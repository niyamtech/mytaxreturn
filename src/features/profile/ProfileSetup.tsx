import  { useState } from 'react';
import { useLocalStorage } from '../../shared/hooks/useLocalStorage';
import type { AppState, UserProfile } from '../../shared/types';
import { v4 as uuidv4 } from 'uuid';

const financialYearOptions = [
  { value: '31-12', label: 'Calendar year (31 Dec)' },
  { value: '30-06', label: 'Australian FY (30 Jun)' },
];

export default function ProfileSetup() {
  const [appState, setAppState] = useLocalStorage<AppState>('aussie-tax-app-state', {
    user: null,
    deductions: [],
    onboardingComplete: false,
  });

  const initial: Partial<UserProfile> = appState.user ?? {};

  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState(initial.firstName ?? '');
  const [lastName, setLastName] = useState(initial.lastName ?? '');
  const [email, setEmail] = useState(initial.email ?? '');
  const [phone, setPhone] = useState(initial.phone ?? '');

  const [hasSpouse, setHasSpouse] = useState(initial.hasSpouse ?? false);
  const [numberOfDependents, setNumberOfDependents] = useState<number>(initial.numberOfDependents ?? 0);

  const [hasHomeOffice, setHasHomeOffice] = useState(initial.hasHomeOffice ?? false);
  const [hasWorkVehicle, setHasWorkVehicle] = useState(initial.hasWorkVehicle ?? false);
  const [hasWorkTravel, setHasWorkTravel] = useState(initial.hasWorkTravel ?? false);

  const [financialYearEnd, setFinancialYearEnd] = useState(initial.financialYearEnd ?? '30-06');

  const [errors, setErrors] = useState<Record<string, string>>({});

  function validateStep(currentStep: number) {
    const errs: Record<string, string> = {};
    if (currentStep === 0) {
      if (!firstName.trim()) errs.firstName = 'First name is required';
      if (!lastName.trim()) errs.lastName = 'Last name is required';
      if (!email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errs.email = 'Valid email is required';
    }
    // other steps can have light validation
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function next() {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, 2));
  }

  function prev() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  function finish() {
    if (!validateStep(step)) return;

    const user: UserProfile = {
      id: appState.user?.id ?? uuidv4(),
      createdAt: appState.user?.createdAt ?? new Date().toISOString(),
      occupation: appState.user?.occupation ?? '',
      employmentType: appState.user?.employmentType ?? 'employee',
      incomeRange: appState.user?.incomeRange ?? '',
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      employer: appState.user?.employer,
      annualIncome: appState.user?.annualIncome,
      taxWithheld: appState.user?.taxWithheld,
      hasHomeOffice,
      hasWorkVehicle,
      hasWorkTravel,
      hasSpouse,
      numberOfDependents,
      financialYearEnd,
    } as UserProfile;

    setAppState({ ...appState, user, onboardingComplete: true });
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Profile setup</h2>

      <div className="bg-white rounded-lg shadow p-6 transition-all">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded ${step === 0 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>1</div>
            <div className={`px-3 py-1 rounded ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>2</div>
            <div className={`px-3 py-1 rounded ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>3</div>
            <div className="ml-auto text-sm text-gray-500">Step {step + 1} of 3</div>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); step === 2 ? finish() : next(); }}>
          {step === 0 && (
            <section className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <div className="text-sm font-medium text-gray-700">First name</div>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  {errors.firstName && <div className="text-red-600 text-sm mt-1">{errors.firstName}</div>}
                </label>

                <label className="block">
                  <div className="text-sm font-medium text-gray-700">Last name</div>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  {errors.lastName && <div className="text-red-600 text-sm mt-1">{errors.lastName}</div>}
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <div className="text-sm font-medium text-gray-700">Email</div>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  {errors.email && <div className="text-red-600 text-sm mt-1">{errors.email}</div>}
                </label>

                <label className="block">
                  <div className="text-sm font-medium text-gray-700">Phone</div>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                </label>
              </div>
            </section>
          )}

          {step === 1 && (
            <section className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Family</div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={hasSpouse} onChange={(e) => setHasSpouse(e.target.checked)} />
                  <span>Do you have a spouse/partner?</span>
                </label>

                <label className="block mt-3">
                  <div className="text-sm font-medium text-gray-700">Number of dependents</div>
                  <input type="number" min={0} value={numberOfDependents} onChange={(e) => setNumberOfDependents(Number(e.target.value))} className="mt-1 block w-24 border rounded px-3 py-2" />
                </label>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Work</div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={hasHomeOffice} onChange={(e) => setHasHomeOffice(e.target.checked)} />
                  <span>Do you work from a home office?</span>
                </label>

                <label className="flex items-center gap-2 mt-2">
                  <input type="checkbox" checked={hasWorkVehicle} onChange={(e) => setHasWorkVehicle(e.target.checked)} />
                  <span>Do you use a vehicle for work?</span>
                </label>

                <label className="flex items-center gap-2 mt-2">
                  <input type="checkbox" checked={hasWorkTravel} onChange={(e) => setHasWorkTravel(e.target.checked)} />
                  <span>Do you travel for work?</span>
                </label>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-700">Financial year end</div>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {financialYearOptions.map((opt) => (
                    <label key={opt.value} className={`p-3 border rounded cursor-pointer ${financialYearEnd === opt.value ? 'border-indigo-600 bg-indigo-50' : ''}`}>
                      <input type="radio" name="fy" value={opt.value} checked={financialYearEnd === opt.value} onChange={() => setFinancialYearEnd(opt.value)} className="hidden" />
                      <div className="text-sm font-medium">{opt.label}</div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="text-sm text-gray-500">Review your details and finish to continue to your dashboard.</div>

              <div className="bg-gray-50 rounded p-3">
                <div className="text-sm">{firstName} {lastName}</div>
                <div className="text-sm">{email}</div>
                <div className="text-sm">{phone}</div>
                <div className="text-sm">Dependents: {numberOfDependents}</div>
                <div className="text-sm">Home office: {hasHomeOffice ? 'Yes' : 'No'}</div>
                <div className="text-sm">Financial year end: {financialYearEnd}</div>
              </div>
            </section>
          )}

          <div className="mt-6 flex gap-3">
            {step > 0 && <button type="button" onClick={prev} className="px-4 py-2 rounded border bg-white">Back</button>}
            <div className="ml-auto">
              {step < 2 && <button type="button" onClick={next} className="px-4 py-2 rounded bg-indigo-600 text-white">Next</button>}
              {step === 2 && <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white">Finish</button>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
