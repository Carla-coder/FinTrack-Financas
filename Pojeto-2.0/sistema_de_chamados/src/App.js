// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import New from './pages/New';
import Profile from './pages/Profile';
import Customers from './pages/Customers';
import Login from './pages/Login';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (status) => {
    setIsAuthenticated(status);
  };

  return (
    <Router>
      {isAuthenticated && <Header />}
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} 
        />
        <Route 
          path="/new/:id?" 
          element={isAuthenticated ? <New /> : <Navigate to="/" />} 
        />
        <Route 
          path="/profile" 
          element={isAuthenticated ? <Profile /> : <Navigate to="/" />} 
        />
        <Route 
          path="/customers" 
          element={isAuthenticated ? <Customers /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
