import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, LayoutDashboard, Receipt, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useLocalStorage } from '../../shared/hooks/useLocalStorage';
import type { AppState } from '../../shared/types';

export function Dashboard() {
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
     <h1>Dashboard</h1>
    </div>
  );
}