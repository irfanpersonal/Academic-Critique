import useStore from "../utils/redux";
import {type IUser} from "../@types/userSlice";
import {countries} from "../utils/countries";
import {updateProfile} from "../features/user/userThunk";
import {toast} from 'react-toastify';

interface EditProfileProps {
    data: IUser
}

const EditProfile: React.FunctionComponent<EditProfileProps> = ({data}) => {
    const {dispatch} = useStore();
    const {updateProfileLoading} = useStore().selector.user;
    const handleSubmit = async(event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        formData.append('username', (target.elements.namedItem('username') as HTMLInputElement).value);
        formData.append('email', (target.elements.namedItem('email') as HTMLInputElement).value);
        formData.append('country', (target.elements.namedItem('country') as HTMLInputElement).value);
        await dispatch(updateProfile(formData)).unwrap();
        toast.success('Edited Profile!');
    }
    return (
        <form className="w-1/2 mx-auto p-4 mt-4" onSubmit={handleSubmit}>
            <h1 className="text-center text-2xl border-b-2 border-black pb-2">Edit Profile</h1>
            <div className="mt-4 flex flex-col">
                <label htmlFor="username" className="font-semibold">Username</label>
                <input className={`outline mt-2 p-2 rounded-md focus:outline-black`} id="username" type="text" name="username" defaultValue={data.username!} required/>
            </div>
            <div className="mt-4 flex flex-col">
                <label htmlFor="email" className="font-semibold">Email</label>
                <input className={`outline mt-2 p-2 rounded-md focus:outline-black`} id="email" type="email" name="email" defaultValue={data.email!} required/>
            </div>
            <div className="mt-4 flex flex-col">
                <label htmlFor="country" className="font-semibold">Country</label>
                <select className="outline mt-2 p-2 rounded-md focus:outline-black" id="country" name="country" defaultValue={data.country!} required>
                    {countries.map(country => {
                        return (
                            <option key={country} value={country}>{country.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}</option>
                        );
                    })}
                </select>
            </div>
            <button className={`bg-black w-full mt-4 p-2 rounded-lg text-white ${updateProfileLoading ? 'bg-gray-400 text-black' : ''}`} disabled={updateProfileLoading}>{updateProfileLoading ? 'Editing' : 'Edit'}</button>
        </form>
    );
}

export default EditProfile;