// import { combineReducers } from '@reduxjs/toolkit';
// import authReducer          from './auth/authSlice';
// import dashboardReducer     from './dashboard/dashboardSlice';
// import tenantReducer        from './tenant/tenantSlice';
// import patientsReducer      from './patients/patientsSlice';
// import appointmentsReducer  from './appointments/appointmentsSlice';
// import prescriptionsReducer from './prescriptions/prescriptionsSlice';
// import billingReducer       from './billing/billingSlice';
// import staffReducer         from './staff/staffSlice';
// import usersReducer         from './users/usersSlice';
// import messagesReducer      from './messages/messagesSlice';
// import calendarReducer      from './calendar/calendarSlice';
// import settingsReducer      from './settings/settingsSlice';
// import recordsReducer       from './records/recordsSlice';

// const rootReducer = combineReducers({
//   auth:          authReducer,
//   dashboard:     dashboardReducer,
//   tenant:        tenantReducer,
//   patients:      patientsReducer,
//   appointments:  appointmentsReducer,
//   prescriptions: prescriptionsReducer,
//   billing:       billingReducer,
//   staff:         staffReducer,
//   users:         usersReducer,
//   messages:      messagesReducer,
//   calendar:      calendarReducer,
//   settings:      settingsReducer,
//   records:       recordsReducer,
// });

// export default rootReducer;
import { combineReducers } from '@reduxjs/toolkit';
import authReducer          from './auth/authSlice';
import dashboardReducer     from './dashboard/dashboardSlice';
import tenantReducer        from './tenant/tenantSlice';
import patientsReducer      from './patients/patientsSlice';
import appointmentsReducer  from './appointments/appointmentsSlice';
import prescriptionsReducer from './prescriptions/prescriptionsSlice';
import billingReducer       from './billing/billingSlice';
import staffReducer         from './staff/staffSlice';
import usersReducer         from './users/usersSlice';
import messagesReducer      from './messages/messagesSlice';
import calendarReducer      from './calendar/calendarSlice';
import settingsReducer      from './settings/settingsSlice';
import recordsReducer       from './records/recordsSlice';
import notificationsReducer from './notifications/notificationsSlice';
import offlineQueueReducer  from './offlineQueue/offlineQueueSlice';


const rootReducer = combineReducers({
  auth:          authReducer,
  dashboard:     dashboardReducer,
  tenant:        tenantReducer,
  patients:      patientsReducer,
  appointments:  appointmentsReducer,
  prescriptions: prescriptionsReducer,
  billing:       billingReducer,
  staff:         staffReducer,
  users:         usersReducer,
  messages:      messagesReducer,
  calendar:      calendarReducer,
  settings:      settingsReducer,
  records:       recordsReducer,
  notifications: notificationsReducer,
    offlineQueue:  offlineQueueReducer,   // ← new

});

export default rootReducer;