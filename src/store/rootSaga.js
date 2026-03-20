import { all } from 'redux-saga/effects';
import authSaga from './auth/authSaga';
import dashboardSaga from './dashboard/dashboardSaga';
import patientsSaga from './patients/patientsSaga';
import appointmentsSaga from './appointments/appointmentsSaga';
import prescriptionsSaga from './prescriptions/prescriptionsSaga';
import billingSaga from './billing/billingSaga';
import staffSaga from './staff/staffSaga';
import usersSaga from './users/usersSaga';
import messagesSaga from './messages/messagesSaga';
import calendarSaga from './calendar/calendarSaga';
import settingsSaga from './settings/settingsSaga';
import recordsSaga from './records/recordsSaga';

export default function* rootSaga() {
  yield all([
    authSaga(),
    dashboardSaga(),
    patientsSaga(),
    appointmentsSaga(),
    prescriptionsSaga(),
    billingSaga(),
    staffSaga(),
    usersSaga(),
    messagesSaga(),
    calendarSaga(),
    settingsSaga(),
    recordsSaga(),
  ]);
}
