import { useState } from "react";

const Modal = ({ 
    isNewPassword=true, 
    website = '', 
    username = '', 
    password = '', 
    note = '',
    setNewWebsite,
    setNewUsername,
    setNewPassword,
    setNewNote,
    handleSubmit,
    handleCancelClick
}) => {

    const [showPassword, setShowPassword] = useState(false);   

    return (
        <div className="bg-white fixed inset-0 flex flex-col items-center justify-center z-50">
            <div className="px-4">
                <form 
                    className=""
                    onSubmit={(e) => handleSubmit(e)}
                >
                    <div className="mb-2">
                        {isNewPassword ? "Add New Password" : "Update Password"}
                    </div>
                    <label htmlFor="new-website">Website</label>
                    <div>
                        {isNewPassword ? (
                            <input
                                type="text"
                                id="new-website"
                                value={website}
                                onChange={(e) => setNewWebsite(e.target.value)}
                                placeholder="website"
                            />) : (
                                <a 
                                    href={`https://www.${website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >{website}</a>
                            )}
                        
                    </div>
                    <label htmlFor="new-username">Username</label>
                    <div>
                        <input
                            type="text"
                            id="new-username"
                            value={username}
                            onChange={(e) => setNewUsername(e.target.value)}
                            placeholder="username"
                        />
                    </div>
                    <label htmlFor="new-password">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="new-password"
                            value={password}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="password"
                            className=""
                        />
                        <img 
                            onClick={() => setShowPassword(!showPassword)} 
                            src={showPassword ? "/visible.svg" : "/invisible.svg"}
                            alt={showPassword ? "showPassword" : "notShowPassword"}
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                        ></img>
                    </div>
                    <label htmlFor="new-note">Note</label>
                    <div>
                        <input
                            type="text"
                            id="new-note"
                            value={note}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="note"
                        />
                    </div>
                    <button className="" onClick={() => handleCancelClick()}>
                        Cancel
                    </button>
                    <button className="submit" type="submit" disabled={isNewPassword ? !(website && password) : false}>
                        Save
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Modal