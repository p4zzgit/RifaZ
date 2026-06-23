import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import PublicRaffleView from './components/PublicRaffleView';
import PublicBolaoView from './components/PublicBolaoView';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import ClientDashboard from './components/ClientDashboard';
import AuthView from './components/AuthView';
import { Usuario } from './types';

export default function App() {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const handleLoginSuccess = (newToken: string, newUser: any) => {
    setToken(newToken);
    setUser(newUser);
    
    // Redirect based on role
    if (newUser.role === 'super_admin') {
      window.location.href = '/admin';
    } else {
      window.location.href = '/panel';
    }
  };

  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage user={user} onLoginClick={() => window.location.href = '/login'} />} />
        
        {/* Auth */}
        <Route path="/login" element={<AuthView onLoginSuccess={handleLoginSuccess} />} />

        {/* Dashboards */}
        <Route 
          path="/admin/*" 
          element={
            token ? <SuperAdminDashboard /> : <Navigate to="/login" />
          } 
        />
        
        <Route 
          path="/panel/*" 
          element={
            token ? <ClientDashboard /> : <Navigate to="/login" />
          } 
        />

        {/* Public Bolao View */}
        <Route path="/bolao/:slug" element={<PublicBolaoView />} />

        {/* Public Raffle View - MUST BE AFTER OTHER SPECIFIC ROUTES */}
        <Route path="/:slug" element={<PublicRaffleView />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
