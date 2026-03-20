import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown,
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Lock, 
  Wallet, 
  Scan, 
  Info, 
  Home, 
  BookOpen, 
  Settings as SettingsIcon,
  ChevronRight,
  CheckCircle2,
  Plus,
  Minus,
  Users,
  Ban,
  PiggyBank,
  ArrowLeft,
  LayoutDashboard,
  FileText,
  Bell,
  Building2,
  Utensils,
  Lightbulb,
  AlertTriangle
} from 'lucide-react';
import { AppStep, UserProfile, TaxResult } from './types';
import { GOALS } from './constants';
import { calculateTax } from './utils/taxCalculator';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className,
  icon: Icon
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
  icon?: any;
}) => {
  const variants = {
    primary: 'bg-[#2f50ca] text-white shadow-lg shadow-blue-500/20 hover:bg-[#2541a5]',
    secondary: 'bg-blue-50 text-[#2f50ca] hover:bg-blue-100',
    outline: 'border-2 border-slate-200 text-slate-600 hover:border-blue-200 hover:text-[#2f50ca]',
    ghost: 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
  };

  return (
    <button 
      onClick={onClick}
      className={cn(
        'flex items-center justify-center gap-2 px-6 py-4 rounded-full font-bold transition-all active:scale-[0.98]',
        variants[variant],
        className
      )}
    >
      {children}
      {Icon && <Icon size={20} />}
    </button>
  );
};

const Card = ({ children, className, ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
  <div className={cn('bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm', className)} {...props}>
    {children}
  </div>
);

const Input = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  prefix, 
  suffix,
  helperText
}: { 
  label: string; 
  value: string | number; 
  onChange: (val: string) => void; 
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  helperText?: React.ReactNode;
}) => (
  <div className="space-y-2">
    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-4">
      {label}
    </label>
    <div className="relative flex items-center bg-white rounded-full px-6 py-4 shadow-sm border border-slate-100 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
      {prefix && <span className="text-slate-400 font-bold mr-2">{prefix}</span>}
      <input 
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-none focus:ring-0 p-0 font-bold text-lg text-slate-900 placeholder:text-slate-300"
      />
      {suffix && <span className="text-slate-400 font-bold ml-2">{suffix}</span>}
    </div>
    {helperText && (
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 ml-4">
        <Info size={14} className="shrink-0" />
        <div className="flex-1">{helperText}</div>
      </div>
    )}
  </div>
);

// --- Screens ---

