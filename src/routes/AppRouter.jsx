import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute   from '../components/guards/ProtectedRoute';
import RoleGuard        from '../components/guards/RoleGuard';
import AppLayout        from '../components/layout/AppLayout';
import Spinner          from '../components/ui/Spinner/Spinner';
import LoginPage        from '../pages/Auth/LoginPage';
import NotFoundPage     from '../pages/Errors/NotFoundPage';
import UnauthorizedPage from '../pages/Errors/UnauthorizedPage';
import ErrorPage        from '../pages/Errors/ErrorPage';

// ─── Lazy imports ─────────────────────────────────────────────────────────────
const DashboardPage     = lazy(() => import('../pages/Dashboard/DashboardPage'));
const SettingsPage      = lazy(() => import('../pages/Settings/SettingsPage'));
const UsersListPage     = lazy(() => import('../pages/Users/UsersListPage'));
const StaffListPage     = lazy(() => import('../pages/Staff/StaffListPage'));
const ProfilePage       = lazy(() => import('../pages/Profile/ProfilePage'));

// ─── Patient module ───────────────────────────────────────────────────────────
const PatientsListPage  = lazy(() => import('../pages/Patients/PatientsListPage'));
const PatientDetailPage = lazy(() => import('../pages/Patients/PatientDetailPage'));

// ─── Appointment module ───────────────────────────────────────────────────────
const AppointmentsListPage  = lazy(() => import('../pages/Appointments/AppointmentsListPage'));
const AppointmentDetailPage = lazy(() => import('../pages/Appointments/AppointmentDetailPage'));

const Fallback = () => <Spinner size="lg" fullPage />;

const ComingSoon = ({ title }) => (
  <div style={{ padding: 48, textAlign: 'center' }}>
    <h2 style={{ fontSize: 22, fontWeight: 600, color: '#0F172A', marginBottom: 8 }}>{title}</h2>
    <p style={{ fontSize: 14, color: '#64748B' }}>This module is ready to be built next.</p>
  </div>
);

const AppRouter = () => (
  <BrowserRouter>
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route path="/login"        element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/error"        element={<ErrorPage />} />
        <Route path="/"             element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard"      element={<DashboardPage />} />
          <Route path="users/*"        element={<UsersListPage />} />
          <Route path="staff/*"        element={<StaffListPage />} />
          <Route path="settings/*"     element={<SettingsPage />} />
          <Route path="profile"        element={<ProfilePage />} />

          {/* ── Patient Module ──────────────────────────────────────── */}
          <Route
            path="patients"
            element={
              <RoleGuard allowedRoles={['admin', 'doctor', 'nurse', 'receptionist']}>
                <PatientsListPage />
              </RoleGuard>
            }
          />
          <Route
            path="patients/:id"
            element={
              <RoleGuard allowedRoles={['admin', 'doctor', 'nurse', 'receptionist']}>
                <PatientDetailPage />
              </RoleGuard>
            }
          />

          {/* ── Appointment Module ──────────────────────────────────── */}
          <Route path="appointments"     element={<AppointmentsListPage />} />
          <Route path="appointments/:id" element={<AppointmentDetailPage />} />

          {/* ── Coming Soon placeholders ────────────────────────────── */}
          <Route path="prescriptions/*" element={<ComingSoon title="Prescriptions" />} />
          <Route path="billing/*"       element={<ComingSoon title="Billing" />} />
          <Route path="messages/*"      element={<ComingSoon title="Messages" />} />
          <Route path="calendar/*"      element={<ComingSoon title="Calendar" />} />
          <Route path="records/*"       element={<ComingSoon title="Medical Records" />} />
          <Route path="my-health/*"     element={<ComingSoon title="My Health" />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default AppRouter;