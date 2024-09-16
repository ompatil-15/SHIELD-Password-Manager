import store from '../../app/store'
import { notesApiSlice } from '../notes/notesApiSlice'
import { personalInfoApiSlice } from '../personalInfo/personalInfoApiSlice';
import { passwordsApiSlice } from '../passwords/passwordsApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentId } from './authSlice';

// Prefetch can be usefull to reduce response time by pre-fetching data 

const Prefetch = () => {
    const id = useSelector(selectCurrentId);
    useEffect(() => {
        store.dispatch(
            passwordsApiSlice.util.prefetch('getUserPasswords', id, { force: false })
        );
        store.dispatch(
            notesApiSlice.util.prefetch('getUserNotes', id, { force: false })
        );
        store.dispatch(
            personalInfoApiSlice.util.prefetch('getPersonalInformation', id, { force: false })
        );
    }, [id])

    return <Outlet />
}
export default Prefetch