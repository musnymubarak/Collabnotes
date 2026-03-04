import api from './axios';

export const fetchNotes = (params) => api.get('/api/notes', { params });
export const createNote = (data) => api.post('/api/notes', data);
export const deleteNote = (id) => api.delete(`/api/notes/${id}`);