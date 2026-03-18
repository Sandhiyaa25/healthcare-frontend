import styled, { keyframes } from 'styled-components';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-12px); }
`;

export const PageWrap = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

export const LeftPanel = styled.div`
  flex: 0 0 42%;
  background: linear-gradient(145deg, #0F172A 0%, #1E293B 60%, #0F3460 100%);
  display: flex;
  flex-direction: column;
  padding: 40px 48px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -80px; right: -80px;
    width: 320px; height: 320px;
    border-radius: 50%;
    background: rgba(37,99,235,0.12);
    pointer-events: none;
  }
  &::after {
    content: '';
    position: absolute;
    bottom: -100px; left: -60px;
    width: 280px; height: 280px;
    border-radius: 50%;
    background: rgba(14,165,233,0.08);
    pointer-events: none;
  }

  @media (max-width: 768px) { display: none; }
`;

export const BrandRow = styled.div`
  display: flex; align-items: center; gap: 12px;
  animation: ${fadeUp} 0.5s ease both;
`;

export const BrandMark = styled.div`
  width: 36px; height: 36px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.sm};
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 800; color: white;
`;

export const BrandLabel = styled.span`
  font-size: 16px;
  font-weight: ${({ theme }) => theme.fonts.weightBold};
  color: white;
`;

export const TaglineWrap = styled.div`
  margin-top: 60px;
  animation: ${fadeUp} 0.5s 0.1s ease both;
`;

export const Tagline = styled.h2`
  font-size: 32px;
  font-weight: ${({ theme }) => theme.fonts.weightBold};
  color: white; line-height: 1.28;
  letter-spacing: -0.6px; margin-bottom: 14px;
`;

export const TaglineSub = styled.p`
  font-size: ${({ theme }) => theme.fonts.sizeSm};
  color: rgba(255,255,255,0.55); line-height: 1.65;
`;

export const FeatureList = styled.ul`
  display: flex; flex-direction: column; gap: 14px;
  margin-top: 40px;
  animation: ${fadeUp} 0.5s 0.2s ease both;
`;

export const FeatureItem = styled.li`
  display: flex; align-items: center; gap: 12px;
  font-size: ${({ theme }) => theme.fonts.sizeSm};
  color: rgba(255,255,255,0.75);

  .feat-icon {
    width: 28px; height: 28px;
    border-radius: ${({ theme }) => theme.radii.sm};
    background: rgba(37,99,235,0.25);
    display: flex; align-items: center; justify-content: center;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 13px; flex-shrink: 0;
  }
`;

export const Illustration = styled.div`
  position: absolute; bottom: 40px; right: 40px;
  animation: ${float} 4s ease-in-out infinite;
`;

export const IllustrationIcon = styled.div`
  width: 72px; height: 72px; border-radius: 50%;
  background: rgba(37,99,235,0.15);
  border: 1.5px solid rgba(37,99,235,0.3);
  display: flex; align-items: center; justify-content: center;
  font-size: 30px; color: ${({ theme }) => theme.colors.primary};
`;

/* ── RIGHT PANEL — full height, card truly centered ── */
export const RightPanel = styled.div`
  flex: 1;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.bgBase};
  padding: 24px;

  @media (max-width: 768px) {
    width: 100vw;
  }
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 4px 32px ${({ theme }) => theme.colors.shadowMd};
  width: 100%;
  max-width: 420px;
  animation: ${fadeUp} 0.4s ease both;
`;

export const CardInner = styled.div`
  padding: 40px 36px;
  @media (max-width: 480px) { padding: 28px 20px; }
`;