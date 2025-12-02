import React from 'react';
import { Link } from 'react-router-dom';

type Content = {
  name?: string;
  url?: string;
};

interface InformationContent {
  title?: string;
  content?: Content[];  
}

const InformationAndPolicy: React.FC<InformationContent> = ({
  title,
  content = [], 
}) => {
  return (
    <div className='information-and-policy-container'>
        <div className='information-and-policy-title'>
            {title}
        </div>
      {content.map((contentData, index) => (
        <div
            className='information-and-policy-content'
            key={index}
        >
            <Link to={contentData.url || '#'} className='information-and-policy-link'>
                {contentData.name}
            </Link>
        </div>
      ))}
    </div>
  );
}

export default InformationAndPolicy;
