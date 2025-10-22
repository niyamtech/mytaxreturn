import type { Deduction, UserProfile } from '../types';

export function calculatePotentialRefund(
  deductions: Deduction[],
  profile: UserProfile | null
): number {
  if (!profile?.annualIncome) return 0;

  const totalDeductions = deductions.reduce(
    (sum, d) => sum + (d.amount * d.claimPercentage / 100),
    0
  );

  const taxRate = getMarginalTaxRate(profile.annualIncome);
  return totalDeductions * taxRate;
}

function getMarginalTaxRate(income: number): number {
  if (income <= 18200) return 0;
  if (income <= 45000) return 0.19;
  if (income <= 120000) return 0.325;
  if (income <= 180000) return 0.37;
  return 0.45;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getRecommendedCategories(occupation: string): string[] {
  const recommendations: Record<string, string[]> = {
    'tradie': ['tools-equipment', 'vehicle', 'clothing-laundry', 'phone-internet'],
    'office-worker': ['home-office', 'phone-internet', 'education', 'professional-fees'],
    'healthcare': ['clothing-laundry', 'professional-fees', 'education', 'insurance'],
    'teacher': ['education', 'home-office', 'professional-fees', 'other'],
    'hospitality': ['clothing-laundry', 'phone-internet', 'vehicle', 'tools-equipment'],
    'it-professional': ['home-office', 'phone-internet', 'education', 'tools-equipment'],
    'sales': ['vehicle', 'phone-internet', 'travel', 'professional-fees'],
  };

  const key = occupation.toLowerCase().replace(/\s+/g, '-');
  return recommendations[key] || ['phone-internet', 'education', 'professional-fees'];
}