import api from './api';

export const getTickets = async () => {
    const response = await api.get('/admin/tickets');
    return response.data;
};

export const createTicket = async (ticketData) => {
    const response = await api.post('/admin/tickets', ticketData);
    return response.data;
};

export const updateTicket = async (id, ticketData) => {
    const response = await api.put(`/admin/tickets/${id}`, ticketData);
    return response.data;
};

export const deleteTicket = async (id) => {
    const response = await api.delete(`/admin/tickets/${id}`);
    return response.data;
};

export const addTicketComment = async (id, text) => {
    const response = await api.post(`/admin/tickets/${id}/comments`, { text });
    return response.data;
};
