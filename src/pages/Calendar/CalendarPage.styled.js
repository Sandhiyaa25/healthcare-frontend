import styled, { keyframes } from 'styled-components';

export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: ${fadeIn} 0.3s ease;
`;

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const Title = styled.h2`
  font-size: ${({ theme }) => theme.fonts?.sizeXl || '24px'};
  font-weight: 700;
  color: ${({ theme }) => theme.colors?.textPrimary || '#1e293b'};
  letter-spacing: -0.3px;
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors?.bgCard || '#ffffff'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#e2e8f0'};
  border-radius: ${({ theme }) => theme.radii?.md || '8px'};
  overflow: hidden;
  padding: 20px;

  /* Ant Design calendar overrides */
  .ant-picker-calendar {
    background: transparent;
  }
  .ant-picker-calendar-header {
    padding: 0 0 16px 0;
  }
`;

export const ErrMsg = styled.div`
  padding: 12px 16px;
  background: #FEF2F2; border: 1px solid #FECACA;
  border-radius: ${({ theme }) => theme.radii?.sm || '6px'};
  color: ${({ theme }) => theme.colors?.danger || '#ef4444'}; font-size: 13px;
`;

export const EventDot = styled.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 4px;
  background: ${({ $type }) =>
        $type === 'surgery' ? '#EF4444' :
            $type === 'follow-up' ? '#F59E0B' :
                '#2563EB'};
`;

export const EventItem = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors?.textSecondary || '#475569'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 1px 0;
  display: flex;
  align-items: center;
`;

export const EventsList = styled.div`
  max-height: 60px;
  overflow-y: auto;
`;
