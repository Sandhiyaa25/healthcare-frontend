import { getDummyDoctors } from './appointments.api';

// ── Helper ──────────────────────────────────────────────────────────────────
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Dummy staff = doctors (re-use from appointments) ────────────────────────
export const fetchStaffApi = async (params = {}) => {
    await delay(300);
    const doctors = getDummyDoctors();
    return {
        data: {
            status: true,
            data: doctors,
        },
    };
};

export const fetchStaffMemberApi = async (id) => {
    await delay(200);
    const doctors = getDummyDoctors();
    const doc = doctors.find((d) => d.user_id === Number(id));
    return { data: { status: true, data: doc || null } };
};

// Stubs for other APIs — not used in the current flow
export const createStaffApi = async (d) => ({ data: { status: true, data: d } });
export const updateStaffApi = async (id, d) => ({ data: { status: true, data: d } });
export const deleteStaffApi = async (id) => ({ data: { status: true, data: null } });
export const fetchRolesApi = async () => ({ data: { status: true, data: [] } });
export const fetchUsersApi = async (p) => ({ data: { status: true, data: [] } });
