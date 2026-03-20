import { TAX_YEAR_2024_25 } from '../constants';
import { TaxResult } from '../types';

export function calculateTax(salary: number, pensionPercent: number, employerPercent: number): TaxResult {
  const pensionContribution = (salary * pensionPercent) / 100;
  const employerContribution = (salary * employerPercent) / 100;
  const taxableIncome = Math.max(0, salary - pensionContribution);
  
  // Income Tax
  let incomeTax = 0;
  // Personal Allowance Taper
  let personalAllowance = TAX_YEAR_2024_25.PERSONAL_ALLOWANCE;
  if (salary > 100000) {
    const reduction = (salary - 100000) / 2;
    personalAllowance = Math.max(0, personalAllowance - reduction);
  }

  const taxableAboveAllowance = Math.max(0, taxableIncome - personalAllowance);
  
  if (taxableIncome > TAX_YEAR_2024_25.HIGHER_RATE_THRESHOLD) {
    incomeTax += (taxableIncome - TAX_YEAR_2024_25.HIGHER_RATE_THRESHOLD) * TAX_YEAR_2024_25.ADDITIONAL_RATE;
    incomeTax += (TAX_YEAR_2024_25.HIGHER_RATE_THRESHOLD - TAX_YEAR_2024_25.BASIC_RATE_THRESHOLD) * TAX_YEAR_2024_25.HIGHER_RATE;
    incomeTax += (TAX_YEAR_2024_25.BASIC_RATE_THRESHOLD - personalAllowance) * TAX_YEAR_2024_25.BASIC_RATE;
  } else if (taxableIncome > TAX_YEAR_2024_25.BASIC_RATE_THRESHOLD) {
    incomeTax += (taxableIncome - TAX_YEAR_2024_25.BASIC_RATE_THRESHOLD) * TAX_YEAR_2024_25.HIGHER_RATE;
    incomeTax += (TAX_YEAR_2024_25.BASIC_RATE_THRESHOLD - personalAllowance) * TAX_YEAR_2024_25.BASIC_RATE;
  } else {
    incomeTax += taxableAboveAllowance * TAX_YEAR_2024_25.BASIC_RATE;
  }

  // National Insurance
  let nationalInsurance = 0;
  if (salary > TAX_YEAR_2024_25.NI_UPPER_THRESHOLD) {
    nationalInsurance += (salary - TAX_YEAR_2024_25.NI_UPPER_THRESHOLD) * TAX_YEAR_2024_25.NI_UPPER_RATE;
    nationalInsurance += (TAX_YEAR_2024_25.NI_UPPER_THRESHOLD - TAX_YEAR_2024_25.NI_THRESHOLD) * TAX_YEAR_2024_25.NI_RATE;
  } else if (salary > TAX_YEAR_2024_25.NI_THRESHOLD) {
    nationalInsurance += (salary - TAX_YEAR_2024_25.NI_THRESHOLD) * TAX_YEAR_2024_25.NI_RATE;
  }

  const takeHome = (salary - pensionContribution - incomeTax - nationalInsurance) / 12;

  return {
    grossIncome: salary,
    pensionContribution,
    taxableIncome,
    incomeTax,
    nationalInsurance,
    takeHome,
    pensionTotal: pensionContribution + employerContribution,
  };
}
