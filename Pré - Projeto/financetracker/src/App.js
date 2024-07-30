import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import ExpensesPage from './components/ExpensesPage';
import ReportsPage from './components/ReportsPage';
import ExpensesList from './components/ExpensesList';
import './styles.css';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [expenses, setExpenses] = useState([]);

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleAddExpense = (expense) => {
    setExpenses([...expenses, expense]);
  };

  return (
    <Router>
      <div className="App">
        {!currentUser ? (
          <Login onLogin={handleLogin} />
        ) : (
          <Routes>
            <Route
              path="/"
              element={<Home currentUser={currentUser} expenses={expenses} handleAddExpense={handleAddExpense} />}
            />
            <Route path="/expenses" element={<ExpensesPage onAddExpense={handleAddExpense} />} />
            <Route path="/records" element={<ExpensesList expenses={expenses} />} />
            <Route path="/reports" element={<ReportsPage expenses={expenses} />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
