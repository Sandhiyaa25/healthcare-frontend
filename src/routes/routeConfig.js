export const ROLES = {
  ADMIN:        'admin',
  DOCTOR:       'doctor',
  NURSE:        'nurse',
  RECEPTIONIST: 'receptionist',
  PATIENT:      'patient',
};

const routeConfig = [
  { path: '/dashboard',     roles: [] }, // all authenticated
  { path: '/patients',      roles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.RECEPTIONIST] },
  { path: '/appointments',  roles: [] },
  { path: '/prescriptions', roles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE] },
  { path: '/billing',       roles: [ROLES.ADMIN, ROLES.RECEPTIONIST] },
  { path: '/staff',         roles: [ROLES.ADMIN] },
  { path: '/users',         roles: [ROLES.ADMIN] },
  { path: '/messages',      roles: [] },
  { path: '/calendar',      roles: [] },
  { path: '/settings',      roles: [ROLES.ADMIN] },
  { path: '/records',       roles: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE] },
];

export default routeConfig;
