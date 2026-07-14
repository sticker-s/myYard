import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('myyard-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('myyard-token');
      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          setUser(data);
        } catch (error) {
          console.error('Failed to fetch user', error);
          localStorage.removeItem('myyard-token');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('myyard-token', data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('myyard-token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, api }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
