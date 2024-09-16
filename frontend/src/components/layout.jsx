import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useSendLogoutMutation } from '../features/auth/authApiSlice'
import LoadingPage from '../pages/loadingPage'
import { toast } from 'sonner'
import LoginAgain from '../pages/loginAgain'
import { useSelector } from 'react-redux'
import { selectCurrentId } from '../features/auth/authSlice'

const user = {
  imageUrl: '/ShieldLogoGray.svg',
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Layout() {
  const id = useSelector(selectCurrentId);
  const location = useLocation();
  const navigate = useNavigate();

  const [sendLogout, {
    isLoading,
    isError,
  }] = useSendLogoutMutation();

  const userNavigation = id
    ? [{ name: 'Sign out', action: () => {
        toast.success('Successfully logged out!', { position: 'bottom-left' });
        navigate('/auth');
        sendLogout().then(() => {
          // window.location.reload();
        }).catch(err => {
          toast.error(err?.data?.message || 'An unexpected error occurred', { position: 'bottom-left' });
        });
      }}]
    : [{ name: 'Login', action: () => window.location.href = '/auth' }];

  const navigation = [
    { name: 'Personal Information', href: '/personal-information', current: location.pathname.includes('/personal-information') },
    { name: 'Passwords', href: '/passwords', current: location.pathname.includes('/passwords') },
    { name: 'Notes', href: '/notes', current: location.pathname.includes('/notes') },
  ]

  if (isLoading) return <LoadingPage />;
  if (isError && !id) return <LoginAgain />;
  
  return (
    <div className="flex min-h-screen flex-col text-zinc-300">
      {/* Navbar */}
      <Disclosure as="nav" className="bg-primary lg:fixed lg:top-0 lg:left-0 lg:right-0 lg:z-50">
        <div className="mx-auto px-4 sm:px-6">
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
              {/* <div className="hidden md:block"> */}
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
              {/* </div> */}
            </div>
            <div className="hidden lg:block">
              <div className="flex items-center">

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <div>
                    <MenuButton className="relative flex max-w-xs items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img alt="" src={user.imageUrl} className="h-8 w-8 rounded-full" />
                    </MenuButton>
                  </div>
                  <MenuItems
                    transition
                    className="absolute -right-3 z-40 w-24 mt-1 flex-col justify-center text-center origin-top-right rounded-md bg-violet-950 font-semibold shadow-lg ring-1 ring-black ring-opacity-5 transition-transform duration-200 ease-out"
                  >
                    {userNavigation.map((item) => (
                      <MenuItem key={item.name}>
                        <button
                          onClick={item.action}
                          className="px-4 py-2 text-sm"
                        >
                          {item.name}
                        </button>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>
            </div>
            <div className="-mr-2 flex lg:hidden">
              {/* Mobile menu button */}
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
              </DisclosureButton>
            </div>
          </div>
        </div>

        <DisclosurePanel className="lg:hidden">
          <div className="pb-3 pt-2">
            {navigation.map((item) => (
              <Link to={item.href} key={item.name}>
                <DisclosureButton
                  // href={item.href}
                  aria-current={item.current ? 'page' : undefined}
                  className={classNames(
                    item.current ? 'w-full text-start bg-secondary text-white' : ' hover:text-white text-gray-300',
                    'block px-5 py-2 text-base font-medium'
                  )}
                >
                  {item.name}
                </DisclosureButton>
              </Link>
            ))}
          </div>
          <div className="border-t z-40 border-gray-700 pb-3">
            <div className="mt-3 px-5">
              {userNavigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  onClick={item.action}
                  className="block rounded-md text-base font-medium hover:text-white"
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
        <div className="hidden lg:flex md:w-64 md:flex-col bg-primary lg:fixed lg:top-16 lg:bottom-0 lg:z-40">
          <nav className="flex-1">
            {navigation.map((item) => (
              <Link to={item.href}
                key={item.name}
                // href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                  item.current ? 'bg-violet-950 text-white' : 'text-gray-300 hover:bg-zinc-800 hover:text-white',
                  'block rounded-r-full py-2.5 px-5 text-sm font-medium'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <main className="flex-1 bg-primary lg:pt-16 lg:ml-64">
          <div className="mx-auto max-w-7xl">
            <Outlet />  
          </div>
        </main>
      </div>
    </div>
  )
}
