import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, LayoutDashboard, Receipt, User, LogOut, Menu, X } from 'lucide-react';
import { useLocalStorage } from '../shared/hooks/useLocalStorage';
import type { AppState } from '../shared/types';
import { useState } from 'react';

export function DashboardLayout() {
  const [appState, setAppState] = useLocalStorage<AppState>('aussie-tax-app-state', {
    user: null,
    deductions: [],
    onboardingComplete: false,
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    if (confirm('Are you sure you want to clear all data and start over?')) {
      setAppState({
        user: null,
        deductions: [],
        onboardingComplete: false,
      });
      navigate('/onboarding');
    }
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Deductions', href: '/dashboard/deductions', icon: Receipt },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <nav className="border-b border-slate-200 bg-white shadow-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/20">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold tracking-tight text-slate-900">
                  Aussie Tax Mate
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* User Menu (Desktop) */}
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">
                  {appState.user?.firstName || 'User'}
                </p>
                <p className="text-xs text-slate-500">
                  {appState.user?.occupation || 'Taxpayer'}
                </p>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Clear data and restart"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}