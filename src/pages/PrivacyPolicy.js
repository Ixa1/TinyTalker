import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PolicyPage.css";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="policy-container">
      <button className="back-btn" onClick={() => navigate("/")}>
        ⬅ Back to Home
      </button>

      <h1 className="policy-title">Privacy Policy</h1>

      <p className="policy-paragraph">
        We are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your information.
      </p>

      <h2 className="policy-subheading">1. Information We Collect</h2>
      <ul className="policy-list">
        <li>Name, email, and account details</li>
        <li>Progress data and quiz performance</li>
        <li>Usage and device information</li>
      </ul>

      <h2 className="policy-subheading">2. How We Use Your Information</h2>
      <ul className="policy-list">
        <li>To personalize your learning experience</li>
        <li>To track and improve your progress</li>
        <li>To communicate with you and send updates</li>
      </ul>

      <h2 className="policy-subheading">3. Data Protection</h2>
      <p className="policy-paragraph">
        We implement encryption, secure login, and data hashing to keep your information safe.
      </p>

      <h2 className="policy-subheading">4. Your Rights</h2>
      <p className="policy-paragraph">
        You may request to access, modify, or delete your data at any time by contacting our support team.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
