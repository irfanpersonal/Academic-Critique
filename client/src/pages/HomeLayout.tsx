import {Navbar} from '../components';
import {Outlet} from 'react-router-dom';

const HomeLayout: React.FunctionComponent = () => {
    return (
        <>
            <Navbar/>
            <section className="p-4 border-t-2 rounded-l-2xl rounded-r-2xl rounded-bl-none rounded-br-none bg-gray-300 min-h-screen">
                <Outlet/>
            </section>
        </>
    );
}

export default HomeLayout;