import api from './api';

export const getMenuItems = async (params) => {
  const response = await api.get('/menu', { params });
  return response.data;
};

export const getMenuItem = async (id) => {
  const response = await api.get(`/menu/${id}`);
  return response.data;
};

export const createMenuItem = async (data) => {
  const response = await api.post('/menu', data);
  return response.data;
};

export const updateMenuItem = async (id, data) => {
  const response = await api.put(`/menu/${id}`, data);
  return response.data;
};

export const deleteMenuItem = async (id) => {
  const response = await api.delete(`/menu/${id}`);
  return response.data;
};
