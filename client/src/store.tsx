import {configureStore} from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
import adminReducer from './features/admin/adminSlice';
import institutionsReducer from './features/institutions/institutionsSlice';
import educatorsReducer from './features/educators/educatorsSlice';
import coursesReducer from './features/courses/coursesSlice';
import reviewsReducer from './features/reviews/reviewsSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        admin: adminReducer,
        institutions: institutionsReducer,
        educators: educatorsReducer,
        courses: coursesReducer,
        reviews: reviewsReducer
    }
});

export type useDispatchType = typeof store.dispatch;

export type useSelectorType = ReturnType<typeof store.getState>;

export default store;