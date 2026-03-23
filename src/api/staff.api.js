import axiosInstance from './axiosInstance';

export const fetchStaffApi       = (p)     => axiosInstance.get('/api/staff', { params: p });
export const fetchStaffMemberApi = (id)    => axiosInstance.get(`/api/staff/${id}`);
export const createStaffApi      = (d)     => axiosInstance.post('/api/staff', d);
export const updateStaffApi      = (id, d) => axiosInstance.put(`/api/staff/${id}`, d);
export const deleteStaffApi      = (id)    => axiosInstance.delete(`/api/staff/${id}`);
export const fetchRolesApi       = ()      => axiosInstance.get('/api/tenants/roles');
export const fetchUsersApi       = (p)     => axiosInstance.get('/api/users', { params: p });
