import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </AuthProvider>
    </div>
  );
}

export default App;
