import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useLoginMutation, useAddNewUserMutation } from './authApiSlice';
import usePersist from "../../hooks/usePersist";
import { toast } from 'sonner';

export default function Auth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [persist, setPersist] = usePersist();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [login] = useLoginMutation();
  const [addNewUser] = useAddNewUserMutation();

  useEffect(() => {
    setError('');
  }, [email, password]);

  const handleToggle = () => {
    setIsSignup(!isSignup);
    setFullName("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setError("");
  };

  const handlePersist = () => {
    setPersist(!persist);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!isSignup) {
        const { accessToken } = await login({ email, password }).unwrap();
        dispatch(setCredentials({ accessToken }));
        setEmail('');
        setPassword('');
        toast.success('Successfully logged in!', { position: 'bottom-left'});
        navigate('/passwords');
      } else {
        await addNewUser({ fullName, email, password }).unwrap();
        handleToggle(); 
        toast.success('Account created successfully!', { position: 'bottom-left'});
      }
    } catch (err) {
      if (err?.status) {
        if (err.status === 400) {
          toast.error('Missing required fields', {position: 'bottom-left'});
        } else if (err.status === 401) {
          toast.error('Invalid credentials', {position: 'bottom-left'});
        } else {
          toast.error(err.data?.message || 'An unexpected error occurred', {position: 'bottom-left'});
        }
      } else {
        toast.error('An unexpected error occurred', {position: 'bottom-left'})
      }
    }
  };

  return (
    <div className="bg-neutral-900 flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="SHIELD"
          src="ShieldLogoGray.svg"
          className="mx-auto h-24 w-auto sm:h-36"
        />
        <h2 className="mt-8 text-center text-2xl font-semibold leading-8 tracking-tight text-neutral-200 sm:text-3xl">
          {isSignup ? "Create an account" : "Sign in to your account"}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="relative">
          {isSignup && (
            <div className="mb-3">
              <label
                htmlFor="name"
                className="block text-md font-medium leading-6 text-neutral-200"
              >
                Full Name
              </label>
              <div className="mt-2">
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
            <label
              htmlFor="email"
              className="block text-md font-medium leading-6 text-neutral-200"
            >
              Email
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                required
                // autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-neutral-800 block w-full rounded-md border-0 py-2 text-neutral-50 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                aria-label="Email"
              />
            </div>
          </div>

          <div className="mb-5 relative">
            <label
              htmlFor="password"
              className="block text-md font-medium leading-6 text-neutral-200"
            >
              Password
            </label>
            <div className="mt-1 relative">
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
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-violet-900 hover:bg-violet-700 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {isSignup ? "Create account" : "Sign in"}
            </button>
          </div>
          <div className="flex mt-3 items-center justify-center">
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
            <div className="text-white text-sm font-semibold ml-2">Trust This Device</div>
          </div>
        </form>

        <div className="my-2">
          {error ? (<div className="text-red-500 text-center">{error}</div>) : <span></span>}
        </div>  

        <div className="mt-2 text-center text-sm text-gray-400 font-medium">
          {!isSignup ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={handleToggle}
            className="font-semibold leading-6 text-violet-600 hover:text-violet-400"
          >
            {!isSignup ? "Create an account" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
