import React from "react";
import useStore from "../utils/redux";
import {AiOutlineSearch} from "react-icons/ai";
import {updateSearchBoxValues} from "../features/courses/coursesSlice";
import {getAllCourses} from "../features/courses/coursesThunk";
import {FaTimes} from "react-icons/fa";

const EducatorsSearchBox: React.FunctionComponent = () => {
    const dispatch = useStore().dispatch;
    const {name, institution_id, educator_id} = useStore().selector.courses.allCoursesData.searchBoxValues;
    return (
        <div className="flex justify-center items-center">
            <div className="relative w-full max-w-lg">
                <input type="text" name="name" value={name} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}));
                }} onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                    if (event.key === 'Enter') {
                        dispatch(getAllCourses());
                    }
                }} className="w-full py-3 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"/>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <AiOutlineSearch size={20}/>
                </div>
            </div>
            {(institution_id || educator_id) && (
                <div onClick={() => {
                    dispatch(updateSearchBoxValues({name: 'educator_id', value: ''}));
                    dispatch(updateSearchBoxValues({name: 'institution_id', value: ''}));
                    dispatch(getAllCourses());
                }} className="py-4 text-gray-700 bg-white border border-gray-300 rounded-lg text-center px-4 hover:bg-black hover:text-red-500 cursor-pointer"><FaTimes/></div>
            )}
        </div>
    );
};

export default EducatorsSearchBox;