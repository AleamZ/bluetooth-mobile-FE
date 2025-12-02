import React from 'react'
import { Link } from 'react-router-dom'

interface SubBannerItemData {
    banner?: string,
    link?: string,
}

const SubBannerItem: React.FC<SubBannerItemData> = ({
    banner = "",
    link = "",
}) => {
  return (
    <div className='sub-banner-item-container'>
        <Link to = {link}>
            <img 
              src = {banner}
              className='sub-banner-item'
            />
        </Link>
    </div>
  )
}

export default SubBannerItem