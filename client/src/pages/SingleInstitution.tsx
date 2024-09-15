import React from 'react';
import useStore from "../utils/redux";
import {useNavigate, useParams} from 'react-router-dom';
import {Loading, EditInstitution, Reviews} from '../components';
import {deleteSingleInstitution, getSingleInstitution} from "../features/institutions/institutionsThunk";
import {FaArrowLeft, FaEdit, FaChalkboardTeacher, FaTrash} from 'react-icons/fa';
import {toggleIsEditingInstitution} from '../features/institutions/institutionsSlice';
import {setFromInstitutionPage, updateSearchBoxValues} from "../features/educators/educatorsSlice";
import {updateSearchBoxValues as updateCourseSearchBoxValues} from '../features/courses/coursesSlice';
import {toast} from 'react-toastify';

const SingleInstitution: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const dispatch = useStore().dispatch;
    const {id} = useParams();
    const {loaders, singleInstitutionData, isEditingInstitution} = useStore().selector.institutions;
    const userData = useStore().selector.user.userData;
    React.useEffect(() => {
        const fetchSingleInstitution = async() => {
            try {
                await dispatch(getSingleInstitution(id!)).unwrap();
            }
            catch(error: any) {
                navigate('/institutions');
            }
        }
        fetchSingleInstitution();
    }, [dispatch, id, navigate]);
    return (
        <div>
            {loaders.getSingleInstitutionLoading ? (
                <Loading title="Loading Single Institution" position='normal' marginTop='2rem'/>
            ) : (
                <div>
                    <div onClick={() => {
                        window.scroll({top: 0, behavior: 'smooth'});
                        navigate('/institutions');
                        if (isEditingInstitution) {
                            dispatch(toggleIsEditingInstitution());
                        }
                    }} className="inline-flex justify-start items-center mb-4">
                        <span className="mr-4 cursor-pointer"><FaArrowLeft/></span>
                        <div className="cursor-pointer">Institutions</div>
                    </div>
                    <div className="border-b-2 mb-4"></div>
                    {isEditingInstitution ? (
                        <EditInstitution data={singleInstitutionData!}/>
                    ) : (
                        <div>
                            <div className="relative">
                                <img src={singleInstitutionData!.image} alt={singleInstitutionData!.name} className="w-full h-64 object-fill outline"/>
                                <div className="absolute top-4 left-4 bg-sky-600 text-white py-1 px-3 rounded-lg outline select-none">
                                    {singleInstitutionData!.type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}
                                </div>
                            </div>
                            <div className="p-6">
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">{singleInstitutionData!.name}</h1>
                                <div className="flex flex-wrap gap-4 mb-6">
                                    <div className="w-full md:w-1/2">
                                        <h2 className="text-lg font-semibold text-gray-700">Contact Information</h2>
                                        <p className="text-gray-600">Email: <a href={`mailto:${singleInstitutionData!.contact_email}`} className="text-sky-500">{singleInstitutionData!.contact_email}</a></p>
                                        <p className="text-gray-600">Website: <a href={singleInstitutionData!.website} target="_blank" rel="noopener noreferrer" className="text-sky-500">{singleInstitutionData!.website}</a></p>
                                        <p className="text-gray-600">Country: {singleInstitutionData!.country.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}</p>
                                        <p className="text-gray-600">Address: {singleInstitutionData!.address}</p>
                                    </div>
                                    <div className="w-full md:w-1/2">
                                        <h2 className="text-lg font-semibold text-gray-700">Institution Data</h2>
                                        <p className="text-gray-600">Acceptance Rate: {singleInstitutionData!.acceptanceRate.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}</p>
                                        <p className="text-gray-600">Accreditation Status: {singleInstitutionData!.accreditationStatus.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}</p>
                                        <p className="text-gray-600">Size: {singleInstitutionData!.size} students</p>
                                        <p className="text-gray-600">Tuition: ${singleInstitutionData!.tuition.toLocaleString()}</p>
                                        <p className="text-gray-600">Rating: <span className="text-yellow-500">{singleInstitutionData!.rating === 0 ? 'No Rating' : `${singleInstitutionData!.rating}/5`}</span></p>
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <h2 className="text-lg font-semibold text-gray-700">Description</h2>
                                    <p className="text-gray-600">{singleInstitutionData!.description}</p>
                                </div>
                                <div onClick={() => {
                                    dispatch(updateSearchBoxValues({name: 'institution_id', value: id}));
                                    window.scroll({top: 0, behavior: 'smooth'});
                                    navigate('/educators');
                                }} className="w-full text-center my-4 bg-gray-400 py-2 cursor-pointer outline hover:bg-stone-600 hover:text-white select-none">View All Educators</div>
                                <div onClick={() => {
                                    dispatch(updateCourseSearchBoxValues({name: 'institution_id', value: id}));
                                    window.scroll({top: 0, behavior: 'smooth'});
                                    navigate('/courses');
                                }} className="w-full text-center my-4 bg-gray-400 py-2 cursor-pointer outline hover:bg-stone-600 hover:text-white select-none">View All Courses</div>
                                <div className="flex justify-between items-center">
                                    {(userData.role === 'OWNER' || userData.role === 'ADMIN') && (
                                        <>
                                            <div onClick={() => {
                                                window.scroll({top: 0, behavior: 'smooth'});
                                                dispatch(toggleIsEditingInstitution());
                                            }} className="p-4 outline bg-green-500 text-white hover:bg-black hover:text-white cursor-pointer"><FaEdit/></div>
                                            <div onClick={() => {
                                                window.scroll({top: 0, behavior: 'smooth'});
                                                dispatch(setFromInstitutionPage({id: id!, name: singleInstitutionData!.name}));
                                                navigate('/educators/add');
                                            }} className="p-4 outline bg-gray-500 text-white hover:bg-black hover:text-white cursor-pointer"><FaChalkboardTeacher/></div>
                                            <div onClick={async() => {
                                                if (loaders.deleteSingleInstitutionLoading) {
                                                    return;
                                                }
                                                try {
                                                    await dispatch(deleteSingleInstitution(id!)).unwrap();
                                                    navigate('/institutions');
                                                    window.scroll({top: 0, behavior: 'smooth'});
                                                    toast.success('Deleted Institution!');
                                                }
                                                catch(error: any) {}
                                            }} className={`p-4 outline bg-red-500 text-white hover:bg-black hover:text-white cursor-pointer ${loaders.deleteSingleInstitutionLoading ? 'bg-gray-500' : ''}`}><FaTrash/></div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {/* Reviews */}
            <Reviews type='INSTITUTION' type_id={id!}/>
        </div>
    );
}

export default SingleInstitution;