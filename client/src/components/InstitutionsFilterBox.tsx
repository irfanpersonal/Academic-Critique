import useStore from '../utils/redux';
import {institutionTypes, institutionAcceptanceRate, institutionAccreditationStatus, institutionSort} from '../utils/institutions_filter';
import {countries} from '../utils/countries';
import {updateSearchBoxValues} from '../features/institutions/institutionsSlice';
import {getAllInstitutions} from '../features/institutions/institutionsThunk';

const InstitutionsFilterBox: React.FunctionComponent = () => {
    const dispatch = useStore().dispatch;
    const {name, type, ratingMin, ratingMax, sizeMin, sizeMax, tuitionMin, tuitionMax, accreditationStatus, acceptanceRate, country, sort} = useStore().selector.institutions.allInstitutionsData.searchBoxValues;
    const {loaders} = useStore().selector.institutions;
    return (
        <div className="p-4 rounded-lg">
            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Search</label>
                <input id="name" name="name" value={name} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}));
                }} type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"/>
            </div>
            <div className="mb-4">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                <select id="type" name="type" value={type} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                    dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}));
                }} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm">
                    <option value=""></option>
                    {institutionTypes.map(institutionType => (
                        <option key={institutionType} value={institutionType}>
                            {institutionType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4 flex gap-2">
                <div className="flex-1">
                    <label htmlFor="ratingMin" className="block text-sm font-medium text-gray-700">Rating</label>
                    <div className="flex gap-2">
                        <input id="ratingMin" name="ratingMin" value={ratingMin} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}));
                        }} type="number" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" placeholder="Min"/>
                        <input id="ratingMax" name="ratingMax" value={ratingMax} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}));
                        }} type="number" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" placeholder="Max"/>
                    </div>
                </div>
            </div>
            <div className="mb-4 flex gap-2">
                <div className="flex-1">
                    <label htmlFor="size" className="block text-sm font-medium text-gray-700">Size</label>
                    <div className="flex gap-2">
                        <input id="sizeMin" name="sizeMin" value={sizeMin} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}));
                        }} type="number" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" placeholder="Min"/>
                        <input id="sizeMax" name="sizeMax" value={sizeMax} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}));
                        }} type="number" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" placeholder="Max"/>
                    </div>
                </div>
            </div>
            <div className="mb-4 flex gap-2">
                <div className="flex-1">
                    <label htmlFor="tuition" className="block text-sm font-medium text-gray-700">Tuition</label>
                    <div className="flex gap-2">
                        <input id="tuitionMin" name="tuitionMin" value={tuitionMin} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}));
                        }} type="number" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" placeholder="Min"/>
                        <input id="tuitionMax" name="tuitionMax" value={tuitionMax} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}));
                        }} type="number" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" placeholder="Max"/>
                    </div>
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="accreditationStatus" className="block text-sm font-medium text-gray-700">Accreditation Status</label>
                <select id="accreditationStatus" name="accreditationStatus" value={accreditationStatus} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                    dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}));
                }} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm">
                    <option value=""></option>
                    {institutionAccreditationStatus.map(item => (
                        <option key={item} value={item}>
                            {item.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label htmlFor="acceptanceRate" className="block text-sm font-medium text-gray-700">Acceptance Rate</label>
                <select id="acceptanceRate" name="acceptanceRate" value={acceptanceRate} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                    dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}));
                }} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm">
                    <option value=""></option>
                    {institutionAcceptanceRate.map(item => (
                        <option key={item} value={item}>
                            {item.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                <select id="country" name="country" value={country} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                    dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}));
                }} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm">
                    <option value=""></option>
                    {countries.map(country => (
                        <option key={country} value={country}>
                            {country.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="sort" className="block text-sm font-medium text-gray-700">Sort</label>
                <select id="sort" name="sort" value={sort} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                    dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}));
                }} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm">
                    <option value=""></option>
                    {institutionSort.map(item => (
                        <option key={item} value={item}>
                            {item.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}
                        </option>
                    ))}
                </select>
            </div>
            <button onClick={() => {
                window.scroll({top: 0, behavior: 'smooth'});
                // Calling dispatch(getAllInstitutions()) will interfere with window.scroll so add a timeout and
                // then execute it.
                setTimeout(() => {
                    dispatch(getAllInstitutions());
                }, 250);
            }} className="outline w-full mt-4 p-2 rounded-lg bg-black text-white" disabled={loaders.getAllInstitutionsLoading}>{loaders.getAllInstitutionsLoading ? 'Searching' : 'Search'}</button>
        </div>
    );
}

export default InstitutionsFilterBox;
