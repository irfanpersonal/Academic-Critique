import React from 'react';
import useStore from '../utils/redux';
import {Loading, EditCourse, Reviews} from '../components';
import {useNavigate, useParams} from "react-router-dom";
import {deleteSingleCourse, getSingleCourse} from '../features/courses/coursesThunk';
import {FaArrowLeft, FaDotCircle, FaTimes, FaEdit, FaTrash} from 'react-icons/fa';
import {toggleIsEditingCourse} from '../features/courses/coursesSlice';

const statusColors: any = {
    ACTIVE: 'rgb(0, 255, 0)',       
    INACTIVE: 'rgb(128, 128, 128)', 
    ON_LEAVE: 'rgb(255, 165, 0)',   
    RETIRED: 'rgb(255, 0, 0)'       
};

const SingleCourse: React.FunctionComponent = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const dispatch = useStore().dispatch;
    const userData = useStore().selector.user.userData;
    const {loaders, singleCourseData, isEditingCourse} = useStore().selector.courses;
    const [isModalOpen, setModalOpen] = React.useState<boolean>(false);
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);
    React.useEffect(() => {
        const fetchSingleEducator = async() => {
            try {
                await dispatch(getSingleCourse(id!)).unwrap();
            }
            catch(error: any) {
                navigate('/educators');
            }
        }
        fetchSingleEducator();
        const closeSyllabus = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        }
        window.addEventListener('keydown', closeSyllabus);
        return () => {
            window.removeEventListener('keydown', closeSyllabus);
        }
    }, [dispatch, navigate, id]);
    return (
        <div>
            {loaders.getSingleCourseLoading ? (
                <Loading title="Loading Single Course" position='normal' marginTop='1rem'/>
            ) : (
                <>
                    <div onClick={() => {
                        window.scroll({top: 0, behavior: 'smooth'});
                        navigate('/courses');
                        if (isEditingCourse) {
                            dispatch(toggleIsEditingCourse());
                        }
                    }} className="inline-flex justify-start items-center mb-4">
                        <span className="mr-4 cursor-pointer"><FaArrowLeft/></span>
                        <div className="cursor-pointer">Courses</div>
                    </div>
                    <div className="border-b-2 mb-4"></div>
                    {isEditingCourse ? (
                        <EditCourse data={singleCourseData!}/>
                    ) : (
                        <>
                            <div className="p-4">
                                {/* Course Name and Code */}
                                <div className="flex flex-col mb-4">
                                    <h1 className="text-3xl font-bold text-gray-800">{singleCourseData!.name}</h1>
                                    <span className="text-sm text-gray-600">Code - {singleCourseData!.code}</span>
                                </div>
                                {/* Course Information */}
                                <div className="flex flex-col mb-4">
                                    <div className="bg-black border-white border-2 p-1 mb-4">
                                        <h3 className="font-semibold text-white text-xl border-b-2 border-white mb-2">Educator</h3>
                                        <div>
                                            <p className="text-white mb-2">Name - {singleCourseData!.educator.name}</p>
                                            <p className="text-white mb-2">Description - {singleCourseData!.educator.description}</p>
                                            <p className="text-white mb-2">Rating - {Number(singleCourseData!.educator.rating) === 0 ? 'No Rating' : `${singleCourseData!.educator.rating}/5`}</p>
                                            <p className="text-white flex items-center">Status - <span className="ml-2"><FaDotCircle title={singleCourseData!.educator.status} color={`${statusColors[singleCourseData!.educator.status]}`}/></span></p>
                                        </div>
                                    </div>
                                    <div className="bg-black border-white border-2 p-1 mb-4">
                                        <h3 className="font-semibold text-white text-xl border-b-2 border-white mb-2">Institution</h3>
                                        <div>
                                            <p className="text-white mb-2">Name - {singleCourseData!.institution.name}</p>
                                            <p className="text-white mb-2">Description - {singleCourseData!.institution.description}</p>
                                            <p className="text-white mb-2">Rating - {Number(singleCourseData!.institution.rating) === 0 ? 'No Rating' : `${singleCourseData!.institution.rating}/5`}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-rows-3 grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="font-semibold text-gray-700">Level</h3>
                                            <p className="text-gray-600">{singleCourseData!.level.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-700">Type</h3>
                                            <p className="text-gray-600">{singleCourseData!.type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-700">Format</h3>
                                            <p className="text-gray-600">{singleCourseData!.format.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-700">Capacity</h3>
                                            <p className="text-gray-600">{singleCourseData!.capacity}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-700">Cost</h3>
                                            <p className="text-gray-600">${singleCourseData!.cost}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-700">Rating</h3>
                                            <p className="text-gray-600">{singleCourseData!.rating}/5</p>
                                        </div>
                                    </div>
                                </div>
                                {/* View Syllabus Button */}
                                <div onClick={openModal} className="w-full text-center bg-gray-400 p-2 cursor-pointer outline hover:bg-stone-600 hover:text-white select-none">View Syllabus</div>
                                {/* Modal for PDF Syllabus */}
                                {isModalOpen && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
                                            <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-4">
                                                <h2 className="text-xl font-bold">Syllabus</h2>
                                                <button onClick={closeModal} className="text-gray-500 hover:text-red-500"><FaTimes size="1.25rem"/></button>
                                            </div>
                                            {/* View PDF Logic */}
                                            <iframe className="outline w-full h-96" src={`${process.env.REACT_APP_API_BASE_URL}${singleCourseData!.syllabus}`} title="Syllabus PDF"></iframe>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-between items-center p-4">
                                {(userData.role === 'OWNER' || userData.role === 'ADMIN') && (
                                    <>
                                        <div onClick={() => {
                                            window.scroll({top: 0, behavior: 'smooth'});
                                            dispatch(toggleIsEditingCourse());
                                        }} className="p-4 outline bg-green-500 text-white hover:bg-black hover:text-white cursor-pointer"><FaEdit/></div>
                                        <div onClick={async() => {
                                            if (loaders.deleteSingleCourseLoading) {
                                                return;
                                            }
                                            try {
                                                await dispatch(deleteSingleCourse(id!)).unwrap();
                                                navigate('/courses');
                                                window.scroll({top: 0, behavior: 'smooth'});
                                            }
                                            catch(error: any) {}
                                        }} className={`p-4 outline bg-red-500 text-white hover:bg-black hover:text-white cursor-pointer ${loaders.deleteSingleCourseLoading ? 'bg-gray-500' : ''}`}><FaTrash/></div>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </>
            )}
            <Reviews type='COURSE' type_id={id!}/>
        </div>
    );
}

export default SingleCourse;