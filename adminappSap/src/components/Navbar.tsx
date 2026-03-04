import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, MapPin, Calendar, Home, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuthHook';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/destinations?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled || location.pathname !== '/' 
          ? 'bg-white text-gray-800 shadow-md' 
          : 'bg-transparent text-white'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link
            to={user && location.pathname.startsWith('/admin') ? "/admin" : "/"}
            className="flex items-center space-x-2"
          >
            <span className="text-xl font-bold">Desi Guide</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/admin" 
              className={`hover:text-cyan-500 transition-colors ${
                location.pathname.startsWith('/admin') ? 'text-cyan-500 font-medium' : ''
              }`}
            >
              Admin
            </Link>
          </nav>

          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden focus:outline-none"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;