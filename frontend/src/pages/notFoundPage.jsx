export default function NotFoundPage() {
    return (
        <main className="flex h-screen justify-center">
            <div className="grid flex-1 place-items-center bg-black py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                <img 
                    alt="Logo" 
                    src="/ShieldLogoGray.svg" 
                    className="w-28 mx-auto"
                />
                <h2 className="mt-4 text-md font-bold tracking-tight text-white sm:text-xl">404</h2>
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">Page not found</h1>
                <div className="mt-7 flex items-center justify-center">
                <a
                    href="/"
                    className="rounded-md bg-purple-700 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Go back home
                </a>
                </div>
            </div>
            </div>
        </main>
    )
  }
  