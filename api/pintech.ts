import axios from 'axios';

const isServer = typeof window === 'undefined';

const protocol = isServer ? (process.env.NODE_ENV === 'production' ? 'https://' : 'http://') : '';

const host = isServer
  ? process.env.VERCEL_URL
    ? `${protocol}${process.env.VERCEL_URL}`
    : `${protocol}localhost:3000`
  : '';

const apiPrefix = '/api';

const baseURL = `${host}${apiPrefix}`;

console.log('baseURL:', baseURL);

const api = axios.create({
  baseURL: baseURL,
});

export const getTools = async () => {
  const response = await api.get('/tools');
  return response.data;
}