const LandingScreen = ({ onStart }: { onStart: () => void }) => (
  <div className="space-y-12">
    <div className="space-y-6">
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
        Optimise your pay without sacrificing your <span className="text-[#2f50ca]">lifestyle</span>
      </h1>
      <p className="text-xl text-slate-500 leading-relaxed max-w-xl">
        See how pension contributions affect your take-home pay and tax.
      </p>
    </div>

    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#2f50ca] rounded-full">
      <Lock size={14} fill="currentColor" />
      <span className="text-[10px] font-bold uppercase tracking-wider">No data stored. All calculations run locally.</span>
    </div>

    <div className="pt-4">
      <Button onClick={onStart} icon={ArrowRight} className="px-10 py-5 text-lg">
        Get started
      </Button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
      {[
        { icon: TrendingUp, title: 'Smart Calculation', desc: 'Advanced algorithms that factor in student loans, NI, and tax brackets.' },
        { icon: ShieldCheck, title: 'Privacy First', desc: "We don't want your data. All variables stay on your device." },
        { icon: Zap, title: 'Visual Insights', desc: "Interactive charts show the 'Sweet Spot' between savings and spending." }
      ].map((f, i) => (
        <Card key={i} className="bg-slate-50/50 border-none space-y-4">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#2f50ca] shadow-sm">
            <f.icon size={24} />
          </div>
          <h3 className="font-bold text-lg text-slate-900">{f.title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
        </Card>
      ))}
    </div>
  </div>
);

const ProfileScreen = ({ profile, setProfile, onNext, onOpenBudget }: { profile: UserProfile; setProfile: any; onNext: () => void; onOpenBudget: () => void }) => (
  <div className="space-y-10">
    <div className="space-y-2">
      <h2 className="text-3xl font-extrabold tracking-tight">Build your profile</h2>
      <p className="text-slate-500">Enter your details manually to pre-fill your salary and pension data.</p>
    </div>

    <Button variant="secondary" className="w-full py-4" icon={Scan}>
      Scan my payslip
    </Button>

    <div className="space-y-6">
      <Input 
        label="Annual salary (£)" 
        prefix="£" 
        placeholder="e.g. 45,000" 
        value={profile.salary || ''} 
        onChange={(v) => setProfile({ ...profile, salary: Number(v.replace(/[^0-9]/g, '')) })} 
      />
      
      <div className="grid grid-cols-2 gap-4">
        <Input 
          label="Current (%)" 
          suffix="%" 
          placeholder="5" 
          value={profile.currentPension || ''} 
          onChange={(v) => setProfile({ ...profile, currentPension: Number(v) })} 
        />
        <Input 
          label="Employer (%)" 
          suffix="%" 
          placeholder="3" 
          value={profile.employerPension || ''} 
          onChange={(v) => setProfile({ ...profile, employerPension: Number(v) })} 
        />
      </div>

      <Input 
        label="Minimum monthly take-home (£)" 
        prefix="£" 
        placeholder="e.g. 2,400" 
        value={profile.minTakeHome || ''} 
        onChange={(v) => setProfile({ ...profile, minTakeHome: Number(v.replace(/[^0-9]/g, '')) })} 
        helperText={
          <div className="flex items-center justify-between w-full">
            <span>The amount you need in your bank each month.</span>
            <button 
              onClick={(e) => { e.preventDefault(); onOpenBudget(); }}
              className="text-[#2f50ca] font-bold hover:underline"
            >
              Open budget
            </button>
          </div>
        }
      />
    </div>

    <div className="pt-8">
      <Button onClick={onNext} className="w-full py-5 text-lg">Next</Button>
    </div>
  </div>
);

const GoalsScreen = ({ profile, setProfile, onNext, onBack }: { profile: UserProfile; setProfile: any; onNext: () => void; onBack: () => void }) => {
  const toggleGoal = (id: string) => {
    const goals = profile.goals.includes(id) 
      ? profile.goals.filter(g => g !== id) 
      : [...profile.goals, id];
    setProfile({ ...profile, goals });
  };

const iconMap: any = { 
    TrendingDown: TrendingDown, 
    Users: Users, 
    Ban: Ban, 
    PiggyBank: PiggyBank 
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-900"><ArrowLeft size={24} /></button>
        <h2 className="text-3xl font-extrabold tracking-tight">What is your primary goal?</h2>
      </div>

      <div className="space-y-4">
        {GOALS.map((goal) => {
          const Icon = iconMap[goal.icon];
          const isSelected = profile.goals.includes(goal.id);
          return (
            <button 
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={cn(
                "w-full flex items-center p-5 rounded-2xl bg-white border-2 transition-all text-left",
                isSelected ? "border-[#2f50ca] shadow-md" : "border-transparent shadow-sm hover:border-slate-100"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                isSelected ? "bg-blue-50 text-[#2f50ca]" : "bg-slate-50 text-slate-400"
              )}>
                <Icon size={24} />
              </div>
              <div className="ml-5 flex-grow">
                <h3 className="font-bold text-slate-900">{goal.title}</h3>
                <p className="text-sm text-slate-500">{goal.description}</p>
              </div>
              {isSelected && <CheckCircle2 className="text-[#2f50ca]" size={24} fill="currentColor" />}
            </button>
          );
        })}
      </div>

      <div className="space-y-4 pt-8">
        <Button onClick={onNext} className="w-full py-5 text-lg">Continue to Results</Button>
        <button onClick={onNext} className="w-full text-slate-400 font-bold hover:text-slate-900 transition-colors">Skip for now</button>
      </div>
    </div>
  );
};

const LifestyleScreen = ({ profile, setProfile, onNext, onBack }: { profile: UserProfile; setProfile: any; onNext: () => void; onBack: () => void }) => {
  const totalExpenses = Object.values(profile.expenses).reduce((a, b) => a + b, 0);
  const currentTax = useMemo(() => calculateTax(profile.salary, profile.currentPension, profile.employerPension), [profile.salary, profile.currentPension, profile.employerPension]);
  
  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#2f50ca] rounded-full">
          <Lock size={12} fill="currentColor" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Secure Analysis</span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight">Can you afford the change?</h2>
        <p className="text-slate-500">Map your monthly essentials against your new projected take-home pay.</p>
      </div>

      <Card className="bg-[#2f50ca] text-white border-none p-8 space-y-6">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">Target Monthly Income</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-extrabold">£{profile.minTakeHome.toLocaleString()}</span>
            <span className="text-sm opacity-70 font-medium">/ month</span>
          </div>
        </div>
        <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-2">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest opacity-50">Current Income</p>
            <p className="text-base font-bold">£{Math.round(currentTax.takeHome).toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase font-bold tracking-widest opacity-50">Total Expenses</p>
            <p className="text-base font-bold">£{totalExpenses.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold tracking-widest opacity-50">Monthly Buffer</p>
            <p className="text-base font-bold">£{(profile.minTakeHome - totalExpenses).toLocaleString()}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { id: 'rent', label: 'Rent', icon: Home, color: 'bg-blue-50 text-blue-500' },
          { id: 'bills', label: 'Bills', icon: Zap, color: 'bg-orange-50 text-orange-500' },
          { id: 'food', label: 'Food', icon: Utensils, color: 'bg-green-50 text-green-500' },
          { id: 'other', label: 'Other', icon: LayoutDashboard, color: 'bg-slate-50 text-slate-500' }
        ].map((item) => (
          <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", item.color)}>
                <item.icon size={20} />
              </div>
              <span className="font-bold text-slate-900">{item.label}</span>
            </div>
            <div className="relative">
              <span className="absolute left-0 bottom-2 text-xl font-bold text-slate-300">£</span>
              <input 
                type="text"
                value={(profile.expenses as any)[item.id] || ''}
                onChange={(e) => setProfile({
                  ...profile,
                  expenses: { ...profile.expenses, [item.id]: Number(e.target.value.replace(/[^0-9]/g, '')) }
                })}
                className="w-full bg-transparent border-b-2 border-slate-100 focus:border-[#2f50ca] border-t-0 border-x-0 px-5 py-2 text-xl font-extrabold text-slate-900 focus:ring-0 transition-colors"
              />
            </div>
          </div>
        ))}
      </div>

      <Button 
        onClick={() => {
          setProfile({ ...profile, minTakeHome: totalExpenses });
          onNext();
        }} 
        className="w-full py-5 text-lg" 
        icon={ArrowRight}
      >
        Save to profile
      </Button>
    </div>
  );
};

