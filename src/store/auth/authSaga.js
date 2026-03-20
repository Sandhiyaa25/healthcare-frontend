import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { loginApi, logoutApi, resolveTenantApi } from '../../api/auth.api';
import {
  loginRequest, loginSuccess, loginFailure,
  logoutRequest, logoutSuccess, setTenant, hydrateUser,
} from './authSlice';
import {
  setToken, setCsrfToken, clearAll, setTenantId, getTenantId,
} from '../../utils/tokenStorage';
import { idbSet, idbGet, idbClear, IDB_KEYS } from '../../utils/indexedDB';
import { normalizeError } from '../../utils/errorNormalizer';
import { getSubdomain } from '../../utils/subdomainUtils';

export function* hydrateUserSaga() {
  try {
    const user = yield call(idbGet, IDB_KEYS.USER);
    yield put(hydrateUser(user));
  } catch {
    yield put(hydrateUser(null));
  }
}

function* loginSaga({ payload }) {
  try {
    let tenantId = payload.tenant_id;

    if (!tenantId) {
      const cached = getTenantId();
      if (cached) {
        tenantId = Number(cached);
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
        setTenantId(tenantId);
        yield call(idbSet, IDB_KEYS.TENANT, tenant);
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

    // ─── Role-based redirect after login ──────────────────────────────────
    const role = user?.role || user?.role_slug;
    if (role === 'patient') {
      window.location.href = '/my-health';
    } else {
      window.location.href = '/dashboard';
    }

  } catch (error) {
    yield put(loginFailure(normalizeError(error)));
  }
}

function* logoutSaga() {
  try {
    yield call(logoutApi);
  } catch {
    // silent
  } finally {
    clearAll();
    yield call(idbClear);
    yield put(logoutSuccess());
  }
}

export default function* authSaga() {
  yield takeEvery(loginRequest.type, loginSaga);
  yield takeLatest(logoutRequest.type, logoutSaga);
}