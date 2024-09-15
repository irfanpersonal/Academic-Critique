import {createSlice} from '@reduxjs/toolkit';
// The "type" you see before "IUserSlice" is whats called a "type-only import" they
// are used in TypeScript to signify that the import is only for type checking and 
// won't be included in the final JavaScript output. This helps keep the final bundle
// size smaller by excluding type-only imports from the build.
import {type IUserSlice} from '../../@types/userSlice';
import {registerUser, loginUser, showCurrentUser, getProfileData, logoutUser, updatePassword, updateProfile, getAllUsers, getSingleUser} from './userThunk';
import {toast} from 'react-toastify';

const initialState: IUserSlice = {
    globalLoading: true,
    getProfileDataLoading: true,
    editingProfile: false,
    updatePasswordLoading: false,
    updateProfileLoading: false,
    getAllUsersLoading: true,
    getSingleUserLoading: true,
    singleUserData: {
        id: null,
        username: null,
        email: null,
        country: null,
        role: null
    },
    allUsersData: {
        users: [],
        totalUsers: 0,
        numberOfPages: 0,
        searchBoxValues: {
            username: '',
            country: 'UNITED_STATES',
            page: '1'
        }
    },
    userData: {
        id: null,
        username: null,
        email: null,
        country: null,
        role: null
    },
    authenticationData: {
        wantsToRegister: true,
        authLoading: false,
        logoutLoading: false,
        authError: {
            text: null,
            duplicate: null,
            notProvided: null,
            incorrect: null
        }
    }
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        toggleAuthType: (state) => {
            state.authenticationData.wantsToRegister = !state.authenticationData.wantsToRegister;
        },
        toggleEditingProfile: (state) => {
            state.editingProfile = !state.editingProfile;
        },
        updateAllUsersSearchBoxValues: (state, action) => {
            state.allUsersData.searchBoxValues[action.payload.name as keyof typeof state.allUsersData.searchBoxValues] = action.payload.value;
        },
        changePage: (state, action) => {
            state.allUsersData.searchBoxValues.page = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state) => {
            state.authenticationData.authLoading = true;
        }).addCase(registerUser.fulfilled, (state, action) => {
            state.authenticationData.authLoading = false;
            state.userData.id = action.payload.id;
            state.userData.username = action.payload.username;
            state.userData.email = action.payload.email;
            state.userData.country = action.payload.country;
            state.userData.role = action.payload.role;
        }).addCase(registerUser.rejected, (state, action) => {
            state.authenticationData.authLoading = false;
            const result = action.payload as any;
            state.authenticationData.authError.duplicate = null;
            state.authenticationData.authError.incorrect = null;
            state.authenticationData.authError.notProvided = null;
            if (result?.text) {
                state.authenticationData.authError.text = result.text;
            }
            else if (result) {
                state.authenticationData.authError.text = result;
            }
            if (result?.duplicate) {
                state.authenticationData.authError.duplicate = result.duplicate;
            }
        }).addCase(loginUser.pending, (state) => {
            state.authenticationData.authLoading = true;
        }).addCase(loginUser.fulfilled, (state, action) => {
            state.authenticationData.authLoading = false;
            state.userData.id = action.payload.id;
            state.userData.username = action.payload.username;
            state.userData.email = action.payload.email;
            state.userData.country = action.payload.country;
            state.userData.role = action.payload.role;
            toast.success('Successfully Logged In!');
        }).addCase(loginUser.rejected, (state, action) => {
            state.authenticationData.authLoading = false;
            const result = action.payload as any;
            state.authenticationData.authError.duplicate = null;
            state.authenticationData.authError.incorrect = null;
            state.authenticationData.authError.notProvided = null;
            if (result?.text) {
                state.authenticationData.authError.text = result.text;
            }
            else if (result) {
                state.authenticationData.authError.text = result;
            }
            if (result?.notProvided) {
                state.authenticationData.authError.notProvided = result.notProvided;
            }
            else if (result?.incorrect) {
                state.authenticationData.authError.incorrect = result.incorrect;
            }
        }).addCase(showCurrentUser.pending, (state) => {
            state.globalLoading = true;
        }).addCase(showCurrentUser.fulfilled, (state, action) => {
            state.userData.id = action.payload.id;
            state.userData.username = action.payload.username;
            state.userData.email = action.payload.email;
            state.userData.country = action.payload.country;
            state.userData.role = action.payload.role;
            state.globalLoading = false;
        }).addCase(showCurrentUser.rejected, (state) => {
            state.globalLoading = false;
        }).addCase(getProfileData.pending, (state) => { 
            state.getProfileDataLoading = true;
        }).addCase(getProfileData.fulfilled, (state, action) => {
            state.userData.id = action.payload.id;
            state.userData.username = action.payload.username;
            state.userData.email = action.payload.email;
            state.userData.role = action.payload.role;
            state.userData.country = action.payload.country;
            state.getProfileDataLoading = false;
        }).addCase(logoutUser.pending, (state) => {
            state.authenticationData.logoutLoading = true;
        }).addCase(logoutUser.fulfilled, (state, action) => {
            state.userData.id = null;
            state.userData.username = null;
            state.userData.email = null;
            state.userData.country = null;
            state.userData.role = null;
            state.authenticationData.logoutLoading = false;
        }).addCase(logoutUser.rejected, (state) => {
            state.authenticationData.logoutLoading = false;
        }).addCase(updatePassword.pending, (state) => {
            state.updatePasswordLoading = true;
        }).addCase(updatePassword.fulfilled, (state, action) => {
            state.updatePasswordLoading = false;
        }).addCase(updatePassword.rejected, (state, action) => {
            state.updatePasswordLoading = false;
            toast.error(action.payload as string);
        }).addCase(updateProfile.pending, (state) => {
            state.updateProfileLoading = true;
        }).addCase(updateProfile.fulfilled, (state, action) => {
            state.userData.id = action.payload.id;
            state.userData.username = action.payload.username;
            state.userData.email = action.payload.email;
            state.userData.role = action.payload.role;
            state.userData.country = action.payload.country;
            state.updateProfileLoading = false;
        }).addCase(updateProfile.rejected, (state) => {
            state.updatePasswordLoading = false;
        }).addCase(getAllUsers.pending, (state) => {
            state.getAllUsersLoading = true;
        }).addCase(getAllUsers.fulfilled, (state, action) => {
            state.allUsersData.users = action.payload.users;
            state.allUsersData.totalUsers = action.payload.totalUsers;
            state.allUsersData.numberOfPages = action.payload.numberOfPages;
            state.getAllUsersLoading = false;
        }).addCase(getAllUsers.rejected, (state) => {
            state.getAllUsersLoading = false;
        }).addCase(getSingleUser.pending, (state) => {
            state.getSingleUserLoading = true;
        }).addCase(getSingleUser.fulfilled, (state, action) => {
            state.singleUserData = action.payload;
            state.getSingleUserLoading = false;
        }).addCase(getSingleUser.rejected, (state) => {
            state.getSingleUserLoading = true;
        })
    }
});

export const {toggleAuthType, toggleEditingProfile, updateAllUsersSearchBoxValues, changePage} = userSlice.actions;

export default userSlice.reducer;