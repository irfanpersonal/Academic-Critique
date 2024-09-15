import {useNavigate} from 'react-router-dom';
import {type IInstitution} from '../@types/institutionsSlice';
import {InstitutionsListItem, PaginationBox} from '.';
import useStore from '../utils/redux';
import {changePage} from '../features/institutions/institutionsSlice';

interface InstitutionsListProps {
    data: IInstitution[],
    totalInstitutions: number,
    numberOfPages: number,
    page: number,
    updateSearch: Function
}

const InstitutionsList: React.FunctionComponent<InstitutionsListProps> = ({data, totalInstitutions, numberOfPages, page, updateSearch}) => {
    const navigate = useNavigate();
    const {role} = useStore().selector.user.userData;
    return (
        <div>
            <div className="flex justify-between items-center border-b-2 border-black mb-4 pb-4">
                {totalInstitutions ? (
                    <h1 className="text-2xl font-bold">{totalInstitutions} Institution{totalInstitutions > 1 && 's'} Found ...</h1>
                ) : (
                    <h1 className="text-2xl font-bold">No Institutions Found ...</h1>
                )}
                {(role === 'ADMIN' || role === 'OWNER') && (
                    <button onClick={() => {
                        navigate('/institutions/add');
                    }} className="font-bold bg-black text-white py-2 px-4 rounded-lg">Add Institution</button>
                )}
            </div>
            <section className="grid grid-rows-1 grid-cols-2 gap-4">
                {data.map(item => {
                    return (
                        <InstitutionsListItem key={item.id} data={item}/>
                    );
                })}
            </section>
            {numberOfPages > 1 && (
                <PaginationBox numberOfPages={numberOfPages} page={Number(page)} changePage={changePage} updateSearch={updateSearch}/>
            )}
        </div>
    );
}

export default InstitutionsList;