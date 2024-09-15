import React from 'react';
import useStore from "../utils/redux";
import ReviewsList from "./ReviewsList";
import {getAllReviews} from "../features/reviews/reviewsThunk";

interface ReviewsProps {
    type: string,
    type_id: string
}

const Reviews: React.FunctionComponent<ReviewsProps> = ({type, type_id}) => {
    const dispatch = useStore().dispatch;
    const {loaders, allReviewsData} = useStore().selector.reviews;
    React.useEffect(() => {
        dispatch(getAllReviews(type_id));
    }, [dispatch, type_id]);
    return (
        <div className="mx-6 outline">
            {loaders.getAllReviewsLoading ? (
                <h1 className="text-center border-b-orange-600 border-b-2">Loading All Reviews...</h1>
            ) : (
                <ReviewsList type={type} type_id={type_id} data={allReviewsData.reviews} totalReviews={allReviewsData.totalReviews} numberOfPages={allReviewsData.numberOfPages} page={Number(allReviewsData.searchBoxValues.page)} updateSearch={getAllReviews}/>
            )}
        </div>
    );
}

export default Reviews;