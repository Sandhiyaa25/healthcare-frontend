// ─── Dummy Medical Records Data ───────────────────────────────────────────────
const DUMMY_RECORDS = [
    { id: 1, patient_id: 1, patient_name: 'Rahul Sharma', diagnosis: 'Type 2 Diabetes', doctor_name: 'Dr. Anita Desai', date_recorded: '2026-03-18', status: 'verified' },
    { id: 2, patient_id: 2, patient_name: 'Priya Patel', diagnosis: 'Hypertension Stage 1', doctor_name: 'Dr. Ramesh Gupta', date_recorded: '2026-03-16', status: 'verified' },
    { id: 3, patient_id: 3, patient_name: 'Arun Kumar', diagnosis: 'Acute Bronchitis', doctor_name: 'Dr. Sunita Rao', date_recorded: '2026-03-14', status: 'pending' },
    { id: 4, patient_id: 4, patient_name: 'Sneha Reddy', diagnosis: 'Allergic Rhinitis', doctor_name: 'Dr. Anita Desai', date_recorded: '2026-03-12', status: 'verified' },
    { id: 5, patient_id: 5, patient_name: 'Vikram Singh', diagnosis: 'Lumbar Disc Herniation', doctor_name: 'Dr. Manoj Pillai', date_recorded: '2026-02-25', status: 'incomplete' },
    { id: 6, patient_id: 6, patient_name: 'Deepa Nair', diagnosis: 'Iron Deficiency Anemia', doctor_name: 'Dr. Ramesh Gupta', date_recorded: '2026-03-10', status: 'verified' },
    { id: 7, patient_id: 7, patient_name: 'Karthik Menon', diagnosis: 'Migraine with Aura', doctor_name: 'Dr. Sunita Rao', date_recorded: '2026-03-08', status: 'verified' },
    { id: 8, patient_id: 1, patient_name: 'Rahul Sharma', diagnosis: 'Diabetic Retinopathy Screening', doctor_name: 'Dr. Suresh Iyer', date_recorded: '2026-03-19', status: 'pending' },
];

// ── Helper ──────────────────────────────────────────────────────────────────
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const fetchRecordsApi = (params) =>
    new Promise((resolve) =>
        setTimeout(() => resolve({ data: DUMMY_RECORDS }), 400)
    );

export const fetchRecordApi = async (id) => {
    await delay(300);
    const rec = DUMMY_RECORDS.find((r) => r.id === Number(id));
    return { data: { status: true, data: rec || null } };
};

export const createRecordApi = async (data) => {
    await delay(400);
    return { data: { status: true, data: data } };
};

export const updateRecordApi = async (id, d) => {
    await delay(400);
    return { data: { status: true, data: d } };
};

export const deleteRecordApi = async (id) => {
    await delay(300);
    return { data: { status: true, data: null } };
};
