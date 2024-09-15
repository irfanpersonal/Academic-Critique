import React from 'react';
import useStore from "../utils/redux";
import {Loading, InstitutionsFilterBox, InstitutionsList} from "../components";
import {getAllInstitutions} from "../features/institutions/institutionsThunk";

const Institutions: React.FunctionComponent = () => {
    const dispatch = useStore().dispatch;
    const {loaders, errors, allInstitutionsData} = useStore().selector.institutions;
    React.useEffect(() => {
        dispatch(getAllInstitutions());
    }, [dispatch]);
    return (
        <div className="flex">
            <div className="border-r-2 w-1/5 border-black mr-4">
                <InstitutionsFilterBox/>
            </div>
            <div className="w-4/5">
                {loaders.getAllInstitutionsLoading ? (
                    <Loading title="Loading All Institutions" position="normal"/>
                ) : (
                    <>
                        {errors.getAllInstitutionsError ? (
                            <div className="text-center">
                                <h1 className="text-2xl mb-4">{errors.getAllInstitutionsError}</h1>
                                <button onClick={() => {
                                    dispatch(getAllInstitutions());
                                }} className="outline py-2 px-4 rounded-lg bg-sky-300">Retry</button>
                            </div>
                        ) : (
                            <InstitutionsList data={allInstitutionsData.institutions} totalInstitutions={allInstitutionsData.totalInstitutions} numberOfPages={allInstitutionsData.numberOfPages} page={Number(allInstitutionsData.searchBoxValues.page)} updateSearch={getAllInstitutions}/>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default Institutions;