import React from 'react';
import useStore from "../utils/redux";
import {EducatorsSearchBox, Loading, EducatorsList} from '../components';
import {getAllEducators} from '../features/educators/educatorsThunk';

const Educators: React.FunctionComponent = () => {
    const dispatch = useStore().dispatch;
    const {loaders, allEducatorsData} = useStore().selector.educators;
    React.useEffect(() => {
        dispatch(getAllEducators());
        // Its better that we don't reset it. Because the user may view many educators at a time from a 
        // specific institution.
        // return () => {
        //     dispatch(updateSearchBoxValues({name: 'institution_id', value: ''}));
        // }
    }, [dispatch]);
    return (
        <div>
            <EducatorsSearchBox/>
            {loaders.getAllEducatorsLoading ? (
                <Loading title="Loading All Educators" position="normal" marginTop="2rem"/>
            ) : (
                <EducatorsList data={allEducatorsData.educators} totalEducators={allEducatorsData.totalEducators} numberOfPages={allEducatorsData.numberOfPages} page={Number(allEducatorsData.searchBoxValues.page)} updateSearch={getAllEducators}/>
            )}
        </div>
    );
}

export default Educators;