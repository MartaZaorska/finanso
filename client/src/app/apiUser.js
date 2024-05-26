import api from './api';

const USER_BASE_URL = 'http://localhost:5000/api/user';

const apiUser = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USER_BASE_URL}/login`,
        method: "POST",
        body: data,
        credentials: 'include'
      })
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USER_BASE_URL}/register`,
        method: 'POST',
        body: data,
        credentials: 'include'
      })
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USER_BASE_URL}/logout`,
        method: 'POST',
        credentials: 'include'
      })
    }),
    getProfile: builder.query({
      query: () => ({
        url: `${USER_BASE_URL}`,
        credentials: 'include'
      })
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USER_BASE_URL}`,
        method: "PUT",
        body: data,
        credentials: 'include'
      })
    }),
    deleteProfile: builder.mutation({
      query: () => ({
        url: `${USER_BASE_URL}`,
        method: 'DELETE',
        credentials: 'include'
      })
    })
  })
});


export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
  useGetProfileQuery
} = apiUser;

export default apiUser;
