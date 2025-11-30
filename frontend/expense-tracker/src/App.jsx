import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Auth/Login.jsx'
import SignUp from './pages/Auth/SignUp.jsx'
import Home from './pages/Dashboard/Home.jsx'
import Expense from './pages/Dashboard/Expense.jsx'
import Income from './pages/Dashboard/Income.jsx'
import Budgets from './pages/Dashboard/Budgets.jsx'
import RecurringTransactions from './pages/Dashboard/RecurringTransactions.jsx'
import Settings from './pages/Dashboard/Settings.jsx'
import UserProvider from './context/userProvider.jsx'
import ThemeProvider from './context/themeProvider.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
function App() {
  return (
    <ErrorBoundary>
    <ThemeProvider>
    <UserProvider>
    <div>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/signup" exact element={<SignUp />} />
          <Route path="/dashboard" exact element={<Home />} />
          <Route path="/expense" exact element={<Expense />} />
          <Route path="/income" exact element={<Income />} />
          <Route path="/budgets" exact element={<Budgets />} />
          <Route path="/recurring" exact element={<RecurringTransactions />} />
          <Route path="/settings" exact element={<Settings />} />
        </Routes>
      </Router>
    </div>
    </UserProvider>
    </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App

const Root = () => {
  // Check if token exists in localStorage
  const isAuthenticated = !!localStorage.getItem('token');

  // Redirect to dashboard if authenticated, otherwise to login
  return isAuthenticated ? (<Navigate to="/dashboard" />) : (<Navigate to="/login" />);
}
