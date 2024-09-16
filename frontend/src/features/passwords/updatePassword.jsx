import { useState, useEffect, useRef } from "react";
import {
  useGetPasswordQuery,
  useUpdatePasswordMutation,
} from "./passwordsApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'sonner';
import { encryptDataBase64, Uint8ArrayToBase64, decryptDataBase64, Base64ToUint8Array } from "../../utils/cryptoUtils";
import useAuth from "../../hooks/useAuth";

const UpdatePassword = ({ setEditPassword }) => {
    const { id } = useParams();
    const { encryptionKey, IV } = useAuth();


    const userRef = useRef();
    const navigate =  useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isDecrypting, setIsDecrypting] = useState(true);

    const [newPassword, setNewPassword] = useState({
        website: "",
        username: "",
        password: "",
        note: "",
    });

    useEffect(() => {
        if(userRef.current){
          userRef.current.focus();
        }
    }, [])

    const [updatePassword] = useUpdatePasswordMutation();

    const {
        data: password,
        isLoading,
        isSuccess,
        isError,
    } = useGetPasswordQuery(id, { skip: !id });

    useEffect(() => {
        if (password && encryptionKey && IV) {
            const decrypt = async () => {
                try {
                    setIsDecrypting(true);

                    const decryptedWebsite = await decryptDataBase64(password.website, encryptionKey, IV);
                    const decryptedUsername = await decryptDataBase64(password.username, encryptionKey, IV);
                    const decryptedPassword = await decryptDataBase64(password.password, encryptionKey, IV);
                    const decryptedNote = await decryptDataBase64(password.note, encryptionKey, IV);

                    const decodedWebsite = new TextDecoder().decode(Base64ToUint8Array(decryptedWebsite));
                    const decodedUsername = new TextDecoder().decode(Base64ToUint8Array(decryptedUsername));
                    const decodedPassword = new TextDecoder().decode(Base64ToUint8Array(decryptedPassword));
                    const decodedNote = new TextDecoder().decode(Base64ToUint8Array(decryptedNote));
                    setNewPassword(prev => ({
                        ...prev,
                        website: decodedWebsite,
                        username: decodedUsername,
                        password: decodedPassword,
                        note: decodedNote
                    }));
                } catch (error) {
                    console.error("Failed to decrypt password", error);
                    toast.error("Failed to decrypt password", { position: 'bottom-left' });
                } finally {
                    setIsDecrypting(false); 
                }
            };

            decrypt();
        }
    }, [password, encryptionKey, IV]);

    const handleUsernameChange = (e) => {
        setNewPassword(password => ({
            ...password,
            username: e.target.value
        }));
    };

    const handlePasswordChange = (e) => {
        setNewPassword(password => ({
            ...password,
            password: e.target.value
        }));
    };

    const handleNoteChange = (e) => {
        setNewPassword(password => ({
            ...password,
            note: e.target.value
        }));
    };

    
    const handleSavePassword = async (e) => {
        e.preventDefault();
        if(id){
            const usernameBase64 = Uint8ArrayToBase64(new TextEncoder().encode(newPassword.username));
            const passwordBase64 = Uint8ArrayToBase64(new TextEncoder().encode(newPassword.password));
            const noteBase64 = Uint8ArrayToBase64(new TextEncoder().encode(newPassword.note));

            const encryptedUsername = await encryptDataBase64(usernameBase64, encryptionKey, IV)
            const encryptedPassword = await encryptDataBase64(passwordBase64, encryptionKey, IV)
            const encryptedNote = await encryptDataBase64(noteBase64, encryptionKey, IV)
            
            updatePassword({
                id: password._id,
                username: encryptedUsername,
                password: encryptedPassword,
                note: encryptedNote
            }).unwrap()
            .then(() => {
                toast.success("Password updated successfully", {position: 'bottom-left'});
                setEditPassword(false)

            })
            .catch((error) => {
                toast.error("Failed to update password:");
                navigate('/passwords');
            });
        } 
    };

    let content;
    if (isLoading || isDecrypting) {
        content = (
        <div className="text-center py-5 text-sm text-zinc-300">Securely loading your passwords...</div>
        )

    } else if (isSuccess) {
        content = (
            <div className="">
                <div className="">
                    <form className="" onSubmit={(e) => handleSavePassword(e)}>
                    <div className="mb-3 text-md">
                        {"Update Password"}
                    </div>
                    <label htmlFor="new-website" className="text-xs font-semibold">Website</label>
                    <div className="mb-2">
                        <a 
                            href={`https://www.${newPassword.website}`} 
                            className="w-full hover:underline text-sm text-white"
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            {newPassword.website}
                        </a>
                    </div>
                    <label htmlFor="new-username"  className="text-xs font-semibold">Username</label>
                    <div className="mb-2">
                        <input
                            type="text"
                            id="new-username"
                            ref={userRef}
                            value={newPassword.username}
                            onChange={(e) => handleUsernameChange(e)}
                            placeholder="username"
                            className="mt-1.5 bg-neutral-700 block w-full rounded-md border-0 py-1.5 text-neutral-50 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                    <label htmlFor="new-password" className="text-xs font-semibold">Password</label>
                    <div className="relative mb-2">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="new-password"
                            value={newPassword.password}
                            onChange={(e) => handlePasswordChange(e)}
                            placeholder="password"
                            className="mt-1.5 bg-neutral-700 block w-full rounded-md border-0 py-1.5 text-neutral-50 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                        />
                        <img
                            onClick={() => setShowPassword(!showPassword)}
                            src={showPassword ? "/visible.svg" : "/invisible.svg"}
                            alt={showPassword ? "showPassword" : "notShowPassword"}
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer w-5"
                        ></img>
                    </div>
                    <label htmlFor="new-note" className="text-xs font-semibold">Note</label>
                    <div className="mb-2">
                    <textarea
                        type="text"
                        id="new-note"
                        value={newPassword.note}
                        onChange={(e) => handleNoteChange(e)}
                        // placeholder="note"              
                        className="h-20 resize-none mt-1.5 bg-neutral-700 block w-full rounded-md border-0 py-1.5 text-neutral-50 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                    <div className="flex justify-end mt-10">
                        <button 
                            type="button"
                            className="text-white font-semibold text-sm border-2 border-violet-500 px-4 py-1 rounded-full" 
                            onClick={() => setEditPassword(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="submit text-white font-semibold text-sm border-2 bg-violet-800 border-violet-800 ml-3 px-4 py-1 rounded-full"
                            type="submit"
                            disabled={!(newPassword.website && newPassword.password)}
                        >
                            Save
                        </button>
                    </div>
                    </form>
                </div>
                </div>
        );
    } else if (isError) {
        toast.error("Failed to fetch password data", {position: 'bottom-left'});
        navigate("/passwords");
    }

    return (
        <div>
            {content}
        </div>
    )
}

export default UpdatePassword;
