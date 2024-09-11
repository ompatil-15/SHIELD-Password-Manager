// import Modal from "../../components/modal";
// import { nanoid } from 'nanoid';
// import {
//     useGetPasswordsQuery, 
//     useGetPasswordQuery,
//     useAddPasswordMutation,
//     useUpdatePasswordMutation,
//     // useDeletePasswordMutation
// } from "../api/apiSlice"
// import { useState, useEffect } from "react"

// const Passwords = () => {
//     const [newWebsite, setNewWebsite] = useState('');
//     const [newUsername, setNewUsername] = useState('');
//     const [newPassword, setNewPassword] = useState('');
//     const [newNote, setNewNote] = useState('');
//     const [selectedPasswordId, setSelectedPasswordId] = useState(null);
//     const [isModal, setIsModal] = useState(false);
//     const [isNewPassword, setIsNewPassword] = useState(true);

//     const {
//         data: passwords,
//         isLoading,
//         isSuccess,
//         isError,
//         error
//     } = useGetPasswordsQuery();

//     const { data: selectedPassword } = useGetPasswordQuery(selectedPasswordId, {skip: !selectedPasswordId})

//     const [addPassword] = useAddPasswordMutation();
//     const [updatePassword] = useUpdatePasswordMutation();
//     // const [deletePassword] = useDeletePasswordMutation();

//     useEffect(() => {
//         if (selectedPassword) {
//             setNewWebsite(selectedPassword.website);
//             setNewUsername(selectedPassword.username);
//             setNewPassword(selectedPassword.password);
//             setNewNote(selectedPassword.note);
//         }
//     }, [selectedPassword]);

//     const reset = () => {
//         setNewWebsite('');
//         setNewUsername('');
//         setNewPassword('');
//         setNewNote('');
//         setSelectedPasswordId(null);
//     }

//     const handlePasswordClick = (id) => {
//         setSelectedPasswordId(id);
//     }

//     const handleBackClick = () => {
//         setSelectedPasswordId(null);
//         setIsModal(false);
//     }

//     const handleAddClick = () => {
//         reset();
//         setIsNewPassword(true);
//         setIsModal(true);
//     }

//     const handleEditClick = () => {
//         setIsNewPassword(false);
//         setIsModal(true);
//     }

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if(isNewPassword){
//             addPassword({ 
//                 id: nanoid(), 
//                 userID: 1, 
//                 website: newWebsite, 
//                 username: newUsername, 
//                 password: newPassword, 
//                 note: newNote
//             })
//             reset();
//             setIsModal(false);
//         } else{
//             // console.log(selectedPasswordId)
//             // updatePassword({ 
//             //     id: selectedPasswordId,
//             //     username: newUsername, 
//             //     password: newPassword, 
//             //     note: newNote
//             // }).unwrap();
//             // reset();
//             // setIsModal(false);
//             updatePassword({
//                 id: selectedPasswordId,
//                 website: newWebsite,
//                 username: newUsername,
//                 password: newPassword,
//                 note: newNote
//             }).unwrap()
//             .then(() => {
//                 reset();
//                 setIsModal(false);
//             })
//             .catch((error) => {
//                 console.error("Failed to update the password: ", error);
//             });
//         }
//     }

//     let content;
//     if (isLoading) {
//         content = <p>Securely loading passwords...</p>
//     } else if (isSuccess) {
//         content = passwords.map((password) => {
//             return (
//                     <div 
//                         key={password.id} 
//                         onClick={() => handlePasswordClick(password.id)} 
//                         className="text-white border-b cursor-pointer hover:bg-zinc-800">
//                         {password.website}
//                     </div>
//             )
//         })
//     } else if (isError) {
//         content = <p>{error}</p>
//     }

//     return (
//         <main>
//             {!selectedPasswordId ? (
//                 <div>
//                     <div className="flex justify-center">
//                         <div className="bg-black w-[700px] flex py-2">
//                             <h1 className="text-white w-[700px] text-xl">Passwords</h1>
//                             <button 
//                                 onClick={() => handleAddClick()}
//                                 className="text-white font-medium text-sm border-2 border-purple-800 px-4 rounded-full">
//                                 Add
//                             </button>
//                         </div>
//                     </div>
//                     <div className="flex justify-center">
//                         <div className="bg-black w-[700px] flex flex-col mt-10">
//                             {content}
//                         </div>
//                     </div>
//                 </div>
//             ): (
//                 <div>
//                     <div onClick={() => handleBackClick()}>Back</div>
//                     {selectedPassword ? (
//                         <div>
//                             <div>{selectedPassword.website}</div>
//                             <div>{selectedPassword.username}</div>
//                             <div>{selectedPassword.password}</div>
//                             <div>{selectedPassword.note}</div>
//                         </div>
                        
//                     ): null}
//                     <div onClick={() => handleEditClick()}>Edit</div>
//                     <div>Delete</div>
//                 </div> 
//             )}   
            
//             {isModal && (
//                 <Modal 
//                     isNewPassword={isNewPassword}
//                     website={newWebsite}
//                     username={newUsername}
//                     password={newPassword}
//                     note={newNote}
//                     setIsModal={setIsModal}
//                     setNewWebsite={setNewWebsite}
//                     setNewUsername={setNewUsername}
//                     setNewPassword={setNewPassword}
//                     setNewNote={setNewNote}
//                     handleSubmit={handleSubmit}
//                 />
//             )} 
//         </main>
//     )
// }
// export default Passwords;


// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// export const apiSlice = createApi({
//     reducerPath: 'api',
//     baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000' }),
//     tagTypes: ['Passwords'], //tags to invalite the states of that tag when state is updated
//     endpoints: (builder) => ({
//         getPasswords: builder.query({
//             query: () => '/passwords',
//             transformResponse: (res) => {
//                 return res.sort((a, b) => a.website.localeCompare(b.website));
//             },
//             providesTags: ['Passwords']
//         }),
//         getPassword: builder.query({
//             query: (id) => ({
//                 url: `/passwords/${id}`,
//             }),
//             providesTags: ['Passwords'],
//         }),
//         addPassword: builder.mutation({
//             query: (password) => ({
//                 url: '/passwords',
//                 method: 'POST',
//                 body: password
//             }),
//             invalidatesTags: ['Passwords']
//         }),
//         updatePassword: builder.mutation({
//             query: (password) => ({
//                 url: `/passwords/${password.id}`,
//                 method: 'PATCH',
//                 body: password
//             }),
//             invalidatesTags: ['Passwords']
//         }),
//         deletePassword: builder.mutation({
//             query: ({ id }) => ({
//                 url: `/passwords/${id}`,
//                 method: 'DELETE',
//                 body: id
//             }),
//             invalidatesTags: ['Passwords']
//         }),
//     })
// })

// export const {
//     useGetPasswordsQuery, 
//     useGetPasswordQuery,
//     useAddPasswordMutation,
//     useUpdatePasswordMutation,
//     useDeletePasswordMutation
// } = apiSlice