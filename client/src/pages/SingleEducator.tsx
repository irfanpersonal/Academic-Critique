import React from 'react';
import useStore from '../utils/redux';
import {Loading, EditEducator, Reviews} from '../components';
import {useNavigate, useParams} from "react-router-dom";
import {deleteSingleEducator, getSingleEducator} from "../features/educators/educatorsThunk";
import {FaArrowLeft, FaDotCircle, FaEdit, FaBook, FaTrash} from 'react-icons/fa';
import {toggleIsEditingEducator} from '../features/educators/educatorsSlice';
import {setFromEducatorPage, updateSearchBoxValues} from '../features/courses/coursesSlice';

const statusColors: any = {
    ACTIVE: 'rgb(0, 255, 0)',       
    INACTIVE: 'rgb(128, 128, 128)', 
    ON_LEAVE: 'rgb(255, 165, 0)',   
    RETIRED: 'rgb(255, 0, 0)'       
};

const SingleEducator: React.FunctionComponent = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const dispatch = useStore().dispatch;
    const userData = useStore().selector.user.userData;
    const {loaders, singleEducatorData, isEditingEducator} = useStore().selector.educators;
    React.useEffect(() => {
        const fetchSingleEducator = async() => {
            try {
                await dispatch(getSingleEducator(id!)).unwrap();
            }
            catch(error: any) {
                navigate('/educators');
            }
        }
        fetchSingleEducator();
    }, [dispatch, navigate, id]);
    return (
        <div>
            {loaders.getSingleEducatorLoading ? (
                <Loading title="Loading Single Educator" position='normal' marginTop='1rem'/>
            ) : (
                <>
                    <div onClick={() => {
                        window.scroll({top: 0, behavior: 'smooth'});
                        navigate('/educators');
                        if (isEditingEducator) {
                            dispatch(toggleIsEditingEducator());
                        }
                    }} className="inline-flex justify-start items-center mb-4">
                        <span className="mr-4 cursor-pointer"><FaArrowLeft/></span>
                        <div className="cursor-pointer">Educators</div>
                    </div>
                    <div className="border-b-2 mb-4"></div>
                    {isEditingEducator ? (
                        <EditEducator data={singleEducatorData!}/>
                    ) : (
                        <>
                            <div className="p-4">
                                <div className="flex items-center space-x-4 mb-6">
                                    <img src={singleEducatorData!.image} alt={singleEducatorData!.name} className="w-24 h-24 object-cover rounded-full border border-gray-300 outline"/>
                                    <div>
                                        <h2 className="text-2xl font-semibold text-gray-900">{singleEducatorData!.name}</h2>
                                        <p className="text-gray-600">{singleEducatorData!.department.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}</p>
                                        <p className="text-gray-500 flex items-center"><span className="mr-2"><FaDotCircle color={`${statusColors[singleEducatorData!.status]}`}/></span>{singleEducatorData!.status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}</p>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-xl font-semibold text-gray-700">Description</h3>
                                    <p className="text-gray-600 bg-white p-2 mt-4">{singleEducatorData!.description}</p>
                                    <p className="text-gray-600 bg-white p-2 mt-4">{singleEducatorData!.rating}/5</p>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-xl font-semibold text-gray-700">Contact Information</h3>
                                    <div className="bg-white p-2 mt-4">
                                        <p className="text-gray-600">Email: <a href={`mailto:${singleEducatorData!.email}`} className="text-blue-500">{singleEducatorData!.email}</a></p>
                                        <p className="text-gray-600">Institution Email: <a href={`mailto:${singleEducatorData!.institution.contact_email}`} className="text-blue-500">{singleEducatorData!.institution.contact_email}</a></p>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-xl font-semibold text-gray-700">Institution</h3>
                                    <div className="bg-white p-2 mt-4">
                                        <p className="text-gray-600">Name: {singleEducatorData!.institution.name}</p>
                                        <p className="text-gray-600">Country: {singleEducatorData!.institution.country.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}</p>
                                        <p className="text-gray-600">Website: <a href={singleEducatorData!.institution.website} className="text-blue-500">{singleEducatorData!.institution.website}</a></p>
                                        <p className="text-gray-600">Rating: {singleEducatorData!.institution.rating === 0 ? 'No Rating' : `${singleEducatorData!.institution.rating}/5`}</p>
                                        <p className="underline cursor-pointer" onClick={() => {
                                            window.scroll({top: 0, behavior: 'smooth'});
                                            navigate(`/institutions/${singleEducatorData!.institution_id}`);
                                        }}>View More Information</p>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-xl font-semibold text-gray-700">Courses</h3>
                                    <div className="bg-white p-2 mt-4">
                                        <p className="text-gray-600">Total Courses: {singleEducatorData!.course_stats.total_courses}</p>
                                        <p className="text-gray-600">Average Cost: ${singleEducatorData!.course_stats.average_cost}</p>
                                        <p className="underline cursor-pointer" onClick={() => {
                                            window.scroll({top: 0, behavior: 'smooth'});
                                            dispatch(updateSearchBoxValues({name: 'educator_id', value: singleEducatorData!.id}));
                                            navigate(`/courses`);
                                        }}>View More Information</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-4">
                                {(userData.role === 'OWNER' || userData.role === 'ADMIN') && (
                                    <>
                                        <div onClick={() => {
                                            window.scroll({top: 0, behavior: 'smooth'});
                                            dispatch(toggleIsEditingEducator());
                                        }} className="p-4 outline bg-green-500 text-white hover:bg-black hover:text-white cursor-pointer"><FaEdit/></div>
                                        <div onClick={() => {
                                            window.scroll({top: 0, behavior: 'smooth'});
                                            dispatch(setFromEducatorPage({educator_name: singleEducatorData!.name, educator_id: id!, institution_name: singleEducatorData!.institution.name, institution_id: singleEducatorData!.institution_id}));
                                            navigate('/courses/add');
                                        }} className="p-4 outline bg-gray-500 text-white hover:bg-black hover:text-white cursor-pointer"><FaBook/></div>
                                        <div onClick={async() => {
                                            if (loaders.deleteSingleEducatorLoading) {
                                                return;
                                            }
                                            try {
                                                await dispatch(deleteSingleEducator(id!)).unwrap();
                                                navigate('/educators');
                                                window.scroll({top: 0, behavior: 'smooth'});
                                            }
                                            catch(error: any) {}
                                        }} className={`p-4 outline bg-red-500 text-white hover:bg-black hover:text-white cursor-pointer ${loaders.deleteSingleEducatorLoading ? 'bg-gray-500' : ''}`}><FaTrash/></div>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </>
            )}
            <Reviews type='EDUCATOR' type_id={id!}/>
        </div>
    );
}

export default SingleEducator;