import styled from 'styled-components';

export const FormSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
`;

export const SectionTitle = styled.p`
  font-size: ${({ theme }) => theme.fonts.sizeSm};
  font-weight: ${({ theme }) => theme.fonts.weightSemi};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  margin-top: 0;
`;

export const FieldHint = styled.span`
  font-size: ${({ theme }) => theme.fonts.sizeXs};
  color: ${({ theme }) => theme.colors.textMuted};
  display: block;
  margin-top: 2px;
`;
