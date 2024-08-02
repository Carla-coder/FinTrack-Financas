import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import New from './pages/New';
import Profile from './pages/Profile';
import Customers from './pages/Customers';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/new/:id?" element={<New />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/customers" element={<Customers />} />
      </Routes>
    </Router>
  );
};

export default App;
