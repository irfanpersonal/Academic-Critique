import useStore from '../utils/redux'

const LoginBox: React.FunctionComponent = () => {
    const {incorrect, notProvided, text} = useStore().selector.user.authenticationData.authError;
    return (
        <>
            <div className="mt-4 flex flex-col">
                <label htmlFor="email" className="font-semibold">Email</label>
                <input className={`outline mt-2 p-2 rounded-md focus:outline-black ${notProvided?.includes('email') ? 'outline-red-800' : ''}`} id="email" type="email" name="email"/>
                {incorrect?.includes('email') && <p className="mt-2 text-red-700">{text}</p>}
                {notProvided?.includes('email') && <p className="mt-2 text-red-700">Please provide a value for email!</p>}
            </div>
            <div className="mt-4 flex flex-col">
                <label htmlFor="password" className="font-semibold">Password</label>
                <input className={`outline mt-2 p-2 rounded-md focus:outline-black ${notProvided?.includes('email') ? 'outline-red-800' : ''}`} id="password" type="password" name="password"/>
                {incorrect?.includes('password') && <p className="mt-2 text-red-700">{text}</p>}
                {notProvided?.includes('password') && <p className="mt-2 text-red-700">Please provide a value for password!</p>}
            </div>
        </>
    );
}

export default LoginBox;