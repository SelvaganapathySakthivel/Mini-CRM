import api from './api';

export const leadService = {
  getLeads: async (params = {}) => {
    const { page, limit, search, status } = params;
    const query = new URLSearchParams();

    if (page) query.append('page', page);
    if (limit) query.append('limit', limit);
    if (search && search.trim() !== '') query.append('search', search.trim());
    if (status && status !== 'All') query.append('status', status);

    const queryString = query.toString();
    const url = `/leads${queryString ? `?${queryString}` : ''}`;

    const response = await api.get(url);
    return response.data;
  },

  getLeadById: async (id) => {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  },

  createLead: async (leadData) => {
    const response = await api.post('/leads', leadData);
    return response.data;
  },

  updateLead: async (id, leadData) => {
    const response = await api.put(`/leads/${id}`, leadData);
    return response.data;
  },

  updateLeadStatus: async (id, status) => {
    const response = await api.patch(`/leads/${id}/status`, { status });
    return response.data;
  },

  deleteLead: async (id) => {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
  },
};

export default leadService;
