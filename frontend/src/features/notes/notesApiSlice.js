import { apiSlice } from '../../app/api/apiSlice';

export const notesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getNotes: builder.query({
            query: () => '/notes',
            providesTags: ['Notes'],
        }),
        getNote: builder.query({
            query: (id) => `/notes/${id}`,
            providesTags: ['Notes'],
        }),
        getUserNotes: builder.query({
            query: (id) => `/users/${id}/notes`,
            transformResponse: (response) => {
                return response.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            },
            providesTags: ['Notes']
        }),
        addNote: builder.mutation({
            query: (note) => ({
                url: '/notes',
                method: 'POST',
                body: note,
            }),
            invalidatesTags: ['Notes'],
        }),
        updateNote: builder.mutation({
            query: (note) => ({
                url: `/notes/${note.id}`,
                method: 'PATCH',
                body: note,
            }),
            invalidatesTags: ['Notes'],
        }),
        deleteNote: builder.mutation({
            query: ({ id }) => ({
                url: `/notes/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Notes'],
        }),
    }),
});

export const {
    useGetNotesQuery,
    useGetNoteQuery,
    useGetUserNotesQuery,
    useAddNoteMutation,
    useUpdateNoteMutation,
    useDeleteNoteMutation
} = notesApiSlice;
