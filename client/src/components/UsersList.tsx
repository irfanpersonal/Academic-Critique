import useStore from "../utils/redux";
import {type IUser} from "../@types/userSlice";
import {UsersListItem, PaginationBox} from '.';
import {changePage} from "../features/user/userSlice";
import {getAllUsers} from "../features/user/userThunk";

interface UsersListProps {
    data: IUser[]
}

const UsersList: React.FunctionComponent<UsersListProps> = ({data}) => {
    const {numberOfPages, searchBoxValues: {page}} = useStore().selector.user.allUsersData;
    return (
        <section>
            {!data.length && (
                <h1 className="text-center font-semibold">No Users Found...</h1>
            )}
            {data.map(item => {
                return (
                    <UsersListItem key={item.id} data={item}/>
                );
            })}
            {numberOfPages > 1 && (
                <PaginationBox numberOfPages={numberOfPages} page={Number(page)} changePage={changePage} updateSearch={getAllUsers}/>
            )}
        </section>
    );
}

export default UsersList;