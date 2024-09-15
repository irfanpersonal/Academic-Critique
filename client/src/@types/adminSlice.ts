export interface IMonthFormat {
    count: number;
    month: string;
}

export interface IChartData {
    users_by_month: IMonthFormat[];
    institutions_by_month: IMonthFormat[];
    educators_by_month: IMonthFormat[];
    courses_by_month: IMonthFormat[];
    reviews_by_month: IMonthFormat[];
}

export interface IOverviewData {
    user_count: number;
    institution_count: number;
    educator_count: number;
    course_count: number;
    review_count: number;
    chart_data: IChartData;
}

export interface ILoaders {
    getOverviewDataLoading: boolean;
    generateAdminLoading: boolean;
}

export interface IErrors {
    getOverviewDataError: boolean;
    generateAdminError: string;
}

export interface IAdminSlice {
    loaders: ILoaders;
    errors: IErrors;
    overviewData: IOverviewData | null;
}