import {useNavigate} from 'react-router-dom';
import {type ICourse} from '../@types/coursesSlice';
import {FaStar} from 'react-icons/fa';

interface CourseListItemProps {
    data: ICourse
}

const CourseListItem: React.FunctionComponent<CourseListItemProps> = ({data}) => {
    const navigate = useNavigate();
    
    return (
        <article className="outline p-4 rounded-lg cursor-pointer hover:bg-white active:bg-gray-200 hover:shadow-lg" onClick={() => {
            window.scroll({top: 0, behavior: 'smooth'});
            navigate(`/courses/${data.id}`);
        }}>
            <div className="mb-4 text-center">
                <h2 className="text-2xl font-semibold text-gray-800 text-center border-b-2 border-black">{data.name}</h2>
                <h1 className="mt-4">Institution - {data.institution.name}</h1>
                <h1 className="mt-4">Educator - {data.educator.name}</h1>
                <h1 className="mt-4 text-green-500">${data.cost}</h1>
                <div className="flex justify-center items-center mt-4">
                    <div className="outline py-2 px-4 rounded-lg bg-black">
                        <div className="flex justify-center items-center text-white"><FaStar color="rgb(246, 251, 122)" size="1.25rem" className="mr-4"/>{Number(data.rating) === 0 ? 'No Rating' : `${data.rating}/5`}</div>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default CourseListItem;
