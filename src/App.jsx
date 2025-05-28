import React from 'react'
import StudentPortal from './UdmePortal/StudentPortal'
import Login from './Login/Login'
import { Routes, Route } from 'react-router-dom'
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/student-portal" element={<StudentPortal />} />
      </Routes>

    </div>
  )
}

export default App