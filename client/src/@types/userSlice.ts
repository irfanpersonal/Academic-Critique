// The reason we aren't wrapping the IUser interface inside of the "declare global {}"
// block is because doing so pollutes the global namespace. We don't want the things 
// we write here to interfere with other things.

// Also notice how we didn't name this file "userSlice.d.ts", this is because its actually 
// frowned upon to do this. ".d.ts" files are meant strictly for TypeScript to know some
// type information while ".ts" files are for type information AND runtime code. So only 
// use ".d.ts" files if you want to notify TypeScript of important type information and 
// ".ts" files if you want to define type information and runtime code. 

export interface IUser {
    id: string | null;
    username: string | null;
    email: string | null;
    country: string | null;
    role: 'USER' | 'ADMIN' | 'OWNER' | null;
}

export interface IAuthenticationData {
    wantsToRegister: boolean;
    authLoading: boolean;
    logoutLoading: boolean;
    authError: {
        text: string | null;
        duplicate: string[] | null;
        notProvided: string[] | null;
        incorrect: string[] | null;
    }
}

export interface IAllUsersData {
    users: IUser[];
    totalUsers: number;
    numberOfPages: number;
    searchBoxValues: {
        username: string;
        country: string;
        page: string;
    }
}

export interface IUserSlice {
    globalLoading: boolean;
    getProfileDataLoading: boolean;
    editingProfile: boolean;
    updatePasswordLoading: boolean;
    updateProfileLoading: boolean;
    getAllUsersLoading: boolean;
    getSingleUserLoading: boolean;
    singleUserData: IUser;
    allUsersData: IAllUsersData;
    userData: IUser;
    authenticationData: IAuthenticationData;
}