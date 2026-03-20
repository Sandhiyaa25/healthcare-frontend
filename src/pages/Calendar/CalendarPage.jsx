import React, { useEffect, useCallback } from 'react';
import { Calendar, Badge } from 'antd';
import useCalendar from '../../hooks/useCalendar';
import Spinner from '../../components/ui/Spinner/Spinner';
import {
    Wrap, TopBar, Title, Card, ErrMsg,
    EventDot, EventItem, EventsList,
} from './CalendarPage.styled';

const TYPE_BADGE = {
    appointment: 'processing',
    'follow-up': 'warning',
    surgery: 'error',
};

const CalendarPage = () => {
    const { events, loading, error, fetchEvents } = useCalendar();

    const loadData = useCallback(() => {
        fetchEvents();
    }, [fetchEvents]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    /* Render events into calendar date cells */
    const dateCellRender = (value) => {
        const dateStr = value.format('YYYY-MM-DD');
        const dayEvents = Array.isArray(events)
            ? events.filter((e) => e.date === dateStr)
            : [];

        if (dayEvents.length === 0) return null;

        return (
            <EventsList>
                {dayEvents.map((ev) => (
                    <EventItem key={ev.id}>
                        <EventDot $type={ev.type} />
                        {ev.title}
                    </EventItem>
                ))}
            </EventsList>
        );
    };

    return (
        <Wrap>
            <TopBar>
                <Title>Appointment Calendar</Title>
            </TopBar>

            {error && <ErrMsg>{error}</ErrMsg>}

            <Card>
                {loading ? (
                    <div style={{ padding: 60, display: 'flex', justifyContent: 'center' }}>
                        <Spinner size="md" />
                    </div>
                ) : (
                    <Calendar cellRender={(current, info) => {
                        if (info.type === 'date') return dateCellRender(current);
                        return info.originNode;
                    }} />
                )}
            </Card>
        </Wrap>
    );
};

export default CalendarPage;
