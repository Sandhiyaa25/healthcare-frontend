export const ROLES = {
  ADMIN:        'admin',
  DOCTOR:       'doctor',
  NURSE:        'nurse',
  RECEPTIONIST: 'receptionist',
  PHARMACIST:   'pharmacist',
  PATIENT:      'patient',
};

// ─── Role Access Matrix ───────────────────────────────────────────────────────
//
//  Rule: each role sees ONLY what they need for their job.
//
//  admin        → hospital operations (patients, appointments, billing,
//                 staff, users, calendar, settings)
//                 NOT prescriptions / records / messages — those are clinical
//
//  doctor       → clinical care (appointments, prescriptions, records,
//                 messages, calendar)
//
//  nurse        → clinical assist (same as doctor minus admin features)
//
//  receptionist → front desk (patients, appointments, billing, calendar, messages)
//
//  pharmacist   → prescriptions only
//
//  patient      → own data only (all modules are API-scoped to their records)
//
// ─────────────────────────────────────────────────────────────────────────────

const routeConfig = [
  // All authenticated users
  { path: '/dashboard',     roles: [] },
  { path: '/profile',       roles: [] },

  // Clinical — admin oversees, doctor/nurse manages, receptionist assists
  { path: '/patients',      roles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.RECEPTIONIST] },
  { path: '/appointments',  roles: [] }, // all roles — API scopes by role server-side

  // Clinical-only — admin excluded
  { path: '/prescriptions', roles: [ROLES.DOCTOR, ROLES.NURSE, ROLES.PHARMACIST, ROLES.PATIENT] },
  { path: '/records',       roles: [ROLES.DOCTOR, ROLES.NURSE, ROLES.PATIENT] },

  // Operations
  { path: '/billing',       roles: [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.PATIENT] },
  { path: '/staff',         roles: [ROLES.ADMIN] },
  { path: '/calendar',      roles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.RECEPTIONIST] },

  // Messages — admin excluded (clinical communication, not operational)
  { path: '/messages',      roles: [ROLES.DOCTOR, ROLES.NURSE, ROLES.RECEPTIONIST, ROLES.PATIENT] },

  // Admin-only
  { path: '/users',         roles: [ROLES.ADMIN] },
  { path: '/settings',      roles: [ROLES.ADMIN] },
];

export default routeConfig;