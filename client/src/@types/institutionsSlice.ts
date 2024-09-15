export interface IInstitution {
    id: string;
    acceptanceRate: string;
    accreditationStatus: string;
    address: string;
    contact_email: string;
    country: string;
    description: string;
    image: string;
    name: string;
    rating: number;
    size: number;
    tuition: number;
    type: string;
    website: string;
    createdAt: string;
    updatedAt: string;
}

export interface ILoaders {
    getAllInstitutionsLoading: boolean;
    createInstitutionLoading: boolean;
    getSingleInstitutionLoading: boolean;
    editSingleInstitutionLoading: boolean;
    deleteSingleInstitutionLoading: boolean;
}

export interface IErrors {
    getAllInstitutionsError: string;
    createInstitutionError: string;
    editSingleInstitutionError: string;
    editSingleInstitutionImageError: string;
}

export interface IAllInstitutionsData {
    institutions: IInstitution[],
    totalInstitutions: number;
    numberOfPages: number;
    searchBoxValues: {
        name: string;
        type: string;
        ratingMin: string;
        ratingMax: string;
        sizeMin: string;
        sizeMax: string;
        tuitionMin: string;
        tuitionMax: string;
        accreditationStatus: string;
        acceptanceRate: string;
        country: string;
        sort: string;
        page: string;
    }
}

export interface IInstitutionsSlice {
    loaders: ILoaders;
    errors: IErrors;
    allInstitutionsData: IAllInstitutionsData;
    singleInstitutionData: IInstitution | null;
    isEditingInstitution: boolean;
}