import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";

const LoginSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // ✅ Password validation function
  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // ✅ Handle Login with JWT
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email)) {
      setError("Invalid email format. Please enter a valid email.");
      return;
    }
    if (!isValidPassword(password)) {
      setError("Password must have 8+ characters, 1 uppercase, 1 number, and 1 special character.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        alert("Login successful!");
        navigate("/inputpage"); // ✅ Redirect to InputPage
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email)) {
      setError("Invalid email format. Please enter a valid email.");
      return;
    }
    if (!isValidPassword(password)) {
      setError("Password must have 8+ characters, 1 uppercase, 1 number, and 1 special character.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/auth/signup", {
        email,
        password,
      });

      if (response.status === 200 || response.status === 201) {
        alert("Signup successful! Please log in.");
        setIsSignup(false);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-signup-container">
      <h2>{isSignup ? "Sign Up" : "Login"}</h2>

      {error && <p className="error-message">{error}</p>}

      <form>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        {isSignup ? (
          <button onClick={handleSignup} className="signup-btn" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        ) : (
          <button onClick={handleLogin} className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        )}
      </form>

      <p className="toggle-link" onClick={() => setIsSignup(!isSignup)}>
        {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
      </p>
    </div>
  );
};

export default LoginSignup; 