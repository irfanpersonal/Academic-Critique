import {useNavigate} from 'react-router-dom';
import {type IEducator} from '../@types/educatorsSlice';
import {FaStar} from 'react-icons/fa';

interface EducatorsListItemProps {
    data: IEducator
}

const EducatorsListItem: React.FunctionComponent<EducatorsListItemProps> = ({data}) => {
    const navigate = useNavigate();
    return (
        <article className="outline p-4 rounded-lg cursor-pointer hover:bg-white active:bg-gray-200" onClick={() => {
            window.scroll({top: 0, behavior: 'smooth'});
            navigate(`/educators/${data.id}`);
        }}>
            <img className="w-48 h-48 outline rounded-lg mx-auto mb-4" src={data.image} alt={data.name}/>
            <h1 className="font-bold text-center">{data.name}</h1>
            <p className='text-center mb-4'>{data.description.length > 125 ? `${data.description.slice(0, 125)}...` : data.description}</p>
            <div className="flex justify-center items-center">
                <div className="outline py-2 px-4 rounded-lg bg-black">
                    <div className="flex justify-center items-center text-white"><FaStar color="rgb(246, 251, 122)" size="1.25rem" className="mr-4"/>{Number(data.rating) === 0 ? 'No Rating' : `${data.rating}/5`}</div>
                </div>
            </div>
        </article>
    );
}

export default EducatorsListItem;