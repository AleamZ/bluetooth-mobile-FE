import EventReminder from '@/components/header/event-reminder'
import MainHeader from '@/components/header/main-header'
import QuickPolicy from '@/components/header/quick-policy'
import React from 'react'
import { Outlet } from 'react-router-dom'

const LoginRegisterLayout:React .FC = () => {
  return (
    <div>
        <div className="auth-header">
            <EventReminder />
            <QuickPolicy />
            <MainHeader />
        </div>
        <div className="content-wrapper">
                <Outlet />
        </div>
    </div>
  )
}

export default LoginRegisterLayout