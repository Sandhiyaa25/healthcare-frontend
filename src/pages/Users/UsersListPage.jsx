import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { fetchRolesApi } from '../../api/staff.api';
import { normalizeError } from '../../utils/errorNormalizer';
import Badge   from '../../components/ui/Badge/Badge';
import Spinner from '../../components/ui/Spinner/Spinner';
import {
  UserAddOutlined, EditOutlined, DeleteOutlined,
  SearchOutlined, ReloadOutlined,
  EyeOutlined, EyeInvisibleOutlined,
  MailOutlined, PhoneOutlined, CalendarOutlined,
  ClockCircleOutlined, SafetyOutlined, CloseOutlined,
} from '@ant-design/icons';
import {
  Wrap, TopBar, Title, Controls,
  SearchBox, SearchInp, IconBtn, AddBtn,
  Card, Table, Thead, Tbody, Tr, Th, Td,
  UserCell, Avatar, UserName, UserEmail,
  ActionsCell, ActionBtn, EmptyState, ErrMsg,
  Overlay, Modal, ModalHead, ModalTitle, CloseBtn,
  FieldGrid, Field, Label, Input, Select,
  FieldErr, PwdWrap, PwdInput, PwdEye,
  BtnRow, CancelBtn, SaveBtn,
} from './UsersListPage.styled';
import styled, { keyframes } from 'styled-components';

// ─── Detail Panel Styles ─────────────────────────────────────────────────────

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const PageLayout = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
`;

const TableWrap = styled.div`
  flex: 1;
  min-width: 0;
  transition: all 0.2s ease;
`;

const DetailPanel = styled.div`
  width: 300px;
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  animation: ${slideIn} 0.25s ease both;
  position: sticky;
  top: 0;
`;

const DetailHeader = styled.div`
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  padding: 24px 20px;
  position: relative;
  text-align: center;
`;

const DetailCloseBtn = styled.button`
  position: absolute;
  top: 12px; right: 12px;
  width: 26px; height: 26px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  border: none; cursor: pointer;
  color: rgba(255,255,255,0.7);
  font-size: 12px;
  display: flex; align-items: center; justify-content: center;
  &:hover { background: rgba(255,255,255,0.2); color: white; }
`;

const DetailAvatar = styled.div`
  width: 64px; height: 64px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 24px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  text-transform: uppercase;
  margin: 0 auto 12px;
  border: 3px solid rgba(255,255,255,0.15);
`;

const DetailName = styled.h3`
  font-size: 15px; font-weight: 600;
  color: white;
  margin-bottom: 4px;
`;

const DetailUsername = styled.p`
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  margin-bottom: 10px;
`;

const DetailBody = styled.div`padding: 16px;`;

const DetailSection = styled.div`margin-bottom: 16px;`;

const DetailSectionTitle = styled.p`
  font-size: 10px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 10px;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  &:last-child { border-bottom: none; }
`;

const DetailRowIcon = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 1px;
  flex-shrink: 0;
`;

const DetailRowContent = styled.div`flex: 1; min-width: 0;`;

const DetailRowLabel = styled.p`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 1px;
`;

const DetailRowValue = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DetailEditBtn = styled.button`
  width: 100%;
  padding: 10px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 4px;
  transition: background 0.15s;
  &:hover { background: ${({ theme }) => theme.colors.primaryDark}; }
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: 12px 0;
`;

// ─── Constants ────────────────────────────────────────────────────────────────


const STATUS_VARIANT = {
  active: 'success', inactive: 'warning', suspended: 'danger', deleted: 'default',
};

