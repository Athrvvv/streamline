import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import api from "../../utils/setupAxios"; // ✅ Using custom Axios instance
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function SignupModal({
  isOpen,
  onClose,
  reservedEmail,
  setReservedEmail,
  referralId,
}) {
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    password: "",
    confirmPassword: "",
    referrer: referralId || null,
    rememberMe: true,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (referralId) {
      setFormData((prev) => ({ ...prev, referrer: referralId }));
    }
  }, [referralId]);

  const handleNext = async () => {
    if (step === 1) {
      if (!reservedEmail || !reservedEmail.includes("@")) {
        return alert("Enter a valid email.");
      }
      try {
        await api.post("/auth/reserve-access", { email: reservedEmail });
        setStep(2);
      } catch (err) {
        alert(err.response?.data?.message || "Error sending code");
      }
    } else if (step === 2) {
      try {
        await api.post("/auth/verify-access-code", {
          email: reservedEmail,
          code,
        });
        setStep(3);
      } catch (err) {
        alert(err.response?.data?.message || "Invalid code.");
      }
    }
  };

  const handleSignup = async () => {
    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match.");
    }

    try {
      const res = await api.post("/auth/signup", {
        email: reservedEmail,
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        password: formData.password,
        phoneNumber: formData.phone,
        referralId: formData.referrer,
      });

      const { token, user } = res.data;

      const storage = formData.rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Cleanup
      localStorage.removeItem("referral_code");
      setStep(1);
      setReservedEmail("");
      setCode("");
      setFormData({
        firstName: "",
        middleName: "",
        lastName: "",
        phone: "",
        password: "",
        confirmPassword: "",
        referrer: null,
        rememberMe: true,
      });

      onClose();
      toast.success("Welcome aboard 🎉");
      navigate(`/dashboard/${user.id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed.");
    }
  };

  const handleBack = () => setStep((prev) => prev - 1);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-gray-900 text-white w-full max-w-3xl rounded-xl shadow-xl p-8 relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-2xl text-white">
          <IoClose />
        </button>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-4">
                Reserve access to the next generation of asset classes
              </h2>
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full bg-gray-800 text-white border border-gray-700 rounded px-4 py-2 mb-4"
                value={reservedEmail}
                onChange={(e) => setReservedEmail(e.target.value)}
              />
              <button
                onClick={handleNext}
                className="bg-white text-black font-semibold py-2 px-4 rounded w-full"
              >
                Reserve access
              </button>
              <p className="mt-4 text-sm underline cursor-pointer" onClick={() => setStep(2)}>
                Already have an access code?
              </p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4">
                Verification code is sent to your email.
              </h2>
              <input
                type="text"
                placeholder="Enter your access code"
                className="w-full bg-gray-800 text-white border border-gray-700 rounded px-4 py-2 mb-4"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <button
                onClick={handleNext}
                className="bg-white text-black font-semibold py-2 px-4 rounded w-full"
              >
                Verify code
              </button>
              <button onClick={handleBack} className="mt-4 underline text-sm">
                ← Back
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-6">Create your account</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="First Name*" className="bg-gray-800 text-white border border-gray-700 rounded px-4 py-2" onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                <input type="password" placeholder="Password*" className="bg-gray-800 text-white border border-gray-700 rounded px-4 py-2" onChange={(e) => setFormData({...formData, password: e.target.value})} />
                <input type="text" placeholder="Middle Name" className="bg-gray-800 text-white border border-gray-700 rounded px-4 py-2" onChange={(e) => setFormData({...formData, middleName: e.target.value})} />
                <input type="password" placeholder="Confirm Password*" className="bg-gray-800 text-white border border-gray-700 rounded px-4 py-2" onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
                <input type="text" placeholder="Last Name*" className="bg-gray-800 text-white border border-gray-700 rounded px-4 py-2" onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                <input type="text" placeholder="Phone (WhatsApp)*" className="bg-gray-800 text-white border border-gray-700 rounded px-4 py-2" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>

              {formData.referrer && (
                <p className="mt-4 text-sm text-blue-400">
                  You’re signing up with referral code: <strong>{formData.referrer}</strong>
                </p>
              )}

              <button
                className="mt-6 bg-white text-black font-semibold py-2 px-4 rounded w-full"
                onClick={handleSignup}
              >
                Continue
              </button>
              <button onClick={handleBack} className="mt-4 underline text-sm">
                ← Back
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
