import styled from 'styled-components';

export const ApptItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.bgBase};
  }

  &.active {
    background: ${({ theme }) => theme.colors.primaryLight};
    border-left: 3px solid ${({ theme }) => theme.colors.primary};
    padding-left: 13px;
  }
`;

export const PatientName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 2px;
`;

export const ApptMeta = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
`;

const STATUS_COLORS = {
  scheduled:  '#2563EB',
  confirmed:  '#16A34A',
  completed:  '#64748B',
  cancelled:  '#DC2626',
  no_show:    '#D97706',
};

export const StatusDot = styled.span`
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ $status }) => STATUS_COLORS[$status] || '#94A3B8'};
  flex-shrink: 0;
`;

export const EmptyState = styled.div`
  padding: 24px 16px;
  text-align: center;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const SkeletonWrap = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;
