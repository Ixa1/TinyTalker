import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './OpeningPage.css';
import { FaGamepad, FaChartLine, FaShieldAlt } from "react-icons/fa";
import funLearningImage from '../Asset/fun-learning.jpg';
import TinyTalkerImg from '../Asset/tinyTalker.jpg';
import sciencelearningImage from '../Asset/science-learning.png';
import inspiredImage from '../Asset/inspired.png';
function OpeningPage() {
    const navigate = useNavigate();

    return (
        <div className="opening-page">
            {/* Header */}
            <header className="header">
                <h1>Tiny Talker</h1>
            </header>

            {/* Main Content */}
            <main className="main-content">
                <div className="content-container">
                    <div className="image-section">
                        <img src={TinyTalkerImg} alt="Tiny Talker Illustration" className="coding-image" />
                    </div>
                    <div className="text-section">
                        <h2 className="headline">
                            "Speak, Play, and Learn – Your Fun Journey into New Languages Begins Here!"
                        </h2>
                        <div className="buttons">
                            <button className="get-started-btn" onClick={() => navigate('/signup')}>
                                START LEARNING
                            </button>
                            <button className="login-btn" onClick={() => navigate('/Login')}>
                                Have an account
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Feature Cards */}
            <h2 className="tagline"><span className="Why">Why</span><span className="Us">Us .</span></h2>
            <section className="feature-section">
  <div className="feature-card">
    <FaGamepad className="feature-icon" />
    <h3>Interactive Games</h3>
    <p>Engaging activities that make learning natural and enjoyable for children.</p>
  </div>
  <div className="feature-card">
    <FaChartLine className="feature-icon" />
    <h3>Track Progress</h3>
    <p>Monitor your child’s development with detailed progress reports.</p>
  </div>
  <div className="feature-card">
    <FaShieldAlt className="feature-icon" />
    <h3>Safe Learning</h3>
    <p>Child-safe environment with parental controls and monitoring.</p>
  </div>
</section>


            {/* Additional Sections */}
            <div className="additional-sections">

                {/* Features Section */}
                <section className="features-section">
                    <h2 className="tagline">
                        <span className="fun">Fun.</span>
                        <span className="simple">Simple.</span>
                        <span className="effective">Effective.</span>
                    </h2>
                    <div className="features-content">
                        <p>
                        Tiny Talker makes language learning fun and exciting for children. It combines short, engaging lessons with interactive games to keep kids motivated. Voice-based activities help build speaking confidence from an early age. The app uses playful visuals and friendly feedback to encourage consistent learning. Tiny Talker is designed to be simple, effective, and age-appropriate. With its game-like experience, kids enjoy learning without even realizing they’re studying.
                        </p>
                        <img src={funLearningImage} alt="Fun Learning" className="section-image" />
                    </div>
                </section>

                {/* Science Section */}
                <section className="science-section">
                <h2 className="tagline">
  <span className="fun">Science</span>
  <span className="simple">-Backed</span>
  <span className="effective">Learning.</span>
</h2>

                    <div className="science-content">
                        <img src={sciencelearningImage} alt="Science Learning" className="section-image" />
                        <p>
                        Our curriculum is built on scientifically proven techniques to enhance learning. We use spaced repetition to improve memory retention over time. Gamification elements make the process engaging, motivating users to keep progressing.
                        </p>
                    </div>
                </section>

                {/* Motivation Section */}
                <section className="motivation-section">
                <h2 className="tagline">
  <span className="fun">Stay</span>
  <span className="simple">Inspired.</span>
</h2>

                    <div className="motivation-content">
                        <p>
                        Earn badges, track your streaks, and celebrate progress as you build daily language habits with Tiny Talker.
Our app keeps learners motivated through fun achievements and visual milestones.
Every completed lesson adds to your streak, reinforcing consistency and rewarding dedication.
These features encourage children to return daily, turning language learning into an exciting habit.
                        </p>
                        <img src={inspiredImage} alt="Motivation Boost" className="section-image" />
                    </div>
                </section>

                {/* Footer */}
                <footer className="footer-columns updated-footer">
                    <div className="footer-brand">
                        <h3 className="brand-name">👧 Tiny Talkers</h3>
                        <p>Making learning fun and effective for children worldwide.</p>
                    </div>
                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li>About Us</li>
                            <li>Our Games</li>
                            <li>Parent Guide</li>
                            <li>Support</li>
                        </ul>
                    </div>
                    <div className="footer-links">
                        <h4>Legal</h4>
                        <ul>
                            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                            <li><Link to="/terms-of-use">Terms of Use</Link></li>
                            <li><Link to="/cookie-policy">Cookie Policy</Link></li>
                        </ul>
                    </div>
                    <div className="footer-social">
                        <h4>Connect With Us</h4>
                        <div className="social-icons">
                            <i className="fab fa-facebook-f"></i>
                            <i className="fab fa-twitter"></i>
                            <i className="fab fa-instagram"></i>
                            <i className="fab fa-youtube"></i>
                        </div>
                    </div>
                </footer>
                <p className="footer-bottom">© 2025 Tiny Talkers. All rights reserved.</p>
            </div>
        </div>
    );
}

export default OpeningPage;
