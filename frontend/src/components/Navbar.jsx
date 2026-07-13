import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-retroPrimary dark:text-darkPrimary">
              MyYard
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            <ThemeToggle />
            
            {!user ? (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-retroPrimary hover:bg-retroPrimary/90 text-white dark:bg-darkPrimary dark:hover:bg-darkPrimary/90 dark:text-gray-900 font-semibold transition"
              >
                Log In
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                {user.role === 'admin' ? (
                  <Link
                    to="/admin"
                    className="text-gray-700 dark:text-gray-300 hover:text-retroPrimary dark:hover:text-darkPrimary font-medium"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/my-tickets"
                    className="text-gray-700 dark:text-gray-300 hover:text-retroPrimary dark:hover:text-darkPrimary font-medium"
                  >
                    My Tickets
                  </Link>
                )}
                
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                    {user.name}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-500 transition"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
