import AppRoutes from './routes/AppRoutes'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './App.css'
import axios from 'axios'

function App() {
  return (
    <>
      <div className="container">
        <nav className="navbar">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/notification">Notification</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>
        <div className="content">
          <AppRoutes />
        </div>
      </div>
    </>
  )
}

export default App
