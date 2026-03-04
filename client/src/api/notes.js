import api from './axios';

export const fetchNotes = (params) => api.get('/notes', { params });
export const createNote = (data) => api.post('/notes', data);
export const deleteNote = (id) => api.delete(`/notes/${id}`);