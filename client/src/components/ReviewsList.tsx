import React from 'react';
import useStore from '../utils/redux';
import {type IReview} from '../@types/reviewsSlice';
import {ReviewsListItem, PaginationBox} from '.';
import {changePage} from '../features/courses/coursesSlice';
import {FaPlus, FaTimes, FaStar} from 'react-icons/fa';
import {createReview} from '../features/reviews/reviewsThunk';
import {toast} from 'react-toastify';
import {setCreateReviewError} from '../features/reviews/reviewsSlice';

interface ReviewsListProps {
    type: string,
    type_id: string,
    data: IReview[],
    totalReviews: number,
    numberOfPages: number,
    page: number,
    updateSearch: Function
}

const ReviewsList: React.FunctionComponent<ReviewsListProps> = ({type, type_id, data, totalReviews, numberOfPages, page, updateSearch}) => {
    const dispatch = useStore().dispatch;
    const [isAdding, setIsAdding] = React.useState<boolean>(false);
    const {loaders, errors} = useStore().selector.reviews;
    const userData = useStore().selector.user.userData;
    return (
        <>
            <div className="flex justify-between items-center border-b-2 border-black p-4">
                {(!data.length) && (
                    <h1 className="text-2xl text-center font-bold">No Reviews Found ...</h1>
                )}
                {(data.length >= 1) && (
                    <h1 className="font-bold text-2xl">{totalReviews} Review{totalReviews > 1 && 's'} Found...</h1>
                )}
                {userData.role === 'USER' && (
                    <div onClick={() => {
                        dispatch(setCreateReviewError(''));
                        if (isAdding) {
                            setIsAdding(false);
                            return;
                        }
                        setIsAdding(true);
                    }} className="outline p-2 cursor-pointer hover:bg-black hover:text-white">{isAdding ? <FaTimes size="1.25rem"/> : <FaPlus size="1.25rem"/>}</div>
                )}
            </div>
            {isAdding && (
                <div className="p-4 outline">
                    <form onSubmit={async(event: React.FormEvent) => {
                        event.preventDefault();
                        const target = event.target as HTMLFormElement;
                        const formData = new FormData();
                        formData.append('title', (target.elements.namedItem('title') as HTMLInputElement).value);
                        formData.append('rating', (target.elements.namedItem('rating') as HTMLInputElement).value);
                        formData.append('content', (target.elements.namedItem('content') as HTMLTextAreaElement).value);
                        formData.append('type', (target.elements.namedItem('type') as HTMLTextAreaElement).value);
                        formData.append('type_id', (target.elements.namedItem('type_id') as HTMLTextAreaElement).value);
                        try {
                            await dispatch(createReview(formData)).unwrap();
                            setIsAdding(false);
                            toast.success('Created Review');
                        }
                        catch(error) {}
                    }}>
                        <div>
                            <div className="flex justify-between items-center">
                                <input id="title" name="title" placeholder='Review Title' className="p-2 w-2/4 outline-none" required/>
                                <div className="flex items-center px-4 rounded-lg bg-black text-yellow-400"><FaStar size="1.2rem" className="mr-4"/><input id="rating" type="number" min="1" max="5" defaultValue="5" name="rating" className="p-2 bg-black outline-none" required/></div>
                            </div>
                            <textarea id="content" name="content" className="w-full mt-4 resize-none h-32 p-2 outline-none" placeholder='Review Content' required></textarea>
                        </div>
                        <input type="hidden" name="type" defaultValue={type}/>
                        <input type="hidden" name="type_id" defaultValue={type_id}/>
                        <p className="mt-4 text-center text-red-500">{errors.createReviewError && `${errors.createReviewError}`}</p>
                        <button className="w-full bg-black text-white p-2 mt-4 hover:outline" type="submit" disabled={loaders.createReviewLoading}>{loaders.createReviewLoading ? 'Creating' : 'Create'}</button>
                    </form>
                </div>
            )}
            <section className="p-4">
                {data.map(item => {
                    return (
                        <ReviewsListItem key={item.id} data={item} type_id={type_id}/>
                    );
                })}
            </section>
            {(numberOfPages > 1) && (
                <PaginationBox numberOfPages={numberOfPages} page={Number(page)} changePage={changePage} updateSearch={updateSearch}/>
            )}
        </>
    );
}

export default ReviewsList;