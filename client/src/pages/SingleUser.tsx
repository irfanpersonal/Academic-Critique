import React from 'react';
import useStore from '../utils/redux';
import {useNavigate, useParams} from "react-router-dom";
import {getSingleUser} from '../features/user/userThunk';
import {Loading, ProfileData} from '../components';
import {FaArrowLeft} from 'react-icons/fa';

const SingleUser: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const dispatch = useStore().dispatch;
    const {getSingleUserLoading, singleUserData} = useStore().selector.user;
    const {username} = useParams();
    React.useEffect(() => {
        const fetchSingleUser = async() => {
            try {
                await dispatch(getSingleUser(username!)).unwrap();
            }
            catch(error: any) {
                return navigate('/users');
            }
        }
        fetchSingleUser();
    }, [dispatch, navigate, username]);
    if (getSingleUserLoading) {
        return (
            <Loading title="Loading Single User" position='normal' marginTop='1rem'/>
        );
    }
    return (
        <div>
            <div onClick={() => {
                window.scroll({top: 0, behavior: 'smooth'});
                navigate('/users');
            }} className="inline-flex justify-start items-center mb-4">
                <span className="mr-4 cursor-pointer"><FaArrowLeft/></span>
                <div className="cursor-pointer">Users</div>
            </div>
            <div className="border-b-2 mb-4"></div>
            <ProfileData data={singleUserData}/>
        </div>
    );
}

export default SingleUser;