import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { useSendLogoutMutation } from '../features/auth/authApiSlice'
import { useEffect } from 'react'
import LoadingPage from '../pages/loadingPage'
import { toast } from 'sonner'

const user = {
  imageUrl: '/ShieldLogoGray.svg',
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Layout() {
  const { id } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const userNavigation = [  
    { name: id === '' ? 'Login' : 'Sign out', href: '/' },
  ]

  const navigation = [
    { name: 'Personal Information', href: '/personal-information', current: location.pathname.includes('/personal-information') },
    { name: 'Passwords', href: '/passwords', current: location.pathname.includes('/passwords') },
    { name: 'Notes', href: '/notes', current: location.pathname.includes('/notes') },
  ]

  const [sendLogout, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) navigate('/')
  }, [isSuccess, navigate])

  if(isLoading) return <LoadingPage />
  if(isError) toast.error(error?.data?.message || "An unexpected error occureed", {position: "bottom-left"})
  
  return (
    <div className="flex min-h-screen flex-col text-zinc-300">
      {/* Navbar */}
      <Disclosure as="nav" className="bg-primary">
        <div className="mx-auto px-4 sm:px-6 lg:px-5 lg:pr-10">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link to="/">
                <div className="text-lg font-extrabold font-gordita">
                  {/* <img
                    alt="SHIELD"
                    src="/ShieldLogoGray.svg"
                    className="h-8 w-8"
                  /> */}
                  SHIELD Password Manager
                </div>
              </Link>
              <div className="hidden md:block">
                {/* <div className="ml-10 flex items-baseline space-x-4">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      aria-current={item.current ? 'page' : undefined}
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium'
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div> */}
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative flex max-w-xs items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img alt="" src={user.imageUrl} className="h-8 w-8 rounded-full" />
                    </MenuButton>
                  </div>
                  <MenuItems
                    transition
                    className="absolute z-40 right-0 w-28 flex justify-center text-center origin-top-right rounded-md bg-violet-950 font-semibold shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    {userNavigation.map((item) => (
                      <MenuItem key={item.name}>
                        <button
                          onClick={() => sendLogout()}
                          className="block px-4 py-2 text-sm"
                        >
                          {item.name}
                        </button>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              {/* Mobile menu button */}
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
              </DisclosureButton>
            </div>
          </div>
        </div>

        <DisclosurePanel className="md:hidden">
          <div className="pb-3 pt-2">
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                  item.current ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'block px-5 py-2 text-base font-medium'
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
          </div>
          <div className="border-t z-40 border-gray-700 pb-3">
            <div className="mt-3 px-5">
              {userNavigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  onClick={() => sendLogout()}
                  className="block rounded-md text-base font-medium hover:bg-gray-700 hover:text-white"
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </div>
        </DisclosurePanel>
      </Disclosure>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden lg:flex md:w-64 md:flex-col bg-primary">
          <nav className="flex-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                  item.current ? 'bg-violet-950 text-white' : 'text-gray-300 hover:bg-zinc-800 hover:text-white',
                  'block rounded-r-full py-2.5 px-5 text-sm font-medium'
                )}
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <main className="flex-1 bg-primary">
          <div className="mx-auto max-w-7xl">
            <Outlet />  
          </div>
        </main>
      </div>
    </div>
  )
}
