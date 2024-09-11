import { apiSlice } from '../../app/api/apiSlice';

export const personalInfoApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPersonalInformation: builder.query({
            query: (id) => `/users/${id}`,
            providesTags: ['PersonalInformation'],
        }),
        updatePersonalInformation: builder.mutation({
            query: (user) => ({
                url: `/users/66dedb26eb36d09989bf22fc`,
                method: 'PATCH',
                body: user,
            }),
            invalidatesTags: ['PersonalInformation'],
        }),
    }),
});

export const {
    useGetPersonalInformationQuery,
    useUpdatePersonalInformationMutation,
} = personalInfoApiSlice;
