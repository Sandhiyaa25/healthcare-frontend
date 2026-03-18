import styled from 'styled-components';

export const FormWrap = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
`;

export const FormTitle = styled.h2`
  font-size: ${({ theme }) => theme.fonts.sizeXl};
  font-weight: ${({ theme }) => theme.fonts.weightBold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 6px;
  letter-spacing: -0.4px;
`;

export const FormSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fonts.sizeSm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 28px;

  strong {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: ${({ theme }) => theme.fonts.weightSemi};
    text-transform: capitalize;
  }
`;

export const AlertBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #FEF2F2;
  border: 1px solid #FECACA;
  border-radius: ${({ theme }) => theme.radii.sm};
  padding: 12px 14px;
  margin-bottom: 20px;
  font-size: ${({ theme }) => theme.fonts.sizeSm};
  color: ${({ theme }) => theme.colors.danger};

  .anticon { font-size: 15px; flex-shrink: 0; }
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 10px;
`;

export const ForgotLink = styled.button`
  align-self: flex-end;
  font-size: ${({ theme }) => theme.fonts.sizeSm};
  color: ${({ theme }) => theme.colors.primary};
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 0;
  margin-bottom: 24px;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover { text-decoration: underline; }
`;
