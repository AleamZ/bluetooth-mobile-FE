import React from 'react'
import { IoCartOutline } from "react-icons/io5";

const CartBlock: React.FC = () => {
  return (
    <div className='cart-block-container'>
        <IoCartOutline className='cart-block-icon'/>
        <p className='cart-block-name'>Giỏ hàng</p>
        <div className='cart-block-cart-count'>
          {"27"}
        </div>
    </div>
  )
}

export default CartBlock;