import React from 'react';
import { Link } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MailIcon from '@mui/icons-material/Mail';

function Footer() {
  return (
    <footer className="bg-secondary-900">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
                <img 
                  className="w-6 h-6" 
                  src="https://cdn-icons-png.flaticon.com/512/9149/9149134.png" 
                  alt="SmartShop"
                />
              </div>
              <h3 className="text-xl font-bold text-white">SmartShop</h3>
            </div>
            <p className="text-secondary-300 leading-relaxed text-sm">
              Your ultimate destination for quality products. We bring together a curated collection of electronics, fashion, home decor, and more.
            </p>
            {/* Social Links */}
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-secondary-400 hover:text-primary-500 transition-colors p-2 hover:bg-secondary-800 rounded-lg">
                <FacebookIcon sx={{ width: 20, height: 20 }} />
              </a>
              <a href="#" className="text-secondary-400 hover:text-primary-500 transition-colors p-2 hover:bg-secondary-800 rounded-lg">
                <TwitterIcon sx={{ width: 20, height: 20 }} />
              </a>
              <a href="#" className="text-secondary-400 hover:text-primary-500 transition-colors p-2 hover:bg-secondary-800 rounded-lg">
                <InstagramIcon sx={{ width: 20, height: 20 }} />
              </a>
              <a href="#" className="text-secondary-400 hover:text-primary-500 transition-colors p-2 hover:bg-secondary-800 rounded-lg">
                <LinkedInIcon sx={{ width: 20, height: 20 }} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-secondary-300 hover:text-primary-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-secondary-300 hover:text-primary-400 transition-colors text-sm">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-secondary-300 hover:text-primary-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-secondary-300 hover:text-primary-400 transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Customer Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-secondary-300 hover:text-primary-400 transition-colors text-sm">
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-primary-400 transition-colors text-sm">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-primary-400 transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-primary-400 transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Newsletter</h3>
            <p className="text-secondary-300 text-sm mb-4">
              Subscribe to get special offers and updates delivered to your inbox.
            </p>
            <div className="space-y-2">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-4 py-2 rounded-l-lg bg-secondary-800 text-white placeholder-secondary-500 border border-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
                <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-r-lg transition-colors font-medium">
                  <MailIcon sx={{ width: 18, height: 18 }} />
                </button>
              </div>
              <p className="text-xs text-secondary-400">
                We'll never share your email. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-secondary-800 my-12"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-secondary-400 text-sm">
          <p>© 2024 SmartShop. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary-400 transition-colors">
              Terms & Conditions
            </a>
            <a href="#" className="hover:text-primary-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary-400 transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
