import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { apiSlice } from '../api/apiSlice';

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPasswords: builder.query({
            query: () => '/passwords',
            transformResponse: (res) => {
                return res.sort((a, b) => a.website.localeCompare(b.website));
            },
            providesTags: ['Passwords']
        }),
        getPassword: builder.query({
            query: (id) => ({
                url: `/passwords/${id}`,
            }),
            providesTags: ['Passwords'],
        }),
        addPassword: builder.mutation({
            query: (password) => ({
                url: '/passwords',
                method: 'POST',
                body: password
            }),
            invalidatesTags: ['Passwords']
        }),
        updatePassword: builder.mutation({
            query: (password) => ({
                url: `/passwords/${password.id}`,
                method: 'PATCH',
                body: password
            }),
            invalidatesTags: ['Passwords']
        }),
        deletePassword: builder.mutation({
            query: ({ id }) => ({
                url: `/passwords/${id}`,
                method: 'DELETE',
                body: id
            }),
            invalidatesTags: ['Passwords']
        }),
    })
})

export const {
    useGetPasswordsQuery, 
    useGetPasswordQuery,
    useAddPasswordMutation,
    useUpdatePasswordMutation,
    useDeletePasswordMutation
} = extendedApiSlice    