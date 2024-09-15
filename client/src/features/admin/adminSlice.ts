import {createSlice} from '@reduxjs/toolkit';
import {type IAdminSlice} from '../../@types/adminSlice';
import {getOverviewData, generateAdmin} from './adminThunk';

const initialState: IAdminSlice = {
    loaders: {
        getOverviewDataLoading: true,
        generateAdminLoading: false
    },
    errors: {
        getOverviewDataError: false,
        generateAdminError: ''
    },
    overviewData: null
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setGenerateAdminError: (state, action) => {
            state.errors.generateAdminError = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getOverviewData.pending, (state) => {
            state.loaders.getOverviewDataLoading = true;
        }).addCase(getOverviewData.fulfilled, (state, action) => {
            state.overviewData = action.payload;
            state.loaders.getOverviewDataLoading = false;
        }).addCase(getOverviewData.rejected, (state) => {
            state.errors.getOverviewDataError = true;
            state.loaders.getOverviewDataLoading = false;
        }).addCase(generateAdmin.pending, (state) => {
            state.loaders.generateAdminLoading = true;
        }).addCase(generateAdmin.fulfilled, (state) => {
            state.loaders.generateAdminLoading = false;
            state.errors.generateAdminError = '';
        }).addCase(generateAdmin.rejected, (state, action) => {
            state.errors.generateAdminError = action.payload as string;
            state.loaders.generateAdminLoading = false;
        })
    }
});

export const {setGenerateAdminError} = adminSlice.actions;

export default adminSlice.reducer;