import styled from 'styled-components';

export const HeaderWrap = styled.header`
  height: ${({ theme }) => theme.layout.headerHeight};
  background: ${({ theme }) => theme.colors.bgCard};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.header};
  flex-shrink: 0;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fonts.sizeMd};
  font-weight: ${({ theme }) => theme.fonts.weightSemi};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const TenantName = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.bgBase};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radii.full};
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const IconBtn = styled.button`
  width: 36px; height: 36px;
  border-radius: ${({ theme }) => theme.radii.sm};
  display: flex; align-items: center; justify-content: center;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: ${({ theme }) => theme.transitions.fast};
  background: transparent;
  &:hover {
    background: ${({ theme }) => theme.colors.bgBase};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

export const AvatarBtn = styled.button`
  display: flex; align-items: center; gap: 8px;
  padding: 4px;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  transition: ${({ theme }) => theme.transitions.fast};
  &:hover { background: ${({ theme }) => theme.colors.bgBase}; }
`;

// export const AvatarCircle = styled.div`
//   width: 28px; height: 28px;
//   border-radius: 50%;
//   background: ${({ theme }) => theme.colors.primary};
//   color: white;
//   font-size: 12px; font-weight: 700;
//   display: flex; align-items: center; justify-content: center;
//   text-transform: uppercase;
// `;


export const AvatarCircle = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
   color: ${({ theme }) => theme.colors.textInverse};
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  overflow: hidden;  /* ← critical for image */
  flex-shrink: 0;
`;

export const Divider = styled.div`
  width: 1px; height: 20px;
  background: ${({ theme }) => theme.colors.border};
  margin: 0 4px;
`;
