import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', country: '' });

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/users/signup`, formData);
      alert('Signup successful');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        {['name', 'email', 'password', 'country'].map(field => (
          <input
            key={field}
            type={field === 'password' ? 'password' : 'text'}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            onChange={handleChange}
            className="mb-3 w-full px-3 py-2 border rounded bg-blue-50"
            required
          />
        ))}
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
          Sign Up
        </button>
        <p className="text-sm text-center mt-3">
          Already have an account? <Link to="/login" className="text-green-600 underline">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
