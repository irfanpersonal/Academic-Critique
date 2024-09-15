import {FaArrowLeft} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import useStore from "../utils/redux";
import {updatePassword} from "../features/user/userThunk";

const UpdatePassword: React.FunctionComponent = () => {
    const {dispatch} = useStore();
    const {updatePasswordLoading} = useStore().selector.user;
    const navigate = useNavigate();
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        formData.append('oldPassword', ((target.elements.namedItem('oldPassword') as HTMLInputElement).value));
        formData.append('newPassword', ((target.elements.namedItem('newPassword') as HTMLInputElement).value));
        dispatch(updatePassword(formData));
    }
    return (
        <>
            <div onClick={() => {
                window.scroll({top: 0, behavior: 'smooth'});
                navigate('/profile');
            }} className="flex items-center border-b-4 pb-4">
                <span className="mr-4 cursor-pointer"><FaArrowLeft/></span>
                <div className="cursor-pointer">Profile</div>
            </div>
            <h1 className="text-center mt-4 text-2xl font-semibold">Update Password</h1>
            <form className="w-1/2 mx-auto mt-4" onSubmit={handleSubmit}>
                <p>To enhance your account security, please provide your current password in the 'Old Password' field, followed by your new password in the 'New Password' field. Ensure your new password is strong and memorable. Once submitted, your password will be updated, giving you access with your new credentials.</p>
                <div className="mt-4">
                    <label htmlFor="oldPassword">Old Password</label>
                    <input className="block py-2 px-4 outline w-full mt-2 rounded-lg focus:outline-black" id="oldPassword" type="password" name="oldPassword"/>
                </div>
                <div className="mt-4">
                    <label htmlFor="newPassword">New Password</label>
                    <input className="block py-2 px-4 outline w-full mt-2 rounded-lg focus:outline-black" id="newPassword" type="password" name="newPassword"/>
                </div>
                <button type="submit" className={`py-2 px-4 bg-black mt-4 text-white w-full rounded-lg ${updatePasswordLoading ? 'bg-gray-400 text-black' : ''}`} disabled={updatePasswordLoading}>{updatePasswordLoading ? 'Updating' : 'Update'}</button>
            </form>
        </>
    );
}

export default UpdatePassword;