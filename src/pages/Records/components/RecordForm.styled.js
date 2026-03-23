import styled from 'styled-components';

export const FormSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
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

export const VitalGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const VitalItem = styled.div``;