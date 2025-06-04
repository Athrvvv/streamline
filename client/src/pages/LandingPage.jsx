import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Features from "../components/Features";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import ScrollToTopButton from "../components/ScrollToTopButton";
import LoginModal from "../features/auth/LoginModal";
import SignupModal from "../features/auth/SignupModal";

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decoded.exp > now) {
          navigate(`/dashboard/${decoded.id}`);
        }
      } catch (err) {
        // Token is invalid or corrupt — do nothing
      }
    }
  }, [navigate]);

  return (
    <>
      <Navbar onLoginClick={() => setShowLogin(true)} />
      <HeroSection onReserveClick={() => setShowSignup(true)} />
      <Features />
      <CTASection onReserveClick={() => setShowSignup(true)} />
      <Footer />
      <ScrollToTopButton />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <SignupModal isOpen={showSignup} onClose={() => setShowSignup(false)} />
    </>
  );
}
