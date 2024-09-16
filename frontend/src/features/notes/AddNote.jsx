import { useState, useRef, useEffect } from "react";
import { useAddNoteMutation } from "./notesApiSlice";
import { toast } from 'sonner';
import { encryptDataBase64, Uint8ArrayToBase64 } from "../../utils/cryptoUtils";
import useAuth from "../../hooks/useAuth";

const AddNote = ({ setAddNewNote }) => {
    const { id, encryptionKey, IV } = useAuth();
    const formRef = useRef(null);
    const textareaRef = useRef(null);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [addNote] = useAddNoteMutation();

    const handleEncryptAndSubmit = async () => {
        try {
            const titleBase64 = Uint8ArrayToBase64(new TextEncoder().encode(newTitle));
            const contentBase64 = Uint8ArrayToBase64(new TextEncoder().encode(newContent));

            const encryptedTitle = await encryptDataBase64(titleBase64, encryptionKey, IV);
            const encryptedContent = await encryptDataBase64(contentBase64, encryptionKey, IV);

            await addNote({
                userID: id,
                title: encryptedTitle,
                content: encryptedContent
            }).unwrap();

            toast.success("Note added successfully", { position: 'bottom-left' });
            setAddNewNote(false);
        } catch (error) {
            console.error("Failed to encrypt or add note", error);
            toast.error(error?.data?.message || "Failed to add note", { position: 'bottom-left' });
            setAddNewNote(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                if (newTitle.trim()) {
                    handleEncryptAndSubmit();
                } else {
                    setAddNewNote(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newTitle, newContent, encryptionKey, IV]);

    const handleChange = (event) => {
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
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 500)}px`;
            textareaRef.current.style.overflowY = textareaRef.current.scrollHeight > 500 ? "auto" : "hidden";
        }
    }, [newContent]);

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
            <div
                ref={formRef}
                className="bg-secondary p-6 w-[650px] rounded-lg shadow-lg"
            >
                <div>
                    <input
                        type="text"
                        id="title"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Title"
                        className="w-full font-semibold border-0 rounded bg-secondary text-xl focus:ring-0 focus:border-none focus:bg-transparent"
                    />
                </div>

                <div className="mb-2">
                    <textarea
                        ref={textareaRef}
                        id="content"
                        value={newContent}
                        onChange={handleChange}
                        placeholder="Take a note..."
                        className="w-full border-0 rounded bg-secondary resize-none text-md focus:ring-0 focus:border-none focus:bg-transparent"
                        style={{ maxHeight: "500px" }}
                    ></textarea>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        className="font-semibold text-sm border-2 bg-violet-800 border-violet-800 px-4 py-1 rounded-full"
                        onClick={() => setAddNewNote(false)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddNote;
