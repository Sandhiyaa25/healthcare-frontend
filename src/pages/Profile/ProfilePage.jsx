import React, { useState } from 'react';
import styled from 'styled-components';
import axiosInstance from '../../api/axiosInstance';
import { normalizeError } from '../../utils/errorNormalizer';
import useAuth from '../../hooks/useAuth';
import { idbSet, IDB_KEYS } from '../../utils/indexedDB';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/auth/authSlice';
import {
  UserOutlined, LockOutlined, SaveOutlined,
  CameraOutlined, CheckCircleOutlined,
} from '@ant-design/icons';

const Wrap    = styled.div`max-width: 680px; display: flex; flex-direction: column; gap: 24px;`;
const Card    = styled.div`background: ${({ theme }) => theme.colors.bgCard}; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: ${({ theme }) => theme.radii.md}; padding: 24px;`;
const CardTitle = styled.h3`font-size: 15px; font-weight: 600; color: ${({ theme }) => theme.colors.textPrimary}; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid ${({ theme }) => theme.colors.border}; padding-bottom: 14px;`;
const AvatarSection = styled.div`display: flex; align-items: center; gap: 20px; margin-bottom: 24px;`;
const AvatarBig = styled.div`
  width: 72px; height: 72px; border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: white; font-size: 28px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  text-transform: uppercase; position: relative; flex-shrink: 0;
`;
const AvatarHint = styled.div``;
const AvatarName = styled.p`font-size: 16px; font-weight: 600; color: ${({ theme }) => theme.colors.textPrimary};`;
const AvatarRole = styled.p`font-size: 12px; color: ${({ theme }) => theme.colors.textMuted}; text-transform: capitalize; margin-top: 2px;`;
const Grid  = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 16px; @media(max-width:500px){grid-template-columns:1fr}`;
const Field = styled.div`display: flex; flex-direction: column; gap: 5px;`;
const Label = styled.label`font-size: 12px; font-weight: 500; color: ${({ theme }) => theme.colors.textPrimary};`;
const Input = styled.input`padding: 9px 12px; border: 1.5px solid ${({ theme }) => theme.colors.border}; border-radius: ${({ theme }) => theme.radii.sm}; font-size: 13px; background: ${({ theme }) => theme.colors.bgCard}; color: ${({ theme }) => theme.colors.textPrimary}; outline: none; width: 100%; &:focus { border-color: ${({ theme }) => theme.colors.primary}; } &:disabled { opacity: 0.6; cursor: not-allowed; }`;
const Textarea = styled.textarea`padding: 9px 12px; border: 1.5px solid ${({ theme }) => theme.colors.border}; border-radius: ${({ theme }) => theme.radii.sm}; font-size: 13px; background: ${({ theme }) => theme.colors.bgCard}; color: ${({ theme }) => theme.colors.textPrimary}; outline: none; width: 100%; resize: vertical; min-height: 80px; font-family: inherit; &:focus { border-color: ${({ theme }) => theme.colors.primary}; }`;
const SaveBtn = styled.button`display: flex; align-items: center; gap: 6px; padding: 9px 20px; background: ${({ theme }) => theme.colors.primary}; color: white; border: none; border-radius: ${({ theme }) => theme.radii.sm}; font-size: 13px; font-weight: 500; cursor: pointer; margin-top: 20px; &:disabled { opacity: 0.6; cursor: not-allowed; } &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.primaryDark}; }`;
const SuccessMsg = styled.div`display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: #DCFCE7; border: 1px solid #86EFAC; border-radius: ${({ theme }) => theme.radii.sm}; color: ${({ theme }) => theme.colors.success}; font-size: 13px; margin-top: 12px;`;
const ErrMsg = styled.div`padding: 10px 14px; background: #FEF2F2; border: 1px solid #FECACA; border-radius: ${({ theme }) => theme.radii.sm}; color: ${({ theme }) => theme.colors.danger}; font-size: 13px; margin-top: 12px;`;

