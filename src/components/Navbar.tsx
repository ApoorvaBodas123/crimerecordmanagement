import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

  const handleNavigation = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
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
            <button 
              onClick={() => handleNavigation(user ? "/crimes" : "/")}
              className="flex-shrink-0 flex items-center bg-transparent border-none p-0"
            >
              <Shield className="h-8 w-8 text-white" />
              <span className="ml-2 text-white text-lg font-bold">Civic Eye Guardian</span>
            </button>
            
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {user ? (
                  <>
                    <button
                      onClick={() => handleNavigation('/crimes')}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        location.pathname === '/crimes'
                          ? 'bg-police-dark text-white'
                          : 'text-white hover:bg-police-light hover:text-white'
                      }`}
                    >
                      Crimes
                    </button>
                    <button
                      onClick={() => handleNavigation('/about')}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        location.pathname === '/about'
                          ? 'bg-police-dark text-white'
                          : 'text-white hover:bg-police-light hover:text-white'
                      }`}
                    >
                      About
                    </button>
                    <button
                      onClick={() => handleNavigation('/sos')}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        location.pathname === '/sos'
                          ? 'bg-police-dark text-white'
                          : 'text-white hover:bg-police-light hover:text-white'
                      }`}
                    >
                      SOS
                    </button>
                    <button
                      onClick={() => handleNavigation('/police-directory')}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        location.pathname === '/police-directory'
                          ? 'bg-police-dark text-white'
                          : 'text-white hover:bg-police-light hover:text-white'
                      }`}
                    >
                      Police Directory
                    </button>
                    {user && (user.role.toLowerCase() === 'police' || user.role.toLowerCase() === 'admin') && (
                      <button
                        onClick={() => handleNavigation('/dashboard')}
                        className={`text-white hover:bg-police-light px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                          location.pathname === '/dashboard' ? 'bg-police-dark' : ''
                        }`}
                      >
                        Dashboard
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleNavigation('/')}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        location.pathname === '/'
                          ? 'bg-police-dark text-white'
                          : 'text-white hover:bg-police-light hover:text-white'
                      }`}
                    >
                      Home
                    </button>
                    <button
                      onClick={() => handleNavigation('/about')}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        location.pathname === '/about'
                          ? 'bg-police-dark text-white'
                          : 'text-white hover:bg-police-light hover:text-white'
                      }`}
                    >
                      About
                    </button>
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
                    className="bg-police-dark text-white hover:bg-police"
                    onClick={() => handleNavigation('/login')}
                  >
                    Login
                  </Button>
                  <Button 
                    className="bg-police-dark text-white hover:bg-police"
                    onClick={() => handleNavigation('/register')}
                  >
                    Register
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
                <button
                  onClick={() => handleNavigation('/crimes')}
                  className="w-full text-left text-white hover:bg-police-light block px-3 py-2 rounded-md text-base font-medium"
                >
                  Crime Records
                </button>
                <button
                  onClick={() => handleNavigation('/about')}
                  className="w-full text-left text-white hover:bg-police-light block px-3 py-2 rounded-md text-base font-medium"
                >
                  About
                </button>
                <button
                  onClick={() => handleNavigation('/sos')}
                  className="w-full text-left text-white hover:bg-police-light block px-3 py-2 rounded-md text-base font-medium"
                >
                  SOS Alerts
                </button>
                <button
                  onClick={() => handleNavigation('/police-directory')}
                  className="w-full text-left text-white hover:bg-police-light block px-3 py-2 rounded-md text-base font-medium"
                >
                  Police Directory
                </button>
                {user && (user.role.toLowerCase() === 'police' || user.role.toLowerCase() === 'admin') && (
                  <button
                    onClick={() => handleNavigation('/dashboard')}
                    className="w-full text-left text-white hover:bg-police-light block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Dashboard
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavigation('/')}
                  className="w-full text-left text-white hover:bg-police-light block px-3 py-2 rounded-md text-base font-medium"
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavigation('/about')}
                  className="w-full text-left text-white hover:bg-police-light block px-3 py-2 rounded-md text-base font-medium"
                >
                  About
                </button>
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
                <button
                  onClick={() => handleNavigation('/login')}
                  className="w-full text-left block text-white hover:bg-police-light px-3 py-2 rounded-md text-base font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigation('/register')}
                  className="w-full text-left block text-white hover:bg-police-light px-3 py-2 rounded-md text-base font-medium"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
