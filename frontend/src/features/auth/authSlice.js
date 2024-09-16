import { createSlice } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode'
import { Base64ToUint8Array, Uint8ArrayToBase64 } from '../../utils/cryptoUtils'

const authSlice = createSlice({
    name: 'auth',
    initialState: { 
        id: null,
        email: null,
        token: null,
        encryptionKey: null, 
        IV: null, 
        passwords: []
    },
    reducers: {
        setCredentials: (state, action) => {
            const { accessToken, encryptionKey } = action.payload
            state.token = accessToken

            if (state.token) {
                const decoded = jwtDecode(state.token)
                const { id, email, encryptedPackage } = decoded.UserInfo
                const encryptedPackageBytes = Base64ToUint8Array(encryptedPackage);
                const IVBytes = encryptedPackageBytes.slice(16, 16 + 12);
                state.id = id
                state.email = email
                state.encryptionKey = encryptionKey
                state.IV = Uint8ArrayToBase64(IVBytes)
            }
        },
        logOut: (state, action) => {
            state.token = null
            state.encryptionKey = null
            state.IV =  null
            state.id = null
            state.email = null
        }
    }
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentId = (state) => state.auth.id;
export const selectCurrentEmail = (state) => state.auth.email;
export const selectCurrentEncryptionKey = (state) => state.auth.encryptionKey;
export const selectCurrentIV = (state) => state.auth.IV;
  