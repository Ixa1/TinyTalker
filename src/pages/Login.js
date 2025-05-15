import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import axios from '../utils/api';
import './Login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Eye icons for show/hide password

function Login() {
    const [formData, setFormData] = useState({
        username: '', // Can be username or email
        password: ''
    });

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/auth/login/', {

                username: formData.username, // could be username or email
                password: formData.password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response:', response.data);
            const { access, refresh, user } = response.data;

            // ✅ If you're returning tokens in the Django view:
            if (access && refresh && user) {
                localStorage.setItem('access_token', access);
                localStorage.setItem('refresh_token', refresh);
          
                if (user.is_admin) {
                  localStorage.setItem('adminToken', access);  // ✅ important for admin protection
                  setMessage('Logged in as admin!');
                  setTimeout(() => {
                    navigate('/admin'); // ✅ admin dashboard
                  }, 1000);
                } else {
                  setMessage('Logged in as user');
                  setTimeout(() => {
                    navigate('/Dashboard'); // ✅ normal user dashboard
                  }, 1000);
                }
          
              } else {
                setMessage('Unexpected response from the server.');
              }

            // if (response.data?.access && response.data?.refresh) {
            //     // Store tokens for authenticated requests later
            //     localStorage.setItem('access_token', response.data.access);
            //     localStorage.setItem('refresh_token', response.data.refresh);

            //     setMessage('Login successful!');

            //     setTimeout(() => {
            //         navigate('/Dashboard');
            //       }, 1500);

            // } else if (response.data?.message === 'Login successful') {
            //     // If you're just returning a success message without tokens
            //     setMessage('Login successful!');

            //     setTimeout(() => {
            //         navigate('/Dashboard');
            //     }, 500);

            // } else {
            //     setMessage('Unexpected response from the server.');
            // }
        } catch (error) {
            console.error('Login error:', error);
            if (error.response?.data?.error) {
              setMessage(error.response.data.error);
            } else if (error.response?.data?.detail) {
              setMessage(error.response.data.detail);
            } else {
              setMessage('An error occurred. Please try again.');
            }
          } finally {
            setLoading(false);
          }
        };
    //     } catch (error) {
    //         console.error('Login error:', error);
    //         if (error.response?.data?.error) {
    //             setMessage(error.response.data.error);
    //         } else if (error.response?.data?.detail) {
    //             setMessage(error.response.data.detail);
    //         } else {
    //             setMessage('An error occurred. Please try again.');
    //         }
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    return (
        <div className="login-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label htmlFor="username">Username or Email:</label>
                    <input
                        id="username"
                        type="text"
                        name="username"
                        placeholder="Enter username or email"
                        autoComplete="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group password-field">
                    <label htmlFor="password">Password:</label>
                    <div className="password-input-container">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <span
                            className="password-toggle-icon"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </div>

                <button type="submit" disabled={loading || !formData.username || !formData.password}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            {message && <p className="message">{message}</p>}
        </div>
    );
}

export default Login;