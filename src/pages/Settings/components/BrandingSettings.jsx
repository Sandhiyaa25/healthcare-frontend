import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { SaveOutlined, BgColorsOutlined, EyeOutlined } from '@ant-design/icons';
import axiosInstance from '../../../api/axiosInstance';
import useTenant     from '../../../hooks/useTenant';
import { setTenant } from '../../../store/auth/authSlice';
import { idbSet, IDB_KEYS } from '../../../utils/indexedDB';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const hexToRgb = (hex) => {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return { r, g, b };
};

// Darken hex by reducing each channel by 30
const darken = (hex) => {
  const { r, g, b } = hexToRgb(hex);
  const d = (v) => Math.max(0, v - 30).toString(16).padStart(2, '0');
  return `#${d(r)}${d(g)}${d(b)}`;
};

// Lighten = rgba with 0.15 opacity
const lighten = (hex) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},0.15)`;
};

// ─── Preset color swatches ────────────────────────────────────────────────────
const PRESETS = [
  { label: 'Blue',       hex: '#2563EB' },
  { label: 'Teal',       hex: '#0891B2' },
  { label: 'Violet',     hex: '#7C3AED' },
  { label: 'Green',      hex: '#16A34A' },
  { label: 'Red',        hex: '#DC2626' },
  { label: 'Amber',      hex: '#D97706' },
  { label: 'Dark Teal',  hex: '#0F766E' },
  { label: 'Pink',       hex: '#BE185D' },
];

// ─── Styled ───────────────────────────────────────────────────────────────────
const Wrap        = styled.div`display: flex; flex-direction: column; gap: 24px;`;
const Title       = styled.h3`font-size: 16px; font-weight: 600; color: ${({ theme }) => theme.colors.textPrimary}; margin-bottom: 4px;`;
const Sub         = styled.p`font-size: 13px; color: ${({ theme }) => theme.colors.textSecondary}; margin-bottom: 20px;`;
const Card        = styled.div`background: ${({ theme }) => theme.colors.bgBase}; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: ${({ theme }) => theme.radii.md}; padding: 20px;`;
const CardTitle   = styled.div`display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: ${({ theme }) => theme.colors.textPrimary}; margin-bottom: 14px;`;
const Label       = styled.label`font-size: 12px; font-weight: 500; color: ${({ theme }) => theme.colors.textPrimary}; display: block; margin-bottom: 6px;`;
const Input       = styled.input`padding: 9px 12px; border: 1.5px solid ${({ theme }) => theme.colors.border}; border-radius: ${({ theme }) => theme.radii.sm}; font-size: 13px; background: ${({ theme }) => theme.colors.bgCard}; color: ${({ theme }) => theme.colors.textPrimary}; outline: none; width: 100%; &:focus { border-color: ${({ theme }) => theme.colors.primary}; }`;
const ColorRow    = styled.div`display: flex; align-items: center; gap: 12px; flex-wrap: wrap;`;
const ColorPicker = styled.input`
  width: 44px; height: 44px; padding: 2px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.bgCard};
  cursor: pointer;
  &::-webkit-color-swatch-wrapper { padding: 0; }
  &::-webkit-color-swatch         { border-radius: 4px; border: none; }
`;
const HexInput    = styled.input`
  width: 100px; padding: 9px 12px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 13px; font-family: monospace;
  background: ${({ theme }) => theme.colors.bgCard};
  color: ${({ theme }) => theme.colors.textPrimary};
  outline: none;
  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
`;
const Swatches    = styled.div`display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px;`;
const Swatch      = styled.button`
  width: 32px; height: 32px; border-radius: 50%;
  background: ${({ $color }) => $color};
  border: ${({ $active }) => $active ? '3px solid white' : '2px solid transparent'};
  outline: ${({ $active, $color }) => $active ? `2px solid ${$color}` : 'none'};
  cursor: pointer; transition: transform 0.15s;
  &:hover { transform: scale(1.15); }
`;
const SwatchLabel = styled.span`font-size: 10px; color: ${({ theme }) => theme.colors.textMuted}; display: block; text-align: center; margin-top: 2px;`;
const SwatchWrap  = styled.div`display: flex; flex-direction: column; align-items: center;`;

// Live preview card
const Preview     = styled.div`
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;
const PreviewBar  = styled.div`
  background: #0F172A;
  padding: 14px 20px;
  display: flex; align-items: center; gap: 10px;
`;
const PreviewLogo = styled.div`
  width: 30px; height: 30px; border-radius: 6px;
  background: ${({ $color }) => $color};
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 11px; font-weight: 700;
`;
const PreviewName = styled.span`color: white; font-size: 14px; font-weight: 600;`;
const PreviewBody = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  padding: 16px 20px;
  display: flex; gap: 12px; flex-wrap: wrap;
`;
const PreviewBtn  = styled.button`
  padding: 8px 18px;
  background: ${({ $color }) => $color};
  color: white; border: none;
  border-radius: 6px; font-size: 13px; font-weight: 500; cursor: default;
`;
const PreviewBtnOutline = styled.button`
  padding: 8px 18px;
  background: transparent;
  color: ${({ $color }) => $color};
  border: 1.5px solid ${({ $color }) => $color};
  border-radius: 6px; font-size: 13px; font-weight: 500; cursor: default;
`;
const PreviewBadge = styled.span`
  padding: 4px 12px;
  background: ${({ $color }) => $color};
  color: white;
  border-radius: 999px; font-size: 11px; font-weight: 600;
