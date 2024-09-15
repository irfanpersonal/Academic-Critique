import React from 'react';
import useStore from './utils/redux';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {AddCourse, AddEducator, AddInstitution, Auth, Courses, CreateAdmin, Educators, Error, Home, HomeLayout, Institutions, Overview, Profile, ProtectedRoute, SingleCourse, SingleEducator, SingleInstitution, SingleUser, UpdatePassword, Users} from './pages';
import {Loading} from './components';
import {showCurrentUser} from './features/user/userThunk';

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomeLayout/>,
        errorElement: <Error/>,
        children: [
            {
                index: true,
                element: <Home/>
            },
            {
                path: 'institutions',
                element: <Institutions/>
            },
            {
                path: 'institutions/:id',
                element: <SingleInstitution/>
            },
            {
                path: 'institutions/add',
                element: <ProtectedRoute role={['ADMIN', 'OWNER']}><AddInstitution/></ProtectedRoute>
            },
            {
                path: 'educators',
                element: <Educators/>
            },
            {
                path: 'educators/:id',
                element: <SingleEducator/>
            },
            {
                path: 'educators/add',
                element: <ProtectedRoute role={['ADMIN', 'OWNER']}><AddEducator/></ProtectedRoute>
            },
            {
                path: 'courses',
                element: <Courses/>
            },
            {
                path: 'courses/:id',
                element: <SingleCourse/>
            },
            {
                path: 'courses/add',
                element: <ProtectedRoute role={['ADMIN', 'OWNER']}><AddCourse/></ProtectedRoute>
            },
            {
                path: 'profile',
                element: <ProtectedRoute role={['USER', 'ADMIN', 'OWNER']}><Profile/></ProtectedRoute>
            },
            {
                path: 'profile/updatePassword',
                element: <ProtectedRoute role={['USER']}><UpdatePassword/></ProtectedRoute>
            },
            {
                path: 'users',
                element: <Users/>
            },
            {
                path: 'users/:username',
                element: <SingleUser/>
            },
            {
                path: 'overview',
                element: <ProtectedRoute role={['OWNER']}><Overview/></ProtectedRoute>
            },
            {
                path: 'overview/generate-admin',
                element: <ProtectedRoute role={['OWNER']}><CreateAdmin/></ProtectedRoute>
            }
        ]
    },
    {
        path: '/auth',
        element: <Auth/>,
        errorElement: <Error/>
    }
])

const App: React.FunctionComponent = () => {
    const {dispatch, selector: {user: {globalLoading}}} = useStore();
    React.useEffect(() => {
        dispatch(showCurrentUser());
    }, [dispatch]);
    if (globalLoading) {
        return (
            <Loading title="Loading Application" position="center"/>
        );
    }
    return (
        <RouterProvider router={router}/>
    );
}

export default App;