const ResultsScreen = ({ profile, onNext }: { profile: UserProfile; onNext: () => void }) => {
  const current = useMemo(() => calculateTax(profile.salary, profile.currentPension, profile.employerPension), [profile.salary, profile.currentPension, profile.employerPension]);
  
  // Initialize optimised percent based on profile
  const initialOptimisedPercent = useMemo(() => {
    if (profile.salary > 100000) return 20;
    if (profile.salary > 50000) return 15;
    return 10;
  }, [profile.salary]);

  const [optimisedPercent, setOptimisedPercent] = useState(initialOptimisedPercent);

  const optimised = useMemo(() => calculateTax(profile.salary, optimisedPercent, profile.employerPension), [profile.salary, optimisedPercent, profile.employerPension]);

  const impact = {
    cost: current.takeHome - optimised.takeHome,
    gain: optimised.pensionTotal - current.pensionTotal,
    taxSaving: current.incomeTax - optimised.incomeTax
  };

  const handleAdjust = (delta: number) => {
    setOptimisedPercent(prev => Math.max(0, Math.min(100, prev + delta)));
  };

  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full text-[#2f50ca]">
              <CheckCircle2 size={14} fill="currentColor" />
              <span className="font-bold text-[10px] uppercase tracking-wider">Optimised Strategy</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
              Adjust your pension: <span className="text-[#2f50ca]">{optimisedPercent}%</span>
            </h2>
          </div>
          
          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            <button 
              onClick={() => handleAdjust(-1)}
              className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Minus size={18} />
            </button>
            <div className="w-12 text-center font-bold text-lg">{optimisedPercent}%</div>
            <button 
              onClick={() => handleAdjust(1)}
              className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#2f50ca] hover:bg-blue-100 transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        <Card className="shadow-xl border-none p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50" />
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1 relative z-10">New estimated monthly take-home</p>
          <div className="flex items-baseline gap-2 relative z-10">
            <span className="text-5xl font-extrabold text-[#2f50ca]">£{Math.round(optimised.takeHome).toLocaleString()}</span>
            <span className="text-slate-400 font-medium">/ month</span>
          </div>
        </Card>
      </div>

      <section className="space-y-8">
        <div className="flex justify-between items-end border-b border-slate-100 pb-2">
          <h3 className="text-xl font-bold">Comparison</h3>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <span className="w-24 text-center">Before</span>
            <span className="w-24 text-center text-[#2f50ca]">After</span>
          </div>
        </div>

        <div className="space-y-10">
          {[
            { label: 'Take-home', before: current.takeHome, after: optimised.takeHome, max: Math.max(current.takeHome, optimised.takeHome) },
            { label: 'Pension', before: current.pensionTotal, after: optimised.pensionTotal, max: Math.max(current.pensionTotal, optimised.pensionTotal) },
            { label: 'Tax & NI', before: current.incomeTax + current.nationalInsurance, after: optimised.incomeTax + optimised.nationalInsurance, max: Math.max(current.incomeTax + current.nationalInsurance, optimised.incomeTax + optimised.nationalInsurance) }
          ].map((item, i) => (
            <div key={i} className="space-y-3">
              <label className="text-sm font-bold text-slate-900">{item.label}</label>
              <div className="flex items-center gap-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 rounded-full w-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-slate-300" style={{ width: `${(item.before / item.max) * 100}%` }}></div>
                  </div>
                  <div className="h-4 bg-blue-50 rounded-full w-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#2f50ca]" style={{ width: `${(item.after / item.max) * 100}%` }}></div>
                  </div>
                </div>
                <div className="flex gap-4 text-xs font-bold w-48 justify-end">
                  <span className="w-20 text-right text-slate-400">£{Math.round(item.before).toLocaleString()}</span>
                  <span className="w-20 text-right text-[#2f50ca]">£{Math.round(item.after).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 p-6 rounded-[2rem] space-y-6">
        <h3 className="text-lg font-bold">The Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Cost to you</p>
            <p className="text-xl font-bold text-red-500">− £{Math.round(impact.cost)}<span className="text-xs font-normal">/mo</span></p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Pension Gain</p>
            <p className="text-xl font-bold text-[#2f50ca]">+ £{Math.round(impact.gain / 12)}<span className="text-xs font-normal">/mo</span></p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Tax Saving</p>
            <p className="text-xl font-bold text-slate-900">£{Math.round(impact.taxSaving / 12)}<span className="text-xs font-normal">/mo</span></p>
          </div>
        </div>
        <div className="flex gap-3 items-start p-4 bg-blue-50 rounded-xl border border-blue-100">
          <Lightbulb className="text-[#2f50ca] shrink-0" size={18} />
          <p className="text-sm text-slate-600 leading-relaxed">
            Salary sacrifice converts taxed income into pension savings, meaning every £1 you give up adds roughly £3 to your future pot.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h3 className="text-lg font-bold">Annual Allowance</h3>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Limit: £60,000</span>
        </div>
        <Card className="p-6 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500 font-medium">Total Annual Contribution</span>
            <span className={cn(
              "font-bold",
              optimised.pensionTotal > 60000 ? "text-red-500" : "text-slate-900"
            )}>
              £{Math.round(optimised.pensionTotal).toLocaleString()}
            </span>
          </div>
          
          <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (optimised.pensionTotal / 60000) * 100)}%` }}
              className={cn(
                "absolute inset-y-0 left-0 rounded-full transition-colors duration-500",
                optimised.pensionTotal > 60000 ? "bg-red-500" : "bg-[#2f50ca]"
              )}
            />
          </div>

          {optimised.pensionTotal > 60000 && (
            <div className="flex gap-3 items-start p-3 bg-red-50 rounded-xl border border-red-100">
              <AlertTriangle className="text-red-500 shrink-0" size={16} />
              <p className="text-xs text-red-700 leading-relaxed font-medium">
                You've exceeded the £60,000 annual allowance. Contributions above this limit may be subject to a tax charge.
              </p>
            </div>
          )}
          
          <p className="text-[10px] text-slate-400 leading-relaxed">
            The annual allowance is the maximum amount you can contribute to your pension each tax year while still receiving tax relief.
          </p>
        </Card>
      </section>

      <Button onClick={onNext} className="w-full py-5 text-lg">Apply Strategy</Button>
    </div>
  );
};

const PremiumScreen = ({ onBack }: { onBack: () => void }) => (
  <div className="space-y-12 text-center">
    <div className="space-y-6">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-[#2f50ca]">
        <Lock size={14} fill="currentColor" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Secure Access</span>
      </div>
      <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
        Unlock the full optimisation power
      </h2>
      <p className="text-lg text-slate-500 max-w-md mx-auto">
        Take control of your financial future with advanced tax strategies and detailed reporting.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
      {[
        { icon: TrendingUp, title: 'Full range', desc: 'Personalised recommendations across all pay brackets.' },
        { icon: Building2, title: 'Tax Breakdown', desc: 'Ultra-precise calculations for every penny earned.' },
        { icon: PiggyBank, title: 'Pension Checks', desc: 'Monitor your £60,000 annual allowance limits.' },
        { icon: FileText, title: 'Export as PDF', desc: 'Generate professional reports for your records.' }
      ].map((f, i) => (
        <Card key={i} className="flex flex-col gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#2f50ca]">
            <f.icon size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">{f.title}</h3>
            <p className="text-sm text-slate-500">{f.desc}</p>
          </div>
        </Card>
      ))}
    </div>

    <div className="space-y-4">
      <Card className="border-2 border-[#2f50ca] relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 bg-[#2f50ca] text-white px-4 py-1 rounded-bl-xl text-[10px] font-bold uppercase">Best Value</div>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold text-xl">Lifetime access</p>
            <p className="text-sm text-slate-500">One-time payment</p>
          </div>
          <p className="text-2xl font-extrabold">£14.99</p>
        </div>
      </Card>
      <Card className="bg-slate-50 border-none text-left">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold text-xl">Monthly</p>
            <p className="text-sm text-slate-500">Billed monthly</p>
          </div>
          <p className="text-2xl font-extrabold">£1.99</p>
        </div>
      </Card>
    </div>

    <div className="space-y-6">
      <Button className="w-full py-5 text-lg">Get Premium</Button>
      <button className="text-sm font-bold text-[#2f50ca]/70 hover:text-[#2f50ca]">Restore purchase</button>
      <p className="text-[10px] text-slate-400 px-12 leading-relaxed">
        By subscribing, you agree to our Terms of Service and Privacy Policy. Subscriptions renew automatically unless cancelled.
      </p>
    </div>
  </div>
);

const SettingsScreen = () => (
  <div className="space-y-10">
    <div className="space-y-2">
      <h2 className="text-3xl font-extrabold tracking-tight">Settings</h2>
      <p className="text-slate-500">Manage your preferences and review legal information.</p>
    </div>

    <Card className="bg-slate-50 border-none p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#2f50ca] shadow-sm">
          <Info size={20} />
        </div>
        <h3 className="text-xl font-bold">Important Information</h3>
      </div>
      <p className="text-slate-600 leading-relaxed font-medium">
        This tool provides illustrative calculations and is not financial advice. Results are example scenarios based on UK tax bands.
      </p>
      <div className="inline-flex items-center gap-2 bg-blue-100/50 px-4 py-2 rounded-full">
        <Lock size={12} fill="currentColor" className="text-[#2f50ca]" />
        <span className="text-[#2f50ca] text-[10px] font-bold uppercase tracking-wider">All calculations run locally on your device.</span>
      </div>
    </Card>

    <div className="space-y-3">
      {[
        { label: 'Terms of Service', category: 'Legal' },
        { label: 'Privacy Policy', category: 'Privacy', sub: 'No personal data is ever stored.' },
        { label: 'About this tool', category: 'Documentation' }
      ].map((item, i) => (
        <button key={i} className="w-full group">
          <Card className="flex justify-between items-center transition-all group-hover:bg-slate-50">
            <div className="text-left">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{item.category}</p>
              <p className="font-bold text-lg">{item.label}</p>
              {item.sub && <p className="text-sm text-[#2f50ca] mt-1 italic">{item.sub}</p>}
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-[#2f50ca] transition-colors" />
          </Card>
        </button>
      ))}
    </div>

    <div className="text-center pt-8 text-slate-300 text-[10px] font-bold uppercase tracking-widest">
      <p>Version 2.4.0 (Build 892)</p>
      <p className="mt-1">© 2024 My Pay</p>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [step, setStep] = useState<AppStep>('landing');
  const [profile, setProfile] = useState<UserProfile>({
    salary: 0,
    currentPension: 5,
    employerPension: 3,
    minTakeHome: 0,
    goals: [],
    expenses: { rent: 0, bills: 0, food: 0, other: 0 }
  });

  const screens = {
    landing: <LandingScreen onStart={() => setStep('profile')} />,
    profile: <ProfileScreen profile={profile} setProfile={setProfile} onNext={() => setStep('goals')} onOpenBudget={() => setStep('lifestyle')} />,
    goals: <GoalsScreen profile={profile} setProfile={setProfile} onNext={() => setStep('results')} onBack={() => setStep('profile')} />,
    lifestyle: <LifestyleScreen profile={profile} setProfile={setProfile} onNext={() => setStep('profile')} onBack={() => setStep('profile')} />,
    results: <ResultsScreen profile={profile} onNext={() => setStep('premium')} />,
    premium: <PremiumScreen onBack={() => setStep('results')} />,
    settings: <SettingsScreen />
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button className="text-[#2f50ca] hover:opacity-70 transition-opacity">
              <Wallet size={24} fill="currentColor" />
            </button>
            <h1 className="font-bold text-lg tracking-tight">My Pay</h1>
          </div>
          <button 
            onClick={() => setStep('settings')}
            className={cn(
              "p-2 rounded-full transition-colors",
              step === 'settings' ? "bg-blue-50 text-[#2f50ca]" : "text-slate-400 hover:bg-slate-50"
            )}
          >
            <SettingsIcon size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {screens[step]}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full z-50 bg-white/90 backdrop-blur-2xl border-t border-slate-100 shadow-lg">
        <div className="max-w-2xl mx-auto flex justify-around items-center h-20 px-4">
          {[
            { id: 'landing', label: 'Home', icon: Home },
            { id: 'results', label: 'Optimise', icon: TrendingUp },
            { id: 'settings', label: 'Settings', icon: SettingsIcon }
          ].map((item) => {
            const isActive = step === item.id || (item.id === 'landing' && ['profile', 'goals', 'lifestyle'].includes(step));
            return (
              <button 
                key={item.id}
                onClick={() => setStep(item.id as AppStep)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 transition-all",
                  isActive ? "text-[#2f50ca] scale-110" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <item.icon size={24} fill={isActive ? "currentColor" : "none"} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
