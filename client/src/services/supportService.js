import api from './api';

export const getSupportRequests = async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/admin/support?${params}`);
    return response.data;
};

export const getSupportRequestById = async (id) => {
    const response = await api.get(`/admin/support/${id}`);
    return response.data;
};

export const replyToSupportRequest = async (id, message) => {
    const response = await api.post(`/admin/support/${id}/reply`, { message });
    return response.data;
};

export const updateSupportStatus = async (id, data) => {
    const response = await api.put(`/admin/support/${id}/status`, data);
    return response.data;
};
