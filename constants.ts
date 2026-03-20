export const TAX_YEAR_2024_25 = {
  PERSONAL_ALLOWANCE: 12570,
  BASIC_RATE_THRESHOLD: 50270,
  HIGHER_RATE_THRESHOLD: 125140,
  BASIC_RATE: 0.20,
  HIGHER_RATE: 0.40,
  ADDITIONAL_RATE: 0.45,
  NI_THRESHOLD: 12570,
  NI_RATE: 0.08, // 8% for 2024/25
  NI_UPPER_THRESHOLD: 50270,
  NI_UPPER_RATE: 0.02,
};

export const GOALS = [
  { id: 'avoid-higher', title: 'Avoid higher-rate tax', description: 'Keep income below £50,270', icon: 'TrendingDown' },
  { id: 'child-benefit', title: 'Keep child benefit', description: 'Avoid High Income Child Benefit Charge', icon: 'Users' },
  { id: 'avoid-additional', title: 'Avoid additional-rate tax', description: 'Keep income below £125,140', icon: 'Ban' },
  { id: 'max-pension', title: 'Maximise pension growth', description: 'Focus on long-term savings', icon: 'PiggyBank' },
];
