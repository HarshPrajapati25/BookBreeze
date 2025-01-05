// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyBooks from './pages/MyBooks';
import AvailableBooks from './pages/AvailableBooks';
import CreateBook from './pages/CreateBook';
import BorrowedBooks from './pages/BorrowedBooks';
import HomePage from './pages/Home';
import ForgotPassword from './pages/ForgotPass';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword/>} />
              <Route
                path="/my-books"
                element={
                  <PrivateRoute>
                    <MyBooks />
                  </PrivateRoute>
                }
              />
              <Route
                path="/borrowed-books"
                element={
                  <PrivateRoute>
                    <BorrowedBooks />
                  </PrivateRoute>
                }
              />
              <Route
                path="/available-books"
                element={
                  <PrivateRoute>
                    <AvailableBooks />
                  </PrivateRoute>
                }
              />
              <Route
                path="/create-book"
                element={
                  <PrivateRoute>
                    <CreateBook />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<PrivateRoute><HomePage/></PrivateRoute>} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;