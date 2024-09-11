import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetPasswordQuery, useDeletePasswordMutation } from "./passwordsApiSlice";
import UpdatePassword from "./updatePassword";
import { toast } from 'sonner';

const SelectedPassword = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [editPassword, setEditPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        data: password,
        isLoading,
        isError
    } = useGetPasswordQuery(id, { skip: !id });

    const [deletePassword] = useDeletePasswordMutation();

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
    if (isLoading) {
        content = <div>Securely loading password...</div>;
    } else if (password) {
        content = (
            <div className="relative z-10">
                <div className="flex justify-start py-2 items-end">
                    <div className="my-auto cursor-pointer text-blue-500 mr-3" onClick={handleBackClick}>
                        <img src="/arrowBack.svg" alt="Back" className="w-5" />
                    </div>
                    <h2 className="my-auto text-xl font-semibold">{password.website}</h2>
                </div>

                <div className="bg-secondary flex-col mt-4 mb-10 shadow-md shadow-zinc-950 rounded-md py-4">
                    <div className="flex flex-col sm:flex-row justify-evenly">
                        <div className="relative flex-col w-full px-4">
                            <label htmlFor="username" className="text-xs font-semibold">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={password.username}
                                disabled
                                placeholder="No username added"
                                className="mt-1.5 bg-neutral-700 block w-full rounded-lg border-0 py-1.5 pr-10 text-neutral-400 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center mr-6 mt-8">
                                <img
                                    onClick={() => {
                                        navigator.clipboard.writeText(password.password)
                                        toast("Username copied to clipboard", {position: "bottom-left"})
                                    }}
                                    src="/copy.svg"
                                    alt="copy username"
                                    className="cursor-pointer w-4"
                                />
                            </div>
                        </div>

                        {/* <div className="flex-col w-full px-4">
                            <label htmlFor="website" className="text-xs font-semibold">Website</label>
                            <input
                                type="text"
                                id="website"
                                value={password.website}
                                disabled
                                placeholder="No website added"
                                className="mt-1.5 bg-neutral-700 block w-full rounded-lg border-0 py-1.5 text-neutral-400 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                            />
                        </div> */}
                        <div className="flex-col w-full px-4">
                            <label htmlFor="website" className="text-xs font-semibold block mt-2 mb-2">Website</label>
                            <a 
                                href={`https://www.${password.website}`} 
                                className="w-full hover:underline text-white text-sm"
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                {password.website}
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-evenly mt-4">
                        <div className="relative flex-col w-full px-4">
                            <label htmlFor="password" className="text-xs font-semibold">Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password.password}
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
                                        navigator.clipboard.writeText(password.password)
                                        toast("Password copied to clipboard", {position: "bottom-left"})
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
                                {password.note ? password.note : "No note added"}
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
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-20">
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
