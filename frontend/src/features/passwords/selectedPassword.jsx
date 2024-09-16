import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetPasswordQuery, useDeletePasswordMutation } from "./passwordsApiSlice";
import UpdatePassword from "./updatePassword";
import { toast } from 'sonner';
import { Base64ToUint8Array, decryptDataBase64 } from "../../utils/cryptoUtils";
import useAuth from "../../hooks/useAuth";

const SelectedPassword = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { encryptionKey, IV } = useAuth();

    const [editPassword, setEditPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [decryptedUsername, setDecryptedUsername] = useState("");
    const [decryptedPassword, setDecryptedPassword] = useState("");
    const [decryptedWebsite, setDecryptedWebsite] = useState("");
    const [decryptedNote, setDecryptedNote] = useState("");

    const [isDecrypting, setIsDecrypting] = useState(true);

    const {
        data: password,
        isLoading,
        isError
    } = useGetPasswordQuery(id, { skip: !id });

    const [deletePassword] = useDeletePasswordMutation();

    useEffect(() => {
        if (password && encryptionKey && IV) {
            const decryptFields = async () => {
                try {
                    setIsDecrypting(true); 

                    const decryptedUsername = await decryptDataBase64(password.username, encryptionKey, IV);
                    const decryptedPassword = await decryptDataBase64(password.password, encryptionKey, IV);
                    const decryptedWebsite = await decryptDataBase64(password.website, encryptionKey, IV);
                    const decryptedNote = password.note ? await decryptDataBase64(password.note, encryptionKey, IV) : "";

                    setDecryptedUsername(new TextDecoder().decode(Base64ToUint8Array(decryptedUsername)));
                    setDecryptedPassword(new TextDecoder().decode(Base64ToUint8Array(decryptedPassword)));
                    setDecryptedWebsite(new TextDecoder().decode(Base64ToUint8Array(decryptedWebsite)));
                    setDecryptedNote(password.note ? new TextDecoder().decode(Base64ToUint8Array(decryptedNote)) : "");

                } catch (error) {
                    console.error("Failed to decrypt data", error);
                    toast.error("Failed to decrypt data", { position: 'bottom-left' });
                } finally {
                    setIsDecrypting(false); 
                }
            };

            decryptFields();
        }
    }, [password, encryptionKey, IV]);

    const handleBackClick = () => {
        navigate("/passwords");
    };

    const handleEditClick = () => {
        setEditPassword(true);
    };

    const handleDeleteClick = () => {
        if (id) {
            deletePassword({ id })
                .unwrap()
                .then(() => {
                    toast.success("Password deleted successfully", { position: 'bottom-left' });
                    navigate('/passwords');
                })
                .catch((error) => {
                    toast.error(error.data.message, { position: 'bottom-left' });
                    navigate('/passwords');
                });
        }
    };

    let content;
    if (isLoading || isDecrypting) {
        content = (
            <div className="text-center py-5 text-sm text-zinc-300">Securely loading your password...</div>
        )
    } else if (password) {
        content = (
            <div className="relative z-10">
                <div className="flex justify-start py-2 items-end">
                    <div className="my-auto cursor-pointer text-blue-500 mr-3" onClick={handleBackClick}>
                        <img src="/arrowBack.svg" alt="Back" className="w-5" />
                    </div>
                    <h2 className="my-auto text-xl font-semibold">{decryptedWebsite}</h2>
                </div>

                <div className="bg-secondary flex-col mt-4 mb-10 shadow-md shadow-zinc-950 rounded-md py-4">
                    <div className="flex flex-col sm:flex-row justify-evenly">
                        <div className="relative flex-col w-full px-4">
                            <label htmlFor="username" className="text-xs font-semibold">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={decryptedUsername}
                                disabled
                                placeholder="No username added"
                                className="mt-1.5 bg-neutral-700 block w-full rounded-lg border-0 py-1.5 pr-10 text-neutral-400 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center mr-6 mt-8">
                                <img
                                    onClick={() => {
                                        navigator.clipboard.writeText(decryptedUsername);
                                        toast("Username copied to clipboard", { position: "bottom-left" });
                                    }}
                                    src="/copy.svg"
                                    alt="copy username"
                                    className="cursor-pointer w-4"
                                />
                            </div>
                        </div>

                        <div className="flex-col w-full px-4">
                            <label htmlFor="website" className="text-xs font-semibold block mt-2 mb-2">Website</label>
                            <Link to={`https://www.${decryptedWebsite}`}
                                className="w-full hover:underline text-white text-sm"
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                {decryptedWebsite}
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-evenly mt-4">
                        <div className="relative flex-col w-full px-4">
                            <label htmlFor="password" className="text-xs font-semibold">Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={decryptedPassword}
                                disabled
                                placeholder="No password added"
                                className="mt-1.5 bg-neutral-700 block w-full rounded-lg border-0 py-1.5 pr-16 text-neutral-400 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-start mr-6 mt-10 space-x-2">
                                <img
                                    onClick={() => setShowPassword(!showPassword)}
                                    src={showPassword ? "/visible.svg" : "/invisible.svg"}
                                    alt={showPassword ? "show password" : "hide password"}
                                    className="cursor-pointer w-4"
                                />
                                <img
                                    onClick={() => {
                                        navigator.clipboard.writeText(decryptedPassword);
                                        toast("Password copied to clipboard", { position: "bottom-left" });
                                    }}
                                    src="/copy.svg"
                                    alt="copy password"
                                    className="cursor-pointer w-4"
                                />
                            </div>
                        </div>

                        <div className="flex-col w-full px-4">
                            <label htmlFor="note" className="text-xs font-semibold">Note</label>
                            <div className="px-3 resize-auto mt-1.5 bg-neutral-700 block w-full rounded-lg border-0 py-1.5 text-neutral-400 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6">
                                {decryptedNote ? decryptedNote : "No note added"}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 px-4 mt-4">
                        <button 
                            className="text-white font-semibold text-sm border-2 border-violet-500 px-4 py-1 rounded-full"
                            onClick={handleEditClick}
                        >
                            Edit
                        </button>
                        <button 
                            className="ml-3 text-white font-semibold text-sm border-2 border-violet-500 px-4 py-1 rounded-full"
                            onClick={handleDeleteClick}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        );
    } else if (isError) {
        content = <div>Failed to load password</div>;
    }

    return (
        <main className="relative flex flex-col items-center justify-start h-full w-full text-gray-300">
            {editPassword && (
                <div className="fixed lg:top-0 lg:left-0 lg:right-0 lg:z-50 inset-0 bg-black bg-opacity-60 flex justify-center items-center z-20">
                    <div className="bg-neutral-800 text-zinc-300 p-6 w-full max-w-lg rounded-md shadow-md">
                        <UpdatePassword setEditPassword={setEditPassword} />
                    </div>
                </div>
            )}
            <div className="w-full max-w-2xl rounded-md">
                {content}
            </div>
        </main>
    );
};

export default SelectedPassword;
