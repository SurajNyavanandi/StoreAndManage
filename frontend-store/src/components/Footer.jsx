import { FiMapPin, FiPhone, FiMail, FiClock, FiFacebook, FiTwitter, FiInstagram, FiGithub, FiShoppingBag, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import React, { useContext } from 'react';
import AppContext from '../services/AppContext';

const Footer = () => {
  const navigate = useNavigate();
  const { setViewMode } = useContext(AppContext);
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", action: () => navigate('/') },
    { name: "Kids Wear", action: () => navigate('/type/kids') },
    { name: "Men's Wear", action: () => navigate('/type/mens') },
    { name: "Women's Wear", action: () => navigate('/type/womens') },
    { name: "Track Order", action: () => navigate('/track-order') },
    { name: "Wishlist", action: () => navigate('/wishlist') },
    { name: "Admin Portal", action: () => setViewMode('admin') },
  ];

  const customerService = [
    { name: "Contact Us", action: () => window.location.href = "mailto:support@virattom.com" },
    { name: "FAQs", action: () => alert("FAQs coming soon!") },
    { name: "Shipping Policy", action: () => alert("Free shipping on orders above ₹500") },
    { name: "Return Policy", action: () => alert("7 days easy return policy") },
    { name: "Privacy Policy", action: () => alert("Your data is safe with us") },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          
          {/* Brand Column */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              <span className="text-white">vi</span>
              <span className="text-blue-500">R</span>
              <span className="text-blue-500">A</span>
              <span className="text-white">t.to</span>
              <span className="text-blue-500">M</span>
            </h2>
            <p className="text-sm md:text-base text-gray-400 mb-4 leading-relaxed">
              Your one-stop destination for premium fashion. Quality products at affordable prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-200 transition-colors">
                <FiGithub size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={link.action}
                    className="text-gray-400 hover:text-blue-500 transition-colors text-sm md:text-base"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2">
              {customerService.map((service, index) => (
                <li key={index}>
                  <button
                    onClick={service.action}
                    className="text-gray-400 hover:text-blue-500 transition-colors text-sm md:text-base"
                  >
                    {service.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm md:text-base">
                <FiMapPin className="text-blue-500 mt-1 flex-shrink-0" size={18} />
                <span className="text-gray-400">123 Fashion Street, Mumbai, India</span>
              </li>
              <li className="flex items-center gap-3 text-sm md:text-base">
                <FiPhone className="text-blue-500 flex-shrink-0" size={18} />
                <span className="text-gray-400">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-sm md:text-base">
                <FiMail className="text-blue-500 flex-shrink-0" size={18} />
                <span className="text-gray-400">support@virattom.com</span>
              </li>
              <li className="flex items-center gap-3 text-sm md:text-base">
                <FiClock className="text-blue-500 flex-shrink-0" size={18} />
                <span className="text-gray-400">Mon-Sat: 10AM - 7PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-gray-800 mt-10 pt-8">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FiTruck className="text-blue-500" /> Free Shipping*
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FiShield className="text-blue-500" /> Secure Payment
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FiRefreshCw className="text-blue-500" /> Easy Returns
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FiShoppingBag className="text-blue-500" /> 100% Authentic
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-xs sm:text-sm">
            © {currentYear} viRAttoM. All rights reserved. | Made with ❤️ for fashion lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;