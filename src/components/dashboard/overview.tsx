import React from "react";

type StatCardProps = {
    number: string | number;
    title: string;
};

const StatCard: React.FC<StatCardProps> = ({ number, title }) => {
    return (
        <div className="overview">
            <div className="overview-content">
                <h3 className="overview-title">{title}</h3>
                <h2 className="overview-number">{number}</h2>
            </div>

        </div >
    );
};

export default StatCard;
