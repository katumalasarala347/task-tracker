import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/users/login`, formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <input type="email" name="email" placeholder="Email"
          onChange={handleChange} className="mb-3 w-full px-3 py-2 border rounded bg-blue-50" required />
        <input type="password" name="password" placeholder="Password"
          onChange={handleChange} className="mb-3 w-full px-3 py-2 border rounded bg-blue-50" required />
        <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded">
          Login
        </button>
        <p className="text-sm text-center mt-3">
          Don't have an account? <Link to="/signup" className="text-blue-600 underline">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
