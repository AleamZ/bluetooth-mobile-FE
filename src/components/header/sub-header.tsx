import React from 'react';
import HeaderItems from '../../data/sub-header-items.json';
import { FaFireFlameCurved, FaBasketShopping, FaPhone, FaTruckFast} from "react-icons/fa6";
import { RiDiscountPercentFill } from "react-icons/ri";
import { Link } from 'react-router-dom';

const SubHeader: React.FC = () => {
  const iconMap: { [key: string]: React.ReactNode } = {
    FaFireFlameCurved: <FaFireFlameCurved />,
    FaBasketShopping: <FaBasketShopping />,
    RiDiscountPercentFill: <RiDiscountPercentFill />,
    FaPhone: <FaPhone />,
    FaTruckFast: <FaTruckFast />,
  };

  return (
    <div className='sub-header-container'>
      <div className='sub-header-sub-container'>
        {HeaderItems.map((item) => (
          <div key={item.id} className='sub-header-item'>
            <div className='sub-header-icon'>
              {iconMap[item.icon]}
            </div>
            <Link 
              to ={item.link}
              className='sub-header-title'
            >
              {item.title}
            </Link>
          </div>
        ))}
      </div>  
    </div>
  );
};

export default SubHeader;
