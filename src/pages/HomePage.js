import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OpeningPage.css';
import { FaLanguage, FaSmile, FaComments } from 'react-icons/fa';

function HomePage() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            navigate('/option');
        }
    }, [navigate]);

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
                        <img
                            src="https://via.placeholder.com/350x350"
                            alt="Tiny Talker Illustration"
                            className="coding-image"
                        />
                    </div>
                    <div className="text-section">
                        <h2 className="headline">
                            "Speak, Play, and Learn – Your Fun Journey into New Languages Begins Here!"
                        </h2>
                        <div className="buttons">
                            <button
                                className="get-started-btn"
                                onClick={() => navigate('/signup')}
                            >
                                START LEARNING
                            </button>
                            <button
                                className="login-btn"
                                onClick={() => navigate('/login')}
                            >
                                I HAVE AN ACCOUNT
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Navigation Buttons */}
            <footer className="footer">
                <button className="redirect-btn" onClick={() => navigate('/basics')}>
                    <FaLanguage className="icon" /> Language Basics
                </button>
                <button className="redirect-btn" onClick={() => navigate('/games')}>
                    <FaSmile className="icon" /> Interactive Games
                </button>
                <button className="redirect-btn" onClick={() => navigate('/conversations')}>
                    <FaComments className="icon" /> Everyday Conversations
                </button>
            </footer>

            {/* Additional Sections */}
            <div className="additional-sections">
                {/* Features Section */}
                <section className="features-section">
                    <h2 className="section-title">fun. simple. effective.</h2>
                    <div className="features-content">
                        <p>
                            Tiny Talker makes learning languages fun with bite-sized lessons, interactive games, and voice-based challenges.
                        </p>
                        <img 
                            src="https://via.placeholder.com/300x400" 
                            alt="Fun Learning" 
                            className="section-image"
                        />
                    </div>
                </section>

                {/* Science Section */}
                <section className="science-section">
                    <h2 className="section-title">science-backed learning.</h2>
                    <div className="science-content">
                        <img 
                            src="https://via.placeholder.com/300x300" 
                            alt="Science Learning" 
                            className="section-image"
                        />
                        <p>
                            Our curriculum uses proven techniques like spaced repetition and gamification to help you retain what you learn.
                        </p>
                    </div>
                </section>

                {/* Motivation Section */}
                <section className="motivation-section">
                    <h2 className="section-title">stay inspired.</h2>
                    <div className="motivation-content">
                        <p>
                            Earn badges, track your streaks, and celebrate progress as you build daily language habits with Tiny Talker.
                        </p>
                        <img 
                            src="https://via.placeholder.com/300x300" 
                            alt="Motivation Boost" 
                            className="section-image"
                        />
                    </div>
                </section>

                {/*  Footer */}
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
                            <li>Privacy Policy</li>
                            <li>Terms of Use</li>
                            <li>Cookie Policy</li>
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

export default HomePage;
