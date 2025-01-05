import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import cat from "../static/little-cat.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogout = () => {
    setIsLogoutDialogOpen(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
    setIsLogoutDialogOpen(false);
  };

  const cancelLogout = () => {
    setIsLogoutDialogOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-blue-600 text-white p-4 text-style: italic">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <div className='flex items-center space-x-2'>
            <img
              src={cat}
              alt="logo"
              className="w-10 h-10"
              onClick={closeMenu}
            />
            <Link to="/"
              className="text-xl font-bold hover:text-blue-200"
              onClick={closeMenu}>BookBreeze</Link>
          </div>

          {/* Hamburger Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden focus:outline-none"
            aria-label="Toggle menu"
          >
            {/* Hamburger icon code */}
          </button>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-8">
            {user ? (
              <>
                <Link to="/available-books" className="hover:text-blue-200">Available Books</Link>
                <Link to="/my-books" className="hover:text-blue-200">My Books</Link>
                <Link to="/borrowed-books" className="hover:text-blue-200">Borrowed Books</Link>
                <Link to="/create-book" className="hover:text-blue-200">Create Book</Link>
                <button
                  onClick={handleLogout}
                  className="hover:text-blue-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200">Login</Link>
                <Link to="/signup" className="hover:text-blue-200">Signup</Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${isOpen
            ? 'max-h-screen opacity-100 visible mt-4'
            : 'max-h-0 opacity-0 invisible'
            }`}
        >
          <div className="flex flex-col space-y-4 py-4">
            {user ? (
              <>
                {/* Mobile menu links */}
                <button
                  onClick={handleLogout}
                  className="hover:text-blue-200 text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Mobile menu links */}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {isLogoutDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4 text-black">Logout Confirmation</h2>
            <p className="mb-4 text-black">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-900 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-900 text-white rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;