`;

const SaveBtn   = styled.button`
  display: flex; align-items: center; gap: 6px;
  padding: 9px 20px;
  background: ${({ theme }) => theme.colors.primary};
  color: white; border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 13px; font-weight: 500; cursor: pointer;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.primaryDark}; }
`;
const SuccessMsg = styled.p`font-size: 12px; color: ${({ theme }) => theme.colors.success}; font-weight: 500; margin-top: 10px;`;
const ErrMsg     = styled.p`font-size: 12px; color: ${({ theme }) => theme.colors.danger}; font-weight: 500; margin-top: 10px;`;

// ─── Component ────────────────────────────────────────────────────────────────
const BrandingSettings = () => {
  const dispatch = useDispatch();
  const tenant   = useTenant();

  const [color,   setColor]   = useState(tenant?.primary_color   || '#2563EB');
  const [tagline, setTagline] = useState(tenant?.tagline         || 'Empowering Healthcare');
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState(null);
  const [err,     setErr]     = useState(null);

  const darkColor  = darken(color);
  const lightColor = lighten(color);

  // Tenant initials for preview
  const getInitials = (name) => {
    if (!name) return 'HC';
    const words = name.trim().split(/\s+/);
    return words.length === 1
      ? words[0].slice(0, 2).toUpperCase()
      : (words[0][0] + words[1][0]).toUpperCase();
  };
  const initials = getInitials(tenant?.name);

  const handleColorChange = useCallback((hex) => {
    // Validate hex format
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      setColor(hex);
    }
  }, []);

  const handleSave = async () => {
    setSaving(true); setMsg(null); setErr(null);
    try {
      await axiosInstance.put('/api/settings/branding', {
        primary_color:       color,
        primary_color_dark:  darkColor,
        primary_color_light: lightColor,
        tagline,
      });

      // Update tenant in Redux + IDB immediately so theme updates live
      const updated = {
        ...tenant,
        primary_color:       color,
        primary_color_dark:  darkColor,
        primary_color_light: lightColor,
        tagline,
      };
      dispatch(setTenant(updated));
      await idbSet(IDB_KEYS.TENANT, updated);

      setMsg('Branding updated! The new colors are now live across your hospital.');
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to save branding. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Wrap>
      <div>
        <Title>Hospital Branding</Title>
        <Sub>
          Customize your hospital's brand color. This applies to buttons, links,
          active states, and accents across the entire system for all staff.
        </Sub>
      </div>

      {/* ── Color Picker ─────────────────────────────────────────── */}
      <Card>
        <CardTitle><BgColorsOutlined /> Brand Color</CardTitle>

        <Label>Pick a color</Label>
        <ColorRow>
          <ColorPicker
            type="color"
            value={color}
            onChange={(e) => handleColorChange(e.target.value)}
          />
          <HexInput
            type="text"
            value={color}
            maxLength={7}
            onChange={(e) => {
              const v = e.target.value;
              if (v.startsWith('#')) handleColorChange(v);
              else handleColorChange('#' + v);
            }}
            placeholder="#2563EB"
          />
          <span style={{ fontSize: 12, color: '#94A3B8' }}>
            Dark: <code style={{ fontSize: 11 }}>{darkColor}</code>
          </span>
        </ColorRow>

        {/* Preset swatches */}
        <Label style={{ marginTop: 16 }}>Or choose a preset</Label>
        <Swatches>
          {PRESETS.map((p) => (
            <SwatchWrap key={p.hex}>
              <Swatch
                $color={p.hex}
                $active={color === p.hex}
                onClick={() => setColor(p.hex)}
                title={p.label}
              />
              <SwatchLabel>{p.label}</SwatchLabel>
            </SwatchWrap>
          ))}
        </Swatches>
      </Card>

      {/* ── Tagline ───────────────────────────────────────────────── */}
      <Card>
        <CardTitle>Hospital Tagline</CardTitle>
        <Label>Shown on the login page and dashboard greeting</Label>
        <Input
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="Empowering Healthcare"
          maxLength={80}
        />
      </Card>

      {/* ── Live Preview ─────────────────────────────────────────── */}
      <Card>
        <CardTitle><EyeOutlined /> Live Preview</CardTitle>
        <Preview>
          <PreviewBar>
            <PreviewLogo $color={color}>{initials}</PreviewLogo>
            <PreviewName>{tenant?.name || 'Hospital Name'}</PreviewName>
          </PreviewBar>
          <PreviewBody>
            <PreviewBtn $color={color}>Book Appointment</PreviewBtn>
            <PreviewBtnOutline $color={color}>View Records</PreviewBtnOutline>
            <PreviewBadge $color={color}>scheduled</PreviewBadge>
            <PreviewBadge $color={darkColor}>confirmed</PreviewBadge>
          </PreviewBody>
        </Preview>
      </Card>

      {/* ── Save ─────────────────────────────────────────────────── */}
      <div>
        <SaveBtn onClick={handleSave} disabled={saving}>
          <SaveOutlined />
          {saving ? 'Saving...' : 'Save Branding'}
        </SaveBtn>
        {msg && <SuccessMsg>✓ {msg}</SuccessMsg>}
        {err && <ErrMsg>✗ {err}</ErrMsg>}
      </div>
    </Wrap>
  );
};

export default BrandingSettings;