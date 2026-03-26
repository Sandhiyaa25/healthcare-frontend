import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root       { height: 100%; width: 100%; }

  body {
    font-family:            ${({ theme }) => theme.fonts.base};
    font-size:              ${({ theme }) => theme.fonts.sizeBase};
    color:                  ${({ theme }) => theme.colors.textPrimary};
    background:             ${({ theme }) => theme.colors.bgBase};
    line-height:            1.6;
    -webkit-font-smoothing: antialiased;
    transition:             background 0.2s ease, color 0.2s ease;
  }

  a                       { color: inherit; text-decoration: none; }
  button                  { font-family: inherit; cursor: pointer; border: none; background: none; }
  input, textarea, select { font-family: inherit; font-size: inherit; }
  ul, ol                  { list-style: none; }

  ::-webkit-scrollbar        { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track  { background: transparent; }
  ::-webkit-scrollbar-thumb  { background: ${({ theme }) => theme.colors.border}; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: ${({ theme }) => theme.colors.textMuted}; }

  /* ── Autofill override (Chrome/Edge inject solid colour) ─────────────────── */
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow:      0 0 0 100px ${({ theme }) => theme.colors.bgInput || theme.colors.bgCard} inset !important;
    -webkit-text-fill-color: ${({ theme }) => theme.colors.textPrimary} !important;
    caret-color:             ${({ theme }) => theme.colors.textPrimary} !important;
  }

  input::placeholder,
  textarea::placeholder {
    color: ${({ theme }) => theme.colors.textMuted} !important;
    opacity: 1 !important;
  }

  /* ── Modal corner overflow ───────────────────────────────────────────────── */
  .ant-modal-content {
    overflow:      hidden !important;
    border-radius: ${({ theme }) => theme.radii.md} !important;
  }

  /* ── Table ───────────────────────────────────────────────────────────────── */
  .ant-table-thead > tr > th {
    font-size: 11px !important; font-weight: 600 !important;
    text-transform: uppercase !important; letter-spacing: 0.5px !important;
  }
  .ant-table-tbody > tr:last-child > td { border-bottom: none !important; }
  .ant-table-container                  { border-radius: 0 !important; }
  .ant-table-placeholder > td           { background: ${({ theme }) => theme.colors.bgCard} !important; border: none !important; }
  .ant-empty-description                { color: ${({ theme }) => theme.colors.textMuted} !important; }

  /* ── Pagination ──────────────────────────────────────────────────────────── */
  .ant-pagination {
    padding: 12px 16px !important; margin: 0 !important;
    border-top: 1px solid ${({ theme }) => theme.colors.border} !important;
  }

  /* ── Dropdown z-index ────────────────────────────────────────────────────── */
  .ant-select-dropdown { z-index: 1100 !important; }
  .ant-picker-dropdown { z-index: 1100 !important; }
  .ant-tooltip         { z-index: 1200 !important; }

  /* ── Form labels ─────────────────────────────────────────────────────────── */
  .ant-form-item-label > label    { font-size: 12px !important; font-weight: 500 !important; }
  .ant-form-item-explain-error    { font-size: 11px !important; }

  /* ── Tabs ────────────────────────────────────────────────────────────────── */
  .ant-tabs-nav::before           { border-bottom-color: ${({ theme }) => theme.colors.border} !important; }
  .ant-tabs-content-holder        { background: ${({ theme }) => theme.colors.bgCard} !important; }

  /* ── Divider inner text ──────────────────────────────────────────────────── */
  .ant-divider-horizontal.ant-divider-with-text .ant-divider-inner-text {
    background: ${({ theme }) => theme.colors.bgCard} !important;
  }

  /* ── Alert ───────────────────────────────────────────────────────────────── */
  .ant-alert { border-radius: ${({ theme }) => theme.radii.sm} !important; }

  /* ── Popover border ──────────────────────────────────────────────────────── */
  .ant-popover-inner           { border: 1px solid ${({ theme }) => theme.colors.border} !important; }
  .ant-popconfirm-description  { color: ${({ theme }) => theme.colors.textSecondary} !important; }

  /* ── Notification border ─────────────────────────────────────────────────── */
  .ant-notification-notice     { border: 1px solid ${({ theme }) => theme.colors.border} !important; }

  /* ── Tag ─────────────────────────────────────────────────────────────────── */
  .ant-tag { border-radius: 4px !important; }

  /* ── Steps connector line ────────────────────────────────────────────────── */
  .ant-steps-item-tail::after  { background: ${({ theme }) => theme.colors.border} !important; }

  /* ── Calendar cell height ────────────────────────────────────────────────── */
  .ant-picker-calendar .ant-picker-cell-inner {
    min-height: 80px !important; height: auto !important; padding: 4px 6px !important;
  }

  /* ── Spin dot ────────────────────────────────────────────────────────────── */
  .ant-spin-dot-item { background: ${({ theme }) => theme.colors.primary} !important; }

  /* ── Radio button group border-radius ────────────────────────────────────── */
  .ant-radio-button-wrapper:first-child { border-radius: ${({ theme }) => theme.radii.sm} 0 0 ${({ theme }) => theme.radii.sm} !important; }
  .ant-radio-button-wrapper:last-child  { border-radius: 0 ${({ theme }) => theme.radii.sm} ${({ theme }) => theme.radii.sm} 0 !important; }

  /* ── Skeleton shimmer ────────────────────────────────────────────────────── */
  .ant-skeleton-active .ant-skeleton-avatar,
  .ant-skeleton-active .ant-skeleton-title,
  .ant-skeleton-active .ant-skeleton-paragraph > li {
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.border} 25%,
      ${({ theme }) => theme.colors.bgBase} 37%,
      ${({ theme }) => theme.colors.border} 63%
    ) !important;
    background-size: 400% 100% !important;
  }
`;

export default GlobalStyles;