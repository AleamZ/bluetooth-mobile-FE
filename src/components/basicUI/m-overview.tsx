import React from 'react';

interface IOverviewProps {
    label: string;
    value: string | number;
}

const MOverview: React.FC<IOverviewProps> = ({ label, value }) => {
    return (
        <div className='box'>
            <span className='label'>{label}:</span>
            <span className='value'>{value}</span>
        </div>
    );
};

export default MOverview;
