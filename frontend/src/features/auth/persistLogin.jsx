/* eslint-disable no-unused-vars */
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useRef } from 'react';
import { useSendLogoutMutation } from "./authApiSlice";
import { useSelector } from 'react-redux';
import { selectCurrentToken } from "./authSlice";
import { toast } from "sonner";

const PersistLogin = () => {
    const navigate = useNavigate();
    const token = useSelector(selectCurrentToken);
    const effectRan = useRef(false);  

    const [sendLogout] = useSendLogoutMutation();

    useEffect(() => {
        if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
            const logout = async () => {
                try {
                    await sendLogout();
                    toast.error('Session expired: Please login again', { position: 'bottom-left' });
                    navigate('/auth');
                } catch (err) {
                    toast.error('Error during logout. Please try again.', { position: 'bottom-left' });
                }
            };

            if (!token) { 
                logout();
            }
        }

        return () => {
            effectRan.current = true;  
        };

        // eslint-disable-next-line
    }, [token, sendLogout, navigate]);

    return <Outlet />;
};

export default PersistLogin;
