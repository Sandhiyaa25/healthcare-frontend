// import React, { useEffect, useRef } from 'react';
// import dayjs from 'dayjs';
// import relativeTime from 'dayjs/plugin/relativeTime';
// import { useSelector } from 'react-redux';
// import {
//   BellOutlined, CalendarOutlined, ExperimentOutlined,
//   DollarOutlined, MessageOutlined, TeamOutlined,
//   CheckCircleOutlined, CloseCircleOutlined,
//   InfoCircleOutlined,
// } from '@ant-design/icons';
// import useNotifications from '../../hooks/useNotifications';
// import {
//   PanelWrap, PanelHead, PanelTitle, MarkAllBtn,
//   NotifList, NotifItem, NotifIconWrap, NotifBody,
//   NotifTitle, NotifMessage, NotifTime, UnreadDot,
//   EmptyNotif, PanelFooter, ViewAllBtn,
// } from './NotificationPanel.styled';

// dayjs.extend(relativeTime);

// const TYPE_CONFIG = {
//   appointment_booked:    { icon: <CalendarOutlined />,      color: '#DBEAFE', iconColor: '#2563EB', label: 'Appointment Booked' },
//   appointment_confirmed: { icon: <CheckCircleOutlined />,   color: '#D1FAE5', iconColor: '#16A34A', label: 'Appointment Confirmed' },
//   appointment_cancelled: { icon: <CloseCircleOutlined />,   color: '#FEE2E2', iconColor: '#DC2626', label: 'Appointment Cancelled' },
//   prescription_created:  { icon: <ExperimentOutlined />,    color: '#F3E8FF', iconColor: '#7C3AED', label: 'Prescription Created' },
//   prescription_dispensed:{ icon: <CheckCircleOutlined />,   color: '#D1FAE5', iconColor: '#16A34A', label: 'Prescription Dispensed' },
//   prescription_rejected: { icon: <CloseCircleOutlined />,   color: '#FEE2E2', iconColor: '#DC2626', label: 'Prescription Rejected' },
//   invoice_created:       { icon: <DollarOutlined />,        color: '#FEF3C7', iconColor: '#D97706', label: 'Invoice Created' },
//   payment_received:      { icon: <DollarOutlined />,        color: '#D1FAE5', iconColor: '#16A34A', label: 'Payment Received' },
//   payment_pending:       { icon: <DollarOutlined />,        color: '#FEF3C7', iconColor: '#D97706', label: 'Payment Pending' },
//   message_received:      { icon: <MessageOutlined />,       color: '#DBEAFE', iconColor: '#2563EB', label: 'New Message' },
//   staff_status_changed:  { icon: <TeamOutlined />,          color: '#F3E8FF', iconColor: '#7C3AED', label: 'Staff Update' },
//   default:               { icon: <InfoCircleOutlined />,    color: '#F1F5F9', iconColor: '#64748B', label: 'Notification' },
// };

// const NotificationPanel = ({ onClose }) => {
//   // const { list, unreadCount, loading, fetchNotifications, markRead, markAllRead } =
//   //   useNotifications();
//   // Panel only reads from store:
// const { list, unreadCount, loading } = useSelector((s) => s.notifications);
//   const panelRef = useRef(null);

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   // Close on outside click
//   useEffect(() => {
//     const handler = (e) => {
//       if (panelRef.current && !panelRef.current.contains(e.target)) {
//         onClose();
//       }
//     };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, [onClose]);

//   const handleItemClick = (notif) => {
//     if (!notif.read_at) markRead(notif.id);
//   };

//   return (
//     <PanelWrap ref={panelRef}>
//       <PanelHead>
//         <PanelTitle>
//           <BellOutlined />
//           Notifications
//           {unreadCount > 0 && (
//             <span style={{
//               background: '#DC2626', color: 'white',
//               borderRadius: 8, padding: '1px 6px',
//               fontSize: 10, fontWeight: 700,
//             }}>
//               {unreadCount > 99 ? '99+' : unreadCount}
//             </span>
//           )}
//         </PanelTitle>
//         {unreadCount > 0 && (
//           <MarkAllBtn onClick={markAllRead}>Mark all read</MarkAllBtn>
//         )}
//       </PanelHead>

//       <NotifList>
//         {loading && list.length === 0 ? (
//           <EmptyNotif>Loading...</EmptyNotif>
//         ) : list.length === 0 ? (
//           <EmptyNotif>
//             <BellOutlined style={{ fontSize: 28, display: 'block', margin: '0 auto 8px' }} />
//             No notifications yet
//           </EmptyNotif>
//         ) : (
//           list.map((notif) => {
//             const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.default;
//             const isUnread = !notif.read_at;
//             return (
//               <NotifItem
//                 key={notif.id}
//                 $unread={isUnread}
//                 onClick={() => handleItemClick(notif)}
//               >
//                 <NotifIconWrap $color={config.color} $iconColor={config.iconColor}>
//                   {config.icon}
//                 </NotifIconWrap>
//                 <NotifBody>
//                   <NotifTitle $unread={isUnread}>{config.label}</NotifTitle>
//                   <NotifMessage>{notif.message || notif.body || '—'}</NotifMessage>
//                   <NotifTime>{notif.created_at ? dayjs(notif.created_at).fromNow() : ''}</NotifTime>
//                 </NotifBody>
//                 {isUnread && <UnreadDot />}
//               </NotifItem>
//             );
//           })
//         )}
//       </NotifList>

