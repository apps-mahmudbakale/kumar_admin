import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/Logo2.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-gray-400 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo & Title Wrapper */}
        <Link to="/" className="flex items-center space-x-2 md:space-x-4">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
          <span className="text-blue-800 font-bold text-sm sm:text-lg md:text-xl leading-tight">
            McGulma's <br className="block sm:hidden" /> Pharmaceutical Dictionary
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-white hover:text-gray-200">Home</Link>
          <Link to="/about" className="text-white hover:text-gray-200">About</Link>
          <Link to="/appendix" className="text-white hover:text-gray-200">Appendix</Link>
          <Link to="/contact" className="text-white hover:text-gray-200">Contact</Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white text-2xl">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-400">
          <Link to="/" className="block py-2 px-4 text-white hover:bg-blue-500">Home</Link>
          <Link to="/about" className="block py-2 px-4 text-white hover:bg-blue-500">About</Link>
          <Link to="/appendix" className="block py-2 px-4 text-white hover:bg-blue-500">Appendix</Link>
          <Link to="/contact" className="block py-2 px-4 text-white hover:bg-blue-500">Contact</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