// ── FIX 1: Added phone to EMPTY_FORM ────────────────────────────────────────
const EMPTY_FORM = {
  username: '', email: '', password: '',
  first_name: '', last_name: '', phone: '',
  role_id: '', status: 'active',
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'Never';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

// ─── Component ────────────────────────────────────────────────────────────────

const UsersListPage = () => {
  const [users,      setUsers]      = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [search,     setSearch]     = useState('');
  const [viewUser,   setViewUser]   = useState(null);
  const [showModal,  setShowModal]  = useState(false);
  const [editUser,   setEditUser]   = useState(null);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving,     setSaving]     = useState(false);
  const [showPwd,    setShowPwd]    = useState(false);
  const [roles,      setRoles]      = useState([]);

  useEffect(() => {
    fetchRolesApi()
      .then((res) => {
        const list = res.data?.data || [];
        setRoles(list);
      })
      .catch(() => setRoles([]));
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await axiosInstance.get('/api/users');
      setUsers(res.data?.data || []);
    } catch (e) {
      setError(normalizeError(e).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const openCreate = () => {
    setEditUser(null);
    setForm({ ...EMPTY_FORM, role_id: roles[0]?.id ?? '' });
    setFormErrors({});
    setViewUser(null);
    setShowModal(true);
  };

  // ── FIX 2: Added phone to openEdit population ────────────────────────────
  const openEdit = (u) => {
    setEditUser(u);
    setForm({
      username:   u.username    || '',
      email:      u.email       || '',
      password:   '',
      first_name: u.first_name  || '',
      last_name:  u.last_name   || '',
      phone:      u.phone       || '',
      role_id:    u.role_id,
      status:     u.status,
    });
    setFormErrors({});
    setViewUser(null);
    setShowModal(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.username.trim())                      errs.username = 'Required';
    if (!editUser && !form.password)                errs.password = 'Required';
    if (form.password && form.password.length < 8) errs.password = 'Min 8 characters';
    // ── FIX 3: Phone format validation ──────────────────────────────────────
    if (form.phone) {
      const cleaned = form.phone.replace(/[\s\-\(\)]/g, '');
      if (!/^\+?[0-9]{7,15}$/.test(cleaned)) {
        errs.phone = 'Invalid phone number';
      }
    }
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setSaving(true); setFormErrors({});
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      if (!payload.phone)    delete payload.phone;  // don't send empty string
      if (editUser) {
        await axiosInstance.put(`/api/users/${editUser.id}`, payload);
      } else {
        await axiosInstance.post('/api/users', payload);
      }
      setShowModal(false);
      fetchUsers();
    } catch (e) {
      const norm = normalizeError(e);
      setFormErrors(norm.fields || { _global: norm.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    try {
      await axiosInstance.delete(`/api/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      if (viewUser?.id === id) setViewUser(null);
    } catch (e) {
      setError(normalizeError(e).message);
    }
  };

  const filtered = users.filter((u) =>
    !search ||
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    (u.first_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.last_name  || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email      || '').toLowerCase().includes(search.toLowerCase())
  );

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const displayName = (u) => u?.first_name
    ? `${u.first_name} ${u.last_name || ''}`.trim()
    : u?.username || '—';

  return (
    <Wrap>
      <TopBar>
        <Title>User Management</Title>
        <Controls>
          <SearchBox>
            <SearchOutlined style={{ color: '#94A3B8' }} />
            <SearchInp
              placeholder="Search by name, username or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </SearchBox>
          <IconBtn onClick={fetchUsers} title="Refresh"><ReloadOutlined /></IconBtn>
          <AddBtn onClick={openCreate}><UserAddOutlined /> Add User</AddBtn>
        </Controls>
      </TopBar>

      {error && <ErrMsg>{error}</ErrMsg>}

      <PageLayout>
        {/* ── Table ── */}
        <TableWrap>
          <Card>
            {loading ? (
              <div style={{ padding: 60, display: 'flex', justifyContent: 'center' }}>
                <Spinner size="md" />
              </div>
            ) : (
              <Table>
                <Thead>
                  <Tr>
                    <Th>User</Th>
                    <Th>Username</Th>
                    <Th>Role</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filtered.length === 0 ? (
                    <Tr>
                      <Td colSpan={5}>
                        <EmptyState>No users found.</EmptyState>
                      </Td>
                    </Tr>
                  ) : filtered.map((u) => (
                    <Tr
                      key={u.id}
                      onClick={() => setViewUser(u)}
                      style={{
                        cursor: 'pointer',
                        background: viewUser?.id === u.id
                          ? 'rgba(37,99,235,0.05)'
                          : undefined,
                        borderLeft: viewUser?.id === u.id
                          ? '3px solid #2563EB'
                          : '3px solid transparent',
                      }}
                    >
                      <Td>
                        <UserCell>
                          <Avatar>
                            {(u.first_name || u.username || 'U')[0].toUpperCase()}
                          </Avatar>
                          <div>
                            <UserName>{displayName(u)}</UserName>
                            {u.email && <UserEmail>{u.email}</UserEmail>}
                          </div>
                        </UserCell>
                      </Td>
                      <Td style={{ fontFamily: 'monospace', fontSize: 12 }}>
                        {u.username}
                      </Td>
                      <Td>
                        <Badge variant={u.role_slug || 'default'}>
                          {u.role_name || u.role_slug}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge variant={STATUS_VARIANT[u.status] || 'default'}>
                          {u.status}
                        </Badge>
                      </Td>
                      <Td>
                        <ActionsCell onClick={(e) => e.stopPropagation()}>
                          <ActionBtn onClick={() => openEdit(u)}>
                            <EditOutlined /> Edit
                          </ActionBtn>
                          <ActionBtn $danger onClick={() => handleDelete(u.id)}>
                            <DeleteOutlined />
                          </ActionBtn>
                        </ActionsCell>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </Card>
        </TableWrap>

        {/* ── Detail Panel ── */}
        {viewUser && (
          <DetailPanel>
            <DetailHeader>
              <DetailCloseBtn onClick={() => setViewUser(null)}>
                <CloseOutlined />
              </DetailCloseBtn>
              <DetailAvatar>
                {(viewUser.first_name || viewUser.username || 'U')[0].toUpperCase()}
              </DetailAvatar>
              <DetailName>{displayName(viewUser)}</DetailName>
              <DetailUsername>@{viewUser.username}</DetailUsername>
              <Badge variant={viewUser.role_slug || 'default'}>
                {viewUser.role_name || viewUser.role_slug}
              </Badge>
            </DetailHeader>

            <DetailBody>
              <DetailSection>
                <DetailSectionTitle>Contact</DetailSectionTitle>
                <DetailRow>
                  <DetailRowIcon><MailOutlined /></DetailRowIcon>
                  <DetailRowContent>
                    <DetailRowLabel>Email</DetailRowLabel>
                    <DetailRowValue>{viewUser.email || '—'}</DetailRowValue>
                  </DetailRowContent>
                </DetailRow>
                <DetailRow>
                  <DetailRowIcon><PhoneOutlined /></DetailRowIcon>
                  <DetailRowContent>
                    <DetailRowLabel>Phone</DetailRowLabel>
                    {/* ── FIX 4: Now shows real phone value ── */}
                    <DetailRowValue>{viewUser.phone || '—'}</DetailRowValue>
                  </DetailRowContent>
                </DetailRow>
              </DetailSection>

              <Divider />

              <DetailSection>
                <DetailSectionTitle>Account</DetailSectionTitle>
                <DetailRow>
                  <DetailRowIcon><SafetyOutlined /></DetailRowIcon>
                  <DetailRowContent>
                    <DetailRowLabel>Status</DetailRowLabel>
                    <DetailRowValue>
                      <Badge variant={STATUS_VARIANT[viewUser.status] || 'default'}>
                        {viewUser.status}
                      </Badge>
                    </DetailRowValue>
                  </DetailRowContent>
                </DetailRow>
                <DetailRow>
                  <DetailRowIcon><ClockCircleOutlined /></DetailRowIcon>
                  <DetailRowContent>
                    <DetailRowLabel>Last Login</DetailRowLabel>
                    <DetailRowValue>{formatDate(viewUser.last_login)}</DetailRowValue>
                  </DetailRowContent>
                </DetailRow>
                <DetailRow>
                  <DetailRowIcon><CalendarOutlined /></DetailRowIcon>
                  <DetailRowContent>
                    <DetailRowLabel>Created</DetailRowLabel>
                    <DetailRowValue>{formatDate(viewUser.created_at)}</DetailRowValue>
                  </DetailRowContent>
                </DetailRow>
              </DetailSection>

              <Divider />

              <DetailEditBtn onClick={() => openEdit(viewUser)}>
                <EditOutlined /> Edit User
              </DetailEditBtn>
            </DetailBody>
          </DetailPanel>
        )}
      </PageLayout>

      {/* ── Create / Edit Modal ── */}
      {showModal && (
        <Overlay onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <Modal>
            <ModalHead>
              <ModalTitle>
                {editUser ? 'Edit User' : 'Create New User'}
              </ModalTitle>
              <CloseBtn onClick={() => setShowModal(false)}>×</CloseBtn>
            </ModalHead>

            {formErrors._global && (
              <ErrMsg style={{ marginBottom: 14 }}>{formErrors._global}</ErrMsg>
            )}

            {/* Row 1: First Name + Last Name */}
            <FieldGrid>
              <Field>
                <Label>First Name</Label>
                <Input
                  value={form.first_name}
                  onChange={f('first_name')}
                  placeholder="First name"
                />
              </Field>
              <Field>
                <Label>Last Name</Label>
                <Input
                  value={form.last_name}
                  onChange={f('last_name')}
                  placeholder="Last name"
                />
              </Field>
            </FieldGrid>

            <div style={{ height: 14 }} />

            {/* Row 2: Username + Phone ── FIX 5: Phone input added here */}
            <FieldGrid>
              <Field>
                <Label>Username *</Label>
                <Input
                  value={form.username}
                  onChange={f('username')}
                  placeholder="e.g. dr_kumar"
                  $error={!!formErrors.username}
                />
                {formErrors.username && <FieldErr>{formErrors.username}</FieldErr>}
              </Field>
              <Field>
                <Label>Phone</Label>
                <Input
                  value={form.phone}
                  onChange={f('phone')}
                  placeholder="+91 9876543210"
                  $error={!!formErrors.phone}
                />
                {formErrors.phone && <FieldErr>{formErrors.phone}</FieldErr>}
              </Field>
            </FieldGrid>

            <div style={{ height: 14 }} />

            {/* Email */}
            <Field>
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={f('email')}
                placeholder="email@hospital.com"
              />
            </Field>

            <div style={{ height: 14 }} />

            {/* Password */}
            <Field>
              <Label>
                {editUser ? 'New Password (leave blank to keep)' : 'Password *'}
              </Label>
              <PwdWrap>
                <PwdInput
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={f('password')}
                  placeholder={
                    editUser ? 'Leave blank to keep current' : 'Min 8 characters'
                  }
                  $error={!!formErrors.password}
                />
                <PwdEye
                  onClick={() => setShowPwd((s) => !s)}
                  type="button"
                >
                  {showPwd ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </PwdEye>
              </PwdWrap>
              {formErrors.password && <FieldErr>{formErrors.password}</FieldErr>}
            </Field>

            {/* Row 3: Role + Status */}
            <FieldGrid style={{ marginTop: 14 }}>
              <Field>
                <Label>Role *</Label>
                <Select
                  value={form.role_id}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, role_id: Number(e.target.value) }))
                  }
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </Select>
              </Field>
              <Field>
                <Label>Status</Label>
                <Select value={form.status} onChange={f('status')}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </Select>
              </Field>
            </FieldGrid>

            <BtnRow>
              <CancelBtn onClick={() => setShowModal(false)}>Cancel</CancelBtn>
              <SaveBtn onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editUser ? 'Update User' : 'Create User'}
              </SaveBtn>
            </BtnRow>
          </Modal>
        </Overlay>
      )}
    </Wrap>
  );
};

export default UsersListPage;