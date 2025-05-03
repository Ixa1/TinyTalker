import React from "react";
import { useNavigate } from "react-router-dom";
import "./TermsOfUse.css"; 

const TermsOfUse = () => {
  const navigate = useNavigate();

  return (
    <div className="terms-container">
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back to Home
      </button>

      <h1 className="terms-title">Terms of Use</h1>
      <p className="terms-paragraph">
        By accessing or using our application, you agree to be bound by these terms.
      </p>

      <h2 className="terms-subheading">1. Use of Service</h2>
      <p className="terms-paragraph">
        You must use the platform lawfully and respect others’ rights and privacy.
      </p>

      <h2 className="terms-subheading">2. Content Ownership</h2>
      <p className="terms-paragraph">
        All content including text, icons, and images are owned or licensed by us.
      </p>

      <h2 className="terms-subheading">3. User Responsibilities</h2>
      <p className="terms-paragraph">
        Users must not misuse the platform, attempt hacking, or violate community guidelines.
      </p>

      <h2 className="terms-subheading">4. Termination</h2>
      <p className="terms-paragraph">
        We reserve the right to suspend accounts that violate our terms without notice.
      </p>
    </div>
  );
};

export default TermsOfUse;
