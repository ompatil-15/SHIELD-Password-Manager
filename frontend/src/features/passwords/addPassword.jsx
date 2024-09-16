import { useEffect, useRef, useState } from "react";
import { useAddPasswordMutation } from "./passwordsApiSlice";
import { toast } from 'sonner';
import { encryptDataBase64, Uint8ArrayToBase64 } from "../../utils/cryptoUtils";
import useAuth from "../../hooks/useAuth";

const AddPassword = ({ setAddNewPassword }) => {
  const { id, encryptionKey, IV } = useAuth();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const websiteBase64 = Uint8ArrayToBase64(new TextEncoder().encode(newPassword.website));
    const usernameBase64 = Uint8ArrayToBase64(new TextEncoder().encode(newPassword.username));
    const passwordBase64 = Uint8ArrayToBase64(new TextEncoder().encode(newPassword.password));
    const noteBase64 = Uint8ArrayToBase64(new TextEncoder().encode(newPassword.note));

    const encryptedWebsite = await encryptDataBase64(websiteBase64, encryptionKey, IV)
    const encryptedUsername = await encryptDataBase64(usernameBase64, encryptionKey, IV)
    const encryptedPassword = await encryptDataBase64(passwordBase64, encryptionKey, IV)
    const encryptedNote = await encryptDataBase64(noteBase64, encryptionKey, IV)
    
    // console.log("website: ",encryptedWebsite)
    // console.log("username: ",encryptedUsername)
    // console.log("password: ",encryptedPassword)
    // console.log("note: ",encryptedNote)

    addPassword({
      userID: id,
      website: encryptedWebsite,
      username: encryptedUsername,
      password: encryptedPassword,
      note: encryptedNote, 
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

  const generateRandomPassword = (e) => {
    // e.preventDefault();
    setNewPassword(password => ({
      ...password,
      password: crypto.randomUUID()
    }));
  }

  const validateWebsite = (value) => {
    const websitePattern = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    return websitePattern.test(value);
  };

  return (
    <div className="">
      <div className="">
        <form className="" onSubmit={(e) => handleSubmit(e)}>
          <div className="mb-3">
            {"Add New Password"}
          </div>
          <div className="flex justify-between py-1 items-end text-xs">
            <label htmlFor="new-website" className="text-xs font-semibold">Website</label>
            { newPassword.website && !validateWebsite(newPassword.website) && <div className="text-red-500">Enter a valid website</div>}
          </div>
          <div className="mb-2">
            <input
              type="text"
              ref={websiteRef}
              id="new-website"
              value={newPassword.website}
              onChange={(e) => handleWebsiteChange(e)}
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
          <div className="flex justify-between py-1 items-end">
            <label htmlFor="new-password" className="text-xs font-semibold">Password</label>
            <button type="button" className="text-xs" onClick={(e) => generateRandomPassword(e)}>Generate random password?</button>
          </div>
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
              className={(newPassword.website && newPassword.password && validateWebsite(newPassword.website)) ? 'bg-violet-800 submit ml-2 text-white font-medium text-sm border-2 border-violet-800 px-4 py-1 rounded-full' : 'bg-neutral-600 ml-2 text-zinc-400 font-medium text-sm border-2 border-neutral-600 px-4 py-1 rounded-full cursor-not-allowed'}
              type="submit"
              disabled={!(newPassword.website && newPassword.password && validateWebsite(newPassword.website))}
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
