import { getDummyAppointments } from './appointments.api';

// ── Helper ──────────────────────────────────────────────────────────────────
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const TYPE_MAP = {
    consultation: 'appointment',
    follow_up: 'follow-up',
    emergency: 'surgery',
    routine: 'appointment',
};

// ── Auto-generate calendar events from appointment data ─────────────────────
export const fetchCalendarEventsApi = async () => {
    await delay(400);
    const appointments = getDummyAppointments();

    const events = appointments.map((a) => ({
        id: `cal-${a.id}`,
        date: a.appointment_date,
        title: `${capitalize(a.type)} - ${a.patient_name}`,
        type: TYPE_MAP[a.type] || 'appointment',
        time: a.start_time?.slice(0, 5),
        appointmentId: a.id,
    }));

    return { data: events };
};

function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).replace('_', '-') : '';
}
