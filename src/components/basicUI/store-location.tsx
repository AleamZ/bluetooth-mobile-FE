import React from 'react'
import { IoLocationOutline } from "react-icons/io5";


const StoreLocation: React.FC = () => {
  return (
    <div className='store-location-container'>
      <div className='store-location-icon'>
        <IoLocationOutline />
      </div>
      <div className='store-location-content'>
        <p className='store-location-name'>xem giá tại</p>
        <p className='store-location-location'>Hồ Chí Minh</p>
      </div>
    </div>
  )
}

export default StoreLocation;