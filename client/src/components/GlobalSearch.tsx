import React from 'react';
import {useNavigate} from "react-router-dom";
import {updateSearchBoxValues as updateInstitutionSearch} from '../features/institutions/institutionsSlice';
import {updateSearchBoxValues as updateEducatorSearch} from '../features/educators/educatorsSlice';
import {updateSearchBoxValues as updateCourseSearch} from '../features/courses/coursesSlice';
import useStore from '../utils/redux';

const navigationLogic: any = {
    "🏛️ Institution": "/institutions",
    "🧑 Educator": "/educators",
    "📖 Course": "/courses"
};

const GlobalSearch: React.FunctionComponent = () => {   
    const dispatch = useStore().dispatch;
    const navigate = useNavigate();
    const inputReference = React.useRef<HTMLInputElement | null>(null);
    const selectReference = React.useRef<HTMLSelectElement | null>(null);
    return (
        <div className="px-4 py-4 bg-white rounded-lg">
            <div className="flex items-center space-x-2">
                <input ref={inputReference} onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                    if (event.key === 'Enter') {
                        const inputValue = (inputReference.current as HTMLInputElement).value;
                        const selectValue = (selectReference.current as HTMLSelectElement).value;
                        if (selectValue === "🏛️ Institution") {
                            dispatch(updateInstitutionSearch({name: 'name', value: inputValue}));
                        }
                        else if (selectValue === "🧑 Educator") {
                            dispatch(updateEducatorSearch({name: 'name', value: inputValue}));
                        }
                        else if (selectValue === "📖 Course") {
                            dispatch(updateCourseSearch({name: 'name', value: inputValue}));
                        }
                        navigate(navigationLogic[selectValue]);
                    }
                }} className="w-2/3 sm:w-2/3 md:w-2/3 lg:w-3/4 xl:w-3/4 2xl:w-4/5 p-3 rounded-l-lg outline" type="search" name="search" placeholder="Search..."/>
                <select className="w-1/3 sm:w-1/3 md:w-1/3 lg:w-1/4 xl:w-1/4 p-3 rounded-r-lg outline text-center" ref={selectReference} defaultValue="🏛️ Institution" name="type">
                    <option>🏛️ Institution</option>
                    <option>🧑 Educator</option>
                    <option>📖 Course</option>
                </select>
            </div>
        </div>
    );
};

export default GlobalSearch;