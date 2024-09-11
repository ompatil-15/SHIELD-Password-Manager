import store from '../../app/store'
import { notesApiSlice } from '../notes/notesApiSlice'
import { personalInfoApiSlice } from '../personalInfo/personalInfoApiSlice';
import { passwordsApiSlice } from '../passwords/passwordsApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {
    useEffect(() => {
        // console.log('subscribing')
        const passwords = store.dispatch(passwordsApiSlice.endpoints.getPasswords.initiate())
        const notes = store.dispatch(notesApiSlice.endpoints.getNotes.initiate())
        const personalInfo = store.dispatch(personalInfoApiSlice.endpoints.getPersonalInformation.initiate())

        return () => {
            // console.log('unsubscribing')
            passwords.unsubscribe()
            notes.unsubscribe()
            personalInfo.unsubscribe()
        }
    }, [])

    return <Outlet />
}
export default Prefetch