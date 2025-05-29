import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/" element={
          <div className="app">
            <h1>Welcome to Logistics Company</h1>
          </div>
        } />
      </Routes>
    </Router>
  )
}

export default App 