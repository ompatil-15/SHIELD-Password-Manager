import { useSelector } from 'react-redux'
import { selectCurrentEmail, selectCurrentEncryptionKey, selectCurrentId, selectCurrentIV, selectCurrentToken } from "../features/auth/authSlice"

const useAuth = () => {
    const id = useSelector(selectCurrentId);
    const email = useSelector(selectCurrentEmail);
    const encryptionKey = useSelector(selectCurrentEncryptionKey);
    const IV = useSelector(selectCurrentIV);
    const token = useSelector(selectCurrentToken);

    return {id, email, encryptionKey, IV, token};
}
export default useAuth;