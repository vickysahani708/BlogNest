import React from 'react'
import { Button } from './ui/button'
import { FcGoogle } from "react-icons/fc"
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '@/helper/firebase/firebase'
import { RouteIndex } from '@/helper/RouteName'
import { showToast } from '@/helper/showtoast';
import { getenv } from '@/helper/getenv';
import { useNavigate } from 'react-router-dom'
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/user/user.slice";

export default function GoogleLogin() {
    const navigate = useNavigate()
    const dispath = useDispatch()
    const handleLogin = async () => {

        try {
            const googleResponse = await signInWithPopup(auth, provider)
            const user = googleResponse.user
            const bodyData = {
                name: user.displayName,
                email: user.email,
                avatar: user.photoURL
            }
            const res = await fetch(`${getenv('VITE_API_BASE_URL')}/auth/google-signin`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData),
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 400 || res.status === 404) {
                    showToast('error', data.message || 'Invalid email or password')
                }
                else {
                    showToast('error', data.message || 'Signin failed');
                }
                return;
            }

            dispath(setUser(data.user))
            navigate(RouteIndex);
            showToast('success', 'Signin successful');
        } catch (err) {
            showToast('error', err.message || 'Something went wrong');
        }
    };
    

    return (
        <Button variant='outline' onClick={handleLogin} className='w-full py-3 text-base flex items-center justify-center gap-2'>
            <FcGoogle />
            Continue with Google
        </Button>
    )
}