const ProfilePage = () => {
  const dispatch    = useDispatch();
  const { user, role } = useAuth();

  const [profileForm, setProfileForm] = useState({
    first_name: user?.first_name || '',
    last_name:  user?.last_name  || '',
    phone:      user?.phone      || '',
    bio:        user?.bio        || '',
  });

  const [pwdForm, setPwdForm] = useState({
    current_password: '',
    new_password:     '',
    confirm_password: '',
  });

  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg,    setProfileMsg]    = useState(null);
  const [profileErr,    setProfileErr]    = useState(null);
  const [pwdSaving,     setPwdSaving]     = useState(false);
  const [pwdMsg,        setPwdMsg]        = useState(null);
  const [pwdErr,        setPwdErr]        = useState(null);

  const pf = (k) => (e) => setProfileForm((p) => ({ ...p, [k]: e.target.value }));
  const wf = (k) => (e) => setPwdForm((p)     => ({ ...p, [k]: e.target.value }));

  const handleProfileSave = async () => {
    setProfileSaving(true); setProfileMsg(null); setProfileErr(null);
    try {
      const res = await axiosInstance.put(`/api/users/${user.id}`, {
        ...profileForm,
        role_id: user.role_id,
        status:  user.status,
      });
      const updatedUser = res.data?.data;
      // Update IndexedDB and Redux
      await idbSet(IDB_KEYS.USER, updatedUser);
      dispatch(loginSuccess({ user: updatedUser, token: null, csrfToken: null }));
      setProfileMsg('Profile updated successfully.');
    } catch (e) {
      setProfileErr(normalizeError(e).message);
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (pwdForm.new_password !== pwdForm.confirm_password) {
      setPwdErr('New passwords do not match.'); return;
    }
    if (pwdForm.new_password.length < 8) {
      setPwdErr('Password must be at least 8 characters.'); return;
    }
    setPwdSaving(true); setPwdMsg(null); setPwdErr(null);
    try {
      await axiosInstance.put('/api/users/me/password', {
        current_password: pwdForm.current_password,
        new_password:     pwdForm.new_password,
      });
      setPwdForm({ current_password: '', new_password: '', confirm_password: '' });
      setPwdMsg('Password changed successfully.');
    } catch (e) {
      setPwdErr(normalizeError(e).message);
    } finally {
      setPwdSaving(false);
    }
  };

  const displayName = user?.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : user?.username;

  return (
    <Wrap>
      {/* Profile Info */}
      <Card>
        <CardTitle><UserOutlined /> My Profile</CardTitle>

        <AvatarSection>
          <AvatarBig>
            {(user?.first_name || user?.username || 'U')[0].toUpperCase()}
          </AvatarBig>
          <AvatarHint>
            <AvatarName>{displayName}</AvatarName>
            <AvatarRole>{role} · {user?.username}</AvatarRole>
          </AvatarHint>
        </AvatarSection>

        <Grid>
          <Field>
            <Label>First Name</Label>
            <Input value={profileForm.first_name} onChange={pf('first_name')} placeholder="First name" />
          </Field>
          <Field>
            <Label>Last Name</Label>
            <Input value={profileForm.last_name} onChange={pf('last_name')} placeholder="Last name" />
          </Field>
          <Field>
            <Label>Username</Label>
            <Input value={user?.username || ''} disabled />
          </Field>
          <Field>
            <Label>Email</Label>
            <Input value={user?.email || ''} disabled />
          </Field>
          <Field>
            <Label>Phone</Label>
            <Input value={profileForm.phone} onChange={pf('phone')} placeholder="+91 98765 43210" />
          </Field>
          <Field>
            <Label>Role</Label>
            <Input value={role || ''} disabled />
          </Field>
        </Grid>

        <Field style={{ marginTop: 16 }}>
          <Label>About Me</Label>
          <Textarea
            value={profileForm.bio}
            onChange={pf('bio')}
            placeholder="A short bio about yourself..."
          />
        </Field>

        {profileMsg && <SuccessMsg><CheckCircleOutlined /> {profileMsg}</SuccessMsg>}
        {profileErr && <ErrMsg>{profileErr}</ErrMsg>}

        <SaveBtn onClick={handleProfileSave} disabled={profileSaving}>
          <SaveOutlined />
          {profileSaving ? 'Saving...' : 'Save Profile'}
        </SaveBtn>
      </Card>

      {/* Change Password */}
      <Card>
        <CardTitle><LockOutlined /> Change Password</CardTitle>

        <Field style={{ marginBottom: 14 }}>
          <Label>Current Password</Label>
          <Input
            type="password"
            value={pwdForm.current_password}
            onChange={wf('current_password')}
            placeholder="Enter current password"
          />
        </Field>
        <Grid>
          <Field>
            <Label>New Password</Label>
            <Input
              type="password"
              value={pwdForm.new_password}
              onChange={wf('new_password')}
              placeholder="Min 8 characters"
            />
          </Field>
          <Field>
            <Label>Confirm New Password</Label>
            <Input
              type="password"
              value={pwdForm.confirm_password}
              onChange={wf('confirm_password')}
              placeholder="Repeat new password"
            />
          </Field>
        </Grid>

        {pwdMsg && <SuccessMsg><CheckCircleOutlined /> {pwdMsg}</SuccessMsg>}
        {pwdErr && <ErrMsg>{pwdErr}</ErrMsg>}

        <SaveBtn onClick={handlePasswordChange} disabled={pwdSaving}>
          <LockOutlined />
          {pwdSaving ? 'Changing...' : 'Change Password'}
        </SaveBtn>
      </Card>
    </Wrap>
  );
};

export default ProfilePage;