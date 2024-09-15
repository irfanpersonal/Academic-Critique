import {useNavigate} from "react-router-dom";
import {type IUser} from "../@types/userSlice";

interface UsersListItemProps {
    data: IUser
}

const UsersListItem: React.FunctionComponent<UsersListItemProps> = ({data}) => {
    const navigate = useNavigate();
    return (
        <div className="cursor-pointer py-4 border-b-2" onClick={() => {
            window.scroll({top: 0, behavior: 'smooth'});
            navigate(`/users/${data.username}`);
        }}>
            <article className="flex justify-between items-center">
                <div>
                    <div>{data.username}</div>
                    <div className="text-xs">{data.email}</div>
                </div>
                <div>{data.country!.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}</div>
            </article>
        </div>
    );
}

export default UsersListItem;