import useStore from "../utils/redux";
import {FaTimes} from "react-icons/fa";
import {toggleIsEditingEducator, updateEditSingleEducatorLoading} from "../features/educators/educatorsSlice";
import {educatorDepartments, educatorStatuses} from "../utils/educators_filter";
import {useParams} from "react-router-dom";
import {editSingleEducator, editSingleEducatorImage} from "../features/educators/educatorsThunk";
import {toast} from 'react-toastify';
import {type IEducator} from "../@types/educatorsSlice";

interface EditEducatorProps {
    data: IEducator
}

const EditEducator: React.FunctionComponent<EditEducatorProps> = ({data}) => {    
    const {id} = useParams();
    const dispatch = useStore().dispatch;
    const {loaders, errors} = useStore().selector.educators;
    const handleSubmit = async(event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        if (target.image.files[0]) {
            const formData = new FormData();
            formData.append('image', target.image.files[0]);
            try {
                await dispatch(editSingleEducatorImage({educator_id: id!, data: formData})).unwrap();
            }
            catch(error: any) {
                dispatch(updateEditSingleEducatorLoading(false));
                return;
            }
        }
        formData.append('name', (target.elements.namedItem('name') as HTMLInputElement).value);
        formData.append('description', (target.elements.namedItem('description') as HTMLInputElement).value);
        formData.append('email', (target.elements.namedItem('email') as HTMLInputElement).value);
        formData.append('department', (target.elements.namedItem('department') as HTMLSelectElement).value);
        formData.append('status', (target.elements.namedItem('status') as HTMLSelectElement).value);
        // Edit Thunk
        try {
            await dispatch(editSingleEducator({educator_id: id!, data: formData})).unwrap();
            toast.success('Edited Educator');
            dispatch(toggleIsEditingEducator());
            window.scroll({top: 0, behavior: 'smooth'});
        }
        catch(error: any) {}
    }
    return (
        <form className="w-1/2 mx-auto mt-4" onSubmit={handleSubmit}>
            <div className="flex items-center mb-4">
                <div onClick={() => {
                    dispatch(toggleIsEditingEducator());
                }} className="mr-4 outline rounded-full p-4 cursor-pointer hover:bg-black hover:text-white"><FaTimes/></div>
                <div className="bg-gray-400 p-4 rounded-2xl w-full text-center font-bold outline">Editing Educator</div>
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
                <label className="font-semibold mb-2" htmlFor="email">Email</label>
                <input className="mb-2 p-2" id="email" type="email" name="email" defaultValue={data!.email} required/>
            </div>
            <div className="flex flex-col">
                <label className="font-semibold mb-2" htmlFor="department">Department</label>
                <select id="department" className="p-2 mb-2" name="department" defaultValue={data!.department} required>
                    <option value=""></option>
                    {educatorDepartments.map(educatorDepartment => {
                        return (
                            <option key={educatorDepartment} value={educatorDepartment}>{educatorDepartment.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}</option>
                        );
                    })}
                </select>
            </div>
            <div className="flex flex-col">
                <label className="font-semibold mb-2" htmlFor="status">Status</label>
                <select id="status" className="p-2 mb-2" name="status" defaultValue={data!.status} required>
                    <option value=""></option>
                    {educatorStatuses.map(educatorStatus => {
                        return (
                            <option key={educatorStatus} value={educatorStatus}>{educatorStatus.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}</option>
                        );
                    })}
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
            {errors.editSingleEducatorError && (
                <p className="text-center mb-4 text-red-500">{errors.editSingleEducatorError}</p>
            )}
            {errors.editSingleEducatorImageError && (
                <p className="text-center mb-4 text-red-500">{errors.editSingleEducatorImageError}</p>
            )}
            <button className="w-full bg-white hover:bg-black hover:text-white py-2 px-4 rounded-lg outline select-none" disabled={loaders.editSingleEducatorLoading}>{loaders.editSingleEducatorLoading ? 'Editing' : 'Edit'}</button>
        </form>
    );
}

export default EditEducator;