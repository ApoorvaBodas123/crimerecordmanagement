import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ChevronDown, 
  Shield, 
  LogOut, 
  Menu, 
  X
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavLink: React.FC<{ to: string, children: React.ReactNode }> = ({ to, children }) => {
    const isActive = location.pathname === to;
    
    return (
      <Link
        to={to}
        className={`px-3 py-2 rounded-md text-sm font-medium ${
          isActive
            ? 'bg-police-dark text-white'
            : 'text-white hover:bg-police-light hover:text-white'
        }`}
      >
        {children}
      </Link>
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-police shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to={user ? "/crimes" : "/"} className="flex-shrink-0 flex items-center">
              <Shield className="h-8 w-8 text-white" />
              <span className="ml-2 text-white text-lg font-bold">Civic Eye Guardian</span>
            </Link>
            
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {user ? (
                  <>
                    <NavLink to="/crimes">Crime Records</NavLink>
                    <NavLink to="/directory">Police Directory</NavLink>
                    <NavLink to="/sos">SOS Alerts</NavLink>
                    <NavLink to="/about">About</NavLink>
                    {user && (user.role.toLowerCase() === 'police' || user.role.toLowerCase() === 'admin') && (
                      <Link
                        to="/dashboard"
                        className="text-white hover:bg-police-light px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Dashboard
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/about">About</NavLink>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center">
              {user ? (
                <div className="flex items-center">
                  <span className="text-white mr-4">
                    <span className="text-gray-300 text-sm mr-2">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}:
                    </span>
                    {user.name}
                  </span>
                  <Button 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-police"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    className="border-police-dark text-police-dark hover:bg-police-dark hover:text-white"
                    asChild
                  >
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button 
                    className="bg-police-dark text-white hover:bg-police"
                    asChild
                  >
                    <Link to="/register">Register</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="md:hidden flex items-center">
            <button
              className="text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-police-dark">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user ? (
              <>
                <Link
                  to="/crimes"
                  className="text-white hover:bg-police-light block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Crime Records
                </Link>
                <Link
                  to="/directory"
                  className="text-white hover:bg-police-light block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Police Directory
                </Link>
                <Link
                  to="/sos"
                  className="text-white hover:bg-police-light block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  SOS Alerts
                </Link>
                {user && (user.role.toLowerCase() === 'police' || user.role.toLowerCase() === 'admin') && (
                  <Link
                    to="/dashboard"
                    className="text-white hover:bg-police-light block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="text-white hover:bg-police-light block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="text-white hover:bg-police-light block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
              </>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-police-light">
            {user ? (
              <div className="px-2 space-y-1">
                <div className="px-3 py-2 text-white">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-300">{user.email}</p>
                </div>
                <button
                  className="w-full text-left block text-white hover:bg-police-light px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-2 space-y-1">
                <Link
                  to="/login"
                  className="block text-white hover:bg-police-light px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-white hover:bg-police-light px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
