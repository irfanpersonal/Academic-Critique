import React from 'react';
import auth_background from '../images/auth_background.jpg';
import useStore from '../utils/redux';
import {useNavigate} from 'react-router-dom';
import {FaArrowLeft, FaBook} from 'react-icons/fa';
import {toggleAuthType} from '../features/user/userSlice';
import {registerUser, loginUser} from '../features/user/userThunk';
import {RegisterBox, LoginBox} from '../components';

const Auth: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const {dispatch, selector} = useStore();
    const {authenticationData: {wantsToRegister, authLoading}, userData: {id}} = selector.user;
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        if (wantsToRegister) {
            formData.append('username', (target.elements.namedItem('username') as HTMLInputElement).value);
            formData.append('email', (target.elements.namedItem('email') as HTMLInputElement).value);
            formData.append('password', (target.elements.namedItem('password') as HTMLInputElement).value);
            formData.append('country', (target.elements.namedItem('country') as HTMLInputElement).value);
            dispatch(registerUser(formData));
            return;
        }
        formData.append('email', (target.elements.namedItem('email') as HTMLInputElement).value);
        formData.append('password', (target.elements.namedItem('password') as HTMLInputElement).value);
        dispatch(loginUser(formData));
    }
    React.useEffect(() => {
        if (id) {
            navigate('/');
            return;
        }
    }, [id, navigate])
    return (
        <div className="flex">
            <form className={`w-1/2 h-screen ${wantsToRegister ? 'overflow-scroll p-4' : 'p-32'}`} onSubmit={handleSubmit}>
                <div className="flex items-center">
                    <div onClick={() => {
                        navigate('/');
                    }} className="mr-4 outline rounded-full p-4 cursor-pointer hover:bg-black hover:text-white"><FaArrowLeft/></div>
                    <span className="inline-block bg-gray-400 p-4 rounded-2xl"><FaBook color='rgba(120, 194, 250, 1.0)' size='3rem'/></span>
                </div>
                <h1 className='mt-4 text-2xl font-bold'>{wantsToRegister ? 'Get Started' : 'Welcome back'}</h1>
                <p>{wantsToRegister ? `Welcome to Academic Critique - Let's create your account` : 'Please log in to access your account and continue exploring'}</p>
                <div className="border-b-4 mt-8"></div>
                {wantsToRegister ? (
                    <RegisterBox/>
                ) : (
                    <LoginBox/>
                )}
                <button className={`${authLoading ? 'bg-gray-400 text-black' : 'bg-black text-white'} w-full mt-8 p-2 rounded-lg`} type="submit" disabled={authLoading}>{wantsToRegister ? 'Sign up' : 'Sign in'}</button>
                <p className="mt-4 text-center">{wantsToRegister ? <span className="text-gray-400">Already have an account? <span onClick={() => dispatch(toggleAuthType())} className='font-bold cursor-pointer text-black'>Log in</span></span> : <span className="text-gray-400">Don't have an account? <span onClick={() => dispatch(toggleAuthType())} className='font-bold cursor-pointer text-black'>Sign up</span></span>}</p>
            </form>
            <img src={auth_background} className="w-1/2 h-screen object-cover object-center p-4 rounded-3xl" alt="A cartoonish look of a cap, book, and pencil"/>
        </div>
    );
}

export default Auth;