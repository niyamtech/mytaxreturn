import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { 
  Sparkles, 
  Briefcase, 
  TrendingUp, 
  ArrowRight,
  CheckCircle2 
} from 'lucide-react';
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage';
import { Card, CardHeader, CardTitle, CardDescription } from '../../../shared/components/Card';
import type { AppState, UserProfile } from '../../../shared/types';
import { Button } from '../../../shared/components/Button';
import { Select } from '../../../shared/components/Select';

export function OnboardingFlow() {
  const navigate = useNavigate();
  const [appState, setAppState] = useLocalStorage<AppState>('aussie-tax-app-state', {
    user: null,
    deductions: [],
    onboardingComplete: false,
    currentStep: 'welcome',
  });

  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    occupation: '',
    employmentType: '' as 'employee' | 'self-employed' | 'contractor' | 'both' | '',
    incomeRange: '',
  });

  const occupations = [
    { value: '', label: 'Select your occupation...' },
    { value: 'tradie', label: '🔧 Tradie (Plumber, Electrician, Carpenter)' },
    { value: 'office-worker', label: '💼 Office Worker / Administrator' },
    { value: 'healthcare', label: '⚕️ Healthcare Professional' },
    { value: 'teacher', label: '📚 Teacher / Educator' },
    { value: 'hospitality', label: '🍽️ Hospitality / Retail' },
    { value: 'it-professional', label: '💻 IT Professional / Developer' },
    { value: 'sales', label: '📊 Sales / Marketing' },
    { value: 'other', label: '👤 Other' },
  ];

  const employmentTypes = [
    { value: '', label: 'Select employment type...' },
    { value: 'employee', label: 'Employee (PAYG)' },
    { value: 'self-employed', label: 'Self-Employed / Sole Trader' },
    { value: 'contractor', label: 'Contractor / Freelancer' },
    { value: 'both', label: 'Multiple Income Sources' },
  ];

  const incomeRanges = [
    { value: '', label: 'Select income range...' },
    { value: '0-45000', label: '$0 - $45,000' },
    { value: '45001-120000', label: '$45,001 - $120,000' },
    { value: '120001-180000', label: '$120,001 - $180,000' },
    { value: '180001+', label: '$180,001+' },
  ];

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2 && formData.occupation) {
      setStep(3);
    } else if (step === 3 && formData.employmentType && formData.incomeRange) {
      // Create initial user profile
      const newUser: UserProfile = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        occupation: formData.occupation,
        employmentType: formData.employmentType,
        incomeRange: formData.incomeRange,
        firstName: '',
        lastName: '',
        email: '',
        hasHomeOffice: false,
        hasWorkVehicle: false,
        hasWorkTravel: false,
        hasSpouse: false,
        numberOfDependents: 0,
        financialYearEnd: '2025',
      };

      setAppState({
        ...appState,
        user: newUser,
        currentStep: 'occupation',
      });

      navigate('/profile');
    }
  };

  // Step 1: Welcome
  if (step === 1) {
    return (
      <div className="animate-fade-in space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-2xl shadow-primary-500/30">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-slate-900">
            G'day! Welcome to Aussie Tax Mate
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Let's maximize your tax refund together. We'll help you discover deductions you might be missing.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <Card className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
              <Briefcase className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="mb-2 font-semibold text-slate-900">Personalized</h3>
            <p className="text-sm text-slate-600">
              Tailored deduction categories based on your occupation
            </p>
          </Card>

          <Card className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mb-2 font-semibold text-slate-900">Maximize Refunds</h3>
            <p className="text-sm text-slate-600">
              Track every eligible expense throughout the year
            </p>
          </Card>

          <Card className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-100">
              <CheckCircle2 className="h-6 w-6 text-accent-600" />
            </div>
            <h3 className="mb-2 font-semibold text-slate-900">ATO Compliant</h3>
            <p className="text-sm text-slate-600">
              Keep records organized for tax time
            </p>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200">
          <CardHeader>
            <CardTitle>Quick Setup (2 minutes)</CardTitle>
            <CardDescription>
              Answer a few questions so we can show you relevant deductions
            </CardDescription>
          </CardHeader>
          <Button onClick={handleContinue} size="lg" className="w-full sm:w-auto">
            Let's Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Card>
      </div>
    );
  }

  // Step 2: Occupation
  if (step === 2) {
    return (
      <div className="animate-slide-up">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <div className="mb-4 flex items-center gap-2 text-sm text-primary-600">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-bold">
                1
              </div>
              <span className="font-medium">Step 1 of 3</span>
            </div>
            <CardTitle>What's your occupation?</CardTitle>
            <CardDescription>
              This helps us show you deductions specific to your line of work
            </CardDescription>
          </CardHeader>

          <div className="space-y-6">
            <Select
              label="Occupation"
              options={occupations}
              value={formData.occupation}
              onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
              required
            />

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button 
                onClick={handleContinue} 
                disabled={!formData.occupation}
                className="flex-1"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Step 3: Employment & Income
  return (
    <div className="animate-slide-up">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <div className="mb-4 flex items-center gap-2 text-sm text-primary-600">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-bold">
              2
            </div>
            <span className="font-medium">Step 2 of 3</span>
          </div>
          <CardTitle>Tell us about your work</CardTitle>
          <CardDescription>
            This helps us estimate your potential tax savings
          </CardDescription>
        </CardHeader>

        <div className="space-y-6">
          <Select
            label="Employment Type"
            options={employmentTypes}
            value={formData.employmentType}
            onChange={(e) => setFormData({ 
              ...formData, 
              employmentType: e.target.value as any 
            })}
            required
          />

          <Select
            label="Annual Income Range"
            options={incomeRanges}
            value={formData.incomeRange}
            onChange={(e) => setFormData({ ...formData, incomeRange: e.target.value })}
            required
          />

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button 
              onClick={handleContinue}
              disabled={!formData.employmentType || !formData.incomeRange}
              className="flex-1"
            >
              Complete Setup
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}