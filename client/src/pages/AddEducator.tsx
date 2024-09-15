import React from 'react';
import useStore from "../utils/redux";
import {useNavigate} from "react-router-dom";
import {FaArrowLeft} from "react-icons/fa";
import {educatorDepartments, educatorStatuses} from "../utils/educators_filter";
import {createEducator} from "../features/educators/educatorsThunk";
import {toast} from 'react-toastify';
import {setFromInstitutionPage} from "../features/educators/educatorsSlice";

const AddEducator: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const dispatch = useStore().dispatch;
    const {loaders, errors, fromInstitutionPage} = useStore().selector.educators;
    const handleSubmit = async(event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        formData.append('name', (target.elements.namedItem('name') as HTMLInputElement).value);
        formData.append('description', (target.elements.namedItem('description') as HTMLInputElement).value);
        formData.append('email', (target.elements.namedItem('email') as HTMLInputElement).value);
        formData.append('department', (target.elements.namedItem('department') as HTMLInputElement).value);
        formData.append('status', (target.elements.namedItem('status') as HTMLInputElement).value);
        formData.append('institution_id', fromInstitutionPage.id!);
        if (target.image.files[0]) {
            formData.append('image', target.image.files[0]);
        }
        try {
            const result = await dispatch(createEducator(formData)).unwrap();
            navigate(`/educators/${result.id}`);
            window.scroll({top: 0, behavior: 'smooth'});
            toast.success('Created Educator');
        }
        catch(error: any) {}
    }
    React.useEffect(() => {
        if (Object.values(fromInstitutionPage).every(value => value === null)) {
            navigate('/');
        }
    }, [fromInstitutionPage, navigate]);
    return (
        <div>
            <div onClick={() => {
                navigate(`/institutions/${fromInstitutionPage.id}`);
            }} className="inline-flex justify-start items-center mb-4">
                <span className="mr-4 cursor-pointer"><FaArrowLeft/></span>
                <div className="cursor-pointer">{fromInstitutionPage.name}</div>
            </div>
            <div className="border-b-2 mb-4"></div>
            <form className="w-1/2 mx-auto mt-4" onSubmit={handleSubmit}>
                <h1 className="text-2xl text-center font-bold mb-4">Create Educator</h1>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2" htmlFor="name">Name</label>
                    <input className="mb-2 p-2" id="name" type="text" name="name" required/>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2" htmlFor="description">Description</label>
                    <textarea className="mb-2 p-2 resize-none h-48" id="description" name="description" maxLength={1000} required></textarea>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2" htmlFor="email">Email</label>
                    <input className="mb-2 p-2" id="email" type="email" name="email" required/>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2" htmlFor="department">Department</label>
                    <select id="department" className="p-2 mb-2" name="department" required>
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
                    <select id="status" className="p-2 mb-2" name="status" required>
                        <option value=""></option>
                        {educatorStatuses.map(educatorStatus => {
                            return (
                                <option key={educatorStatus} value={educatorStatus}>{educatorStatus.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}</option>
                            );
                        })}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2" htmlFor="name">Institution</label>
                    <input className="mb-2 p-2 cursor-not-allowed bg-gray-400 outline-none" name="institution_id" defaultValue={`${fromInstitutionPage.name!} | ${fromInstitutionPage.id!}`} readOnly/>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-2" htmlFor="image">Image</label>
                    <input className="outline p-2 mb-4 rounded-lg" id="image" type="file" accept=".jpg,.jpeg,.png" name="image" required/>
                </div>
                {errors.createEducatorError && (
                    <p className="mb-4 text-center text-red-600">{errors.createEducatorError}</p>
                )}
                <button onClick={() => {
                    navigate(`/institutions/${fromInstitutionPage.id}`);
                    window.scroll({top: 0, behavior: 'smooth'});
                    dispatch(setFromInstitutionPage({id: null, name: null}));
                }} className="w-full bg-white hover:bg-black hover:text-white py-2 px-4 rounded-lg outline select-none mb-4">Cancel</button>
                <button className="w-full bg-white hover:bg-black hover:text-white py-2 px-4 rounded-lg outline select-none" disabled={loaders.createEducatorLoading}>{loaders.createEducatorLoading ? 'Creating' : 'Create'}</button>
            </form>
        </div>
    );
}

export default AddEducator;