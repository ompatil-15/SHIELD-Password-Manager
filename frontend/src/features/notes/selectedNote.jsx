import { useState, useEffect, useRef } from "react";
import { 
    useGetNoteQuery,
    useUpdateNoteMutation,
    useDeleteNoteMutation
} from "./notesApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'sonner';

const Note = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const textareaRef = useRef(null);
    const formRef = useRef(null);

    const [updateNote] = useUpdateNoteMutation();
    const [deleteNote] = useDeleteNoteMutation();
    
    const {
        data: note,
        isLoading,
        isSuccess,
        isError,
    } = useGetNoteQuery(id, { skip: !id });

    useEffect(() => {
        if (note) {
            setNewTitle(note.title);
            setNewContent(note.content);
        }
    }, [note]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                if (note && (note.title !== newTitle || note.content !== newContent)) {
                    updateNote({
                        id: note._id,
                        title: newTitle,
                        content: newContent,
                    })
                    .unwrap()
                    .then(() => {
                        toast.success("Note updated successfully", { position: 'bottom-left' });
                        navigate('/notes');
                    })
                    .catch((error) => {
                        toast.error(error?.data?.message || "Failed to update note", { position: 'bottom-left' });
                        // console.error("Failed to update note:", error);
                    });
                } else {
                    navigate('/notes');
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [navigate, newContent, newTitle, note, updateNote]);

    const handleDeleteNote = () => {
        if (id) {
            deleteNote({ id })
            .unwrap()
            .then(() => {
                toast.success("Note deleted successfully", { position: 'bottom-left' });
                navigate('/notes');
            })
            .catch((error) => {
                toast.error(error?.data?.message || "Failed to delete note", { position: 'bottom-left' });
                // console.error("Failed to delete note:", error);
            });
        }
    };

    const handleInput = (event) => {
        const textarea = textareaRef.current;
        textarea.style.height = "auto";
        const scrollHeight = textarea.scrollHeight;
        const maxHeight = 500;
        textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
        textarea.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden";
        setNewContent(event.target.value);
    };

    useEffect(() => {
        if (textareaRef.current) {
            // Set the initial height based on content
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 500)}px`;
            textareaRef.current.style.overflowY = textareaRef.current.scrollHeight > 500 ? "auto" : "hidden";
        }
    }, [newContent]);

    let content;
    if (isLoading) {
        content = <div className="text-zinc-300 text-center">Loading note...</div>;
    } else if (isSuccess) {
        content = (
            <div className="text-zinc-300">
                <input
                    type="text"
                    id="title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Title"
                    className="w-full border-0 rounded font-semibold bg-secondary text-xl focus:ring-0 focus:border-none focus:bg-transparent"
                />
                <textarea
                    ref={textareaRef}
                    id="content"
                    value={newContent}
                    onChange={handleInput}
                    placeholder="Take a note..."
                    className="w-full border-0 rounded bg-secondary resize-none text-md focus:ring-0 focus:border-none focus:bg-transparent"
                    style={{ maxHeight: "500px" }}
                />
                <div className="flex justify-end items-center mt-2">
                    {/* <Link to="/notes" className="font-semibold text-sm border-2 border-violet-500 px-4 py-1 rounded-full">
                            Back
                    </Link> */}
                    <button
                        onClick={handleDeleteNote}
                        className="submit font-semibold text-sm border-2 bg-violet-800 border-violet-800 ml-3 px-4 py-1 rounded-full"
                    >
                        Delete
                    </button>
                </div>
            </div>
        );
    } else if (isError) {
        content = <p className="text-white text-center">Failed to load note</p>;
    }

    return (
        <main className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-secondary p-6 rounded-lg w-[700px]" ref={formRef}>
                {content}
            </div>
        </main>
    );
};

export default Note;
