import { useState } from "react";
import { 
    useGetUserNotesQuery
} from "./notesApiSlice";
import { Link } from "react-router-dom";
import AddNote from "./AddNote";
import LoadingPage from "../../pages/loadingPage";
import useAuth from "../../hooks/useAuth";
import { toast } from 'sonner';

const Notes = () => {
    const { id } = useAuth();
    const [addNewNote, setAddNewNote] = useState(false);
    const {
        data: notes,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUserNotesQuery(id, {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    let content;
    if (isLoading) {
        content = <LoadingPage />;
    } else if (isSuccess) {
        content = notes.length ? (
            notes.map((note, index) => (
                <Link to={note._id} key={note._id}>
                    <div className={`flex justify-between items-center px-4 text-white text-sm cursor-pointer hover:bg-zinc-700 py-3 ${
                            index < notes.length - 1 ? 'border-b border-neutral-700' : 'hover:rounded-b-md'} ${index === 0 ? 'hover:rounded-t-md' : ''}`}>
                        <div>
                            {note.title}
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
            <div className="text-center py-4">Notes you add appear here</div>
        );
    } else if (isError) {
        if(error?.data?.message === "No notes found"){
            content = (
                <div className="text-center py-4 text-sm">Notes you add appear here</div>
            )
        } else {
            toast(error?.data?.message || "An error occurred while fetching notes.", {position: "bottom-left"});
        }
    }

    return (
        <main className="relative flex flex-col items-center">
        {addNewNote && (
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-none flex items-center justify-center z-50">
                <div className="bg-neutral-800 p-6 w-full max-w-lg rounded-md shadow-md text-gray-300">
                    <AddNote setAddNewNote={setAddNewNote} />
                </div>
            </div>
        )}
        <div className={`bg-primary w-full max-w-2xl text-white transition-all duration-300 ${addNewNote ? 'blur-none' : ''}`}>
            <div className="bg-primary flex justify-between py-2 px-4 md:px-0">
                <h1 className="text-white text-xl">Notes</h1>
                <button 
                    onClick={() => setAddNewNote(true)}
                    className="text-white font-medium text-sm border-2 border-violet-800 px-4 rounded-full">
                    Add
                </button>
            </div>
            <div className="bg-secondary text-gray-300 mt-4 sm:rounded-md shadow-md shadow-zinc-950">
                {content}
            </div>
        </div>
    </main>
    );
};

export default Notes;
