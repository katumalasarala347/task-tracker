import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="bg-gray-800 text-white px-6 py-4 flex justify-between">
      <h1 className="font-bold text-xl">Task Tracker</h1>
      <button onClick={logout} className="hover:underline">Logout</button>
    </div>
  );
};

export default Header;
