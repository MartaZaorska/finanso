import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: '',
  prepareHeaders(headers){ return headers; }
});

const api = createApi({
  baseQuery,
  endpoints: (builder) => ({})
});

export default api;