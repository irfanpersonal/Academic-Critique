import {useRouteError, Link} from 'react-router-dom';
import notFound from '../images/not_found.png';

interface IError {
    status: number
}

const Error: React.FunctionComponent = () => {
    const error = useRouteError() as IError;
    if (error.status === 404) {
        return (
        <div className="flex flex-col justify-center items-center text-center w-screen h-screen">
            <img className="w-48 h-48 mb-4 rounded-full outline" src={notFound} alt="A chalkboard with some text saying 404 Not Found"/>
            <p className="mb-2">Oopsies, looks like you don't know where you're going. How about home?</p>
            <Link to="/" className="inline-block bg-white border border-black py-2 px-8 rounded-xl text-black no-underline hover:bg-black hover:text-white transition-colors duration-300">Back Home</Link>
        </div>
        );
    }
    return (
        <div className="flex flex-col justify-center items-center w-screen h-screen">
            <h1 className="text-2xl font-bold">Something went wrong, try again later!</h1>
        </div>
    );
};

export default Error;