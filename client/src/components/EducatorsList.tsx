import {type IEducator} from '../@types/educatorsSlice';
import {EducatorsListItem, PaginationBox} from '.';
import {changePage} from '../features/educators/educatorsSlice';

interface EducatorsListProps {
    data: IEducator[],
    totalEducators: number,
    numberOfPages: number,
    page: number,
    updateSearch: Function
}

const EducatorsList: React.FunctionComponent<EducatorsListProps> = ({data, totalEducators, numberOfPages, page, updateSearch}) => {
    return (
        <>
            {(!data.length) && (
                <h1 className="text-2xl text-center mt-4 font-bold">No Educators Found ...</h1>
            )}
            {(data.length >= 1) && (
                <h1 className="font-bold text-2xl border-b-2 border-black mt-4">{totalEducators} Educator{totalEducators > 1 && 's'} Found...</h1>
            )}
            <section className="mt-4 grid grid-cols-2 grid-rows-5 gap-4">
                {data.map(item => {
                    return (
                        <EducatorsListItem key={item.id} data={item}/>
                    );
                })}
            </section>
            {(numberOfPages > 1) && (
                <PaginationBox numberOfPages={numberOfPages} page={Number(page)} changePage={changePage} updateSearch={updateSearch}/>
            )}
        </>
    );
}

export default EducatorsList;