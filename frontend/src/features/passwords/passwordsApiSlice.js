import { apiSlice } from '../../app/api/apiSlice';

export const passwordsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPassword: builder.query({
            query: (id) => `/passwords/${id}`,
            providesTags: ['Passwords'],
        }),
        getUserPasswords: builder.query({
            query: (id) => `/users/${id}/passwords`,
            transformResponse: (response) => {
                return response.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            },
            providesTags: ['Passwords']
        }),
        addPassword: builder.mutation({
            query: (password) => ({
                url: '/passwords',
                method: 'POST',
                body: password,
            }),
            invalidatesTags: ['Passwords'],
        }),
        updatePassword: builder.mutation({
            query: (password) => ({
                url: `/passwords/${password.id}`,
                method: 'PATCH',
                body: password,
            }),
            invalidatesTags: ['Passwords'],
        }),
        deletePassword: builder.mutation({
            query: ({ id }) => ({
                url: `/passwords/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Passwords'],
        }),
    }),
});

export const {
    useGetPasswordQuery,
    useGetUserPasswordsQuery,
    useAddPasswordMutation,
    useUpdatePasswordMutation,
    useDeletePasswordMutation
} = passwordsApiSlice;
