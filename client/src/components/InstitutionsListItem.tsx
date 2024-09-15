import {type IInstitution} from "../@types/institutionsSlice";
import {Link} from 'react-router-dom';

interface InstitutionsListItemProps {
    data: IInstitution;
}

const InstitutionsListItem: React.FunctionComponent<InstitutionsListItemProps> = ({ data }) => {
    return (
        <article className="bg-white outline">
            <img src={data.image} alt={data.name} className="w-full h-48 object-cover border-b-2 border-black"/>
            <div className="p-4">
                <h2 className="text-2xl font-bold mb-2">{data.name}</h2>
                <p className="text-lg text-gray-600">{data.type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}</p>
                <div className="mt-2 mb-4">
                    <p className="text-sm text-gray-500">Acceptance Rate: {data.acceptanceRate.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}</p>
                    <p className="text-sm text-gray-500">Accreditation Status: {data.accreditationStatus.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}</p>
                    <p className="text-sm text-gray-500">Country: {data.country.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}</p>
                </div>
                <p className="text-sm text-gray-700 mb-4">{data.description}</p>
                <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Rating: {data.rating === 0 ? 'No Rating' : `${data.rating}/5`}</span>
                    <span className="text-lg font-semibold">Tuition: ${data.tuition}</span>
                </div>
                <div className="flex justify-between">
                    <div className="mt-4">
                        <a href={`mailto:${data.contact_email}`} className="text-blue-500 hover:underline">{data.contact_email}</a>
                        <br/>
                        <a href={data.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{data.website}</a>
                    </div>
                    <Link onClick={() => {
                        window.scroll({top: 0, behavior: 'smooth'});
                    }} to={`/institutions/${data.id}`} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded flex justify-center items-center hover:bg-blue-600">
                        View Details
                    </Link>
                </div>
            </div>
        </article>
    );
}

export default InstitutionsListItem;
