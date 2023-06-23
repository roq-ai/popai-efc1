import axios from 'axios';
import queryString from 'query-string';
import { OkrInterface, OkrGetQueryInterface } from 'interfaces/okr';
import { GetQueryInterface } from '../../interfaces';

export const getOkrs = async (query?: OkrGetQueryInterface) => {
  const response = await axios.get(`/api/okrs${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createOkr = async (okr: OkrInterface) => {
  const response = await axios.post('/api/okrs', okr);
  return response.data;
};

export const updateOkrById = async (id: string, okr: OkrInterface) => {
  const response = await axios.put(`/api/okrs/${id}`, okr);
  return response.data;
};

export const getOkrById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/okrs/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteOkrById = async (id: string) => {
  const response = await axios.delete(`/api/okrs/${id}`);
  return response.data;
};
