import React, { useEffect, useState } from 'react'
import Logo from '../../assets/LogoBluetooth.png'
import LogoMobile from '../../assets/LogoMobile.png' // Add your mobile logo here
import { Link } from 'react-router-dom';

const LogoBlock: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className='logo-block-container'>
      <Link to="/">
        <img
          className="logo-shop"
          src={isMobile ? LogoMobile : Logo}
          alt="Logo"
        />
      </Link>
    </div>
  )
}

export default LogoBlock;