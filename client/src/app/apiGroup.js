import api from './api';

const GROUP_BASE_URL = 'http://localhost:5000/api/group';

const apiGroup = api.injectEndpoints({
  endpoints: (builder) => ({
    getGroup: builder.query({
      query: (groupId) => ({
        url: `${GROUP_BASE_URL}/${groupId}`,
        credentials: 'include'
      })
    }),
    createGroup: builder.mutation({
      query: (data) => ({
        url: `${GROUP_BASE_URL}`,
        method: "POST",
        body: data,
        credentials: 'include'
      })
    }),
    updateGroup: builder.mutation({
      query: ({groupId, name, currency}) => ({
        url: `${GROUP_BASE_URL}/${groupId}`,
        method: 'PUT',
        body: { name, currency },
        credentials: 'include'
      })
    }),
    deleteGroup: builder.mutation({
      query: (groupId) => ({
        url: `${GROUP_BASE_URL}/${groupId}`,
        method: "DELETE",
        credentials: 'include'
      })
    }),
    addUser: builder.mutation({
      query: ({ groupId, email }) => ({
        url: `${GROUP_BASE_URL}/${groupId}/user`,
        method: 'POST',
        body: { email },
        credentials: 'include'
      })
    }),
    changeUserRole: builder.mutation({
      query: ({ groupId, userId, role }) => ({
        url: `${GROUP_BASE_URL}/${groupId}/user`,
        method: 'PUT',
        body: { id: userId, role },
        credentials: 'include'
      })
    }),
    removeUser: builder.mutation({
      query: ({ groupId, userId }) => ({
        url: `${GROUP_BASE_URL}/${groupId}/user`,
        method: 'DELETE',
        body: { id: userId },
        credentials: 'include'
      })
    }),
    addElement: builder.mutation({
      query: ({ groupId, type, data }) => ({
        url: `${GROUP_BASE_URL}/${groupId}/${type}`,
        method: 'POST',
        body: data,
        credentials: 'include'
      })
    }),
    updateElement: builder.mutation({
      query: ({ groupId, type, data }) => ({
        url: `${GROUP_BASE_URL}/${groupId}/${type}`,
        method: "PUT",
        body: data,
        credentials: 'include'
      })
    }),
    deleteElement: builder.mutation({
      query: ({ groupId, id, type }) => ({
        url: `${GROUP_BASE_URL}/${groupId}/${type}`,
        method: 'DELETE',
        body: { id },
        credentials: 'include'
      })
    })
  })
});

export const {
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
  useGetGroupQuery,
  useAddUserMutation,
  useChangeUserRoleMutation,
  useRemoveUserMutation,
  useAddElementMutation,
  useUpdateElementMutation,
  useDeleteElementMutation
} = apiGroup;

export default apiGroup;
