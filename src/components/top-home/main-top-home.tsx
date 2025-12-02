import React from 'react'
import MainMenu from './main-menu'
import SubBanner from './sub-banner'
import MainBanner from './main-banner'

const MainTopHome: React.FC = () => {
  return (
    <div className='main-top-home-container'>
      <div className='main-top-home-sub-container'>
        <MainMenu />
        <MainBanner />
        <SubBanner />
      </div>
    </div>
  )
}

export default MainTopHome