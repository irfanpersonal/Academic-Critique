import React from 'react';
import moment from 'moment';
import {type IReview} from "../@types/reviewsSlice";
import useStore from '../utils/redux';
import {updateReview, deleteReview} from '../features/reviews/reviewsThunk';
import {setIsEditingReview} from '../features/reviews/reviewsSlice';

interface ReviewsListItemProps {
    data: IReview,
    type_id: string
}

const ReviewsListItem: React.FunctionComponent<ReviewsListItemProps> = ({data, type_id}) => {
    const dispatch = useStore().dispatch;
    const userId = useStore().selector.user.userData.id;
    const {loaders, isEditingReview} = useStore().selector.reviews;
    const titleReference = React.useRef<HTMLInputElement | null>(null);
    const ratingReference = React.useRef<HTMLInputElement | null>(null);
    const contentReference = React.useRef<HTMLTextAreaElement | null>(null);
    return (
        <article className="bg-white p-1 mb-4">
            <div className="flex flex-col">
                <div><span className="underline">Username</span> - {data.user.username}</div>
                <div><span className="underline">Country</span> - {data.user.country!.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}</div>
            </div>
            {isEditingReview === data.id ? (
                <input type="text" id="title" ref={titleReference} className="text-xl font-bold border-b-2 border-black p-1 mb-2" defaultValue={data.title} required/>
            ) : (
                <h2 className="text-xl font-bold">{data.title}</h2>
            )}
            <div className="flex items-center gap-2">
                <span className="text-lg font-medium text-yellow-500">Rating:</span>
                {isEditingReview === data.id ? (
                    <input type="number" id="rating" ref={ratingReference} min="1" max="5" className="text-xl font-bold border-b-2 border-black p-1 mb-2" defaultValue={data.rating} required/>
                ) : (
                    <span className="text-lg font-semibold">{data.rating} / 5</span>
                )}
            </div>
            {isEditingReview === data.id ? (
                <textarea id="content" ref={contentReference} name="content" className="w-full resize-none outline p-1" defaultValue={data.content} required></textarea>
            ) : (
                <p className="text-gray-700 leading-relaxed">{data.content}</p>
            )}
            <div className="text-gray-500 text-sm flex justify-between items-center mb-4">
                <div>Created: {moment(data.createdAt).format('MMMM Do YYYY')}</div>
                {data.updatedAt !== data.createdAt && (
                    <div>Updated: {new Date(data.updatedAt).toLocaleDateString()}</div>
                )}
            </div>
            {userId === data.user_id && (
                <div className="flex justify-end items-center">
                    <div onClick={() => {
                        if (isEditingReview) {
                            dispatch(setIsEditingReview(''));
                            return;
                        }
                        dispatch(setIsEditingReview(data.id));
                    }} className="mr-4 outline py-2 px-4 cursor-pointer bg-black text-white hover:bg-green-400 hover:text-black select-none">{isEditingReview ? 'Cancel' : 'Edit'}</div>
                    {isEditingReview === data.id && (
                        <div onClick={async() => {
                            if (loaders.editSingleReviewLoading) {
                                return;
                            }
                            const formData = new FormData();
                            formData.append('title', titleReference.current!.value);
                            formData.append('rating', ratingReference.current!.value);
                            formData.append('content', contentReference.current!.value);
                            try {
                                await dispatch(updateReview({id: data.id, data: formData}));
                                dispatch(setIsEditingReview(''));
                            }
                            catch(error: any) {}
                        }} className={`mr-4 outline py-2 px-4 cursor-pointer bg-black text-white hover:bg-green-400 hover:text-black select-none ${loaders.editSingleReviewLoading ? 'bg-gray-400' : ''}`}>Save</div>
                    )}
                    <div onClick={async() => {
                        if (loaders.editSingleReviewLoading) {
                            return;
                        }
                        try {
                            await dispatch(deleteReview({reviewId: data.id, type_id: type_id})).unwrap();
                        }
                        catch(error: any) {}
                    }} className={`outline py-2 px-4 cursor-pointer bg-black text-white hover:bg-red-400 hover:text-black select-none ${loaders.deleteSingleReviewLoading ? 'bg-gray-500 text-white' : ''}`}>Delete</div>
                </div>
            )}
        </article>
    );
}

export default ReviewsListItem;