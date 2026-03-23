import styled, { keyframes, css } from 'styled-components';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
`;

export const PageWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  animation: ${fadeUp} 0.3s ease both;
  height: calc(100vh - 100px);
  overflow: hidden;
`;

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  flex-shrink: 0;
`;

export const PageTitle = styled.h2`
  font-size: ${({ theme }) => theme.fonts.sizeLg};
  font-weight: ${({ theme }) => theme.fonts.weightBold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TodayBadge = styled.span`
  font-size: ${({ theme }) => theme.fonts.sizeXs};
  font-weight: ${({ theme }) => theme.fonts.weightMedium};
  background: ${({ theme }) => theme.colors.primary};
  color: #ffffff;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radii.full};
`;

export const TopControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

export const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const FilterSelect = styled.select`
  height: 34px;
  padding: 0 10px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.fonts.sizeSm};
  color: ${({ theme }) => theme.colors.textPrimary};
  background: ${({ theme }) => theme.colors.bgCard};
  cursor: pointer;
  min-width: 130px;
  transition: ${({ theme }) => theme.transitions.fast};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`;

export const ViewToggle = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.bgBase};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  overflow: hidden;
`;

export const ViewBtn = styled.button`
  padding: 6px 14px;
  font-size: ${({ theme }) => theme.fonts.sizeSm};
  font-weight: ${({ theme }) => theme.fonts.weightMedium};
  cursor: pointer;
  border: none;
  transition: ${({ theme }) => theme.transitions.fast};
  display: flex;
  align-items: center;
  gap: 4px;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? '#ffffff' : theme.colors.textSecondary};

  &:hover:not([data-active='true']) {
    background: ${({ theme }) => theme.colors.bgCard};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

export const NavBtn = styled.button`
  width: 34px;
  height: 34px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.bgCard};
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const MonthLabel = styled.span`
  font-size: ${({ theme }) => theme.fonts.sizeMd};
  font-weight: ${({ theme }) => theme.fonts.weightSemi};
  color: ${({ theme }) => theme.colors.textPrimary};
  min-width: 150px;
  text-align: center;
`;

export const MainArea = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex: 1;
  overflow: hidden;
  min-height: 0;
`;

export const CalendarWrap = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
`;

/* ── Month Grid ── */
export const MonthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  flex: 1;
  overflow-y: auto;
`;

export const WeekDayHeader = styled.div`
  padding: 10px 0;
  text-align: center;
  font-size: ${({ theme }) => theme.fonts.sizeXs};
  font-weight: ${({ theme }) => theme.fonts.weightSemi};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.6px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgBase};
  position: sticky;
  top: 0;
  z-index: 1;
`;

export const DayCell = styled.div`
  min-height: 110px;
  padding: 6px;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  cursor: ${({ $isCurrentMonth }) => $isCurrentMonth ? 'pointer' : 'default'};
  background: ${({ $isToday, $isSelected, $isCurrentMonth, theme }) =>
    $isSelected     ? `${theme.colors.primary}12` :
    $isToday        ? `${theme.colors.primary}08` :
    !$isCurrentMonth ? theme.colors.bgBase :
    theme.colors.bgCard};
  transition: background 0.12s;
  overflow: hidden;
  position: relative;

  &:hover {
    background: ${({ $isCurrentMonth, theme }) =>
      $isCurrentMonth ? `${theme.colors.primary}10` : theme.colors.bgBase};
  }

  &:nth-child(7n) { border-right: none; }
`;

export const DayNumber = styled.div`
  font-size: ${({ theme }) => theme.fonts.sizeSm};
  font-weight: ${({ $isToday, theme }) =>
    $isToday ? theme.fonts.weightBold : theme.fonts.weightMedium};
  color: ${({ $isToday, $isCurrentMonth, theme }) =>
    $isToday        ? theme.colors.primary :
    !$isCurrentMonth ? theme.colors.textMuted :
    theme.colors.textPrimary};
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${({ $isToday, theme }) =>
    $isToday ? `${theme.colors.primary}20` : 'transparent'};
  margin-bottom: 4px;
  flex-shrink: 0;
`;

export const EventsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
  max-height: calc(100% - 32px);

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 2px;
  }
