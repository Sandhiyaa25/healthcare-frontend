import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Tooltip, Spin, Select, Badge } from 'antd';
import {
  CalendarOutlined, LeftOutlined, RightOutlined,
  ClockCircleOutlined, UserOutlined, TeamOutlined,
  ReloadOutlined, PlusOutlined, CheckCircleOutlined,
  CloseCircleOutlined, ScheduleOutlined, EyeOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import useCalendar     from '../../hooks/useCalendar';
import useAuth         from '../../hooks/useAuth';
import { fetchStaffApi } from '../../api/staff.api';
import AppointmentForm from '../Appointments/components/AppointmentForm';
import {
  PageWrap, TopBar, PageTitle, TodayBadge, TopControls,
  FilterGroup, FilterSelect, ViewToggle, ViewBtn,
  NavBtn, MonthLabel, MainArea, CalendarWrap,
  MonthGrid, WeekDayHeader, DayCell, DayNumber,
  EventsContainer, EventChip, MoreCount,
  SidePanel, SidePanelCard, SideCardHead,
  SideCardTitle, SideCardBody, StatRow, StatLabel,
  StatValue, DayEventItem, DayEventTime,
  DayEventName, DayEventMeta, StatusDot,
  LegendWrap, LegendItem, LegendDot,
  EmptyDay, LoadingOverlay, ErrorMsg,
  TooltipWrap, TooltipTitle, TooltipRow,
} from './CalendarPage.styled';
import { useTheme } from '../../context/ThemeContext';

const WEEK_DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const STATUS_LABELS = {
  scheduled: 'Scheduled',
  confirmed:  'Confirmed',
  completed:  'Completed',
  cancelled:  'Cancelled',
  no_show:    'No Show',
};

const EventTooltipContent = ({ event }) => (
  <TooltipWrap>
    <TooltipTitle>{event.patient_name || `Patient #${event.patient_id}`}</TooltipTitle>
    <TooltipRow><ClockCircleOutlined /> {event.start_time} – {event.end_time || '—'}</TooltipRow>
    <TooltipRow><UserOutlined /> {event.doctor_name || `Dr. #${event.doctor_id}`}</TooltipRow>
    <TooltipRow>
      <span style={{
        display: 'inline-block',
        width: 8, height: 8, borderRadius: '50%',
        background: event.status === 'confirmed' ? '#3B82F6'
          : event.status === 'completed' ? '#10B981'
          : event.status === 'cancelled' ? '#EF4444'
          : '#F59E0B',
        marginTop: 3,
      }} />
      {STATUS_LABELS[event.status] || event.status}
    </TooltipRow>
    {event.type && <TooltipRow><ScheduleOutlined /> {event.type}</TooltipRow>}
  </TooltipWrap>
);

const CalendarPage = () => {
  const { role, user } = useAuth();
  const { themeName }  = useTheme();
  const isDark         = themeName === 'dark';

  const {
    events, loading, error,
    fetchMonthEvents, selectDate, selectedDate,
    filters, updateFilters,
  } = useCalendar();

  const today       = dayjs();
  const [current, setCurrent]   = useState({ year: today.year(), month: today.month() + 1 });
  const [view,    setView]      = useState('month'); // month | week | day
  const [doctors, setDoctors]   = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formDate, setFormDate] = useState(null);

  const canBook    = ['admin','doctor','nurse','receptionist'].includes(role);
  const isDoctor   = role === 'doctor';
  const isPatient  = role === 'patient';
  const isAdmin    = role === 'admin';

  // Load doctors for filter (admin/nurse/receptionist)
  useEffect(() => {
    if (!['admin','nurse','receptionist'].includes(role)) return;
    fetchStaffApi({ role_id: '', per_page: 100 })
      .then((r) => {
        const raw  = r.data?.data;
        const list = Array.isArray(raw) ? raw
          : Array.isArray(raw?.staff) ? raw.staff : [];
        // Filter doctors only
        setDoctors(list.filter((s) => s.role_slug === 'doctor' || s.role_name?.toLowerCase() === 'doctor'));
      })
      .catch(() => {});
  }, [role]);

  const loadEvents = useCallback(() => {
    fetchMonthEvents(current.year, current.month, {
      doctorId: filters.doctorId || undefined,
      status:   filters.status   || undefined,
    });
  }, [fetchMonthEvents, current, filters]);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  const goToPrev = () => {
    setCurrent((c) => {
      if (c.month === 1) return { year: c.year - 1, month: 12 };
      return { year: c.year, month: c.month - 1 };
    });
  };

  const goToNext = () => {
    setCurrent((c) => {
      if (c.month === 12) return { year: c.year + 1, month: 1 };
      return { year: c.year, month: c.month + 1 };
    });
  };

  const goToToday = () => {
    setCurrent({ year: today.year(), month: today.month() + 1 });
    selectDate(today.format('YYYY-MM-DD'));
  };

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const firstDay  = new Date(current.year, current.month - 1, 1).getDay();
    const daysInMonth = new Date(current.year, current.month, 0).getDate();
    const prevMonth   = current.month === 1 ? 12 : current.month - 1;
    const prevYear    = current.month === 1 ? current.year - 1 : current.year;
    const daysInPrev  = new Date(prevYear, prevMonth, 0).getDate();

    const days = [];

    // Fill previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date:           `${prevYear}-${String(prevMonth).padStart(2,'0')}-${String(daysInPrev - i).padStart(2,'0')}`,
        day:            daysInPrev - i,
        isCurrentMonth: false,
      });
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({
        date:           `${current.year}-${String(current.month).padStart(2,'0')}-${String(d).padStart(2,'0')}`,
        day:            d,
        isCurrentMonth: true,
      });
    }

    // Fill next month
    const remaining = 42 - days.length;
    const nextMonth  = current.month === 12 ? 1 : current.month + 1;
    const nextYear   = current.month === 12 ? current.year + 1 : current.year;
    for (let d = 1; d <= remaining; d++) {
      days.push({
        date:           `${nextYear}-${String(nextMonth).padStart(2,'0')}-${String(d).padStart(2,'0')}`,
        day:            d,
        isCurrentMonth: false,
      });
    }

    return days;
  }, [current]);

  // Map events by date
  const eventsByDate = useMemo(() => {
    const map = {};
    events.forEach((ev) => {
      const d = ev.date || ev.appointment_date;
      if (!d) return;
      if (!map[d]) map[d] = [];
      map[d].push(ev);
    });
    return map;
  }, [events]);

  // Stats for side panel
  const stats = useMemo(() => {
    const counts = { scheduled: 0, confirmed: 0, completed: 0, cancelled: 0, no_show: 0 };
    events.forEach((ev) => { if (counts[ev.status] !== undefined) counts[ev.status]++; });
    return counts;
  }, [events]);

  // Selected day events
  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return [];
    return eventsByDate[selectedDate] || [];
  }, [selectedDate, eventsByDate]);

  const handleDayClick = (day) => {
    if (!day.isCurrentMonth) return;
    selectDate(day.date);
  };

  const handleEventClick = (e, event) => {
    e.stopPropagation();
  };

  const handleSlotClick = (day) => {
    if (!canBook || !day.isCurrentMonth) return;
    setFormDate(day.date);
    setShowForm(true);
  };

  return (
    <PageWrap>
      {/* Top Bar */}
      <TopBar>
        <PageTitle>
          <CalendarOutlined />
          Calendar
          {today.month() + 1 === current.month && today.year() === current.year && (
            <TodayBadge>Today: {today.format('D MMM')}</TodayBadge>
          )}
        </PageTitle>

        <TopControls>
          {/* Doctor filter — admin/nurse/receptionist */}
          {['admin','nurse','receptionist'].includes(role) && doctors.length > 0 && (
            <FilterGroup>
              <FilterSelect
                value={filters.doctorId || ''}
                onChange={(e) => updateFilters({ doctorId: e.target.value || null })}
              >
                <option value="">All Doctors</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.user_id || d.id}>
                    {d.first_name ? `${d.first_name} ${d.last_name || ''}` : `Doctor #${d.id}`}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>
          )}

          {/* Status filter */}
          <FilterGroup>
            <FilterSelect
              value={filters.status || ''}
              onChange={(e) => updateFilters({ status: e.target.value || null })}
            >
              <option value="">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no_show">No Show</option>
            </FilterSelect>
          </FilterGroup>

          {/* View toggle */}
          <ViewToggle>
            <ViewBtn $active={view === 'month'} onClick={() => setView('month')}>
              <ScheduleOutlined /> Month
            </ViewBtn>
            <ViewBtn $active={view === 'week'} onClick={() => setView('week')}>
              <CalendarOutlined /> Week
            </ViewBtn>
          </ViewToggle>

          {/* Navigation */}
          <FilterGroup>
            <NavBtn onClick={goToPrev}><LeftOutlined /></NavBtn>
            <MonthLabel>
              {MONTH_NAMES[current.month - 1]} {current.year}
            </MonthLabel>
            <NavBtn onClick={goToNext}><RightOutlined /></NavBtn>
          </FilterGroup>

          <NavBtn onClick={goToToday} title="Go to today">
            <ReloadOutlined />
          </NavBtn>

          {canBook && (
            <ViewBtn
              $active
              style={{ padding: '6px 14px', borderRadius: 6 }}
              onClick={() => { setFormDate(today.format('YYYY-MM-DD')); setShowForm(true); }}
            >
              <PlusOutlined /> Book
            </ViewBtn>
          )}
        </TopControls>
      </TopBar>

      {error && <ErrorMsg>{error}</ErrorMsg>}

      <MainArea>
        {/* Calendar Grid */}
        <CalendarWrap style={{ position: 'relative' }}>
          {loading && (
            <LoadingOverlay>
              <Spin size="large" />
            </LoadingOverlay>
          )}

          {/* Week day headers */}
          <MonthGrid style={{ flex: 'none', overflow: 'visible' }}>
            {WEEK_DAYS.map((d) => (
              <WeekDayHeader key={d}>{d}</WeekDayHeader>
            ))}
          </MonthGrid>

          {/* Day cells */}
          <MonthGrid>
            {calendarDays.map((day, idx) => {
              const dayEvs    = eventsByDate[day.date] || [];
              const isToday   = day.date === today.format('YYYY-MM-DD');
              const isSelected = day.date === selectedDate;
              const visible   = dayEvs.slice(0, 3);
              const overflow  = dayEvs.length - 3;

              return (
                <DayCell
                  key={idx}
                  $isToday={isToday}
                  $isSelected={isSelected}
                  $isCurrentMonth={day.isCurrentMonth}
                  onClick={() => handleDayClick(day)}
                  onDoubleClick={() => handleSlotClick(day)}
                >
                  <DayNumber
                    $isToday={isToday}
                    $isCurrentMonth={day.isCurrentMonth}
                  >
                    {day.day}
                  </DayNumber>

                  <EventsContainer>
                    {visible.map((ev, i) => (
                      <Tooltip
                        key={i}
                        title={<EventTooltipContent event={ev} />}
                        placement="top"
                        mouseEnterDelay={0.3}
                        overlayStyle={{ maxWidth: 280 }}
                      >
                        <EventChip
                          $status={ev.status}
                          $dark={isDark}
                          onClick={(e) => handleEventClick(e, ev)}
                        >
                          {ev.start_time && `${ev.start_time.slice(0,5)} `}
                          {ev.patient_name || ev.title || `Appt #${ev.id}`}
                        </EventChip>
                      </Tooltip>
                    ))}
                    {overflow > 0 && (
                      <MoreCount onClick={(e) => { e.stopPropagation(); selectDate(day.date); }}>
                        +{overflow} more
                      </MoreCount>
                    )}
                  </EventsContainer>
                </DayCell>
              );
            })}
          </MonthGrid>
        </CalendarWrap>

        {/* Side Panel */}
        <SidePanel>
          {/* Selected Day Events */}
          <SidePanelCard>
            <SideCardHead>
              <SideCardTitle>
                <CalendarOutlined />
                {selectedDate
                  ? dayjs(selectedDate).format('D MMM YYYY')
                  : 'Select a day'}
              </SideCardTitle>
              {selectedDate && canBook && (
                <NavBtn
                  style={{ width: 26, height: 26, fontSize: 11 }}
                  onClick={() => { setFormDate(selectedDate); setShowForm(true); }}
                  title="Book appointment"
                >
                  <PlusOutlined />
                </NavBtn>
              )}
            </SideCardHead>
            <SideCardBody style={{ padding: selectedDayEvents.length ? '8px 14px' : '14px' }}>
              {!selectedDate ? (
                <EmptyDay>Click a date to see appointments</EmptyDay>
              ) : selectedDayEvents.length === 0 ? (
                <EmptyDay>No appointments this day</EmptyDay>
              ) : (
                selectedDayEvents.map((ev, i) => (
                  <DayEventItem key={i}>
                    <DayEventTime>
                      <ClockCircleOutlined style={{ marginRight: 4 }} />
                      {ev.start_time?.slice(0,5)} – {ev.end_time?.slice(0,5) || '—'}
                    </DayEventTime>
                    <DayEventName>
                      {ev.patient_name || `Patient #${ev.patient_id}`}
                    </DayEventName>
                    <DayEventMeta>
                      <UserOutlined style={{ marginRight: 4 }} />
                      {ev.doctor_name || `Dr. #${ev.doctor_id}`}
                      {' · '}
                      <StatusDot $status={ev.status} />
                      {' '}{STATUS_LABELS[ev.status] || ev.status}
                    </DayEventMeta>
                  </DayEventItem>
                ))
              )}
            </SideCardBody>
          </SidePanelCard>

          {/* Monthly stats */}
          <SidePanelCard>
            <SideCardHead>
              <SideCardTitle>
                <ScheduleOutlined />
                {MONTH_NAMES[current.month - 1]} Summary
              </SideCardTitle>
            </SideCardHead>
            <SideCardBody>
              <StatRow>
                <StatLabel>Total</StatLabel>
                <StatValue>{events.length}</StatValue>
              </StatRow>
              {Object.entries(stats).map(([status, count]) => (
                count > 0 && (
                  <StatRow key={status}>
                    <StatLabel>
                      <StatusDot $status={status} />
                      {STATUS_LABELS[status]}
                    </StatLabel>
                    <StatValue>{count}</StatValue>
                  </StatRow>
                )
              ))}
            </SideCardBody>
          </SidePanelCard>

          {/* Legend */}
          <SidePanelCard>
            <SideCardHead>
              <SideCardTitle>
                <EyeOutlined /> Legend
              </SideCardTitle>
            </SideCardHead>
            <SideCardBody>
              <LegendWrap>
                {Object.entries(STATUS_LABELS).map(([status, label]) => (
                  <LegendItem key={status}>
                    <LegendDot $status={status} />
                    {label}
                  </LegendItem>
                ))}
              </LegendWrap>
            </SideCardBody>
          </SidePanelCard>

          {/* Role guide */}
          <SidePanelCard>
            <SideCardHead>
              <SideCardTitle>
                <UserOutlined />
                {role === 'doctor'       ? 'Your Schedule'
                  : role === 'patient'   ? 'My Appointments'
                  : role === 'nurse'     ? 'All Appointments'
                  : 'Calendar Guide'}
              </SideCardTitle>
            </SideCardHead>
            <SideCardBody>
              <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                {role === 'doctor'
                  ? 'Showing only your assigned appointments. Double-click a date to book.'
                  : role === 'patient'
                  ? 'Showing your personal appointments only.'
                  : role === 'nurse'
                  ? 'Viewing all appointments. Use doctor filter to see individual schedules.'
                  : role === 'receptionist'
                  ? 'Full view. Double-click any date to book an appointment.'
                  : 'Full system view. Use filters to narrow by doctor or status.'}
              </p>
            </SideCardBody>
          </SidePanelCard>
        </SidePanel>
      </MainArea>

      {/* Book appointment modal */}
      {showForm && (
        <AppointmentForm
          open={showForm}
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); loadEvents(); }}
          initialData={formDate ? { appointment_date: formDate } : null}
        />
      )}
    </PageWrap>
  );
};

export default CalendarPage;