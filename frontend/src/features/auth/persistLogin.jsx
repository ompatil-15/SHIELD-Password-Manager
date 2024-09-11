import { Outlet, Link } from "react-router-dom"
import { useEffect, useRef, useState } from 'react'
import { useRefreshMutation } from "./authApiSlice"
import usePersist from "../../hooks/usePersist"
import { useSelector } from 'react-redux'
import { selectCurrentToken } from "./authSlice"
import LoadingPage from "../../pages/loadingPage"

const PersistLogin = () => {

    const [persist] = usePersist()
    const token = useSelector(selectCurrentToken)
    const effectRan = useRef(false)

    const [trueSuccess, setTrueSuccess] = useState(false)

    const [refresh, {
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation()


    useEffect(() => {

        if (effectRan.current === true || process.env.NODE_ENV !== 'development') { 

            const verifyRefreshToken = async () => {
                // console.log('verifying refresh token')
                try {
                    //const response = 
                    await refresh()
                    //const { accessToken } = response.data
                    setTrueSuccess(true)
                }
                catch (err) {
                    console.error(err)
                }
            }

            if (!token && persist) verifyRefreshToken()
        }

        return () => effectRan.current = true

        // eslint-disable-next-line
    }, [])


    let content
    if (!persist) { // persist: no
        // console.log('no persist')
        content = <Outlet />
    } else if (isLoading) { //persist: yes, token: no
        // console.log('loading')
        content = <LoadingPage />
    } else if (isError) { //persist: yes, token: no
        // console.log('error')
        content = (
            <div className='fixed inset-0 w-screen h-screen bg-black text-white z-50 flex justify-center items-center'>
                {error.data?.message}
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
    } else if (isSuccess && trueSuccess) { //persist: yes, token: yes
        // console.log('success')
        content = <Outlet />
    } else if (token && isUninitialized) { //persist: yes, token: yes
        // console.log('token and uninit')
        // console.log(isUninitialized)
        content = <Outlet />
    }

    return content
}
export default PersistLogin