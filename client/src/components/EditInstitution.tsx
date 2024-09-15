import useStore from "../utils/redux";
import {type IInstitution} from "../@types/institutionsSlice";
import {institutionTypes, institutionAccreditationStatus, institutionAcceptanceRate} from '../utils/institutions_filter';
import {countries} from "../utils/countries";
import {FaTimes} from "react-icons/fa";
import {toggleIsEditingInstitution, updateEditSingleInstitutionLoading} from "../features/institutions/institutionsSlice";
import {useParams} from "react-router-dom";
import {editSingleInstitution, editSingleInstitutionImage} from "../features/institutions/institutionsThunk";
import {toast} from 'react-toastify';

interface EditInstitutionProps {
    data: IInstitution
}

const EditInstitution: React.FunctionComponent<EditInstitutionProps> = ({data}) => {    
    const {id} = useParams();
    const dispatch = useStore().dispatch;
    const {loaders, errors} = useStore().selector.institutions;
    const handleSubmit = async(event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        if (target.image.files[0]) {
            const formData = new FormData();
            formData.append('image', target.image.files[0]);
            try {
                await dispatch(editSingleInstitutionImage({institutionId: id!, data: formData})).unwrap();
            }
            catch(error: any) {
                dispatch(updateEditSingleInstitutionLoading(false));
                return;
            }
        }
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
        // Edit Thunk
        try {
            await dispatch(editSingleInstitution({institutionId: id!, data: formData})).unwrap();
            toast.success('Edited Institution');
            dispatch(toggleIsEditingInstitution());
            window.scroll({top: 0, behavior: 'smooth'});
        }
        catch(error: any) {}
    }
    return (
        <form className="w-1/2 mx-auto mt-4" onSubmit={handleSubmit}>
            <div className="flex items-center mb-4">
                <div onClick={() => {
                    dispatch(toggleIsEditingInstitution());
                }} className="mr-4 outline rounded-full p-4 cursor-pointer hover:bg-black hover:text-white"><FaTimes/></div>
                <div className="bg-gray-400 p-4 rounded-2xl w-full text-center font-bold outline">Editing Institution</div>
            </div>
            <div className="flex flex-col">
                <label className="font-semibold mb-2" htmlFor="name">Name</label>
                <input className="mb-2 p-2" id="name" type="text" name="name" defaultValue={data!.name} required/>
            </div>
            <div className="flex flex-col">
                <label className="font-semibold mb-2" htmlFor="description">Description</label>
                <textarea className="mb-2 p-2 resize-none h-48" id="description" name="description" maxLength={1000} defaultValue={data!.description} required></textarea>
            </div>
            <div className="flex flex-col">
                <label className="font-semibold mb-2" htmlFor="type">Type</label>
                <select id="type" className="p-2 mb-2" name="type" defaultValue={data!.type} required>
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
                <input id="address" className="p-2 mb-2" type="text" name="address" defaultValue={data!.address} required/>
            </div>
            <div className="flex flex-col">
                <label className="font-semibold mb-2" htmlFor="contact_email">Contact Email</label>
                <input id="contact_email" className="p-2 mb-2" type="email" name="contact_email" defaultValue={data!.contact_email} required/>
            </div>
            <div className="flex flex-col">
                <label className="font-semibold mb-2" htmlFor="website">Website</label>
                <input className="p-2 mb-2" id="website" type="url" name="website" defaultValue={data!.website} required/>
            </div>
            <div className="flex flex-col">
                <label className="font-semibold mb-2" htmlFor="size">Size</label>
                <input className="p-2 mb-2" id="size" type="number" name="size" min="1" defaultValue={data!.size} required/>
            </div>
            <div className="flex flex-col">
                <label className="font-semibold mb-2" htmlFor="country">Country</label>
                <select className="p-2 mb-2" id="country" name="country" defaultValue={data!.country} required>
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
                <input className="p-2 mb-2" id="tuition" type="number" name="tuition" min="1" defaultValue={data!.tuition} required/>
            </div>
            <div className="flex flex-col">
                <label className="font-semibold mb-2" htmlFor="acceptanceRate">Acceptance Rate</label>
                <select className="p-2 mb-2" id="acceptanceRate" name="acceptanceRate" defaultValue={data!.acceptanceRate} required>
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
                <select className="p-2 mb-2" id="accreditationStatus" name="accreditationStatus" defaultValue={data!.accreditationStatus} required>
                    <option value=""></option>
                    {institutionAccreditationStatus.map(item => (
                        <option key={item} value={item}>
                            {item.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col items-center">
                <p>Current Image</p>
                <img className="w-48 h-48 outline rounded-lg" src={data!.image} alt={data!.name}/>
            </div>
            <div className="flex flex-col">
                <label className="font-semibold mb-2" htmlFor="image">Image</label>
                <input className="outline p-2 mb-4 rounded-lg" id="image" type="file" name="image"/>
            </div>
            {errors.editSingleInstitutionError && (
                <p className="text-center mb-4 text-red-500">{errors.editSingleInstitutionError}</p>
            )}
            {errors.editSingleInstitutionImageError && (
                <p className="text-center mb-4 text-red-500">{errors.editSingleInstitutionImageError}</p>
            )}
            <button className="w-full bg-white hover:bg-black hover:text-white py-2 px-4 rounded-lg outline select-none" disabled={loaders.editSingleInstitutionLoading}>{loaders.editSingleInstitutionLoading ? 'Editing' : 'Edit'}</button>
        </form>
    );
}

export default EditInstitution;