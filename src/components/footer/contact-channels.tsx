import React from 'react'
import { Link } from 'react-router-dom';

type IconItem = {
  imgIcon: string;
  urlLink: string;
}

interface channelBlock { 
  title?: string;
  iconItems: IconItem[]; 
}

const ContactChannels: React.FC<channelBlock> = ({
  title,
  iconItems = [],
}) => {
  return (
    <div className='contact-channels-contaitainer'>
      <div className='contact-channels-title'>
        {title}
      </div>
      <div className='contact-channels-list-icon'>
        {iconItems.map((iconData, index) => (
          <div 
            className='contact-channels-icon'
            key={index}
          >
            <Link to = {iconData.urlLink || '#'}>
              <img src={iconData.imgIcon} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ContactChannels