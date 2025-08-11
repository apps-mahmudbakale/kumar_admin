import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'

import Admin from './pages/Admin';
import Navbar from './components/Navbar';
import Definition from './pages/Definition';
import Login from './pages/Login';
import ProductsApi from './pages/ProductsApi';

function usePageTracking() {
  const location = useLocation()

  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
      })
    }
  }, [location])
}

function AppRoutes() {
  usePageTracking()

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/dashboard" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/api/products" element={<ProductsApi />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}

export default App
