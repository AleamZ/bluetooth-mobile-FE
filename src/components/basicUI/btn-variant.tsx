import React from 'react';

interface ButtonProps {
    value: string;
    price: string;
    onClick: () => void;
    isSelected: boolean;
}

const BtnVariant: React.FC<ButtonProps> = ({ value, price, onClick, isSelected }) => {
    return (
        <button
            className={`btn-variant ${isSelected ? 'selected' : ''}`}
            onClick={onClick}
        >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className='name'>{value}</span>
                <span className='price'>{price}</span>
            </div>
            {isSelected && <span className="checkmark">✔</span>}
        </button>
    );
}

export default BtnVariant;