import useStore from '../utils/redux';
import {Navigate} from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode,
    role: any[]
}

const ProtectedRoute: React.FunctionComponent<ProtectedRouteProps> = ({children, role}): any => {
    const user = useStore().selector.user.userData;
    if (!role.includes(user?.role)) {
        return <Navigate to='/'/>
    }
    return children;
}

export default ProtectedRoute;