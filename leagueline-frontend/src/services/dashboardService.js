import api from './api.js';

export const getOrganizerDashboard = () => api.get('/organizer/dashboard').then((r) => r.data);
export const getManagerDashboard = () => api.get('/manager/dashboard').then((r) => r.data);
export const getFanDashboard = () => api.get('/fan/dashboard').then((r) => r.data);