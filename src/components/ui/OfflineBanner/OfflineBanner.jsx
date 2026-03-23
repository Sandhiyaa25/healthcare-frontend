/**
 * OfflineBanner.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Elegant, tenant-themed offline/sync banner.
 * Uses styled-components theme directly — matches tenant brand color automatically.
 */

import React, { useEffect } from 'react';
import styled, { keyframes, css, useTheme } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import {
  DisconnectOutlined, SyncOutlined,
  CheckCircleOutlined, WarningOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import {
  hideBanner,
  drainQueue,
  loadQueueRequest,
} from '../../../store/offlineQueue/offlineQueueSlice';

// ─── Animations ───────────────────────────────────────────────────────────────
const slideDown = keyframes`
  from { transform: translateY(-120%); opacity: 0; }
  to   { transform: translateY(0);     opacity: 1; }
`;
const spin = keyframes`
  from { transform: rotate(0deg);   }
  to   { transform: rotate(360deg); }
`;
const pulseDot = keyframes`
  0%, 100% { opacity: 1; transform: scale(1);    }
  50%       { opacity: 0.5; transform: scale(0.8); }
`;
const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
`;

// ─── Styled ───────────────────────────────────────────────────────────────────
const Wrap = styled.div`
  position: fixed;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  pointer-events: all;
  animation: ${slideDown} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 16px 9px 14px;
  border-radius: 999px;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  min-width: 260px;
  max-width: 480px;

  /* Dynamic colors from props */
  background:   ${({ $bg })     => $bg};
  border: 1px solid ${({ $bd }) => $bd};

  /* Frosted glass effect */
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);

  /* Elegant shadow */
  box-shadow:
    0 8px 32px rgba(0,0,0,0.14),
    0 2px 8px  rgba(0,0,0,0.08),
    inset 0 1px 0 rgba(255,255,255,0.1);

  /* Shimmer when syncing */
  ${({ $syncing }) => $syncing && css`
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255,255,255,0.07) 50%,
        transparent 100%
      );
      background-size: 400px 100%;
      animation: ${shimmer} 1.6s ease infinite;
      pointer-events: none;
    }
  `}
`;

const Dot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ $c }) => $c};
  animation: ${({ $pulse }) => $pulse
    ? css`${pulseDot} 1.4s ease infinite`
    : 'none'};
`;

const Icon = styled.span`
  font-size: 13px;
  color: ${({ $c }) => $c};
  display: flex;
  align-items: center;
  flex-shrink: 0;
  ${({ $spin }) => $spin && css`
    animation: ${spin} 1s linear infinite;
  `}
`;

const Texts = styled.div`flex: 1; min-width: 0;`;

const Main = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: ${({ $c }) => $c};
  margin: 0;
  line-height: 1.3;
`;

const Sub = styled.p`
  font-size: 10px;
  color: ${({ $c }) => $c};
  opacity: 0.65;
  margin: 1px 0 0 0;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: ${({ $c }) => $c};
  color: white;
  font-size: 10px;
  font-weight: 700;
  flex-shrink: 0;
`;

const RetryBtn = styled.button`
  font-size: 10px;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  border: 1.5px solid ${({ $c }) => $c};
  color: ${({ $c }) => $c};
  background: transparent;
  transition: all 0.15s;
  &:hover { background: ${({ $c }) => $c}; color: white; }
`;

const CloseBtn = styled.button`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(0,0,0,0.08);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  color: ${({ $c }) => $c};
  flex-shrink: 0;
  opacity: 0.65;
  transition: opacity 0.15s;
  &:hover { opacity: 1; }
`;

// ─── Mode configs ─────────────────────────────────────────────────────────────
const SUB = {
  offline: 'Actions saved. Will auto-sync when reconnected.',
  syncing: 'Submitting queued actions to server…',
  synced:  'All actions submitted successfully.',
  error:   'Some actions could not be submitted.',
};

// ─── Component ────────────────────────────────────────────────────────────────
const OfflineBanner = () => {
  const dispatch      = useDispatch();
  const theme         = useTheme();
  const showBanner    = useSelector((s) => s.offlineQueue?.showBanner    ?? false);
  const bannerMode    = useSelector((s) => s.offlineQueue?.bannerMode    ?? 'offline');
  const bannerMessage = useSelector((s) => s.offlineQueue?.bannerMessage ?? '');
  const pendingCount  = useSelector((s) => s.offlineQueue?.pendingCount  ?? 0);
  const isSyncing     = useSelector((s) => s.offlineQueue?.isSyncing     ?? false);

  // Load queue from IDB on mount
  useEffect(() => {
    dispatch(loadQueueRequest());
  }, [dispatch]);

  if (!showBanner) return null;

  // Resolve colors — all from tenant theme
  const primary = theme?.colors?.primary    || '#2563EB';
  const danger  = theme?.colors?.danger     || '#DC2626';
  const success = theme?.colors?.success    || '#16A34A';
  const warning = theme?.colors?.warning    || '#D97706';

  const palette = {
    offline: { main: danger,  bg: `${danger}12`,  bd: `${danger}30`  },
    syncing: { main: primary, bg: `${primary}12`, bd: `${primary}30` },
    synced:  { main: success, bg: `${success}12`, bd: `${success}30` },
    error:   { main: warning, bg: `${warning}12`, bd: `${warning}30` },
  };
  const p = palette[bannerMode] || palette.offline;

  const icons = {
    offline: <DisconnectOutlined />,
    syncing: <SyncOutlined />,
    synced:  <CheckCircleOutlined />,
    error:   <WarningOutlined />,
  };

  return (
    <Wrap role="status" aria-live="polite">
      <Inner $bg={p.bg} $bd={p.bd} $syncing={isSyncing}>

        {/* Status dot */}
        <Dot $c={p.main} $pulse={bannerMode === 'offline'} />

        {/* Icon */}
        <Icon $c={p.main} $spin={bannerMode === 'syncing'}>
          {icons[bannerMode]}
        </Icon>

        {/* Text */}
        <Texts>
          <Main $c={p.main}>{bannerMessage}</Main>
          <Sub  $c={p.main}>{SUB[bannerMode]}</Sub>
        </Texts>

        {/* Pending count badge */}
        {pendingCount > 0 && bannerMode !== 'synced' && (
          <Badge $c={p.main}>{pendingCount > 99 ? '99+' : pendingCount}</Badge>
        )}

        {/* Retry button on error */}
        {bannerMode === 'error' && (
          <RetryBtn $c={p.main} onClick={() => dispatch(drainQueue())}>
            Retry
          </RetryBtn>
        )}

        {/* Dismiss on synced or error */}
        {(bannerMode === 'synced' || bannerMode === 'error') && (
          <CloseBtn $c={p.main} onClick={() => dispatch(hideBanner())} aria-label="Dismiss">
            <CloseOutlined />
          </CloseBtn>
        )}

      </Inner>
    </Wrap>
  );
};

export default OfflineBanner;