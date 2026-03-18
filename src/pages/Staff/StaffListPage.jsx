import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { fetchRolesApi, fetchUsersApi } from '../../api/staff.api';
import { normalizeError } from '../../utils/errorNormalizer';
import Badge   from '../../components/ui/Badge/Badge';
import Spinner from '../../components/ui/Spinner/Spinner';
import {
  UserAddOutlined, EditOutlined, DeleteOutlined,
  SearchOutlined, ReloadOutlined, MedicineBoxOutlined,
} from '@ant-design/icons';
import {
  Wrap, TopBar, Title, Controls,
  SearchBox, SearchInp, IconBtn, AddBtn,
  Card, Table, Thead, Tbody, Tr, Th, Td,
  StaffCell, Avatar, SName, SDept,
  ActCell, ABtn, EmptyState, ErrMsg,
  Overlay, Modal, MHead, MTitle, CloseBtn,
  FGrid, Field, Label, Input, Select,
  BtnRow, CancelBtn, SaveBtn,
} from './StaffListPage.styled';
const STATUS_VARIANT = { active:'success', inactive:'warning' };
const EMPTY_FORM = { user_id:'', role_id:'', department:'', specialization:'', license_number:'', status:'active' };

const StaffListPage = () => {
  const [staff,      setStaff]      = useState([]);
  const [users,      setUsers]      = useState([]);
  const [roles,      setRoles]      = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [search,     setSearch]     = useState('');
  const [showModal,  setShowModal]  = useState(false);
  const [editItem,   setEditItem]   = useState(null);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [saving,     setSaving]     = useState(false);
  const [formErr,    setFormErr]    = useState('');

  const fetchStaff = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await axiosInstance.get('/api/staff');
      setStaff(res.data?.data || []);
    } catch(e) { setError(normalizeError(e).message); }
    finally { setLoading(false); }
  }, []);

  // const fetchMeta = useCallback(async () => {
  //   try {
  //     const [rolesRes, usersRes] = await Promise.all([
  //       fetchRolesApi(),
  //       fetchUsersApi(),
  //     ]);
  //     setRoles(rolesRes.data?.data || []);
  //     setUsers(usersRes.data?.data || []);
  //   } catch {}
  // }, []);
  const fetchMeta = useCallback(async () => {
  try {
    // Small delay to let the main staff request complete first
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const [rolesRes, usersRes] = await Promise.all([
      fetchRolesApi(),
      fetchUsersApi(),
    ]);
    setRoles(rolesRes.data?.data || []);
    setUsers(usersRes.data?.data || []);
  } catch {}
}, []);

  useEffect(() => { fetchStaff(); fetchMeta(); }, [fetchStaff, fetchMeta]);

  const openCreate = () => { setEditItem(null); setForm(EMPTY_FORM); setFormErr(''); setShowModal(true); };
  const openEdit   = (s) => {
    setEditItem(s);
    setForm({ user_id:s.user_id, role_id:s.role_id, department:s.department||'', specialization:s.specialization||'', license_number:s.license_number||'', status:s.status });
    setFormErr(''); setShowModal(true);
  };

  const handleSave = async () => {
    // if (!form.user_id || !form.role_id) { setFormErr('User and Role are required.'); return; }
    if (!form.user_id) { 
  setFormErr('Please select a user.'); 
  return; 
}
// role_id is auto-set, but verify it was set
if (!form.role_id && form.role_id !== 0) { 
  setFormErr('Could not determine role. Please re-select the user.'); 
  return; 
}
    setSaving(true); setFormErr('');
    try {
      if (editItem) { await axiosInstance.put(`/api/staff/${editItem.id}`, form); }
      else          { await axiosInstance.post('/api/staff', form); }
      setShowModal(false); fetchStaff();
    } catch(e) { setFormErr(normalizeError(e).message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this staff member?')) return;
    try {
      await axiosInstance.delete(`/api/staff/${id}`);
      setStaff((prev) => prev.filter((s) => s.id !== id));
    } catch(e) { setError(normalizeError(e).message); }
  };

const filtered = staff.filter((s) => {
  if (!search) return true;
  const q    = search.toLowerCase();
  const name = getStaffName(s).toLowerCase();
  const dept = (s.department || '').toLowerCase();
  const user = (s.username || '').toLowerCase();
  return name.includes(q) || dept.includes(q) || user.includes(q);
});

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  // const getStaffName = (s) => {
  //   if (s.user?.first_name) return `${s.user.first_name} ${s.user.last_name||''}`.trim();
  //   if (s.first_name)       return `${s.first_name} ${s.last_name||''}`.trim();
  //   return `User #${s.user_id}`;
  // };
const getStaffName = (s) => {
  // first_name comes decrypted if StaffService decrypts it
  // otherwise fall back to username which is never encrypted
  if (s.first_name && s.first_name.length < 100) {
    return `${s.first_name} ${s.last_name || ''}`.trim();
  }
  if (s.username) return s.username;
  return `Staff #${s.id}`;
};
  return (
    <Wrap>
      <TopBar>
        <Title>Staff Management</Title>
        <Controls>
          <SearchBox>
            <SearchOutlined style={{color:'#94A3B8'}}/>
            <SearchInp placeholder="Search staff..." value={search} onChange={(e)=>setSearch(e.target.value)}/>
          </SearchBox>
          <IconBtn onClick={fetchStaff} title="Refresh"><ReloadOutlined/></IconBtn>
          <AddBtn onClick={openCreate}><UserAddOutlined/> Add Staff</AddBtn>
        </Controls>
      </TopBar>

      {error && <ErrMsg>{error}</ErrMsg>}

      <Card>
        {loading ? (
          <div style={{padding:60,display:'flex',justifyContent:'center'}}><Spinner size="md"/></div>
        ) : (
          <Table>
            <Thead>
              <Tr><Th>Staff Member</Th><Th>Role</Th><Th>Department</Th><Th>Specialization</Th><Th>License</Th><Th>Status</Th><Th>Actions</Th></Tr>
            </Thead>
            <Tbody>
              {filtered.length === 0 ? (
                <Tr><Td colSpan={7}><EmptyState><MedicineBoxOutlined style={{fontSize:36,display:'block',margin:'0 auto 8px'}}/> No staff members found.</EmptyState></Td></Tr>
              ) : filtered.map((s, idx) => (
                <Tr key={s.id}>
                  {/* <Td style={{color:'#94A3B8'}}>{idx+1}</Td> */}
                  <Td>
                    <StaffCell>
                      <Avatar>{getStaffName(s)[0]?.toUpperCase()||'S'}</Avatar>
                      <div>
                        <SName>{getStaffName(s)}</SName>
                        {(s.user?.username||s.username) && <SDept>@{s.user?.username||s.username}</SDept>}
                      </div>
                    </StaffCell>
                  </Td>
                  <Td><Badge variant="primary">{s.role?.name||s.role_name||`Role #${s.role_id}`}</Badge></Td>
                  <Td>{s.department||'—'}</Td>
                  <Td>{s.specialization||'—'}</Td>
                  <Td style={{fontFamily:'monospace',fontSize:12}}>{s.license_number||'—'}</Td>
                  <Td><Badge variant={STATUS_VARIANT[s.status]||'default'}>{s.status}</Badge></Td>
                  <Td>
                    <ActCell>
                      <ABtn onClick={()=>openEdit(s)}><EditOutlined/> Edit</ABtn>
                      <ABtn danger="true" onClick={()=>handleDelete(s.id)}><DeleteOutlined/></ABtn>
                    </ActCell>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Card>

      {showModal && (
        <Overlay onClick={(e)=>e.target===e.currentTarget&&setShowModal(false)}>
          <Modal>
            <MHead>
              <MTitle>{editItem ? 'Edit Staff' : 'Add Staff Member'}</MTitle>
              <CloseBtn onClick={()=>setShowModal(false)}>×</CloseBtn>
            </MHead>
            {formErr && <ErrMsg style={{marginBottom:14}}>{formErr}</ErrMsg>}
            <FGrid>
              <Field>
  <Label>User *</Label>
  <Select
    value={form.user_id}
    onChange={(e) => {
      const selectedUser = users.find(u => u.id === Number(e.target.value));
      setForm(p => ({
        ...p,
        user_id: e.target.value,
        role_id: selectedUser?.role_id || p.role_id,
      }));
    }}
  >
    <option value="">Select user</option>
    {/* {users.filter(u => u.role_slug !== 'patient' && u.role_slug !== 'admin').map(u => (
      <option key={u.id} value={u.id}>
        {u.first_name && u.first_name.length < 100
          ? `${u.first_name} ${u.last_name || ''} (${u.username})`
          : u.username}
      </option> */}
    {/* ))} */}
    {users.filter(u => u.role_slug !== 'patient' && u.role_slug !== 'admin').map(u => {
  const displayName = u.first_name && u.first_name.length < 80
    ? `${u.first_name} ${u.last_name || ''}`.trim()
    : u.username;
  return (
    <option key={u.id} value={u.id}>
      {displayName} ({u.username})
    </option>
  );
})}
  </Select>
</Field>

<Field>
  <Label>Role</Label>
  <Select value={form.role_id} disabled style={{ opacity: 0.65, cursor: 'not-allowed' }}>
    <option value="">Auto-set from user</option>
    {roles.map(r => (
      <option key={r.id} value={r.id}>{r.name}</option>
    ))}
  </Select>
  <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 3 }}>
    Role is automatically set from the selected user
  </p>
</Field>
              <Field>
                <Label>Department</Label>
                <Input value={form.department} onChange={f('department')} placeholder="e.g. Cardiology"/>
              </Field>
              <Field>
                <Label>Specialization</Label>
                <Input value={form.specialization} onChange={f('specialization')} placeholder="e.g. Cardiologist"/>
              </Field>
              <Field>
                <Label>License Number</Label>
                <Input value={form.license_number} onChange={f('license_number')} placeholder="Medical license #"/>
              </Field>
              <Field>
                <Label>Status</Label>
                <Select value={form.status} onChange={f('status')}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>
              </Field>
            </FGrid>
            <BtnRow>
              <CancelBtn onClick={()=>setShowModal(false)}>Cancel</CancelBtn>
              <SaveBtn onClick={handleSave} disabled={saving}>{saving?'Saving...':editItem?'Update':'Add Staff'}</SaveBtn>
            </BtnRow>
          </Modal>
        </Overlay>
      )}
    </Wrap>
  );
};

export default StaffListPage;
