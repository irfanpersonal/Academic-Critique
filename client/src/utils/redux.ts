import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';

const useStore = () => {
    // Remember that in order to use hooks they MUST be inside of a function body.
    const dispatch = useDispatch<useDispatchType>();
    // const selector = useSelector((store: useSelectorType) => store);
    // If you return the entire state like the line above you will get this warning
    // in the console.
    // Selector unknown returned the root state when called. This can lead to unnecessary 
    // rerenders. Selectors that return the entire state are almost certainly a mistake, 
    // as they will cause a rerender whenever *anything* in state changes.
    const selector = {
        user: useSelector((store: useSelectorType) => store.user),
        admin: useSelector((store: useSelectorType) => store.admin),
        institutions: useSelector((store: useSelectorType) => store.institutions),
        educators: useSelector((store: useSelectorType) => store.educators),
        courses: useSelector((store: useSelectorType) => store.courses),
        reviews: useSelector((store: useSelectorType) => store.reviews)
    };
    return {dispatch, selector};
}

export default useStore;