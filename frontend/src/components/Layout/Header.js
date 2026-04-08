import React from 'react'
import { Link } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import DetailsUser from './DetailsUser';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function Header({isAuthenticated, user}) {
  const { cartItems } = useSelector(state => state.cart)
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Cleanup function when component unmounts
    return () => {
      setMobileOpen(false);
    }
  }, [])

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -3,
      top: 13,
      border: `2px solid white`,
      padding: '0 4px',
      backgroundColor: '#0ea5e9',
      color: 'white',
      fontWeight: 'bold',
    },
  }));

  const toggleMobile = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg shadow-md">
              <img 
                className="w-6 h-6" 
                src="https://cdn-icons-png.flaticon.com/512/9149/9149134.png" 
                alt="SmartShop Logo"
              />
            </div>
            <h1 className="text-2xl font-bold text-secondary-900">SmartShop</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex gap-8 font-medium">
              <li>
                <Link to="/" className="text-secondary-700 hover:text-primary-500 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-secondary-700 hover:text-primary-500 transition-colors duration-200">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-secondary-700 hover:text-primary-500 transition-colors duration-200">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-secondary-700 hover:text-primary-500 transition-colors duration-200">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/search" className="p-2 hover:bg-primary-50 rounded-lg transition-colors">
              <SearchIcon sx={{ width: 24, height: 24, color: '#334155' }} />
            </Link>

            <Link to='/cart' className="p-2 hover:bg-primary-50 rounded-lg transition-colors">
              <StyledBadge badgeContent={cartItems.length || 0} color="primary">
                <ShoppingCartIcon sx={{ width: 24, height: 24, color: '#334155' }} />
              </StyledBadge>
            </Link>

            {isAuthenticated ? (
              <DetailsUser user={user} />
            ) : (
              <Link to='/login' className="p-2 hover:bg-primary-50 rounded-lg transition-colors">
                <AccountBoxIcon sx={{ width: 24, height: 24, color: '#334155' }} />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMobile} className="p-2">
              {mobileOpen ? (
                <CloseIcon sx={{ width: 24, height: 24 }} />
              ) : (
                <MenuIcon sx={{ width: 24, height: 24 }} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="md:hidden border-t border-secondary-200 py-4 animate-slide-up">
            <ul className="flex flex-col gap-4 font-medium mb-4">
              <li>
                <Link 
                  to="/" 
                  className="text-secondary-700 hover:text-primary-500 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className="text-secondary-700 hover:text-primary-500 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-secondary-700 hover:text-primary-500 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-secondary-700 hover:text-primary-500 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  About
                </Link>
              </li>
            </ul>
            
            <div className="flex items-center gap-4 pt-4 border-t border-secondary-200">
              <Link to="/search" onClick={() => setMobileOpen(false)}>
                <SearchIcon sx={{ width: 24, height: 24 }} />
              </Link>
              <Link to='/cart' onClick={() => setMobileOpen(false)}>
                <StyledBadge badgeContent={cartItems.length || 0}>
                  <ShoppingCartIcon sx={{ width: 24, height: 24 }} />
                </StyledBadge>
              </Link>
              {isAuthenticated ? (
                <DetailsUser user={user} />
              ) : (
                <Link to='/login' onClick={() => setMobileOpen(false)}>
                  <AccountBoxIcon sx={{ width: 24, height: 24 }} />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Header
