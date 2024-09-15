import React from 'react';
import useStore from '../utils/redux';
import {NavLink} from 'react-router-dom';
import {FaBook, FaUserAlt, FaBars, FaTimes} from "react-icons/fa";

const Navbar: React.FunctionComponent = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
    const userData = useStore().selector.user.userData;
    React.useEffect(() => {
        const handleResize = () => {
            // If the Screen Size is larger than the md TailwindCSS value than we close the menu.
            if (window.innerWidth > 768) { 
                setIsMenuOpen(false);
            }
        };
        // Add Event Listener
        window.addEventListener('resize', handleResize);
        // Initial check
        handleResize();
        // Remove Event Listener when the Component Unmounts (go to auth page)
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);
    return (
        <nav className="flex flex-col">
            <div className="p-4 text-black flex justify-between items-center bg-white">
                <div className="flex items-center">
                    <button className="mr-4 text-gray-500 lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <FaTimes size="1.25rem" className='hover:text-red-400'/> : <FaBars size="1.25rem" className="hover:text-gray-400"/>}</button>
                    <NavLink className="font-bold flex items-center" to='/'>
                        <span className="mr-2"><FaBook size="1.25rem" color="rgba(120, 194, 250, 1.0)"/></span>Academic Critique
                    </NavLink>
                </div>
                <div className={`hidden sm:hidden md:hidden lg:block xl:block 2xl:block`}>
                    <NavLink className={({isActive}) => `ml-0 lg:ml-4 px-4 py-2 rounded-2xl ${isActive ? 'bg-sky-200' : 'bg-gray-300'}`} to='/'>Home</NavLink>
                    <NavLink className={({isActive}) => `ml-0 lg:ml-4 px-4 py-2 rounded-2xl ${isActive ? 'bg-sky-200' : 'bg-gray-300'}`} to='/institutions'>Institutions</NavLink>
                    <NavLink className={({isActive}) => `ml-0 lg:ml-4 px-4 py-2 rounded-2xl ${isActive ? 'bg-sky-200' : 'bg-gray-300'}`} to='/educators'>Educators</NavLink>
                    <NavLink className={({isActive}) => `ml-0 lg:ml-4 px-4 py-2 rounded-2xl ${isActive ? 'bg-sky-200' : 'bg-gray-300'}`} to='/courses'>Courses</NavLink>
                    <NavLink className={({isActive}) => `ml-0 lg:ml-4 px-4 py-2 rounded-2xl ${isActive ? 'bg-sky-200' : 'bg-gray-300'}`} to='/users'>Users</NavLink>
                </div>
                <div className="flex items-center lg:mt-0">
                    {userData.id ? (
                        <NavLink className="flex items-center outline rounded-full px-4 py-2" to='/profile'>
                            <span className="mr-2"><FaUserAlt /></span>
                            {userData.role === 'USER' ? `${userData.username}` : userData.role === 'ADMIN' ? 'Admin' : 'Owner'}
                        </NavLink>
                    ) : (
                        <NavLink className="flex items-center outline rounded-full px-4 py-2" to='/auth'>
                            <span className="mr-2"><FaUserAlt /></span>Register/Login
                        </NavLink>
                    )}
                </div>
            </div>
            {isMenuOpen && (
                <div className="flex flex-col mb-4">
                    <NavLink className={({isActive}) => `p-2 ${isActive ? 'bg-sky-200' : 'bg-gray-300'}`} to='/'>Home</NavLink>
                    <NavLink className={({isActive}) => `p-2 ${isActive ? 'bg-sky-200' : 'bg-gray-300'}`} to='/institutions'>Institutions</NavLink>
                    <NavLink className={({isActive}) => `p-2 ${isActive ? 'bg-sky-200' : 'bg-gray-300'}`} to='/educators'>Educators</NavLink>
                    <NavLink className={({isActive}) => `p-2 ${isActive ? 'bg-sky-200' : 'bg-gray-300'}`} to='/courses'>Courses</NavLink>
                    <NavLink className={({isActive}) => `p-2 ${isActive ? 'bg-sky-200' : 'bg-gray-300'}`} to='/users'>Users</NavLink>
                </div>
            )}
        </nav>
    );
}

export default Navbar;