import React from 'react';
import useStore from "../utils/redux";
import {useNavigate} from "react-router-dom";
import {FaArrowLeft} from "react-icons/fa";
import {courseFormats, courseTypes, courseLevels} from "../utils/courses_filter";
import {createCourse} from '../features/courses/coursesThunk';
import {toast} from 'react-toastify';
import {setFromEducatorPage} from '../features/courses/coursesSlice';

const AddCourse: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const dispatch = useStore().dispatch;
    const {loaders, errors, fromEducatorPage} = useStore().selector.courses;
    const handleSubmit = async(event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        formData.append('name', (target.elements.namedItem('name') as HTMLInputElement).value);
        formData.append('code', (target.elements.namedItem('code') as HTMLInputElement).value);
        formData.append('capacity', (target.elements.namedItem('capacity') as HTMLInputElement).value);
        formData.append('cost', (target.elements.namedItem('cost') as HTMLInputElement).value);
        formData.append('format', (target.elements.namedItem('format') as HTMLSelectElement).value);
        formData.append('type', (target.elements.namedItem('type') as HTMLSelectElement).value);
        formData.append('level', (target.elements.namedItem('level') as HTMLSelectElement).value);
        formData.append('educator_id', fromEducatorPage.educator_id!);
        formData.append('institution_id', fromEducatorPage.institution_id!);
        if (target.syllabus.files[0]) {
            formData.append('syllabus', target.syllabus.files[0]);
        }
        try {
            const result = await dispatch(createCourse(formData)).unwrap();
            navigate(`/courses/${result.id}`);
            window.scroll({top: 0, behavior: 'smooth'});
            toast.success('Created Course!');
        }
        catch(error: any) {}
    }
    React.useEffect(() => {
        if (Object.values(fromEducatorPage).every(value => value === null)) {
            navigate('/');
        }
    }, [fromEducatorPage, navigate]);
    return (
        <div>
            <div onClick={() => {
                navigate(`/educators/${fromEducatorPage!.educator_id}`);
            }} className="inline-flex justify-start items-center mb-4">
                <span className="mr-4 cursor-pointer"><FaArrowLeft/></span>
                <div className="cursor-pointer">{fromEducatorPage!.educator_name}</div>
            </div>
            <div className="border-b-2 mb-4"></div>
            <form className="w-1/2 mx-auto mt-4" onSubmit={handleSubmit}>
                <h1 className="text-2xl text-center font-bold mb-4">Create Course</h1>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2" htmlFor="name">Name</label>
                    <input className="mb-2 p-2" id="name" type="text" name="name" required/>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2" htmlFor="code">Code</label>
                    <input className="mb-2 p-2" id="code" type="text" name="code" required/>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2" htmlFor="capacity">Capacity</label>
                    <input className="mb-2 p-2" id="capacity" type="number" name="capacity" min="1" required/>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2" htmlFor="cost">Cost</label>
                    <input className="mb-2 p-2" id="cost" type="number" name="cost" min="1" required/>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2" htmlFor="format">Format</label>
                    <select id="format" className="p-2 mb-2" name="format" required>
                        <option value=""></option>
                        {courseFormats.map(courseFormat => {
                            return (
                                <option key={courseFormat} value={courseFormat}>{courseFormat.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}</option>
                            );
                        })}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2" htmlFor="type">Type</label>
                    <select id="type" className="p-2 mb-2" name="type" required>
                        <option value=""></option>
                        {courseTypes.map(courseType => {
                            return (
                                <option key={courseType} value={courseType}>{courseType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}</option>
                            );
                        })}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2" htmlFor="level">Level</label>
                    <select id="level" className="p-2 mb-2" name="level" required>
                        <option value=""></option>
                        {courseLevels.map(courseLevel => {
                            return (
                                <option key={courseLevel} value={courseLevel}>{courseLevel.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}</option>
                            );
                        })}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2" htmlFor="syllabus">Syllabus</label>
                    <input className="outline p-2 mb-4 rounded-lg" id="syllabus" type="file" accept=".pdf" name="syllabus" required/>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2">Educator</label>
                    <input className="mb-2 p-2 cursor-not-allowed bg-gray-400 outline-none" defaultValue={`${fromEducatorPage.educator_name!} | ${fromEducatorPage.educator_id!}`} readOnly/>
                </div>
                <div className="flex flex-col mb-4">
                    <label className="font-semibold mb-2">Institution</label>
                    <input className="mb-2 p-2 cursor-not-allowed bg-gray-400 outline-none" defaultValue={`${fromEducatorPage.institution_name!} | ${fromEducatorPage.institution_id!}`} readOnly/>
                </div>
                {errors.createCourseError && (
                    <p className="mb-4 text-center text-red-600">{errors.createCourseError}</p>
                )}
                <button onClick={() => {
                    navigate(`/educators/${fromEducatorPage!.educator_id}`);
                    window.scroll({top: 0, behavior: 'smooth'});
                    dispatch(setFromEducatorPage({educator_name: null, educator_id: null, institution_name: null, institution_id: null}));
                }} className="w-full bg-white hover:bg-black hover:text-white py-2 px-4 rounded-lg outline select-none mb-4">Cancel</button>
                <button className="w-full bg-white hover:bg-black hover:text-white py-2 px-4 rounded-lg outline select-none" disabled={loaders.createCourseLoading}>{loaders.createCourseLoading ? 'Creating' : 'Create'}</button>
            </form>
        </div>
    );
}

export default AddCourse;