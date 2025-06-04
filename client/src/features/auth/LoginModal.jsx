import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
        rememberMe
      });

      const { token, user } = res.data;

      if (rememberMe) {
        localStorage.setItem('token', token);
      } else {
        sessionStorage.setItem('token', token);
      }

      localStorage.setItem('user', JSON.stringify(user));

      navigate(`/dashboard/${user.id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white w-full max-w-4xl rounded-xl shadow-xl flex flex-col md:flex-row overflow-hidden relative"
          >
            {/* Close Button */}
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 text-2xl">
              <IoClose />
            </button>

            {/* Left Panel – Hidden on small screens */}
            <div className="hidden md:flex w-1/2 bg-gray-100 p-8 flex-col justify-between">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Welcome!</h2>
                <div className="text-6xl font-bold">W. <span role="img" aria-label="smile">😊</span></div>
              </div>
              <p className="text-sm">
                Not a member yet? <span className="underline cursor-pointer">Reserve Access </span>
              </p>
            </div>

            {/* Right Panel – Always visible */}
            <div className="w-full md:w-1/2 p-8">
              <h2 className="text-xl font-semibold mb-6">Log in</h2>

              <form className="space-y-4" onSubmit={handleLogin}>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">EMAIL</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-b py-2 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600 block mb-1">PASSWORD</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-b py-2 outline-none"
                  />
                </div>

                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="mr-2"
                  />
                  <label htmlFor="remember" className="text-sm text-gray-600">
                    Keep me logged in
                  </label>
                </div>

                <button type="submit" className="w-full bg-black text-white py-2 rounded-md mt-6">
                  Log in now
                </button>

                <div className="text-right mt-2 text-sm">
                  <a href="/forgot-password" className="underline">Forgot your password?</a>
                </div>
              </form>

              <div className="mt-6">
                <p className="text-sm text-center mb-3">Or sign in with</p>
                <div className="flex justify-center">
                  <button className="border rounded px-4 py-2 flex items-center gap-2">
                    <span>G</span> Google
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
