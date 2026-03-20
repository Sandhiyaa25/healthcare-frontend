// ── Dummy Appointment Data ──────────────────────────────────────────────────
let dummyAppointments = [
    {
        id: 1, patient_id: 1, doctor_id: 10,
        patient_name: 'Rahul Sharma', doctor_name: 'Dr. Anita Desai',
        appointment_date: '2026-03-18', start_time: '09:00:00', end_time: '09:30:00',
        type: 'consultation', status: 'completed',
        notes: 'Follow-up for diabetes management. HbA1c improved to 6.8%.',
        created_at: '2026-03-15T08:00:00Z', updated_at: '2026-03-18T09:35:00Z',
    },
    {
        id: 2, patient_id: 2, doctor_id: 11,
        patient_name: 'Priya Patel', doctor_name: 'Dr. Suresh Iyer',
        appointment_date: '2026-03-20', start_time: '10:30:00', end_time: '11:00:00',
        type: 'follow_up', status: 'scheduled',
        notes: 'Blood pressure review. Bring latest BP readings.',
        created_at: '2026-03-16T10:00:00Z', updated_at: '2026-03-16T10:00:00Z',
    },
    {
        id: 3, patient_id: 5, doctor_id: 12,
        patient_name: 'Vikram Singh', doctor_name: 'Dr. Ramesh Gupta',
        appointment_date: '2026-03-19', start_time: '14:00:00', end_time: '15:00:00',
        type: 'emergency', status: 'completed',
        notes: 'Pre-operative assessment for knee arthroscopy.',
        created_at: '2026-03-17T09:00:00Z', updated_at: '2026-03-19T15:10:00Z',
    },
    {
        id: 4, patient_id: 3, doctor_id: 10,
        patient_name: 'Arun Kumar', doctor_name: 'Dr. Anita Desai',
        appointment_date: '2026-03-20', start_time: '11:00:00', end_time: '11:30:00',
        type: 'follow_up', status: 'confirmed',
        notes: 'Post-bronchitis follow-up. Check chest X-ray results.',
        created_at: '2026-03-14T12:00:00Z', updated_at: '2026-03-19T08:00:00Z',
    },
    {
        id: 5, patient_id: 6, doctor_id: 11,
        patient_name: 'Deepa Nair', doctor_name: 'Dr. Suresh Iyer',
        appointment_date: '2026-03-21', start_time: '09:00:00', end_time: '09:30:00',
        type: 'consultation', status: 'scheduled',
        notes: 'Migraine frequency assessment. Review medication diary.',
        created_at: '2026-03-18T14:00:00Z', updated_at: '2026-03-18T14:00:00Z',
    },
    {
        id: 6, patient_id: 4, doctor_id: 12,
        patient_name: 'Sneha Reddy', doctor_name: 'Dr. Ramesh Gupta',
        appointment_date: '2026-03-22', start_time: '15:00:00', end_time: '15:30:00',
        type: 'routine', status: 'scheduled',
        notes: 'Allergy desensitisation therapy – session 4.',
        created_at: '2026-03-19T16:00:00Z', updated_at: '2026-03-19T16:00:00Z',
    },
];

// Dummy doctors for the form dropdown
const dummyDoctors = [
    { user_id: 10, first_name: 'Anita', last_name: 'Desai', role_slug: 'doctor' },
    { user_id: 11, first_name: 'Suresh', last_name: 'Iyer', role_slug: 'doctor' },
    { user_id: 12, first_name: 'Ramesh', last_name: 'Gupta', role_slug: 'doctor' },
];

let nextApptId = 7;

// ── Helper ──────────────────────────────────────────────────────────────────
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ── API functions (mock) ────────────────────────────────────────────────────
export const fetchAppointmentsApi = async (params = {}) => {
    await delay(400);
    let filtered = [...dummyAppointments];

    if (params.status) {
        filtered = filtered.filter((a) => a.status === params.status);
    }
    if (params.date) {
        filtered = filtered.filter((a) => a.appointment_date === params.date);
    }

    const page = params.page || 1;
    const perPage = params.per_page || 20;
    const start = (page - 1) * perPage;
    const paged = filtered.slice(start, start + perPage);

    return {
        data: {
            status: true,
            data: {
                appointments: paged,
                data: paged,
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

export const fetchAppointmentApi = async (id) => {
    await delay(300);
    const appt = dummyAppointments.find((a) => a.id === Number(id));
    if (!appt) throw new Error('Appointment not found');
    return { data: { status: true, data: appt } };
};

export const createAppointmentApi = async (data) => {
    await delay(500);
    // Look up patient & doctor names from dummy data
    const { getDummyPatients } = await import('./patients.api');
    const patients = getDummyPatients();
    const patient = patients.find((p) => p.id === Number(data.patient_id));
    const doctor = dummyDoctors.find((d) => d.user_id === Number(data.doctor_id));

    const newAppt = {
        ...data,
        id: nextApptId++,
        patient_name: patient ? `${patient.first_name} ${patient.last_name}` : `Patient #${data.patient_id}`,
        doctor_name: doctor ? `Dr. ${doctor.first_name} ${doctor.last_name}` : `Doctor #${data.doctor_id}`,
        status: 'scheduled',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
    dummyAppointments = [newAppt, ...dummyAppointments];
    return { data: { status: true, data: newAppt } };
};

export const updateAppointmentApi = async (id, data) => {
    await delay(400);
    const idx = dummyAppointments.findIndex((a) => a.id === Number(id));
    if (idx === -1) throw new Error('Appointment not found');
    dummyAppointments[idx] = { ...dummyAppointments[idx], ...data, updated_at: new Date().toISOString() };
    return { data: { status: true, data: dummyAppointments[idx] } };
};

export const cancelAppointmentApi = async (id) => {
    await delay(300);
    const idx = dummyAppointments.findIndex((a) => a.id === Number(id));
    if (idx === -1) throw new Error('Appointment not found');
    dummyAppointments[idx] = { ...dummyAppointments[idx], status: 'cancelled', updated_at: new Date().toISOString() };
    return { data: { status: true, data: dummyAppointments[idx] } };
};

export const updateStatusApi = async (id, status) => {
    await delay(300);
    const idx = dummyAppointments.findIndex((a) => a.id === Number(id));
    if (idx === -1) throw new Error('Appointment not found');
    dummyAppointments[idx] = { ...dummyAppointments[idx], status, updated_at: new Date().toISOString() };
    return { data: { status: true, data: dummyAppointments[idx] } };
};

// ── Re-exports for cross-module use ─────────────────────────────────────────
export const getDummyAppointments = () => [...dummyAppointments];
export const getDummyDoctors = () => [...dummyDoctors];