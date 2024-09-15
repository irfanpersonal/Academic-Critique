import React from 'react';
import useStore from '../utils/redux';
import {getOverviewData} from '../features/admin/adminThunk';
import {Loading, ChartData} from '../components';
import {FaUser, FaBuilding} from "react-icons/fa";
import {GiTeacher} from "react-icons/gi";
import {TbBooks} from "react-icons/tb";
import {MdOutlineRateReview} from "react-icons/md";
import {useNavigate} from 'react-router-dom';

const Overview: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const {dispatch} = useStore();
    const {loaders, errors, overviewData} = useStore().selector.admin;
    React.useEffect(() => {
        dispatch(getOverviewData());
    }, [dispatch]);
    if (loaders.getOverviewDataLoading) {
        return (
            <Loading title="Loading Overview Data" position='normal' marginTop='1rem'/>
        );
    }
    return (
        <div>
            {errors.getOverviewDataError ? (
                <h1>Failed to Fetch Overview Data</h1>
            ) : (
                <>
                    <div className="text-2xl">Overview</div>
                    <p className="mt-2 text-gray-500">Get the data you need, fast! Access information quickly when it matters most.</p>
                    <div className="grid grid-rows-1 grid-cols-3 gap-4 mt-8">
                        <div className="outline p-4 rounded-lg">
                            <h1 className="text-2xl">Total Users</h1>
                            <p className="text-gray-500 mt-2">Explore the growing community of students and educators contributing to academic reviews.</p>
                            <div className="flex justify-between items-center">
                                <div className="mt-4 text-3xl text-sky-400">{overviewData!.user_count}</div>
                                <div className="flex justify-center items-center"><FaUser size='1.5rem'/></div>
                            </div>
                        </div>
                        <div className="outline p-4 rounded-lg">
                            <h1 className="text-2xl">Total Institutions</h1>
                            <p className='text-gray-500 mt-2'>Discover institutions rated by students for their courses and teaching quality.</p>
                            <div className="flex justify-between items-center">
                                <div className="mt-4 text-3xl text-sky-400">{overviewData!.institution_count}</div>
                                <div className="flex justify-center items-center"><FaBuilding size='1.5rem'/></div>
                            </div>
                        </div>
                        <div className="outline p-4 rounded-lg">
                            <h1 className="text-2xl">Total Educators</h1>
                            <p className='text-gray-500 mt-2'>Learn about educators through detailed reviews and course feedback.</p>
                            <div className="flex justify-between items-center">
                                <div className="mt-4 text-3xl text-sky-400">{overviewData!.educator_count}</div>
                                <div className="flex justify-center items-center"><GiTeacher size='1.5rem'/></div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-rows-1 grid-cols-3 gap-4 mt-8">
                        <div className="outline p-4 rounded-lg">
                            <h1 className="text-2xl">Total Courses</h1>
                            <p className="text-gray-500 mt-2">Explore the growing number of courses available through our platform. Discover new opportunities and enhance your learning experience with detailed reviews from fellow students.</p>
                            <div className="flex justify-between items-center">
                                <div className="mt-4 text-3xl text-sky-400">{overviewData!.user_count}</div>
                                <div className="flex justify-center items-center"><TbBooks size='1.5rem'/></div>
                            </div>
                        </div>
                        <div className="outline p-4 rounded-lg">
                            <h1 className="text-2xl">Total Reviews</h1>
                            <p className='text-gray-500 mt-2'>Read through a wealth of reviews submitted by students about various institutions, courses, and educators. Your insights help others make informed decisions about their academic journey.</p>
                            <div className="flex justify-between items-center">
                                <div className="mt-4 text-3xl text-sky-400">{overviewData!.institution_count}</div>
                                <div className="flex justify-center items-center"><MdOutlineRateReview size='1.5rem'/></div>
                            </div>
                        </div>
                        <div className="outline p-4 rounded-lg">
                            <h1 className="text-2xl">Quick Actions</h1>
                            <p onClick={() => {
                                navigate('/overview/generate-admin');
                            }} className="my-2 bg-gray-400 p-2 rounded-lg outline select-none hover:text-white hover:bg-black cursor-pointer">Create Admin Account</p>
                            <p onClick={() => {
                                navigate('/users');
                            }} className="my-2 bg-gray-400 p-2 rounded-lg outline select-none hover:text-white hover:bg-black cursor-pointer">Browse All Users</p>
                            <p onClick={() => {
                                navigate('/profile')
                            }} className="my-2 bg-gray-400 p-2 rounded-lg outline select-none hover:text-white hover:bg-black cursor-pointer">Access Profile Information</p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <ChartData data={overviewData!.chart_data}/>
                    </div>
                </>
            )}
        </div>
    );
}

export default Overview;