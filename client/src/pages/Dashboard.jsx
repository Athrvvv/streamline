import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export default function Dashboard({ userId }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const referralLink = `${window.location.origin}/signup?referral=${user.id}`;
  const [userStats, setUserStats] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp < now) {
        localStorage.clear();
        sessionStorage.clear();
        navigate('/');
        return;
      }

      axios.get("/api/user/me", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setUserStats(res.data)).catch(console.error);
    } catch (err) {
      console.error("Token error:", err);
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      alert("Referral link copied to clipboard!");
    } catch {
      alert("Failed to copy referral link.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-4xl font-bold text-blue-700">
            👋 Welcome, User {userId}
          </h1>
          <button
            onClick={handleLogout}
            className="transition bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md text-sm shadow-md active:scale-95"
          >
            🚪 Logout
          </button>
        </div>

        {/* Referral Link */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Your Referral Link</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="w-full p-2 border rounded bg-gray-100 text-sm cursor-pointer"
              onClick={(e) => e.target.select()}
            />
            <button
              onClick={handleCopy}
              className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 active:scale-95 transition"
            >
              📋 Copy
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-10">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">📈 Referrals</h2>
            <p className="text-gray-600">
              Total successful referrals: <strong>{userStats.referralCount || 0}</strong>
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold text-green-600 mb-2">⭐ Points</h2>
            <p className="text-gray-600">
              Points earned: <strong>{userStats.points || 0}</strong>
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold text-purple-600 mb-2">👤 Profile</h2>
            <p className="text-gray-600">Basic info, preferences, etc.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
