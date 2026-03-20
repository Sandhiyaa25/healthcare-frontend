// ── Dummy Patient Data ──────────────────────────────────────────────────────
let dummyPatients = [
    {
        id: 1, first_name: 'Rahul', last_name: 'Sharma',
        email: 'rahul.sharma@email.com', phone: '+91 9876543210',
        date_of_birth: '1990-05-15', gender: 'male', blood_group: 'O+',
        address: '42 MG Road, Bengaluru, Karnataka 560001',
        allergies: 'Penicillin', medical_notes: 'Type 2 Diabetes – managed with Metformin',
        emergency_contact_name: 'Sunita Sharma', emergency_contact_phone: '+91 9876543211',
        status: 'active', created_at: '2025-11-10T09:00:00Z', updated_at: '2026-03-18T10:00:00Z',
    },
    {
        id: 2, first_name: 'Priya', last_name: 'Patel',
        email: 'priya.patel@email.com', phone: '+91 9123456789',
        date_of_birth: '1985-08-22', gender: 'female', blood_group: 'A+',
        address: '15 Jubilee Hills, Hyderabad, Telangana 500033',
        allergies: 'None known', medical_notes: 'Hypertension – on Lisinopril 10mg',
        emergency_contact_name: 'Rajesh Patel', emergency_contact_phone: '+91 9123456780',
        status: 'active', created_at: '2025-12-01T11:00:00Z', updated_at: '2026-03-15T14:00:00Z',
    },
    {
        id: 3, first_name: 'Arun', last_name: 'Kumar',
        email: 'arun.kumar@email.com', phone: '+91 9988776655',
        date_of_birth: '1978-01-30', gender: 'male', blood_group: 'B+',
        address: '8 Anna Nagar, Chennai, Tamil Nadu 600040',
        allergies: 'Sulfa drugs', medical_notes: 'Recovered from acute bronchitis (Feb 2026)',
        emergency_contact_name: 'Lakshmi Kumar', emergency_contact_phone: '+91 9988776600',
        status: 'active', created_at: '2026-01-05T08:00:00Z', updated_at: '2026-03-10T09:30:00Z',
    },
    {
        id: 4, first_name: 'Sneha', last_name: 'Reddy',
        email: 'sneha.reddy@email.com', phone: '+91 9010203040',
        date_of_birth: '1995-11-12', gender: 'female', blood_group: 'AB-',
        address: '23 Banjara Hills, Hyderabad, Telangana 500034',
        allergies: 'Dust, Pollen', medical_notes: 'Seasonal allergies – Cetirizine as needed',
        emergency_contact_name: 'Ramesh Reddy', emergency_contact_phone: '+91 9010203041',
        status: 'active', created_at: '2026-01-20T10:00:00Z', updated_at: '2026-03-12T15:00:00Z',
    },
    {
        id: 5, first_name: 'Vikram', last_name: 'Singh',
        email: 'vikram.singh@email.com', phone: '+91 9555444333',
        date_of_birth: '1982-07-04', gender: 'male', blood_group: 'O-',
        address: '56 Connaught Place, New Delhi 110001',
        allergies: 'None known', medical_notes: 'Scheduled for knee arthroscopy (Mar 2026)',
        emergency_contact_name: 'Meera Singh', emergency_contact_phone: '+91 9555444334',
        status: 'active', created_at: '2025-10-15T12:00:00Z', updated_at: '2026-02-28T16:00:00Z',
    },
    {
        id: 6, first_name: 'Deepa', last_name: 'Nair',
        email: 'deepa.nair@email.com', phone: '+91 9876012345',
        date_of_birth: '1992-03-28', gender: 'female', blood_group: 'A-',
        address: '99 Marine Drive, Kochi, Kerala 682001',
        allergies: 'Ibuprofen', medical_notes: 'Migraine – on preventive therapy',
        emergency_contact_name: 'Suresh Nair', emergency_contact_phone: '+91 9876012346',
        status: 'active', created_at: '2026-02-10T07:30:00Z', updated_at: '2026-03-17T11:00:00Z',
    },
    {
        id: 7, first_name: 'Karthik', last_name: 'Menon',
        email: 'karthik.menon@email.com', phone: '+91 9345678901',
        date_of_birth: '1988-12-01', gender: 'male', blood_group: 'B-',
        address: '7 Park Street, Kolkata, West Bengal 700016',
        allergies: 'None known', medical_notes: 'Lumbar disc herniation – physiotherapy ongoing',
        emergency_contact_name: 'Anita Menon', emergency_contact_phone: '+91 9345678902',
        status: 'inactive', created_at: '2025-09-01T14:00:00Z', updated_at: '2026-01-05T10:00:00Z',
    },
];

let nextPatientId = 8;

// ── Helper ──────────────────────────────────────────────────────────────────
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ── API functions (mock) ────────────────────────────────────────────────────
export const fetchPatientsApi = async (params = {}) => {
    await delay(400);
    let filtered = [...dummyPatients];

    // Search filter
    if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
            (p) =>
                `${p.first_name} ${p.last_name}`.toLowerCase().includes(q) ||
                (p.email || '').toLowerCase().includes(q)
        );
    }

    // Status filter
    if (params.status) {
        filtered = filtered.filter((p) => p.status === params.status);
    }

    const page = params.page || 1;
    const perPage = params.per_page || 20;
    const start = (page - 1) * perPage;
    const paged = filtered.slice(start, start + perPage);

    return {
        data: {
            status: true,
            data: {
                patients: paged,
                pagination: {
                    total: filtered.length,
                    per_page: perPage,
                    current_page: page,
                    last_page: Math.ceil(filtered.length / perPage),
                },
            },
        },
    };
};

export const fetchPatientApi = async (id) => {
    await delay(300);
    const patient = dummyPatients.find((p) => p.id === Number(id));
    if (!patient) throw new Error('Patient not found');
    return { data: { status: true, data: patient } };
};

export const createPatientApi = async (data) => {
    await delay(500);
    const newPatient = {
        ...data,
        id: nextPatientId++,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: data.status || 'active',
    };
    dummyPatients = [newPatient, ...dummyPatients];
    return { data: { status: true, data: newPatient } };
};

export const updatePatientApi = async (id, data) => {
    await delay(400);
    const idx = dummyPatients.findIndex((p) => p.id === Number(id));
    if (idx === -1) throw new Error('Patient not found');
    dummyPatients[idx] = { ...dummyPatients[idx], ...data, updated_at: new Date().toISOString() };
    return { data: { status: true, data: dummyPatients[idx] } };
};

export const deletePatientApi = async (id) => {
    await delay(300);
    dummyPatients = dummyPatients.filter((p) => p.id !== Number(id));
    return { data: { status: true, data: null } };
};

// ── Re-export patient list for cross-module use ─────────────────────────────
export const getDummyPatients = () => [...dummyPatients];
