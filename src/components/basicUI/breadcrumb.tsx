import { Breadcrumb } from 'antd'
import React from 'react'
import { FaHome } from 'react-icons/fa'
import {  useNavigate } from 'react-router-dom'

interface IBreadcrumb {
  url: string;
  name: string;
}

interface IPropsBreadcrumb {
  breadcrumb: IBreadcrumb[]
}
const MBreadcrumb: React.FC<IPropsBreadcrumb> = ({breadcrumb}) => {
  const navigate = useNavigate()

  return (
    <div className='breadcrumb-container'>
        <div className='breadcrumb-sub-container'>
        <FaHome className='breadcrumb-icon' />
        <Breadcrumb className='breadcrumb-box' separator=">">
        {breadcrumb.map((item, index) => (
            <Breadcrumb.Item key={index} className='breadcrumb-item' onClick={() => {
              if (index !== breadcrumb.length - 1) {
                navigate(item.url);
              }
            }}>{item.name}</Breadcrumb.Item>
        ))}
            
        </Breadcrumb>
        </div>
    </div>
  )
}

export default MBreadcrumb