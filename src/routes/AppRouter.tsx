import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useLocalStorage } from '../shared/hooks/useLocalStorage';

// Layouts
import { OnboardingLayout } from '../layouts/OnboardingLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { OnboardingFlow } from '../features/onboarding/components/OnboardingFlow';
import ProfileSetup from '../features/profile/ProfileSetup';
import { Dashboard } from '../features/dashboard/Dashboard';
import type { AppState } from '../shared/types';



export function AppRouter() {
  const [appState] = useLocalStorage<AppState>('aussie-tax-app-state', {
    user: null,
    deductions: [],
    onboardingComplete: false,
    currentStep: 'welcome',
  });

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect based on completion status */}
        <Route path="/" element={
          appState.onboardingComplete 
            ? <Navigate to="/dashboard" replace />
            : <Navigate to="/onboarding" replace />
        } />

        {/* Onboarding Flow */}
        <Route path="/onboarding" element={<OnboardingLayout />}>
          <Route index element={<OnboardingFlow />} />
        </Route>

        {/* Profile Setup */}
        <Route path="/profile" element={<OnboardingLayout />}>
          <Route index element={<ProfileSetup />} />
        </Route>

        {/* Dashboard (Protected) */}
        <Route path="/dashboard" element={
          appState.onboardingComplete 
            ? <DashboardLayout />
            : <Navigate to="/onboarding" replace />
        }>
          <Route index element={<Dashboard/>} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}