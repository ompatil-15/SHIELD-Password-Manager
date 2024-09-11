import { useEffect, useRef, useState } from "react";
import {
  // useGetPasswordsQuery,
  // useGetPasswordQuery,
  useAddPasswordMutation,
  // useUpdatePasswordMutation,
  // useDeletePasswordMutation,
} from "./passwordsApiSlice";
import useAuth from "../../hooks/useAuth";
import { toast } from 'sonner';



const AddPassword = ({ setAddNewPassword }) => {
  const { id } = useAuth();
  const websiteRef = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState({
    website: "",
    username: "",
    password: "",
    note: "",
  });

  useEffect(() => {
    if(websiteRef.current){
      websiteRef.current.focus();
    }
  }, [])

  const [addPassword] = useAddPasswordMutation();

  const handleSubmit = (e) => {
    e.preventDefault();
    addPassword({
      userID: id,
      website: newPassword.website,
      username: newPassword.username,
      password: newPassword.password,
      note: newPassword.note, 
    }).unwrap()
    .then(() => {
      setAddNewPassword(false);
      toast.success("Password added successfully", {position: 'bottom-left'})
    })
    .catch((error) => {
      console.error("Failed to add the password: ", error);
      toast.error(error.data.message, {position: 'bottom-left'})
      setAddNewPassword(false);
    });
  } 
  
  const handleWebsiteChange = (e) => {
    setNewPassword(password => ({
      ...password,
      website: e.target.value
    }));
  };

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

  const validateWebsite = (e) => {
    const input = e.target;
    const websitePattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    
    if (!websitePattern.test(input.value)) {
      input.setCustomValidity('Please enter a valid website, e.g., example.com');
    } else {
      input.setCustomValidity('');
    }
  };

  return (
    <div className="">
      <div className="">
        <form className="" onSubmit={(e) => handleSubmit(e)}>
          <div className="mb-3">
            {"Add New Password"}
          </div>
          <label htmlFor="new-website" className="text-xs font-semibold">Website</label>
          <div className="mb-2">
            <input
              type="text"
              ref={websiteRef}
              id="new-website"
              value={newPassword.website}
              onChange={(e) => handleWebsiteChange(e)}
              onBlur={validateWebsite} 
              // placeholder="website"
              className="mt-1.5 bg-neutral-700 block w-full rounded-md border-0 py-1.5 text-neutral-50 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
              // pattern="^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$"
              required
            />
          </div>
          <label htmlFor="new-username" className="text-xs font-semibold">Username</label>
          <div className="mb-2">
            <input
              type="text"
              id="new-username"
              value={newPassword.username}
              onChange={(e) => handleUsernameChange(e)}
              // placeholder="username"
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
              // placeholder="password"
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
            <button className="text-white font-semibold text-sm border-2 border-violet-500 px-4 py-1 rounded-full" onClick={() => setAddNewPassword(false)}>
              Cancel
            </button>
            <button
              className={(newPassword.website && newPassword.password)   ? 'bg-violet-800 submit ml-2 text-white font-medium text-sm border-2 border-violet-800 px-4 py-1 rounded-full' : 'bg-neutral-600 ml-2 text-zinc-400 font-medium text-sm border-2 border-neutral-600 px-4 py-1 rounded-full'}
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
};

export default AddPassword;
