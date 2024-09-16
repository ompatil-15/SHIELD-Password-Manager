import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useLoginMutation, useAddNewUserMutation, useGetSaltMutation } from './authApiSlice';
// import usePersist from "../../hooks/usePersist";
import { toast } from 'sonner';
import { Uint8ArrayToBase64, createEncryptedPackageBase64, deriveKeyBase64, hashPasswordWithAesKeyAsSaltBase64 } from "../../utils/cryptoUtils";

export default function Auth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const [persist, setPersist] = usePersist();
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");

  const [login] = useLoginMutation();
  const [addNewUser] = useAddNewUserMutation();
  const [getSalt] = useGetSaltMutation();


  const handleToggle = () => {
    setIsSignup(!isSignup);
    setFullName("");
    setEmail("");
    setPassword("");
    setCPassword("");
    setShowPassword(false);
  };

  // const handlePersist = () => {
  //   setPersist(!persist);
  // };

  const isValidFullName = (name) => {
    return !name || name.length < 3;
  }
  
  const isValidEmail = (email) => {
    return !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  const isValidPassword = (password) => {
    return !password || password.length < 8;
  }
  
  const isValidCPassword = (cpassword, password) => {
    return !cpassword || password !== cpassword;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!isSignup) {
        // Authenticate user by fetching salt and sending hash to verify
        const { salt } = await getSalt(email.toLocaleLowerCase()).unwrap()
        const passwordBase64 = Uint8ArrayToBase64(new TextEncoder().encode(password));
        const hashBase64 = await hashPasswordWithAesKeyAsSaltBase64(passwordBase64, salt);
        const { accessToken } = await login({ email, hash: hashBase64 }).unwrap();
        const encryptionKey = await deriveKeyBase64(passwordBase64, salt)
        dispatch(setCredentials({ accessToken, encryptionKey }));
        setEmail('');
        setPassword('');
        toast.success('Successfully logged in!', { position: 'bottom-left'});
        navigate('/passwords');
      } else {
        // Generate encrypted package (salt, IV, hash) in Base64 format
        const passwordBase64 = Uint8ArrayToBase64(new TextEncoder().encode(password)); 
        const encryptedPackageBase64 = await createEncryptedPackageBase64(passwordBase64); 

        await addNewUser({ fullName, email: email.toLocaleLowerCase(), encryptedPackage: encryptedPackageBase64 }).unwrap();
        handleToggle(); 
        toast.success('Account created successfully!', { position: 'bottom-left' });
      }
    } catch (err) {
      const errorMessage = err?.data?.message || 'An unexpected error occurred';
      toast.error(errorMessage, { position: 'bottom-left' });
    }
  };

  return (
    <main className="bg-neutral-900 flex min-h-screen flex-col justify-center">
    <Link to="/"><button className="ml-10 text-sm lg:text-base py-1 px-6 bg-gradient-to-r text-zinc-200 bg-zinc-700 font-semibold rounded-full cursor-pointer">Back</button></Link>
    <div className="px-6 py-8 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="SHIELD"
          src="ShieldLogoGray.svg"
          className="mx-auto h-24 w-auto sm:h-32"
        />
        <h2 className="mt-8 text-center text-xl font-semibold leading-8 tracking-tight text-neutral-200 sm:text-2xl">
          {isSignup ? "Create an account" : "Sign in to your account"}
        </h2>
      </div>

      <div className="text-sm mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="relative">
          {isSignup && (
            <div className="mb-3">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="name"
                  className="block font-medium leading-6 text-neutral-200"
                >
                  Full Name
                </label>
                <div>
                  {fullName && fullName.length < 3 ? (<div className="text-red-500">Name must be at least 3 characters long</div>) : null}
                </div>
              </div>
              <div className="">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-neutral-800 block w-full rounded-md border-0 py-2 text-neutral-50 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                  aria-label="Full Name"
                />
              </div>
            </div>
          )}

          <div className="mb-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="email"
                className="block font-medium leading-6 text-neutral-200"
              >
                Email
              </label>
              <div>
                {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? (<div className="text-red-500">Please enter a valid email address</div>) : null}
              </div>
            </div>
            <div className="">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-neutral-800 block w-full rounded-md border-0 py-2 text-neutral-50 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                aria-label="Email"
              />
            </div>
          </div>

          <div className="mb-3 relative">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block font-medium leading-6 text-neutral-200"
              >
                Password
              </label>
              <div>
                {isSignup && password && password.length < 8 ? (<div className="text-red-500">Password must be at least 8 characters long</div>) : null}
              </div>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete={isSignup ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-neutral-800 block w-full rounded-md border-0 py-2 text-neutral-50 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6 pr-10"
                aria-label="Password"
              />
              <img
                onClick={() => setShowPassword(!showPassword)}
                src={showPassword ? "/visible.svg" : "/invisible.svg"}
                alt={showPassword ? "showPassword" : "notShowPassword"}
                className="w-5 absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
              />
            </div>
          </div>

          {isSignup && (
            <div className="mb-3 relative">
              <div className="flex items-center justify-between">
              <label
                htmlFor="confirm-password"
                className="block font-medium leading-6 text-neutral-200"
              >
                Confirm Password
              </label>
              <div>
                {cPassword && password !== cPassword ? (<div className="text-red-500">Passwords do not match</div>) : null}
              </div>
            </div>
              <div className="relative">
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showCPassword ? "text" : "password"}
                  required
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  value={cPassword}
                  onChange={(e) => setCPassword(e.target.value)}
                  className="bg-neutral-800 block w-full rounded-md border-0 py-2 text-neutral-50 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6 pr-10"
                  aria-label="Confirm Password"
                />
                <img
                  onClick={() => setShowCPassword(!showCPassword)}
                  src={showCPassword ? "/visible.svg" : "/invisible.svg"}
                  alt={showCPassword ? "showPassword" : "notShowPassword"}
                  className="w-5 absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={
                isSignup 
                  ? isValidFullName(fullName) || isValidEmail(email) || isValidPassword(password) || isValidCPassword(cPassword, password)
                  : false
              }
              className={`flex w-full justify-center rounded-md px-3 py-2.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 
                ${isSignup 
                  ? (isValidFullName(fullName) || isValidEmail(email) || isValidPassword(password) || isValidCPassword(cPassword, password)
                    ? 'bg-neutral-600 text-zinc-400 cursor-not-allowed'
                    : 'bg-violet-900 hover:bg-violet-700 text-white')
                  :  (isValidEmail(email)
                    ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed' 
                    : 'bg-violet-900 hover:bg-violet-700 text-white')}`}  
            >
              {isSignup ? "Create account" : "Sign in"}
            </button>
          </div>
          {/* <div className="flex mt-3 items-center justify-center">
            <div>
              <label htmlFor="persist" className="">
                <input
                  type="checkbox"
                  className="rounded-full bg-purple-900"
                  id="persist"
                  onChange={handlePersist}
                  checked={persist}
                />
              </label>
            </div>
            <div className="text-white text-sm font-semibold ml-2">Trust this device</div>
          </div> */}
        </form>

        <div className="mt-4 text-center text-sm text-gray-400 font-medium">
          {!isSignup ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={handleToggle}
            className={`font-semibold leading-6 text-violet-600 hover:text-violet-400`}>
            {!isSignup ? "Create an account" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
    </main>
  );
}
