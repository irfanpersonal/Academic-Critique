import React from 'react';
import {LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer} from 'recharts';
import {type IChartData} from '../@types/adminSlice';

interface ChartDataProps {
    data: IChartData
}

const ChartData: React.FunctionComponent<ChartDataProps> = ({data}) => {
    return (
        <div className="w-full">
            <h1 className="text-2xl text-center">Monthly Overview</h1>
            <h3>Users by Month</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.users_by_month}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="month"/>
                    <YAxis/>
                    <Tooltip/>
                    <Legend/>
                    <Line type="monotone" dataKey="count" stroke="#8884d8"/>
                </LineChart>
            </ResponsiveContainer>
            <h3>Institutions by Month</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.institutions_by_month}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    {/* <XAxis dataKey="month"/> */}
                    {/* <YAxis/> */}
                    <Tooltip/>
                    <Legend/>
                    <Line type="monotone" dataKey="count" stroke="#82ca9d"/>
                </LineChart>
            </ResponsiveContainer>
            <h3>Educators by Month</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.educators_by_month}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="month"/>
                    <YAxis/>
                    <Tooltip/>
                    <Legend/>
                    <Line type="monotone" dataKey="count" stroke="#ff7300"/>
                </LineChart>
            </ResponsiveContainer>
            <h3>Courses by Month</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.courses_by_month}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="month"/>
                    <YAxis/>
                    <Tooltip/>
                    <Legend/>
                    <Line type="monotone" dataKey="count" stroke="#387908"/>
                </LineChart>
            </ResponsiveContainer>
            <h3>Reviews by Month</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.reviews_by_month}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="month"/>
                    <YAxis/>
                    <Tooltip/>
                    <Legend/>
                    <Line type="monotone" dataKey="count" stroke="#f7c300"/>
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ChartData;