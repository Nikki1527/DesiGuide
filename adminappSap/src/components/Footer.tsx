import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-6 w-6 text-cyan-400" />
              <h2 className="text-xl font-bold">TravelQuest</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Discover the world with our expertly crafted travel experiences. 
              From serene beaches to majestic mountains, we make travel dreams come true.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-cyan-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/destinations" className="text-gray-400 hover:text-cyan-400 transition-colors">Destinations</Link>
              </li>
              <li>
                <Link to="/bookings" className="text-gray-400 hover:text-cyan-400 transition-colors">My Bookings</Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-cyan-400 transition-colors">Profile</Link>
              </li>
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Popular Destinations</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/destinations/847bfff8-fed3-4767-aef8-b846de1fca2d" className="text-gray-400 hover:text-cyan-400 transition-colors">Telangana</Link>
              </li>
              <li>
                <Link to="/destinations/2" className="text-gray-400 hover:text-cyan-400 transition-colors">Andrapradesh</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-cyan-400 mr-2 mt-0.5" />
                <span className="text-gray-400">Mb University, Rangampeta,Tirupathi</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-cyan-400 mr-2" />
                <span className="text-gray-400">+91 9581456522</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-cyan-400 mr-2" />
                <span className="text-gray-400">astra29101@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Desi Guide. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/terms" className="text-sm text-gray-500 hover:text-cyan-400 transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/privacy" className="text-sm text-gray-500 hover:text-cyan-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/faq" className="text-sm text-gray-500 hover:text-cyan-400 transition-colors">
                FAQs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;