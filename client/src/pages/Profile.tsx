import React from 'react';
import useStore from "../utils/redux";
import {FaLink, FaChartArea} from 'react-icons/fa';
import {toast} from 'react-toastify';
import {Loading, EditProfile, ProfileData} from '../components';
import {getProfileData, logoutUser} from "../features/user/userThunk";
import {FaEdit, FaTimes} from 'react-icons/fa';
import {toggleEditingProfile} from '../features/user/userSlice';
import {useNavigate} from 'react-router-dom';

const Profile: React.FunctionComponent = () => {
    const {dispatch} = useStore();
    const navigate = useNavigate();
    const {getProfileDataLoading, editingProfile, userData, authenticationData: {logoutLoading}} = useStore().selector.user;
    React.useEffect(() => {
        dispatch(getProfileData());
    }, [dispatch]);
    return (
        <div>
            {getProfileDataLoading ? (
                <Loading title="Loading Profile Data" position="normal" marginTop="1rem"/>
            ) : (
                <>
                    <div className="flex justify-between items-center border-b-4 pb-4">
                        <div className="text-2xl">Account Details</div>
                        <div className="flex">
                            {userData.role === 'OWNER' && (
                                <div onClick={() => {
                                    navigate('/overview');
                                }} className="mr-4 flex justify-center items-center cursor-pointer outline py-2 px-4 rounded-lg hover:text-gray-500 active:bg-black active:text-white select-none"><FaChartArea size='1.25rem' className="mr-4"/>Overview</div>
                            )}
                            {userData.role === 'USER' && (
                                <div onClick={() => {
                                    dispatch(toggleEditingProfile());
                                }} className="mr-4 flex justify-center items-center cursor-pointer outline py-2 px-4 rounded-lg hover:text-gray-500 active:bg-black active:text-white select-none">{editingProfile ? (<FaTimes size='1.25rem' className="mr-4"/>) : (<FaEdit size='1.25rem' className="mr-4"/>)}{editingProfile ? 'Cancel' : 'Edit'}</div>
                            )}
                            {userData.role === 'USER' && (
                                <div onClick={async() => {
                                    await navigator.clipboard.writeText(`${window.location.origin}/users/${userData.username}`);
                                    toast.success('Copied Link!');
                                }} className="flex justify-center items-center cursor-pointer outline py-2 px-4 rounded-lg hover:text-gray-500 active:bg-black active:text-white select-none"><FaLink size='1.25rem' className="mr-4"/>Copy Link</div>
                            )}
                        </div>
                    </div>
                    {editingProfile ? (
                        <EditProfile data={userData}/>
                    ) : (
                        <ProfileData data={userData}/>
                    )}
                    {userData.role === 'USER' && (
                        <div className="w-1/2 mx-auto mt-4 text-center">
                            <div onClick={() => {
                                navigate('/profile/updatePassword');
                            }} className="cursor-pointer inline-block hover:text-gray-400">Change password</div>
                        </div>
                    )}
                    <div onClick={async() => {
                        if(logoutLoading) {
                            return;
                        }
                        await dispatch(logoutUser()).unwrap();
                        window.scroll({top: 0, behavior: 'smooth'});
                        navigate('/');
                        toast.success('Successfully Logged Out!');
                    }} className="select-none cursor-pointer w-1/2 mx-auto outline mt-4 p-2 bg-red-500 text-white text-center rounded-lg active:text-white active:bg-black">Log out</div>
                </>
            )}
        </div>
    );
}

export default Profile;