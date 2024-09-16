import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:5000',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token

        if (token) {
            headers.set("Authorization", `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    // console.log(args) // request url, method, body
    // console.log(api) // signal, dispatch, getState()
    // console.log(extraOptions) //custom like {shout: true}
    
    let result = await baseQuery(args, api, extraOptions)

    // If you want, handle other status codes, too
    if (result?.error?.status === 403) {
        // // console.log('sending refresh token')

        // // send refresh token to get new access token 
        // const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

        // if (refreshResult?.data) {

        //     // store the new token 
        //     api.dispatch(setCredentials({ ...refreshResult.data }))

        //     // retry original query with new access token
        //     result = await baseQuery(args, api, extraOptions)
        // } else {

        //     if (refreshResult?.error?.status === 403) {
        //         refreshResult.error.data.message = "Your login has expired. "
        //     }
        //     return refreshResult
        // }
        api.dispatch(apiSlice.endpoints.sendLogout.initiate());
    }

    return result
}

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Passwords', 'Notes', 'PersonalInformation'], // Shared tags for invalidation
    endpoints: builder => ({})
});