//       <PanelFooter>
//         <ViewAllBtn onClick={onClose}>Close</ViewAllBtn>
//       </PanelFooter>
//     </PanelWrap>
//   );
// };

// export default NotificationPanel;
import React, { useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  BellOutlined, CalendarOutlined, ExperimentOutlined,
  DollarOutlined, MessageOutlined, TeamOutlined,
  CheckCircleOutlined, CloseCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import useNotifications from '../../hooks/useNotifications';
import {
  PanelWrap, PanelHead, PanelTitle, MarkAllBtn,
  NotifList, NotifItem, NotifIconWrap, NotifBody,
  NotifTitle, NotifMessage, NotifTime, UnreadDot,
  EmptyNotif, PanelFooter, ViewAllBtn,
} from './NotificationPanel.styled';

dayjs.extend(relativeTime);

// ─── Type → icon/colour mapping ───────────────────────────────────────────────
const TYPE_CONFIG = {
  appointment_booked:     { icon: <CalendarOutlined />,     color: '#DBEAFE', iconColor: '#2563EB', label: 'Appointment Booked' },
  appointment_confirmed:  { icon: <CheckCircleOutlined />,  color: '#D1FAE5', iconColor: '#16A34A', label: 'Appointment Confirmed' },
  appointment_cancelled:  { icon: <CloseCircleOutlined />,  color: '#FEE2E2', iconColor: '#DC2626', label: 'Appointment Cancelled' },
  prescription_created:   { icon: <ExperimentOutlined />,   color: '#F3E8FF', iconColor: '#7C3AED', label: 'Prescription Created' },
  prescription_dispensed: { icon: <CheckCircleOutlined />,  color: '#D1FAE5', iconColor: '#16A34A', label: 'Prescription Dispensed' },
  prescription_rejected:  { icon: <CloseCircleOutlined />,  color: '#FEE2E2', iconColor: '#DC2626', label: 'Prescription Rejected' },
  invoice_created:        { icon: <DollarOutlined />,       color: '#FEF3C7', iconColor: '#D97706', label: 'Invoice Created' },
  payment_received:       { icon: <DollarOutlined />,       color: '#D1FAE5', iconColor: '#16A34A', label: 'Payment Received' },
  payment_pending:        { icon: <DollarOutlined />,       color: '#FEF3C7', iconColor: '#D97706', label: 'Payment Pending' },
  message_received:       { icon: <MessageOutlined />,      color: '#DBEAFE', iconColor: '#2563EB', label: 'New Message' },
  staff_status_changed:   { icon: <TeamOutlined />,         color: '#F3E8FF', iconColor: '#7C3AED', label: 'Staff Update' },
  default:                { icon: <InfoCircleOutlined />,   color: '#F1F5F9', iconColor: '#64748B', label: 'Notification' },
};

// ─── Component ────────────────────────────────────────────────────────────────
const NotificationPanel = ({ onClose }) => {
  // Get state + actions from the hook (polling already started in AppLayout)
  const { list, unreadCount, loading, fetchNotifications, markRead, markAllRead } =
    useNotifications();

  const panelRef = useRef(null);

  // Refresh list when panel opens
  useEffect(() => {
    fetchNotifications();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const handleItemClick = (notif) => {
    if (!notif.read_at) markRead(notif.id);
  };

  return (
    <PanelWrap ref={panelRef}>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <PanelHead>
        <PanelTitle>
          <BellOutlined />
          Notifications
          {unreadCount > 0 && (
            <span style={{
              background: '#DC2626', color: 'white',
              borderRadius: 8, padding: '1px 6px',
              fontSize: 10, fontWeight: 700,
            }}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </PanelTitle>
        {unreadCount > 0 && (
          <MarkAllBtn onClick={markAllRead}>Mark all read</MarkAllBtn>
        )}
      </PanelHead>

      {/* ── List ────────────────────────────────────────────────────── */}
      <NotifList>
        {loading && list.length === 0 ? (
          <EmptyNotif>Loading...</EmptyNotif>
        ) : list.length === 0 ? (
          <EmptyNotif>
            <BellOutlined style={{ fontSize: 28, display: 'block', margin: '0 auto 8px' }} />
            No notifications yet
          </EmptyNotif>
        ) : (
          list.map((notif) => {
            const config  = TYPE_CONFIG[notif.type] || TYPE_CONFIG.default;
            const isUnread = !notif.read_at;
            return (
              <NotifItem
                key={notif.id}
                $unread={isUnread}
                onClick={() => handleItemClick(notif)}
              >
                <NotifIconWrap $color={config.color} $iconColor={config.iconColor}>
                  {config.icon}
                </NotifIconWrap>
                <NotifBody>
                  <NotifTitle $unread={isUnread}>{config.label}</NotifTitle>
                  <NotifMessage>{notif.message || notif.body || '—'}</NotifMessage>
                  <NotifTime>
                    {notif.created_at ? dayjs(notif.created_at).fromNow() : ''}
                  </NotifTime>
                </NotifBody>
                {isUnread && <UnreadDot />}
              </NotifItem>
            );
          })
        )}
      </NotifList>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <PanelFooter>
        <ViewAllBtn onClick={onClose}>Close</ViewAllBtn>
      </PanelFooter>

    </PanelWrap>
  );
};

export default NotificationPanel;