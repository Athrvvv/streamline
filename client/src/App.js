import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
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
    </Router>
  );
}