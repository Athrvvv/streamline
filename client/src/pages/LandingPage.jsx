import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  const [reservedEmail, setReservedEmail] = useState("");
  const [referralId, setReferralId] = useState(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      setReferralId(ref);
      localStorage.setItem("referral_code", ref);
    }
  }, [searchParams]);

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
        // Invalid token — skip redirection
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

      <SignupModal
        isOpen={showSignup}
        onClose={() => setShowSignup(false)}
        reservedEmail={reservedEmail}
        setReservedEmail={setReservedEmail}
        referralId={referralId}
      />
    </>
  );
}
