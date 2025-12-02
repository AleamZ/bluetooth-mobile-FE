import React from 'react'
import { useScreenSize } from '@/hooks/useScreenSize'

const Copyright: React.FC = () => {
  const { isMobile } = useScreenSize()

  return (
    <div className='copyright-container'>
      <div className='copyright-sub-container'>
        {isMobile ? (
          <>
            © 2025 BLUETOOTH MOBILE | ĐKKD: 41Q8018794
            <br />
            263 Đặng Văn Bi, P.Trường Thọ, Q.Thủ Đức, TP.HCM | Hotline: 090330321
          </>
        ) : (
          <>
            © 2025. BLUETOOTH MOBILE. HỘ KINH DOANH CỬA HÀNG ĐIỆN THOẠI CÔNG NGHỆ - GPĐKKD: 41Q8018794. Địa chỉ: 18E đường Đặng Văn Bi, Khu phố 4, phường Trường Thọ, Quận Thủ Đức, TP.Hồ Chí Minh. Điện thoại: 090330321
          </>
        )}
      </div>
    </div>
  )
}

export default Copyright

