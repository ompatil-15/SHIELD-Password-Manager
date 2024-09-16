import { Link } from "react-router-dom"

const LoginAgain = () => {
  return (
    <div className='fixed inset-0 w-screen h-screen bg-black text-white z-50 flex justify-center items-center'>
                    <div className="flex w-screen h-screen bg-black text-white fixed justify-center items-center">
                        <div className="flex-col">
                            <img 
                                src="/ShieldLogoGray.svg"
                                alt="SHIELD"
                                className="w-40 mb-10"
                            ></img>
                            <Link to="/auth">
                                <div className="bg-violet-900 py-2 px-4 text-md font-semibold rounded-md">Please login again</div>
                            </Link>
                        </div>
                    </div>
            </div>
  )
}

export default LoginAgain
