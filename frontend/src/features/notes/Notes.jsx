import { useState, useEffect } from "react";
import { useGetUserNotesQuery } from "./notesApiSlice";
import { Link } from "react-router-dom";
import AddNote from "./AddNote";
import { toast } from 'sonner';
import { Base64ToUint8Array, decryptDataBase64 } from "../../utils/cryptoUtils";
import LoginAgain from "../../pages/loginAgain";
import Premium from "../../components/premium";
import useAuth from "../../hooks/useAuth";

const Notes = () => {
    const { id, encryptionKey, IV } = useAuth();
    const limit = 15;
    const [addNewNote, setAddNewNote] = useState(false);
    const [searchNote, setSearchNote] = useState("");
    const [decryptedNotes, setDecryptedNotes] = useState([]);
    const [loading, setLoading] = useState(true); 
    
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

    useEffect(() => {
        const decryptNotes = async () => {
            if (notes) {
                try {
                    const decrypted = await Promise.all(
                        notes.map(async (note) => {
                            const decryptedTitle = await decryptDataBase64(note.title, encryptionKey, IV);
                            const decryptedContent = await decryptDataBase64(note.content, encryptionKey, IV);
                            const decodedTitle = (new TextDecoder().decode(Base64ToUint8Array(decryptedTitle)));
                            const decodedContent = (new TextDecoder().decode(Base64ToUint8Array(decryptedContent)));
                            return { ...note, title: decodedTitle, content: decodedContent };
                        })
                    );
                    setDecryptedNotes(decrypted);
                } catch (error) {
                    console.error("Failed to decrypt notes", error);
                    toast.error("Failed to decrypt notes", { position: 'bottom-left' });
                } finally {
                    setLoading(false); 
                }
            } else {
                setLoading(false); 
            }
        };

        decryptNotes();
    }, [notes, encryptionKey, IV]);

    let content;
    if (isLoading || loading) {
        content = (
            <div className="text-center py-5 text-sm text-zinc-300">Securely loading your notes...</div>
        );
    } else if (isSuccess) {
        const filteredNotes = searchNote !== ""
            ? decryptedNotes.filter((note, index) => note.title?.toLowerCase().includes(searchNote.toLowerCase()))
            : decryptedNotes;

        content = decryptedNotes?.length && filteredNotes.length ? (
            filteredNotes.map((note, index) => (
                <Link to={note?._id} key={note?._id}>
                    <div className={`flex justify-between items-center px-4 text-white text-sm cursor-pointer hover:bg-zinc-700 py-3 ${
                            index < filteredNotes.length - 1 ? 'border-b border-neutral-700' : 'hover:rounded-b-md'}`}>
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
            <div className="text-center py-4 text-sm text-zinc-300">Notes you add appear here</div>
        );
    } else if (isError) {
        if(error?.data?.message === "No notes found"){
            content = (
                <div className="text-center py-4 text-sm text-zinc-300">Notes you add appear here</div>
            );
        } else {
            content = (
                <div className="text-center py-4 text-sm text-red-500">An error occurred while fetching notes</div>
            );
            toast.error(error?.data?.message || "An error occurred while fetching notes", { position: "bottom-left" });
        }
    } else {
        return <LoginAgain />;
    }

    return (
        <main className="relative flex flex-col items-center">
            {notes?.length >= limit && <Premium />}
            {addNewNote && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-none flex items-center justify-center z-50">
                    <div className="bg-neutral-800 p-6 w-full max-w-lg rounded-md shadow-md text-gray-300">
                        <AddNote setAddNewNote={setAddNewNote} />
                    </div>
                </div>
            )}
            <div className={`bg-primary mt-1 w-full max-w-2xl text-white transition-all duration-300 ${addNewNote ? 'blur-none' : ''}`}>
                <div className="bg-primary flex justify-between py-2 px-4 md:px-0">
                    <h1 className="text-white text-xl">Notes</h1>
                    <button 
                        onClick={() => setAddNewNote(true)}
                        disabled={notes?.length>=limit}
                        className={notes?.length < limit ? `text-white font-medium text-sm border-2 border-violet-800 px-4 rounded-full` : `bg-neutral-600 text-zinc-400 font-medium text-sm border-2 border-neutral-600 px-4 rounded-full cursor-not-allowed`}>
                        Add
                    </button>
                </div>
                <div className="bg-secondary mt-4 sm:rounded-md shadow-md shadow-zinc-950 mb-10">
                        {notes?.length ? (
                            <div className="px-4 py-2 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between">
                                <h1 className="text-md text-zinc-300">{notes ? notes.length === 1 ? '1 note' : `${notes.length} notes` : null}</h1>
                                <input 
                                    placeholder="Search notes"
                                    onChange={(e) => setSearchNote(e.target.value)}
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

export default Notes;
