import api from './api';

export const taskService = {
  getTasks: async (params = {}) => {
    const { status, assignedTo, lead, dueDate } = params;
    const query = new URLSearchParams();

    if (status && status !== 'All') query.append('status', status);
    if (assignedTo && assignedTo !== 'All') query.append('assignedTo', assignedTo);
    if (lead && lead !== 'All') query.append('lead', lead);
    if (dueDate) query.append('dueDate', dueDate);

    const queryString = query.toString();
    const url = `/tasks${queryString ? `?${queryString}` : ''}`;

    const response = await api.get(url);
    return response.data;
  },

  getTaskById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  updateTaskStatus: async (id, status) => {
    const response = await api.patch(`/tasks/${id}/status`, { status });
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};

export default taskService;
