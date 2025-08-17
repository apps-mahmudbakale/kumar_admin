import { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaBox, FaUsers, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext.jsx';
import { logoutUser } from '../utils/firebaseHelper';
import Swal from 'sweetalert2';
import logo from '../assets/Logo2.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  // Check if current route is active
  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-600' : 'hover:bg-blue-600';
  };

  const menuItems = [
    { path: "/products", icon: <FaBox className="mr-2" />, text: "Products" },
    { path: "/users", icon: <FaUsers className="mr-2" />, text: "Users" },
  ];

  const handleLogout = async () => {
    try {
      const { success, error } = await logoutUser();
      if (success) {
        await Swal.fire({
          icon: 'success',
          title: 'Logged out successfully!',
          showConfirmButton: false,
          timer: 1500
        });
        navigate('/login');
      } else {
        throw new Error(error || 'Failed to logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Logout Failed',
        text: error.message || 'An error occurred while logging out',
        timer: 3000,
        showConfirmButton: true
      });
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-blue-700 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo & Title */}
        <Link to="/dashboard" className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
          <span className="text-white font-bold text-lg hidden sm:block">
            Admin Panel
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          {/* Desktop Menu */}
          <div className="flex space-x-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 text-white rounded-md transition-colors ${isActive(item.path)}`}
              >
                {item.icon}
                {item.text}
              </Link>
            ))}
          </div>
          
          {/* User Profile Dropdown */}
          {currentUser && (
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 text-white hover:bg-blue-600 p-2 rounded-md transition-colors"
              >
                {currentUser.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt={currentUser.displayName || 'User'} 
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <FaUserCircle className="w-8 h-8 text-gray-200" />
                )}
                <span className="hidden lg:inline">
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </span>
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <p className="font-medium">{currentUser.displayName || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden text-white text-2xl focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-700">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-white ${isActive(item.path)}`}
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              {item.text}
            </Link>
          ))}
          
          {currentUser && (
            <div className="border-t border-blue-600 mt-2 pt-2">
              <div className="px-4 py-2 text-white">
                <p className="font-medium">{currentUser.displayName || 'User'}</p>
                <p className="text-xs text-blue-100">{currentUser.email}</p>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center px-4 py-3 text-white hover:bg-blue-600"
              >
                <FaSignOutAlt className="mr-2" />
                Sign out
              </button>
            </div>
          )}
        </div>
      )}
      {/* Close dropdown when clicking outside */}
      {isProfileOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
