import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { loginApi, logoutApi, resolveTenantApi } from '../../api/auth.api';
import {
  loginRequest, loginSuccess, loginFailure,
  logoutRequest, logoutSuccess, setTenant, hydrateUser,
} from './authSlice';
import { setTenantInfo } from '../tenant/tenantSlice';
import {
  setToken, setCsrfToken, clearAll, setTenantId, getTenantId,
} from '../../utils/tokenStorage';
import { idbSet, idbGet, idbClear, IDB_KEYS } from '../../utils/indexedDB';
import { normalizeError } from '../../utils/errorNormalizer';
import { queueClear } from '../offlineQueue/offlineQueueDB';
import { setQueueItems } from '../offlineQueue/offlineQueueSlice';
import { getSubdomain }   from '../../utils/subdomainUtils';

// ─── Hydrate user from IndexedDB on app start ─────────────────────────────────
export function* hydrateUserSaga() {
  try {
    const user = yield call(idbGet, IDB_KEYS.USER);
    yield put(hydrateUser(user));
  } catch {
    yield put(hydrateUser(null));
  }
}

// ─── Login ────────────────────────────────────────────────────────────────────
function* loginSaga({ payload }) {
  try {
    let tenantId = payload.tenant_id;

    if (!tenantId) {
      const cached = getTenantId();
      if (cached) {
        tenantId = Number(cached);

        // Also re-fetch tenant config from API so colors/settings are fresh
        // (cached tenantId exists but tenant info may be stale)
        const subdomain = getSubdomain();
        if (subdomain) {
          try {
            const tenantRes = yield call(resolveTenantApi, subdomain);
            const tenant    = tenantRes.data?.data;
            if (tenant?.id) {
              yield put(setTenant(tenant));
              yield put(setTenantInfo(tenant));        // ← store in tenantSlice too
              yield call(idbSet, IDB_KEYS.TENANT, tenant); // ← persist to IDB
            }
          } catch {
            // non-fatal — continue login with cached tenantId
          }
        }
      } else {
        const subdomain = getSubdomain();
        if (!subdomain) {
          yield put(loginFailure({
            message: 'No tenant found in URL. Use: apollo-chennai.localhost:3000',
            fields: {},
          }));
          return;
        }
        const tenantRes = yield call(resolveTenantApi, subdomain);
        const tenant    = tenantRes.data?.data;
        if (!tenant?.id) {
          yield put(loginFailure({ message: 'Tenant not found. Check the URL.', fields: {} }));
          return;
        }
        tenantId = tenant.id;
        yield put(setTenant(tenant));
        yield put(setTenantInfo(tenant));          // ← store in tenantSlice too
        setTenantId(tenantId);
        yield call(idbSet, IDB_KEYS.TENANT, tenant); // ← persist to IDB
      }
    }

    const response = yield call(loginApi, {
      username:  payload.username,
      password:  payload.password,
      tenant_id: tenantId,
    });

    const { access_token, csrf_token, user } = response.data.data;

    setToken(access_token);
    setCsrfToken(csrf_token);
    yield call(idbSet, IDB_KEYS.USER, user);

    yield put(loginSuccess({ token: access_token, csrfToken: csrf_token, user }));

    // All roles go to dashboard
    window.location.href = '/dashboard';

  } catch (error) {
    yield put(loginFailure(normalizeError(error)));
  }
}


function* logoutSaga() {
  try {
    yield call(logoutApi);
  } catch {
    // silent — clear locally even if API fails
  } finally {
    clearAll();
    yield call(idbClear);                  // clears hc_saas_db (user, tenant)
    yield call(queueClear);                // ← ADD: clears hc_offline_queue
    yield put(setQueueItems([]));          // ← ADD: reset Redux queue state
    yield put(logoutSuccess());
  }
}


// ─── Root saga ────────────────────────────────────────────────────────────────
export default function* authSaga() {
  yield takeEvery(loginRequest.type,   loginSaga);
  yield takeLatest(logoutRequest.type, logoutSaga);
}