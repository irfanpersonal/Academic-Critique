import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { nanoid } from 'nanoid';
import { useDispatch } from 'react-redux';
import { type useDispatchType } from '../store';

interface PaginationBoxProps {
    _id?: string;
    numberOfPages: number;
    changePage: Function;
    page: number;
    updateSearch: Function;
}

const PaginationBox: React.FunctionComponent<PaginationBoxProps> = ({ _id, page, numberOfPages, changePage, updateSearch }) => {
    const dispatch = useDispatch<useDispatchType>();

    const previousPage = () => {
        const newValue = page - 1;
        if (newValue === 0) {
            dispatch(changePage(numberOfPages));
            return;
        }
        dispatch(changePage(newValue));
    };

    const nextPage = () => {
        const newValue = page + 1;
        if (newValue === (numberOfPages + 1)) {
            dispatch(changePage(1));
            return;
        }
        dispatch(changePage(newValue));
    };

    return (
        <div className="flex justify-center items-center p-2 rounded-md mb-8">
            <span 
                className="flex justify-center items-center cursor-pointer h-8 w-8 border border-gray-200 bg-white text-black transition-colors duration-300" 
                onClick={() => {
                    previousPage();
                    dispatch(updateSearch(_id));
                }}
            >
                <IoIosArrowBack className="text-lg" />
            </span>
            {Array.from({ length: numberOfPages }, (_, index) => (
                <span 
                    key={nanoid()} 
                    className={`flex justify-center items-center cursor-pointer h-8 w-8 border border-gray-200 ${page === index + 1 ? 'bg-black text-white' : 'bg-white text-black'} transition-colors duration-300`} 
                    onClick={() => {
                        dispatch(changePage(index + 1));
                        dispatch(updateSearch(_id));
                    }}
                >
                    {index + 1}
                </span>
            ))}
            <span 
                className="flex justify-center items-center cursor-pointer h-8 w-8 border border-gray-200 bg-white text-black transition-colors duration-300" 
                onClick={() => {
                    nextPage();
                    dispatch(updateSearch(_id));
                }}
            >
                <IoIosArrowForward className="text-lg" />
            </span>
        </div>
    );
}

export default PaginationBox;