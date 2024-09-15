import emptyProfilePicture from '../images/empty-profile-picture.png';
import {type IUser} from "../@types/userSlice";

interface ProfileDataProps {
    data: IUser
}

const ProfileData: React.FunctionComponent<ProfileDataProps> = ({data}) => {
    return (
        <div className="text-center">
            <img src={emptyProfilePicture} className="w-36 h-36 rounded-full inline-block mt-4 outline p-2 bg-sky-100" alt="Empty User"/>
            <div className="w-1/2 outline mx-auto rounded-lg p-4 mt-4">
                {data.role === 'USER' && (
                    <>
                        <div className="mt-4 border-b-4 border-sky-100 pb-4">
                            <div>Username - {data.username}</div>
                        </div>
                        <div className="mt-4 border-b-4 border-sky-100 pb-4">
                            <div>Email Address - {data.email}</div>
                        </div>
                        <div className="mt-4 border-b-4 border-sky-100 pb-4">
                            <div>Country - {data.country!.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}</div>
                        </div>
                    </>
                )}
                {(data.role === 'OWNER') && (
                    <>
                        <p>As the owner, you have extensive control over the platform, including the ability to create institutions, educators, and courses. You can also generate new admin users, providing additional management capabilities. Additionally, you have access to a comprehensive stats page that offers an overview of all platform activities, giving you valuable insights into user engagement and content creation.</p>
                        <div className="mt-4 border-b-4 border-sky-100 pb-4">
                            <div>Email Address - {data.email}</div>
                        </div>
                    </>
                )}
                {(data.role === 'ADMIN') && (
                    <>
                        <p>As an admin, you are empowered to create and manage institutions, educators, and courses within the platform. This role allows you to contribute to the growth and maintenance of the content, ensuring the platform remains up-to-date and relevant for all users.</p>
                        <div className="mt-4 border-b-4 border-sky-100 pb-4">
                            <div>Email Address - {data.email}</div>
                        </div>
                    </>
                )}
                {/* No need to show what role they are because all of them are of USER role. */}
                {/* <div className="mt-4 border-b-4 border-sky-100 pb-4">
                    <div>Role - {capitalize(data.role!)}</div>
                </div> */}
            </div>
        </div>
    );
}

export default ProfileData;