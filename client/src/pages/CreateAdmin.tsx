import React from 'react';
import useStore from "../utils/redux";
import {useNavigate} from "react-router-dom";
import {FaArrowLeft} from 'react-icons/fa';
import {setGenerateAdminError} from '../features/admin/adminSlice';
import {generateAdmin} from "../features/admin/adminThunk";
import {toast} from 'react-toastify';

const CreateAdmin: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const dispatch = useStore().dispatch;
    const {loaders, errors} = useStore().selector.admin;
    const handleSubmit = async(event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        formData.append('email', (target.elements.namedItem('email') as HTMLInputElement).value);
        try {
            await dispatch(generateAdmin(formData)).unwrap();
            (document.querySelector('#email') as HTMLInputElement).value = '';
            toast.success('Successfuly Created Admin Account');
            navigate('/overview');
        }
        catch(error: any) {}
    }
    React.useEffect(() => {
        return () => {
            dispatch(setGenerateAdminError(''));
        }
    }, [dispatch]);
    return (
        <div>
            <div onClick={() => {
                navigate('/overview');
            }} className="inline-flex justify-start items-center mb-4">
                <span className="mr-4 cursor-pointer"><FaArrowLeft/></span>
                <div className="cursor-pointer">Overview</div>
            </div>
            <div className="border-b-2 mb-4"></div>
            <h1 className="text-center mt-4 text-2xl font-semibold">Generate Admin Account</h1>
            <form className="w-1/2 mx-auto" onSubmit={handleSubmit}>
                <p className="mt-4">As an Owner, you have the unique capability to create new Admin accounts. To initiate this process, enter the email address of the individual you wish to appoint as an Admin. Upon successful submission, an email will be sent to the provided address containing the login credentials for the new Admin account. Double-check the email address to ensure it is correct, as this is how the new Admin will receive their access details.</p>
                <p className="mt-4">Please be aware that Admin accounts created through this form are non-changeable. This means once the account is set up, its role and permissions cannot be modified. It's important to inform the new Admin about this fixed status so they understand the nature of their account.</p>
                <div className="mt-4 flex flex-col">
                    <label htmlFor="email" className="font-semibold">Email</label>
                    <input className={`outline mt-2 p-2 rounded-md focus:outline-black`} id="email" type="email" name="email"/>
                </div>
                {errors.generateAdminError && <p className="text-center mt-4 text-red-600">{errors.generateAdminError}</p>}
                <button className={`w-full p-2 mt-4 rounded-lg bg-sky-400 text-black cursor-pointer outline ${loaders.generateAdminLoading && 'bg-red-400'}`} type="submit" disabled={loaders.generateAdminLoading}>{loaders.generateAdminLoading ? 'Creating' : 'Create'}</button>
            </form>
        </div>
    );
}

export default CreateAdmin;