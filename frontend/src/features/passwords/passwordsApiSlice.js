import { apiSlice } from '../../app/api/apiSlice';

export const passwordsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPasswords: builder.query({
            query: () => '/passwords',
            // transformResponse: (res) => {
            //     return res.sort((a, b) => a.website.localeCompare(b.website));
            // },
            providesTags: ['Passwords']
        }),
        getPassword: builder.query({
            query: (id) => `/passwords/${id}`,
            providesTags: ['Passwords'],
        }),
        getUserPasswords: builder.query({
            query: (id) => `/users/${id}/passwords`,
            transformResponse: (res) => {
                return res.sort((a, b) => a.website.localeCompare(b.website));
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
    useGetPasswordsQuery,
    useGetPasswordQuery,
    useGetUserPasswordsQuery,
    useAddPasswordMutation,
    useUpdatePasswordMutation,
    useDeletePasswordMutation
} = passwordsApiSlice;
