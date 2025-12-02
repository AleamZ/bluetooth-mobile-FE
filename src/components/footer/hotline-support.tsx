import React from 'react'
import HotlineSupports from '../../data/hotline-support.json'
import { Link } from 'react-router-dom'

const HotlineSupport: React.FC = () => {
  return (
    <div className='hotline-support-container'>
        <div className='hotline-support-Subcontainer'>
          <p className='hotline-support-title'>
            Tổng đài hỗ trợ miễn phí
          </p>
          {HotlineSupports.map((HotlineSupport) => (
            <div className='hotline-support-content'>
              {HotlineSupport.title}
              <Link 
                to = {HotlineSupport.url}
                className='hotline-support-Link'
              >
                {HotlineSupport.phone}
              </Link>
              {HotlineSupport.time}
            </div>
          ))}
        </div>
    </div>
  )
}

export default HotlineSupport