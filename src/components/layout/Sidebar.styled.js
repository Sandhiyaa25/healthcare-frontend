import styled from 'styled-components';

export const SidebarWrap = styled.aside`
  width: ${({ theme, $collapsed }) => $collapsed ? theme.layout.sidebarCollapsed : theme.layout.sidebarWidth};
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bgSidebar};
  display: flex;
  flex-direction: column;
  transition: width 0.22s cubic-bezier(0.4,0,0.2,1), background 0.2s ease;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.sidebar};
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: ${({ $collapsed }) => $collapsed ? '18px 0' : '18px 20px'};
  justify-content: ${({ $collapsed }) => $collapsed ? 'center' : 'flex-start'};
  border-bottom: 1px solid rgba(255,255,255,0.06);
  min-height: ${({ theme }) => theme.layout.headerHeight};
`;

export const BrandLogo = styled.div`
  width: 32px; height: 32px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.sm};
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; color: white;
  flex-shrink: 0;
  transition: background 0.2s ease;
`;

export const BrandName = styled.span`
  font-size: 16px;
  font-weight: ${({ theme }) => theme.fonts.weightBold};
  color: white;
  white-space: nowrap;
  letter-spacing: -0.3px;
`;

export const NavLabel = styled.div`
  font-size: 10px;
  font-weight: ${({ theme }) => theme.fonts.weightSemi};
  color: rgba(255,255,255,0.3);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  padding: 14px 20px 4px;
`;

export const NavItem = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: ${({ $collapsed }) => $collapsed ? '12px 0' : '11px 20px'};
  justify-content: ${({ $collapsed }) => $collapsed ? 'center' : 'flex-start'};
  border-radius: 0;
  background: ${({ $active }) => $active ? 'rgba(37,99,235,0.18)' : 'transparent'};
  border-left: 3px solid ${({ $active, theme }) => $active ? theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.bgSidebarHover};
    border-left-color: ${({ $active, theme }) => $active ? theme.colors.primary : 'rgba(255,255,255,0.1)'};
  }
`;

export const NavIcon = styled.span`
  font-size: 16px;
  color: ${({ $active, theme }) => $active ? theme.colors.primary : 'rgba(255,255,255,0.55)'};
  display: flex; align-items: center;
  flex-shrink: 0;
  transition: color 0.15s ease;
`;

export const NavText = styled.span`
  font-size: ${({ theme }) => theme.fonts.sizeSm};
  font-weight: ${({ theme }) => theme.fonts.weightMedium};
  color: rgba(255,255,255,0.8);
  white-space: nowrap;
`;

export const CollapseBtn = styled.button`
  display: flex; align-items: center; justify-content: center;
  width: 100%; padding: 14px;
  color: rgba(255,255,255,0.4);
  font-size: 16px;
  transition: all 0.15s ease;
  border-top: 1px solid rgba(255,255,255,0.06);
  &:hover { color: white; background: ${({ theme }) => theme.colors.bgSidebarHover}; }
`;

export const UserInfo = styled.div`
  display: flex; align-items: center; gap: 10px;
  padding: 14px 16px;
  border-top: 1px solid rgba(255,255,255,0.06);
`;

export const UserAvatar = styled.div`
  width: 32px; height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: white; font-size: 13px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  text-transform: uppercase; flex-shrink: 0;
`;

export const UserMeta = styled.div`overflow: hidden; flex: 1;`;

export const UserName = styled.p`
  font-size: ${({ theme }) => theme.fonts.sizeSm};
  font-weight: ${({ theme }) => theme.fonts.weightMedium};
  color: rgba(255,255,255,0.9);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`;

export const UserRole = styled.p`
  font-size: 10px;
  color: rgba(255,255,255,0.4);
  text-transform: capitalize;
`;
