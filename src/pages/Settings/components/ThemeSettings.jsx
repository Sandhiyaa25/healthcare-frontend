import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../../context/ThemeContext';
import { CheckOutlined } from '@ant-design/icons';

const Wrap = styled.div``;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.fonts.sizeLg};
  font-weight: ${({ theme }) => theme.fonts.weightSemi};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 8px;
`;

const Sub = styled.p`
  font-size: ${({ theme }) => theme.fonts.sizeSm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 28px;
`;

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  max-width: 500px;
`;

const ThemeCard = styled.button`
  border: 2px solid ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 16px;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.bgCard};
  transition: ${({ theme }) => theme.transitions.fast};
  position: relative;

  &:hover { border-color: ${({ theme }) => theme.colors.primary}; }
`;

const ThemePreview = styled.div`
  width: 100%;
  height: 60px;
  border-radius: ${({ theme }) => theme.radii.sm};
  margin-bottom: 10px;
  background: ${({ $bg }) => $bg};
  border: 1px solid rgba(0,0,0,0.08);
`;

const ThemeName = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
`;

const CheckMark = styled.div`
  position: absolute;
  top: 8px; right: 8px;
  width: 20px; height: 20px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 10px;
  display: flex; align-items: center; justify-content: center;
`;

const THEMES = [
  { key: 'default', name: 'Light',   bg: 'linear-gradient(135deg, #F1F5F9 50%, #2563EB 50%)' },
  { key: 'dark',    name: 'Dark',    bg: 'linear-gradient(135deg, #0D1117 50%, #3B82F6 50%)' },
  { key: 'warm',    name: 'Warm',    bg: 'linear-gradient(135deg, #FFFBF0 50%, #D97706 50%)' },
];

const ThemeSettings = () => {
  const { themeName, setTheme } = useTheme();

  return (
    <Wrap>
      <Title>Appearance</Title>
      <Sub>Choose your preferred theme. Your selection is saved automatically.</Sub>
      <ThemeGrid>
        {THEMES.map((t) => (
          <ThemeCard key={t.key} $active={themeName === t.key} onClick={() => setTheme(t.key)}>
            {themeName === t.key && <CheckMark><CheckOutlined /></CheckMark>}
            <ThemePreview $bg={t.bg} />
            <ThemeName>{t.name}</ThemeName>
          </ThemeCard>
        ))}
      </ThemeGrid>
    </Wrap>
  );
};

export default ThemeSettings;
