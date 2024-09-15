import React from 'react';
import useStore from '../utils/redux';
import {countries} from '../utils/countries';
import {getAllUsers} from '../features/user/userThunk';
import {Loading, UsersList} from '../components';
import {FaSearch} from "react-icons/fa";
import {updateAllUsersSearchBoxValues} from '../features/user/userSlice';

const Users: React.FunctionComponent = () => {
    const dispatch = useStore().dispatch;
    const {getAllUsersLoading, allUsersData} = useStore().selector.user;
    React.useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch]);
    return (
        <div className="w-1/2 mx-auto">
            <div className="text-2xl font-semibold">Users</div>
            <p className="mt-4">Search for users to find specific individuals registered on the platform. You can filter the results by username or country to narrow down your search.</p>
            <div className="mt-4 flex items-center">
                <div onClick={() => {
                    (document.querySelector('#username') as HTMLInputElement).focus();
                }} className="flex border border-black items-center w-3/4 p-2 rounded-lg mr-2">
                    <span className="ml-2 mr-4"><FaSearch size='1rem'/></span>
                    <input id="username" name="username" onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                        if (event.key === 'Enter') {
                            dispatch(getAllUsers());
                        }
                    }} className="w-full outline-none bg-gray-300" value={allUsersData.searchBoxValues.username} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        dispatch(updateAllUsersSearchBoxValues({name: event.target.name, value: event.target.value}));
                    }} type="search"/>
                </div>
                <select name="country" value={allUsersData.searchBoxValues.country} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                    dispatch(updateAllUsersSearchBoxValues({name: event.target.name, value: event.target.value}));
                    dispatch(getAllUsers());
                }} className="outline bg-gray-300 rounded-lg w-1/4 flex justify-center items-center p-2 cursor-pointer select-none">
                    {countries.map(country => {
                        <option value="">Anywhere</option>
                        return (
                            <option key={country} value={country}>{country.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}</option>
                        );
                    })}
                </select>
            </div>
            {getAllUsersLoading ? (
                <Loading title="Loading All Users" position='normal' marginTop='2rem'/>
            ) : (
                <div className="mt-4">
                    <UsersList data={allUsersData.users}/>
                </div>
            )}
        </div>
    );
}

export default Users;