import useStore from "../utils/redux";
import {FaTimes} from "react-icons/fa";
import {type ICourse} from "../@types/coursesSlice";
import {toggleIsEditingCourse, updateEditSingleCourseLoading} from "../features/courses/coursesSlice";
import {courseFormats, courseLevels, courseTypes} from "../utils/courses_filter";
import {useParams} from "react-router-dom";
import {editSingleCourse, editSingleCourseSyllabus} from "../features/courses/coursesThunk";
import {toast} from 'react-toastify';

interface EditCourseProps {
    data: ICourse
}

const EditCourse: React.FunctionComponent<EditCourseProps> = ({data}) => {    
    const {id} = useParams();
    const dispatch = useStore().dispatch;
    const {loaders, errors} = useStore().selector.courses;
    const handleSubmit = async(event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        if (target.syllabus.files[0]) {
            const formData = new FormData();
            formData.append('syllabus', target.syllabus.files[0]);
            try {
                await dispatch(editSingleCourseSyllabus({course_id: id!, data: formData})).unwrap();
            }
            catch(error: any) {
                dispatch(updateEditSingleCourseLoading(false));
                return;
            }
        }
        formData.append('name', (target.elements.namedItem('name') as HTMLInputElement).value);
        formData.append('code', (target.elements.namedItem('code') as HTMLInputElement).value);
        formData.append('capacity', (target.elements.namedItem('capacity') as HTMLInputElement).value);
        formData.append('cost', (target.elements.namedItem('cost') as HTMLInputElement).value);
        formData.append('format', (target.elements.namedItem('format') as HTMLSelectElement).value);
        formData.append('type', (target.elements.namedItem('type') as HTMLSelectElement).value);
        formData.append('level', (target.elements.namedItem('level') as HTMLSelectElement).value);
        // Edit Thunk
        try {
            await dispatch(editSingleCourse({course_id: id!, data: formData})).unwrap();
            toast.success('Edited Course');
            dispatch(toggleIsEditingCourse());
            window.scroll({top: 0, behavior: 'smooth'});
        }
        catch(error: any) {}
    }
    return (
        <form className="w-1/2 mx-auto mt-4" onSubmit={handleSubmit}>
            <div className="flex items-center mb-4">
                <div onClick={() => {
                    window.scroll({top: 0, behavior: 'smooth'});
                    dispatch(toggleIsEditingCourse());
                }} className="mr-4 outline rounded-full p-4 cursor-pointer hover:bg-black hover:text-white"><FaTimes/></div>
                <div className="bg-gray-400 p-4 rounded-2xl w-full text-center font-bold outline">Editing Course</div>
            </div>
            <div className="flex flex-col">
                <label className="font-semibold mb-2" htmlFor="name">Name</label>
                <input className="mb-2 p-2" id="name" type="text" name="name" defaultValue={data!.name} required/>
            </div>
            <div className="flex flex-col">
                <label className="font-semibold mb-2" htmlFor="code">Code</label>
                <input className="mb-2 p-2" id="code" type="text" name="code" defaultValue={data!.code} required/>
            </div>
            <div className="flex flex-col">
                <label className="font-semibold mb-2" htmlFor="capacity">Capacity</label>
                <input className="mb-2 p-2" id="capacity" type="number" name="capacity" min="1" defaultValue={data!.capacity} required/>
            </div>
            <div className="flex flex-col">
                <label className="font-semibold mb-2" htmlFor="cost">Cost</label>
                <input className="mb-2 p-2" id="cost" type="number" name="cost" min="1" defaultValue={data!.cost} required/>
            </div>
            <div className="flex flex-col">
                <label className="font-semibold mb-2" htmlFor="format">Format</label>
                <select id="format" className="p-2 mb-2" name="format" defaultValue={data!.format} required>
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
                <select id="type" className="p-2 mb-2" name="type" defaultValue={data!.type} required>
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
                <select id="level" className="p-2 mb-2" name="level" defaultValue={data!.level} required>
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
                <input className="outline p-2 mb-4 rounded-lg" id="syllabus" type="file" accept=".pdf" name="syllabus"/>
            </div>
            {errors.editSingleCourseError && (
                <p className="text-center mb-4 text-red-500">{errors.editSingleCourseError}</p>
            )}
            {errors.editSingleCourseSyllabusError && (
                <p className="text-center mb-4 text-red-500">{errors.editSingleCourseSyllabusError}</p>
            )}
            <button className="w-full bg-white hover:bg-black hover:text-white py-2 px-4 rounded-lg outline select-none" disabled={loaders.editSingleCourseLoading}>{loaders.editSingleCourseLoading ? 'Editing' : 'Edit'}</button>
        </form>
    );
}

export default EditCourse;