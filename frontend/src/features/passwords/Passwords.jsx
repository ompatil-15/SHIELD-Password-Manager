import { Link } from "react-router-dom";
import {
    useGetUserPasswordsQuery 
} from "./passwordsApiSlice";
import { useState, useEffect } from "react";
import AddPassword from "./addPassword";
import LoadingPage from "../../pages/loadingPage";
import useAuth from "../../hooks/useAuth";
import { toast } from 'sonner';

const Passwords = () => {
    const { id } = useAuth();
    const [searchPassword, setSearchPassword] = useState("");
    const [addNewPassword, setAddNewPassword] = useState(false);

    const {
        data: passwords,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUserPasswordsQuery(id, {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    // Prevent body scrolling when modal is open
    useEffect(() => {
        if (addNewPassword) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [addNewPassword]);

    let content;
    if (isLoading) {
        content = <LoadingPage />;
    } else if (isSuccess) {
        const filteredPasswords = searchPassword !== ""
        ? passwords.filter(password => password.website.toLowerCase().includes(searchPassword.toLowerCase()))
        : passwords;

        content = filteredPasswords.length ? (
            filteredPasswords.map((password, index) => (
                <Link to={password._id} key={password._id}>
                    <div className={`flex justify-between items-center px-4 text-white text-sm cursor-pointer hover:bg-zinc-700 py-3 ${
                            index < filteredPasswords.length - 1 ? 'border-b border-neutral-700' : 'hover:rounded-b-md'} ${index === 0 ? 'hover:rounded-t-md' : ''}`}>
                        <div>
                            {password.website}
                        </div>
                        <div>
                            <img 
                                src="/arrowForward.svg"
                                alt="Forward Arrow"
                                className="w-3"
                            />
                        </div>
                    </div>
                </Link>
            ))
        ) : (
            <div className="text-center py-4 text-sm">Passwords you add appear here</div>
        );
    } else if (isError) {
        if(error?.data?.message === "No passwords found"){
            content = (
                <div className="text-center py-5 text-sm text-zinc-300">Passwords you add appear here</div>
            )
        } else {
            toast(error?.data?.message || "An error occurred while fetching notes.", {position: "bottom-left"});
        }
    }

    return (
        <main className="relative flex flex-col items-center">
            {addNewPassword && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-none flex items-center justify-center z-50">
                    <div className="bg-neutral-800 p-6 w-full max-w-lg rounded-md shadow-md text-gray-300">
                        <AddPassword setAddNewPassword={setAddNewPassword} />
                    </div>
                </div>
            )}
            <div className={`bg-primary w-full max-w-2xl text-white transition-all duration-300 ${addNewPassword ? 'blur-none' : ''}`}>
                <div className="bg-primary flex justify-between py-2 px-5 md:px-0">
                    <h1 className="text-white text-xl">Passwords</h1>
                    <button 
                        onClick={() => setAddNewPassword(true)}
                        className="text-white font-medium text-sm border-2 border-violet-800 px-4 rounded-full">
                        Add
                    </button>
                </div>
                <div className="bg-secondary mt-4 sm:rounded-md shadow-md shadow-zinc-950">
                    {passwords ? (
                        <div className="px-4 py-2 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between">
                            <h1 className="text-md text-zinc-300">{passwords ? `${passwords.length} websites and apps` : null}</h1>
                            <input 
                                placeholder="Search passwords"
                                onChange={(e) => setSearchPassword(e.target.value)}
                                className="text-zinc-400 text-sm w-full py-1 px-0 sm:px-2 sm:w-44 border-0 border-b-zinc-600 border-b-2 font-semibold bg-secondary focus:ring-0 focus:border-b-violet-700"
                            ></input>
                        </div>
                    ) : null}
                    
                    
                    {content}
                </div>
            </div>
        </main>
    );
};

export default Passwords;