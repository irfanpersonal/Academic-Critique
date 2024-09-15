import {createSlice} from '@reduxjs/toolkit';
import {IInstitutionsSlice} from '../../@types/institutionsSlice';
import {getAllInstitutions, createInstitution, getSingleInstitution, editSingleInstitution, editSingleInstitutionImage, deleteSingleInstitution} from './institutionsThunk';
import {toast} from 'react-toastify';

const initialState: IInstitutionsSlice = {
    loaders: {
        getAllInstitutionsLoading: true,
        createInstitutionLoading: false,
        getSingleInstitutionLoading: true,
        editSingleInstitutionLoading: false,
        deleteSingleInstitutionLoading: false
    },
    errors: {
        getAllInstitutionsError: '',
        createInstitutionError: '',
        editSingleInstitutionError: '',
        editSingleInstitutionImageError: ''
    },
    singleInstitutionData: null,
    allInstitutionsData: {
        institutions: [],
        numberOfPages: 0,
        totalInstitutions: 0,
        searchBoxValues: {
            name: '',
            type: '',
            ratingMin: '',
            ratingMax: '',
            sizeMin: '',
            sizeMax: '',
            tuitionMin: '',
            tuitionMax: '',
            accreditationStatus: '',
            acceptanceRate: '',
            country: '',
            sort: '',
            page: '1'
        }
    },
    isEditingInstitution: false  
};

const institutionSlice = createSlice({
    name: 'institutions',
    initialState,
    reducers: {
        updateSearchBoxValues: (state, action) => {
            state.allInstitutionsData.searchBoxValues[action.payload.name as keyof typeof state.allInstitutionsData.searchBoxValues] = action.payload.value;
        },
        changePage: (state, action) => {
            state.allInstitutionsData.searchBoxValues.page = action.payload;
        },
        toggleIsEditingInstitution: (state) => {
            state.isEditingInstitution = !state.isEditingInstitution;
        },
        updateEditSingleInstitutionLoading: (state, action) => {
            state.loaders.editSingleInstitutionLoading = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAllInstitutions.pending, (state) => {
            state.loaders.getAllInstitutionsLoading = true;
        }).addCase(getAllInstitutions.fulfilled, (state, action) => {
            state.allInstitutionsData.institutions = action.payload.institutions;
            state.allInstitutionsData.totalInstitutions = action.payload.totalInstitutions;
            state.allInstitutionsData.numberOfPages = action.payload.numberOfPages;
            state.loaders.getAllInstitutionsLoading = false;
        }).addCase(getAllInstitutions.rejected, (state) => {
            state.errors.getAllInstitutionsError = 'We encountered an issue gathering the institutions data...';
            state.loaders.getAllInstitutionsLoading = false;
        }).addCase(createInstitution.pending, (state) => {
            state.loaders.createInstitutionLoading = true;
        }).addCase(createInstitution.fulfilled, (state) => {
            state.errors.createInstitutionError = '';
            state.loaders.createInstitutionLoading = false;
        }).addCase(createInstitution.rejected, (state, action) => {
            state.errors.createInstitutionError = action.payload as string;
            state.loaders.createInstitutionLoading = false;
        }).addCase(getSingleInstitution.pending, (state) => {
            state.loaders.getSingleInstitutionLoading = true;
        }).addCase(getSingleInstitution.fulfilled, (state, action) => {
            state.singleInstitutionData = action.payload;
            state.loaders.getSingleInstitutionLoading = false;
        }).addCase(getSingleInstitution.rejected, (state) => {
            state.loaders.getSingleInstitutionLoading = true;
        }).addCase(editSingleInstitution.pending, (state) => {
            state.loaders.editSingleInstitutionLoading = true;
        }).addCase(editSingleInstitution.fulfilled, (state, action) => {
            state.singleInstitutionData = action.payload;
            state.errors.editSingleInstitutionError = '';
            state.loaders.editSingleInstitutionLoading = false;
        }).addCase(editSingleInstitution.rejected, (state, action) => {
            state.errors.editSingleInstitutionError = action.payload as string;
            state.loaders.editSingleInstitutionLoading = false;
        }).addCase(editSingleInstitutionImage.pending, (state) => {
            state.loaders.editSingleInstitutionLoading = true;
        }).addCase(editSingleInstitutionImage.fulfilled, (state, action) => {
            state.loaders.editSingleInstitutionLoading = true;
            state.singleInstitutionData!.image = action.payload.institution_image;
        }).addCase(editSingleInstitutionImage.rejected, (state, action) => {
            state.errors.editSingleInstitutionImageError = action.payload as string;
            state.loaders.editSingleInstitutionLoading = true;
        }).addCase(deleteSingleInstitution.pending, (state) => {
            state.loaders.deleteSingleInstitutionLoading = true;
        }).addCase(deleteSingleInstitution.fulfilled, (state) => {
            state.loaders.deleteSingleInstitutionLoading = false;
        }).addCase(deleteSingleInstitution.rejected, (state, action) => {
            toast.error(action.payload as string);
            state.loaders.deleteSingleInstitutionLoading = false;
        });
    }
});

export const {updateSearchBoxValues, changePage, toggleIsEditingInstitution, updateEditSingleInstitutionLoading} = institutionSlice.actions;

export default institutionSlice.reducer;