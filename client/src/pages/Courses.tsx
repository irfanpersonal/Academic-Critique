import React from 'react';
import useStore from "../utils/redux";
import {CourseSearchBox, Loading, CourseList} from '../components';
import {getAllCourses} from '../features/courses/coursesThunk';

const Courses: React.FunctionComponent = () => {
    const dispatch = useStore().dispatch;
    const {loaders, allCoursesData} = useStore().selector.courses;
    React.useEffect(() => {
        dispatch(getAllCourses());
    }, [dispatch]);
    return (
        <div>
            <CourseSearchBox/>
            {loaders.getAllCoursesLoading ? (
                <Loading title="Loading All Courses" position="normal" marginTop="2rem"/>
            ) : (
                <CourseList data={allCoursesData.courses} totalCourses={allCoursesData.totalCourses} numberOfPages={allCoursesData.numberOfPages} page={Number(allCoursesData.searchBoxValues.page)} updateSearch={getAllCourses}/>
            )}
        </div>
    );
}

export default Courses;