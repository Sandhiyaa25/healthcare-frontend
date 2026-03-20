// ─── Dummy Prescriptions Data ─────────────────────────────────────────────────
const DUMMY_PRESCRIPTIONS = [
    { id: 1, patient_id: 1, patient_name: 'Rahul Sharma', medication_name: 'Amoxicillin 500mg', dosage: '500mg', frequency: 'Twice daily', date_issued: '2026-03-18', status: 'active' },
    { id: 2, patient_id: 2, patient_name: 'Priya Patel', medication_name: 'Metformin 850mg', dosage: '850mg', frequency: 'Once daily', date_issued: '2026-03-15', status: 'active' },
    { id: 3, patient_id: 3, patient_name: 'Arun Kumar', medication_name: 'Paracetamol 650mg', dosage: '650mg', frequency: 'Three times', date_issued: '2026-03-10', status: 'completed' },
    { id: 4, patient_id: 4, patient_name: 'Sneha Reddy', medication_name: 'Cetirizine 10mg', dosage: '10mg', frequency: 'Once daily', date_issued: '2026-03-12', status: 'active' },
    { id: 5, patient_id: 5, patient_name: 'Vikram Singh', medication_name: 'Omeprazole 20mg', dosage: '20mg', frequency: 'Before meals', date_issued: '2026-02-28', status: 'expired' },
    { id: 6, patient_id: 6, patient_name: 'Deepa Nair', medication_name: 'Azithromycin 250mg', dosage: '250mg', frequency: 'Once daily', date_issued: '2026-03-17', status: 'active' },
    { id: 7, patient_id: 7, patient_name: 'Karthik Menon', medication_name: 'Ibuprofen 400mg', dosage: '400mg', frequency: 'After meals', date_issued: '2026-03-05', status: 'completed' },
    { id: 8, patient_id: 1, patient_name: 'Rahul Sharma', medication_name: 'Metformin 500mg', dosage: '500mg', frequency: 'Twice daily', date_issued: '2026-03-15', status: 'active' },
];

// ── Helper ──────────────────────────────────────────────────────────────────
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const fetchPrescriptionsApi = (params) =>
    new Promise((resolve) =>
        setTimeout(() => resolve({ data: DUMMY_PRESCRIPTIONS }), 400)
    );

export const fetchPrescriptionApi = async (id) => {
    await delay(300);
    const rx = DUMMY_PRESCRIPTIONS.find((p) => p.id === Number(id));
    return { data: { status: true, data: rx || null } };
};

export const createPrescriptionApi = async (data) => {
    await delay(400);
    return { data: { status: true, data: data } };
};

export const updatePrescriptionApi = async (id, d) => {
    await delay(400);
    return { data: { status: true, data: d } };
};

export const deletePrescriptionApi = async (id) => {
    await delay(300);
    return { data: { status: true, data: null } };
};
