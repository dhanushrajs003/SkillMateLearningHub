import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const countryCodes = [
  { code: "+1", label: "🇺🇸 +1" },
  { code: "+91", label: "🇮🇳 +91" },
  { code: "+44", label: "🇬🇧 +44" },
];

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

 
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState(countryCodes[0].code);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);

  
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

 
  const [forgotStep, setForgotStep] = useState(0); 
  const [forgotCountryCode, setForgotCountryCode] = useState(countryCodes[0].code);
  const [forgotPhone, setForgotPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirm, setResetConfirm] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const navigate = useNavigate();
  const GENERATED_OTP = "1234";

  
  const resetForgot = () => {
    setForgotStep(0);
    setForgotCountryCode(countryCodes[0].code);
    setForgotPhone("");
    setOtp("");
    setOtpError("");
    setResetPassword("");
    setResetConfirm("");
  };

  const handleForgotPhone = (e) => {
    e.preventDefault();
    const u = JSON.parse(localStorage.getItem("user"));
    if (u && forgotCountryCode === u.countryCode && forgotPhone === u.phone) {
      setForgotStep(2);
      setOtp("");
      setOtpError("");
      alert("OTP sent! (Use 1234 for demo)");
    } else setOtpError("Phone number not found.");
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp === GENERATED_OTP) {
      setOtpError("");
      setForgotStep(3);
      setResetPassword("");
      setResetConfirm("");
    } else setOtpError("Invalid OTP. Try again.");
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!resetPassword || !resetConfirm) return setOtpError("Please fill all fields.");
    if (resetPassword !== resetConfirm) return setOtpError("Passwords do not match.");
    const u = JSON.parse(localStorage.getItem("user"));
    if (u && forgotCountryCode === u.countryCode && forgotPhone === u.phone) {
      u.password = resetPassword;
      localStorage.setItem("user", JSON.stringify(u));
      alert("Password reset successful. Please log in.");
      setIsLogin(true);
      resetForgot();
      setLoginUsername("");
      setLoginPassword("");
    } else setOtpError("User not found.");
  };

  // Login/Register logic
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      const u = JSON.parse(localStorage.getItem("user"));
      if (u && loginUsername === u.username && loginPassword === u.password) {
        localStorage.setItem("isLoggedIn", "true");
        navigate("/dashboard");
      } else alert("Invalid username or password!");
    } else {
      if (
        firstName &&
        lastName &&
        username &&
        email &&
        countryCode &&
        phone &&
        password &&
        confirmPassword
      ) {
        if (password !== confirmPassword) return alert("Passwords do not match.");
        const newUser = {
          username,
          password,
          email,
          firstName,
          lastName,
          countryCode,
          phone,
        };
        localStorage.setItem("user", JSON.stringify(newUser));
        alert("Registered successfully. Please log in.");
        setIsLogin(true);
        setPassword("");
        setConfirmPassword("");
        setEmail("");
        setUsername("");
        setFirstName("");
        setLastName("");
        setCountryCode(countryCodes[0].code);
        setPhone("");
      } else alert("Please fill all fields.");
    }
  };

  // Input class for perfect sizing, no shrink on focus
  const inputClass =
    "w-full px-4 py-3 rounded-lg border-2 border-gray-300 text-base focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-200 transition";

  return (
    <div className="w-full h-screen flex items-stretch bg-gray-50">
      {/* Left */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-white p-8">
        <h2 className="text-4xl font-bold mb-4 whitespace-pre-line">
          {isLogin ? "Hi\nWelcome Back !" : "Welcome to SkillMate !"}
        </h2>
        <img
          src="https://img.freepik.com/free-vector/graident-ai-robot-vectorart_78370-4114.jpg?semt=ais_hybrid&w=740"
          alt="Learning"
          className="w-4/5 max-w-lg h-auto object-contain mt-6"
        />
      </div>
      {/* Right */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 md:p-12 bg-white shadow-2xl rounded-2xl">
        <div className="w-full max-w-md max-h-[90vh] overflow-auto">
          {/* Forgot Password Flow */}
          {forgotStep > 0 ? (
            <div>
              <button className="mb-4 text-sm text-blue-600 hover:underline" onClick={resetForgot}>
                &larr; Back to Login
              </button>
              {forgotStep === 1 && (
                <form onSubmit={handleForgotPhone} className="space-y-6">
                  <h3 className="text-xl font-semibold mb-2">Enter Registered Phone</h3>
                  <div className="flex gap-2">
                    <select className={inputClass + " w-1/3"} value={forgotCountryCode} onChange={e => setForgotCountryCode(e.target.value)}>
                      {countryCodes.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                    </select>
                    <input type="tel" className={inputClass + " w-2/3"} value={forgotPhone} onChange={e => setForgotPhone(e.target.value)} required autoComplete="tel" placeholder="Phone" />
                  </div>
                  {otpError && <div className="text-red-600 text-sm">{otpError}</div>}
                  <button type="submit" className="w-full py-3 rounded-lg bg-teal-700 text-white font-semibold text-base hover:bg-teal-800 transition">Send OTP</button>
                </form>
              )}
              {forgotStep === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <h3 className="text-xl font-semibold mb-2">Enter OTP</h3>
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={4}
                    inputType="tel"
                    shouldAutoFocus
                    inputStyle={{
                      width: "2.2rem", height: "2.2rem", margin: "0 0.2rem",
                      fontSize: "1.1rem", borderRadius: "0.5rem", border: "1px solid #d1d5db",
                    }}
                    containerStyle={{ justifyContent: "center", marginBottom: "1rem" }}
                  />
                  {otpError && <div className="text-red-600 text-sm">{otpError}</div>}
                  <button type="submit" className="w-full py-3 rounded-lg bg-teal-700 text-white font-semibold text-base hover:bg-teal-800 transition">Verify OTP</button>
                </form>
              )}
              {forgotStep === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <h3 className="text-xl font-semibold mb-2">Reset Password</h3>
                  <div className="relative">
                    <input type={showResetPassword ? "text" : "password"} className={inputClass} value={resetPassword} onChange={e => setResetPassword(e.target.value)} required placeholder="New Password" />
                    <span className="absolute right-3 top-3 cursor-pointer text-gray-500" onClick={() => setShowResetPassword(s => !s)}>{showResetPassword ? <FaEyeSlash /> : <FaEye />}</span>
                  </div>
                  <div className="relative">
                    <input type={showResetConfirm ? "text" : "password"} className={inputClass} value={resetConfirm} onChange={e => setResetConfirm(e.target.value)} required placeholder="Confirm Password" />
                    <span className="absolute right-3 top-3 cursor-pointer text-gray-500" onClick={() => setShowResetConfirm(s => !s)}>{showResetConfirm ? <FaEyeSlash /> : <FaEye />}</span>
                  </div>
                  {otpError && <div className="text-red-600 text-sm">{otpError}</div>}
                  <button type="submit" className="w-full py-3 rounded-lg bg-teal-700 text-white font-semibold text-base hover:bg-teal-800 transition">Reset Password</button>
                </form>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {isLogin ? (
                <>
                  <div>
                    <label className="block mb-2 font-medium text-base">User Name</label>
                    <input className={inputClass} value={loginUsername} onChange={e => setLoginUsername(e.target.value)} required autoComplete="username" />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-base">Password</label>
                    <div className="relative">
                      <input type={showLoginPassword ? "text" : "password"} className={inputClass} value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required autoComplete="current-password" />
                      <span className="absolute right-3 top-3 cursor-pointer text-gray-500" onClick={() => setShowLoginPassword(s => !s)}>{showLoginPassword ? <FaEyeSlash /> : <FaEye />}</span>
                    </div>
                    <div className="flex justify-end">
                      <button type="button" className="text-xs text-gray-500 mt-1 hover:underline" onClick={() => { setForgotStep(1); setOtpError(""); }}>Forgot Password ?</button>
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3 rounded-lg bg-teal-700 text-white font-semibold text-base hover:bg-teal-800 transition">Log In</button>
                  <div className="text-center text-base mt-2">
                    Create New Account?{" "}
                    <span className="text-blue-700 cursor-pointer hover:underline" onClick={() => { setIsLogin(false); setLoginUsername(""); setLoginPassword(""); }}>Sign Up</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input placeholder="First Name" className={inputClass + " w-1/2"} value={firstName} onChange={e => setFirstName(e.target.value)} required autoComplete="given-name" />
                    <input placeholder="Last Name" className={inputClass + " w-1/2"} value={lastName} onChange={e => setLastName(e.target.value)} required autoComplete="family-name" />
                  </div>
                  <input placeholder="User Name" className={inputClass} value={username} onChange={e => setUsername(e.target.value)} required autoComplete="username" />
                  <input type="email" placeholder="Email" className={inputClass} value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
                  <div className="flex gap-2">
                    <select className={inputClass + " w-1/3"} value={countryCode} onChange={e => setCountryCode(e.target.value)} required>
                      {countryCodes.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                    </select>
                    <input type="tel" placeholder="Phone" className={inputClass + " w-2/3"} value={phone} onChange={e => setPhone(e.target.value)} required autoComplete="tel" />
                  </div>
                  <div className="relative">
                    <input placeholder="Create Password" type={showRegPassword ? "text" : "password"} className={inputClass} value={password} onChange={e => setPassword(e.target.value)} required autoComplete="new-password" />
                    <span className="absolute right-3 top-3 cursor-pointer text-gray-500" onClick={() => setShowRegPassword(s => !s)}>{showRegPassword ? <FaEyeSlash /> : <FaEye />}</span>
                  </div>
                  <div className="relative">
                    <input placeholder="Confirm Password" type={showRegConfirm ? "text" : "password"} className={inputClass} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required autoComplete="new-password" />
                    <span className="absolute right-3 top-3 cursor-pointer text-gray-500" onClick={() => setShowRegConfirm(s => !s)}>{showRegConfirm ? <FaEyeSlash /> : <FaEye />}</span>
                  </div>
                  <button type="submit" className="w-full py-3 rounded-lg bg-teal-700 text-white font-semibold text-base hover:bg-teal-800 transition">Sign Up</button>
                  <div className="text-center text-base mt-2">
                    Already Have An Account?{" "}
                    <span className="text-blue-700 cursor-pointer hover:underline" onClick={() => { setIsLogin(true); setPassword(""); setUsername(""); }}>Log In</span>
                  </div>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
