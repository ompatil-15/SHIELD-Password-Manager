
const LoadingPage = () => {
  return (
    <main>
      <div className="fixed inset-0 w-screen h-screen bg-black text-white z-50 flex justify-center items-center">
        <div className="flex-col items-center justify-center">
          <img 
              src="/ShieldLogoGray.svg"
              alt="SHIELD"
              className="w-40 mb-10"
          ></img>
          <div className="flex justify-center font-semibold">Loading...</div>
        </div>
      </div>
    </main>
  )
}

export default LoadingPage;