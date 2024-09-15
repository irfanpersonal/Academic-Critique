import React from 'react';
import useStore from '../utils/redux';
import {countries} from '../utils/countries';

const RegisterBox: React.FunctionComponent = () => {
    const {duplicate} = useStore().selector.user.authenticationData.authError;
    return (
        <>
            <div className="mt-4 flex flex-col">
                <label htmlFor="username" className="font-semibold">Username</label>
                <input className={`outline mt-2 p-2 rounded-md focus:outline-black ${duplicate?.includes('username') ? 'outline-red-800' : ''}`} id="username" type="text" name="username" required/>
                {duplicate?.includes('username') && <p>Someone already took that username.</p>}
            </div>
            <div className="mt-4 flex flex-col">
                <label htmlFor="email" className="font-semibold">Email</label>
                <input className={`outline mt-2 p-2 rounded-md focus:outline-black ${duplicate?.includes('email') ? 'outline-red-800' : ''}`} id="email" type="email" name="email" required/>
                {duplicate?.includes('email') && <p>Someone already took that email.</p>}
            </div>
            <div className="mt-4 flex flex-col">
                <label htmlFor="password" className="font-semibold">Password</label>
                <input className="outline mt-2 p-2 rounded-md focus:outline-black" id="password" type="password" name="password" required/>
            </div>
            <div className="mt-4 flex flex-col">
                <label htmlFor="country" className="font-semibold">Country</label>
                <select className="outline mt-2 p-2 rounded-md focus:outline-black" id="country" name="country" required>
                    <option value=""></option>
                    {countries.map(country => {
                        return (
                            <option key={country} value={country}>{country.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}</option>
                        );
                    })}
                </select>
            </div>
        </>
    );
}

export default RegisterBox;