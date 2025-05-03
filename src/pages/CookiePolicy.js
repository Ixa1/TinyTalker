import React from "react";
import { useNavigate } from "react-router-dom";
import "./CookiePolicy.css";

const CookiePolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="cookie-container">
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back to Home
      </button>

      <h1 className="cookie-title">Cookie Policy</h1>
      <p className="cookie-paragraph">
        This policy explains how cookies are used on our website and app.
      </p>

      <h2 className="cookie-subheading">1. What Are Cookies?</h2>
      <p className="cookie-paragraph">
        Cookies are small text files placed on your device to help us analyze site usage and improve your experience.
      </p>

      <h2 className="cookie-subheading">2. Types of Cookies We Use</h2>
      <ul className="cookie-list">
        <li>Essential cookies for login and session tracking</li>
        <li>Analytics cookies for performance monitoring</li>
        <li>Preference cookies to remember settings</li>
      </ul>

      <h2 className="cookie-subheading">3. How to Manage Cookies</h2>
      <p className="cookie-paragraph">
        You can disable cookies in your browser settings, but some features may not function properly.
      </p>
    </div>
  );
};

export default CookiePolicy;
