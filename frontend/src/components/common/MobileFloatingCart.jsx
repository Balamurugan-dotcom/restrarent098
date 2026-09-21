import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const MobileFloatingCart = () => {
  const { totalCount, totalAmount } = useCart();
  const location = useLocation();

  // Hide on Cart and Checkout pages or if cart is empty
  const isHiddenPage =
    location.pathname === '/cart' ||
    location.pathname === '/checkout' ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/track');

  if (totalCount === 0 || isHiddenPage) {
    return null;
  }

  return (
    <div className="mobile-floating-cart-wrap">
      <Link to="/cart" className="mobile-floating-cart-bar">
        <div className="mobile-floating-cart-left">
          <div className="mobile-floating-cart-icon">
            <ShoppingBag size={18} color="#FFFFFF" />
            <span className="mobile-floating-cart-badge">{totalCount}</span>
          </div>
          <div className="mobile-floating-cart-info">
            <span className="mobile-floating-cart-count">
              {totalCount} item{totalCount !== 1 ? 's' : ''} added
            </span>
            <span className="mobile-floating-cart-amount">₹{totalAmount}</span>
          </div>
        </div>
        <div className="mobile-floating-cart-right">
          <span>View Cart</span>
          <ArrowRight size={17} />
        </div>
      </Link>
    </div>
  );
};

export default MobileFloatingCart;
