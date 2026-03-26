// import React, { useEffect, useState } from 'react';
// import { Provider, useDispatch, useSelector } from 'react-redux';
// import store              from '../store';
// import { AppThemeProvider } from '../context/ThemeContext';
// import GlobalStyles       from '../theme/GlobalStyles';
// import ErrorBoundary      from './ErrorBoundary';
// import { hydrateUser }    from '../store/auth/authSlice';
// import { idbGet, IDB_KEYS } from '../utils/indexedDB';

// const Spinner = () => (
//   <div style={{
//     display:'flex', alignItems:'center', justifyContent:'center',
//     height:'100vh', background:'#F1F5F9',
//   }}>
//     <div style={{
//       width:36, height:36,
//       border:'3px solid #DBEAFE',
//       borderTopColor:'#2563EB',
//       borderRadius:'50%',
//       animation:'hc_spin 0.7s linear infinite',
//     }}/>
//     <style>{`@keyframes hc_spin{to{transform:rotate(360deg)}}`}</style>
//   </div>
// );

// const ThemedApp = ({ children }) => {
//   const dispatch   = useDispatch();
//   const authTenant = useSelector((s) => s.auth.tenant);
//   const tenantInfo = useSelector((s) => s.tenant.info);
//   const tenant     = tenantInfo || authTenant;
//   const [ready, setReady] = useState(false);

//   useEffect(() => {
//     idbGet(IDB_KEYS.USER)
//       .then((user) => dispatch(hydrateUser(user)))
//       .catch(()    => dispatch(hydrateUser(null)))
//       .finally(()  => setReady(true));
//   }, [dispatch]);

//   if (!ready) {
//     return (
//       <AppThemeProvider tenantConfig={null}>
//         <GlobalStyles />
//         <Spinner />
//       </AppThemeProvider>
//     );
//   }

//   return (
//     <AppThemeProvider tenantConfig={tenant}>
//       <GlobalStyles />
//       {children}
//     </AppThemeProvider>
//   );
// };

// const AppProviders = ({ children }) => (
//   <ErrorBoundary>
//     <Provider store={store}>
//       <ThemedApp>{children}</ThemedApp>
//     </Provider>
//   </ErrorBoundary>
// );

// export default AppProviders;
import React, { useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store                from '../store';
import { AppThemeProvider } from '../context/ThemeContext';
import GlobalStyles         from '../theme/GlobalStyles';
import ErrorBoundary        from './ErrorBoundary';
import { hydrateUser }      from '../store/auth/authSlice';
import { setTenantInfo }    from '../store/tenant/tenantSlice';
import { idbGet, IDB_KEYS } from '../utils/indexedDB';

const Spinner = () => (
  <div style={{
    display:'flex', alignItems:'center', justifyContent:'center',
    height:'100vh', background:'#F1F5F9',
  }}>
    <div style={{
      width:36, height:36,
      border:'3px solid #DBEAFE',
      borderTopColor:'#2563EB',
      borderRadius:'50%',
      animation:'hc_spin 0.7s linear infinite',
    }}/>
    <style>{`@keyframes hc_spin{to{transform:rotate(360deg)}}`}</style>
  </div>
);

const ThemedApp = ({ children }) => {
  const dispatch   = useDispatch();

  // tenant comes from two possible Redux locations — prefer tenantSlice.info
  const authTenant = useSelector((s) => s.auth.tenant);
  const tenantInfo = useSelector((s) => s.tenant.info);
  const tenant     = tenantInfo || authTenant;

  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Load BOTH user and tenant from IndexedDB on every app start / refresh
    // Without this, tenant colors are lost after refresh
    Promise.all([
      idbGet(IDB_KEYS.USER).catch(() => null),
      idbGet(IDB_KEYS.TENANT).catch(() => null),
    ]).then(([user, savedTenant]) => {
      dispatch(hydrateUser(user));
      if (savedTenant) {
        dispatch(setTenantInfo(savedTenant));
      }
    }).finally(() => setReady(true));
  }, [dispatch]);

  if (!ready) {
    return (
      <AppThemeProvider tenantConfig={null}>
        <GlobalStyles />
        <Spinner />
      </AppThemeProvider>
    );
  }

  return (
    <AppThemeProvider tenantConfig={tenant}>
      <GlobalStyles />
      {children}
    </AppThemeProvider>
  );
};

const AppProviders = ({ children }) => (
  <ErrorBoundary>
    <Provider store={store}>
      <ThemedApp>{children}</ThemedApp>
    </Provider>
  </ErrorBoundary>
);

export default AppProviders;