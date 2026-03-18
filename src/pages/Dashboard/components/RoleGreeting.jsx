import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  HeartOutlined, MedicineBoxOutlined, SafetyOutlined,
  StarOutlined, ClockCircleOutlined,
} from '@ant-design/icons';

// ─── Styled ──────────────────────────────────────────────────────────────────

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.08); }
`;

const fadeSlide = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Wrap = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.bgSidebar} 0%, #1e3a5f 100%);
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 28px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  overflow: hidden;
  position: relative;
  animation: ${fadeSlide} 0.4s ease both;

  &::before {
    content: '';
    position: absolute;
    top: -40px; right: -40px;
    width: 180px; height: 180px;
    border-radius: 50%;
    background: rgba(37,99,235,0.12);
    pointer-events: none;
  }
  &::after {
    content: '';
    position: absolute;
    bottom: -60px; left: 30%;
    width: 240px; height: 240px;
    border-radius: 50%;
    background: rgba(14,165,233,0.07);
    pointer-events: none;
  }
`;

const Left = styled.div`
  flex: 1;
  position: relative;
  z-index: 1;
`;

const TimeChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: ${({ theme }) => theme.radii.full};
  padding: 4px 12px;
  font-size: 11px;
  color: rgba(255,255,255,0.7);
  font-weight: 500;
  margin-bottom: 12px;
  width: fit-content;
`;

const Greeting = styled.h2`
  font-size: 26px;
  font-weight: 700;
  color: white;
  letter-spacing: -0.4px;
  margin-bottom: 6px;
  line-height: 1.25;
`;

const SubMessage = styled.p`
  font-size: 13px;
  color: rgba(255,255,255,0.6);
  line-height: 1.5;
  max-width: 520px;
`;

const RoleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(37,99,235,0.35);
  border: 1px solid rgba(37,99,235,0.5);
  color: #93C5FD;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: ${({ theme }) => theme.radii.full};
  text-transform: capitalize;
  margin-top: 14px;
`;

const Right = styled.div`
  flex-shrink: 0;
  position: relative;
  z-index: 1;
`;

const IconCircle = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(37,99,235,0.2);
  border: 1.5px solid rgba(37,99,235,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  color: #60A5FA;
  animation: ${pulse} 3s ease-in-out infinite;
`;

const DateDisplay = styled.div`
  margin-top: 8px;
  text-align: center;
  font-size: 11px;
  color: rgba(255,255,255,0.4);
`;

// ─── Data ────────────────────────────────────────────────────────────────────

const ROLE_CONFIG = {
  admin: {
    icon:     <MedicineBoxOutlined />,
    message:  (name) => `Good ${getTime()}, ${name}`,
    sub:      'Full hospital overview. Monitor operations, staff, revenue and patient flow.',
    label:    'Hospital Admin',
  },
  doctor: {
    icon:     <HeartOutlined />,
    message:  (name) => `Good ${getTime()}, Dr. ${name}`,
    sub:      'Your patients and appointments are ready. Healing begins with you.',
    label:    'Doctor',
  },
  nurse: {
    icon:     <SafetyOutlined />,
    message:  (name) => `Good ${getTime()}, ${name}`,
    sub:      "Compassionate care drives recovery. Here's your ward overview for today.",
    label:    'Nurse',
  },
  receptionist: {
    icon:     <ClockCircleOutlined />,
    message:  (name) => `Good ${getTime()}, ${name}`,
    sub:      "You're the first face patients see. Here's today's appointment and billing summary.",
    label:    'Receptionist',
  },
  pharmacist: {
    icon:     <MedicineBoxOutlined />,
    message:  (name) => `Good ${getTime()}, ${name}`,
    sub:      'Every prescription matters. Review pending prescriptions and dispensing queue.',
    label:    'Pharmacist',
  },
  patient: {
    icon:     <HeartOutlined />,
    message:  (name) => `Good ${getTime()}, ${name}`,
    sub:      'Your health is our priority. Here is your personal health summary.',
    label:    'Patient',
  },
};

const getTime = () => {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
};

const HEALTH_QUOTES = [
  '"The greatest wealth is health." — Virgil',
  '"Take care of your body. It\'s the only place you have to live."',
  '"An apple a day keeps the doctor away."',
  '"Health is not valued till sickness comes."',
  '"To keep the body in good health is a duty."',
];

// ─── Component ───────────────────────────────────────────────────────────────

const RoleGreeting = ({ user, role }) => {
  useState(() =>
    HEALTH_QUOTES[Math.floor(Math.random() * HEALTH_QUOTES.length)]
  );

  const config   = ROLE_CONFIG[role] || ROLE_CONFIG.admin;
  const name     = user?.first_name || user?.username || 'User';
  const now      = new Date();
  const dateStr  = now.toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const timeStr  = now.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <Wrap>
      <Left>
        <TimeChip>
          <ClockCircleOutlined style={{ fontSize: 11 }} />
          {timeStr} · {dateStr}
        </TimeChip>
        <Greeting>{config.message(name)}</Greeting>
        <SubMessage>{config.sub}</SubMessage>
        <RoleBadge>
          <StarOutlined style={{ fontSize: 10 }} />
          {config.label}
        </RoleBadge>
      </Left>
      <Right>
        <IconCircle>{config.icon}</IconCircle>
        <DateDisplay>{now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</DateDisplay>
      </Right>
    </Wrap>
  );
};

export default RoleGreeting;