`;

const STATUS_COLORS = {
  scheduled: { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' },
  confirmed: { bg: '#DBEAFE', text: '#1E40AF', border: '#3B82F6' },
  completed: { bg: '#D1FAE5', text: '#065F46', border: '#10B981' },
  cancelled: { bg: '#FEE2E2', text: '#991B1B', border: '#EF4444' },
  no_show:   { bg: '#F3F4F6', text: '#374151', border: '#9CA3AF' },
};

const DARK_STATUS_COLORS = {
  scheduled: { bg: '#451A00', text: '#FCD34D', border: '#F59E0B' },
  confirmed: { bg: '#1E3A5F', text: '#93C5FD', border: '#3B82F6' },
  completed: { bg: '#064E3B', text: '#6EE7B7', border: '#10B981' },
  cancelled: { bg: '#450A0A', text: '#FCA5A5', border: '#EF4444' },
  no_show:   { bg: '#1F2937', text: '#9CA3AF', border: '#6B7280' },
};

export const EventChip = styled.div`
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
  border-left: 2.5px solid ${({ $status, $dark }) =>
    ($dark ? DARK_STATUS_COLORS : STATUS_COLORS)[$status]?.border || '#94A3B8'};
  background: ${({ $status, $dark }) =>
    ($dark ? DARK_STATUS_COLORS : STATUS_COLORS)[$status]?.bg || '#F1F5F9'};
  color: ${({ $status, $dark }) =>
    ($dark ? DARK_STATUS_COLORS : STATUS_COLORS)[$status]?.text || '#475569'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.1s;
  line-height: 1.4;

  &:hover {
    filter: brightness(0.95);
    transform: translateX(1px);
  }
`;

export const MoreCount = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
  padding: 1px 4px;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

/* ── Week / Day view ── */
export const WeekGrid = styled.div`
  display: grid;
  grid-template-columns: 60px repeat(${({ $days }) => $days}, 1fr);
  flex: 1;
  overflow-y: auto;
`;

export const TimeLabel = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: right;
  padding-right: 8px;
  height: 60px;
  display: flex;
  align-items: flex-start;
  padding-top: 4px;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
`;

export const WeekDayCol = styled.div`
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  position: relative;
  min-height: 60px;

  &:last-child { border-right: none; }
`;

export const WeekDayHead = styled.div`
  text-align: center;
  padding: 10px 4px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $isToday, theme }) =>
    $isToday ? `${theme.colors.primary}10` : theme.colors.bgBase};
  position: sticky;
  top: 0;
  z-index: 2;
`;

export const WeekDayName = styled.p`
  font-size: 10px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
`;

export const WeekDayNum = styled.p`
  font-size: 18px;
  font-weight: 700;
  color: ${({ $isToday, theme }) =>
    $isToday ? theme.colors.primary : theme.colors.textPrimary};
  margin: 0;
`;

export const TimeSlot = styled.div`
  height: 60px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border}40;
  position: relative;
  background: ${({ $isNow }) => $isNow ? 'rgba(37,99,235,0.04)' : 'transparent'};

  &:hover { background: ${({ theme }) => `${theme.colors.primary}06`}; }
`;

export const WeekEventBlock = styled.div`
  position: absolute;
  left: 2px;
  right: 2px;
  border-radius: 4px;
  padding: 3px 6px;
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
  overflow: hidden;
  border-left: 3px solid ${({ $status }) =>
    STATUS_COLORS[$status]?.border || '#94A3B8'};
  background: ${({ $status, $dark }) =>
    ($dark ? DARK_STATUS_COLORS : STATUS_COLORS)[$status]?.bg || '#F1F5F9'};
  color: ${({ $status, $dark }) =>
    ($dark ? DARK_STATUS_COLORS : STATUS_COLORS)[$status]?.text || '#475569'};
  z-index: 1;
  transition: all 0.1s;

  &:hover { filter: brightness(0.93); z-index: 2; }
`;

export const CurrentTimeLine = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: ${({ theme }) => theme.colors.danger};
  z-index: 3;
  
  &::before {
    content: '';
    position: absolute;
    left: -4px;
    top: -4px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.danger};
  }
`;

/* ── Side panel ── */
export const SidePanel = styled.div`
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  overflow-y: auto;
`;

export const SidePanelCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
`;

export const SideCardHead = styled.div`
  padding: 12px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgBase};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SideCardTitle = styled.h4`
  font-size: ${({ theme }) => theme.fonts.sizeSm};
  font-weight: ${({ theme }) => theme.fonts.weightSemi};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const SideCardBody = styled.div`
  padding: 12px 14px;
`;

export const StatRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child { border-bottom: none; }
`;

export const StatLabel = styled.span`
  font-size: ${({ theme }) => theme.fonts.sizeSm};
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const StatValue = styled.span`
  font-size: ${({ theme }) => theme.fonts.sizeSm};
  font-weight: ${({ theme }) => theme.fonts.weightSemi};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const DayEventItem = styled.div`
  padding: 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};

  &:last-child { border-bottom: none; }
  &:hover { opacity: 0.8; }
`;

export const DayEventTime = styled.p`
  font-size: ${({ theme }) => theme.fonts.sizeXs};
  font-weight: ${({ theme }) => theme.fonts.weightSemi};
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 2px 0;
`;

export const DayEventName = styled.p`
  font-size: ${({ theme }) => theme.fonts.sizeSm};
  font-weight: ${({ theme }) => theme.fonts.weightMedium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 2px 0;
`;

export const DayEventMeta = styled.p`
  font-size: ${({ theme }) => theme.fonts.sizeXs};
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
`;

export const StatusDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $status }) => STATUS_COLORS[$status]?.border || '#94A3B8'};
  flex-shrink: 0;
`;

export const LegendWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const LegendDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
  background: ${({ $status }) => STATUS_COLORS[$status]?.border || '#94A3B8'};
`;

export const EmptyDay = styled.div`
  padding: 20px 14px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fonts.sizeSm};
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.colors.bgCard}CC;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: ${({ theme }) => theme.radii.md};
`;

export const ErrorMsg = styled.div`
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.danger}18;
  border: 1px solid ${({ theme }) => theme.colors.danger}40;
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
`;

/* ── Event Tooltip ── */
export const TooltipWrap = styled.div`
  min-width: 200px;
  max-width: 260px;
`;

export const TooltipTitle = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 8px 0;
`;

export const TooltipRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-bottom: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

/* ── Mobile list view ── */
export const MobileEventList = styled.div`
  display: none;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 640px) {
    display: flex;
  }
`;

export const MobileCalendarWrap = styled.div`
  @media (max-width: 640px) {
    display: none;
  }
`;