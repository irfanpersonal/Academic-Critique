import useStore from "../utils/redux";
import {useNavigate} from "react-router-dom";
import {FaArrowLeft} from "react-icons/fa";
import {institutionTypes, institutionAcceptanceRate, institutionAccreditationStatus} from '../utils/institutions_filter';
import {countries} from "../utils/countries";
import {createInstitution} from "../features/institutions/institutionsThunk";
import {toast} from 'react-toastify';

const AddInstitution: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const dispatch = useStore().dispatch;
    const {loaders, errors} = useStore().selector.institutions;
    const handleSubmit = async(event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        formData.append('name', (target.elements.namedItem('name') as HTMLInputElement).value);
        formData.append('description', (target.elements.namedItem('description') as HTMLInputElement).value);
        formData.append('type', (target.elements.namedItem('type') as HTMLInputElement).value);
        formData.append('address', (target.elements.namedItem('address') as HTMLInputElement).value);
        formData.append('contact_email', (target.elements.namedItem('contact_email') as HTMLInputElement).value);
        formData.append('website', (target.elements.namedItem('website') as HTMLInputElement).value);
        formData.append('size', (target.elements.namedItem('size') as HTMLInputElement).value);
        formData.append('country', (target.elements.namedItem('country') as HTMLInputElement).value);
        formData.append('tuition', (target.elements.namedItem('tuition') as HTMLInputElement).value);
        formData.append('acceptanceRate', (target.elements.namedItem('acceptanceRate') as HTMLInputElement).value);
        formData.append('accreditationStatus', (target.elements.namedItem('accreditationStatus') as HTMLInputElement).value);
        if (target.image.files[0]) {
            formData.append('image', target.image.files[0]);
        }
        try {
            await dispatch(createInstitution(formData)).unwrap();
            toast.success('Created Institution');
            navigate('/institutions');
            window.scroll({top: 0, behavior: 'smooth'});
        }
        catch(error: any) {}
    }
    return (
        <div>
            <div onClick={() => {
                navigate('/institutions');
            }} className="inline-flex justify-start items-center mb-4">
                <span className="mr-4 cursor-pointer"><FaArrowLeft/></span>
                <div className="cursor-pointer">Institutions</div>
            </div>
            <div className="border-b-2 mb-4"></div>
            <form className="w-1/2 mx-auto mt-4" onSubmit={handleSubmit}>
                <h1 className="text-2xl text-center font-bold mb-4">Create Institution</h1>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2" htmlFor="name">Name</label>
                    <input className="mb-2 p-2" id="name" type="text" name="name" required/>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2" htmlFor="description">Description</label>
                    <textarea className="mb-2 p-2 resize-none h-48" id="description" name="description" maxLength={1000} required></textarea>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2" htmlFor="type">Type</label>
                    <select id="type" className="p-2 mb-2" name="type" required>
                        <option value=""></option>
                        {institutionTypes.map(institutionType => {
                            return (
                                <option key={institutionType} value={institutionType}>{institutionType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}</option>
                            );
                        })}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2" htmlFor="address">Address</label>
                    <input id="address" className="p-2 mb-2" type="text" name="address" required/>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2" htmlFor="contact_email">Contact Email</label>
                    <input id="contact_email" className="p-2 mb-2" type="email" name="contact_email" required/>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2" htmlFor="website">Website</label>
                    <input className="p-2 mb-2" id="website" type="url" name="website" required/>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2" htmlFor="size">Size</label>
                    <input className="p-2 mb-2" id="size" type="number" name="size" required/>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2" htmlFor="country">Country</label>
                    <select className="p-2 mb-2" id="country" name="country" required>
                        <option value=""></option>
                        {countries.map(country => {
                            return (
                                <option key={country} value={country}>{country.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}</option>
                            );
                        })}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2" htmlFor="tuition">Tuition</label>
                    <input className="p-2 mb-2" id="tuition" type="number" name="tuition" required/>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2" htmlFor="acceptanceRate">Acceptance Rate</label>
                    <select className="p-2 mb-2" id="acceptanceRate" name="acceptanceRate" required>
                        <option value=""></option>
                        {institutionAcceptanceRate.map(item => (
                            <option key={item} value={item}>
                                {item.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2" htmlFor="accreditationStatus">Accreditation Status</label>
                    <select className="p-2 mb-2" id="accreditationStatus" name="accreditationStatus" required>
                        <option value=""></option>
                        {institutionAccreditationStatus.map(item => (
                            <option key={item} value={item}>
                                {item.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2" htmlFor="image">Image</label>
                    <input className="outline p-2 mb-4 rounded-lg" id="image" type="file" name="image" required/>
                </div>
                {errors.createInstitutionError && (
                    <p className="mb-4 text-center text-red-600">{errors.createInstitutionError}</p>
                )}
                <button className="w-full bg-white hover:bg-black hover:text-white py-2 px-4 rounded-lg outline select-none" disabled={loaders.createInstitutionLoading}>{loaders.createInstitutionLoading ? 'Creating' : 'Create'}</button>
            </form>
        </div>
    );
}

export default AddInstitution;