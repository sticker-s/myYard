import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@myyard.com');
      setPassword('admin123');
    } else {
      setEmail('user1@myyard.com');
      setPassword('user123');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
      <h2 className="text-3xl font-bold mb-6 text-center text-retroPrimary dark:text-darkPrimary">Welcome Back</h2>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
      
      <div className="flex gap-2 mb-6">
        <button onClick={() => fillDemo('admin')} className="flex-1 py-1 px-2 bg-gray-100 dark:bg-gray-700 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition">Admin Demo</button>
        <button onClick={() => fillDemo('user')} className="flex-1 py-1 px-2 bg-gray-100 dark:bg-gray-700 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition">User Demo</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-retroPrimary dark:focus:ring-darkPrimary"
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-retroPrimary dark:focus:ring-darkPrimary"
            required 
          />
        </div>
        <button type="submit" className="w-full py-2 px-4 bg-retroPrimary hover:bg-retroPrimary/90 dark:bg-darkPrimary dark:hover:bg-darkPrimary/90 text-white dark:text-gray-900 font-bold rounded-lg transition mt-4">
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
