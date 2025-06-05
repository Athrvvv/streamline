import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
}

function DashboardWrapper() {
  const { id } = useParams();

  return (
    <ProtectedRoute>
      <Dashboard userId={id} />
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Navigate to="/" />} />
        <Route path="/dashboard/:id" element={<DashboardWrapper />} />
      </Routes>

      {/* 🔔 Global toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}
