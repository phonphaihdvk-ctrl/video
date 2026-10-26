/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Film,
  Mail,
  Lock,
  User,
  QrCode,
  ShieldAlert,
  Clock,
  CheckCheck,
  RotateCcw,
  Sun,
  Moon,
  Sparkles,
  HardDrive,
  CheckCircle2,
  KeyRound,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { AppUser, Language } from '../types/video';

interface AuthScreenProps {
  lang: Language;
  onToggleLang: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  pendingUser: AppUser | null;
  onRegisterOrLogin: (name: string, email: string, password?: string) => void;
  onQuickApprove: (userIdOrEmail: string) => void;
  onCheckStatus: () => void;
  onOpenQRScanner: () => void;
  onOpenDevPanel: () => void;
  onResetPendingUser: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  lang,
  onToggleLang,
  isDark,
  onToggleTheme,
  pendingUser,
  onRegisterOrLogin,
  onQuickApprove,
  onCheckStatus,
  onOpenQRScanner,
  onOpenDevPanel,
  onResetPendingUser,
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('Phon Phal');
  const [email, setEmail] = useState('phonphaihdvk@gmail.com');
  const [password, setPassword] = useState('123456');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onRegisterOrLogin(name.trim(), email.trim(), password);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center p-4 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Top Controls (Theme & Lang) */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
          <button
            onClick={onToggleLang}
            className="px-2 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {lang.toUpperCase()}
          </button>
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-amber-500 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs transition-colors"
            title={isDark ? 'Switch to Light' : 'Switch to Dark'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
          </button>
        </div>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mt-2 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-500 text-white flex items-center justify-center text-3xl shadow-xl shadow-blue-600/30 mb-3 transform hover:scale-105 transition-transform">
            <Film className="w-8 h-8 fill-current" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
            {lang === 'km' ? 'គ្រប់គ្រង Media Cloud' : 'HD Media Vault Cloud'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-blue-500" />
            <span>{lang === 'km' ? 'ប្រព័ន្ធស្ដុកវីដេអូ និងរូបភាព (5TB Google Cloud)' : 'High-Res Media Vault (5TB Storage)'}</span>
          </p>
        </div>

        {/* ================= PENDING APPROVAL SCREEN ================= */}
        {pendingUser && pendingUser.status === 'pending' ? (
          <div className="w-full text-center space-y-4 bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center">
              <Clock className="w-7 h-7 animate-pulse" />
            </div>

            <div>
              <h3 className="font-bold text-sm sm:text-base text-amber-500">
                {lang === 'km' ? 'រង់ចាំការអនុម័តពី Developer' : 'Waiting for Developer Approval'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {lang === 'km'
                  ? 'គណនីរបស់អ្នកបានផ្ញើទៅ Developer រួចហើយ។ សូមរង់ចាំ Developer ចុចអនុម័ត (Approve) សិន ទើបអាចចូលប្រើប្រាស់បាន។'
                  : 'Your account request has been submitted. Please wait for Developer approval before accessing the vault.'}
              </p>
            </div>

            {/* Pending User Details */}
            <div className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-xl border border-amber-500/20 text-left text-xs space-y-1">
              <div className="font-bold text-slate-800 dark:text-slate-200">{pendingUser.name}</div>
              <div className="text-[11px] text-slate-500 font-mono">{pendingUser.email}</div>
              <div className="text-[10px] text-amber-500 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{lang === 'km' ? 'ស្ថានភាព: រង់ចាំការអនុម័ត' : 'Status: Pending approval'}</span>
              </div>
            </div>

            {/* Developer Action Demo Button */}
            <div className="pt-2 border-t border-amber-500/20 space-y-2">
              <button
                onClick={() => onQuickApprove(pendingUser.id)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <CheckCheck className="w-4 h-4" />
                <span>{lang === 'km' ? '(Developer) ចុចអនុម័តភ្លាមៗ' : '(Developer) Instant Approve Now'}</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={onCheckStatus}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{lang === 'km' ? 'ពិនិត្យស្ថានភាព' : 'Check Status'}</span>
                </button>
                <button
                  onClick={onResetPendingUser}
                  className="flex-1 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                  {lang === 'km' ? 'ប្តូរគណនី' : 'Switch Account'}
                </button>
              </div>
            </div>

            {/* Developer Admin Access */}
            <button
              onClick={onOpenDevPanel}
              className="text-[11px] text-amber-500 hover:text-amber-400 font-semibold underline underline-offset-4"
            >
              {lang === 'km' ? 'បើកផ្ទាំង Developer (Admin Panel)' : 'Open Developer Admin Panel'}
            </button>
          </div>
        ) : (
          /* ================= LOGIN / REGISTER FORM ================= */
          <div className="w-full space-y-4">
            
            {/* Mode Tabs */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setIsRegisterMode(false)}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  !isRegisterMode
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                }`}
              >
                {lang === 'km' ? 'ចូលប្រើប្រាស់ (Sign In)' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={() => setIsRegisterMode(true)}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  isRegisterMode
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                }`}
              >
                {lang === 'km' ? 'ចុះឈ្មោះ (Register)' : 'Register'}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Name Field (shown in register mode or editable) */}
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                  {lang === 'km' ? 'ឈ្មោះរបស់អ្នក' : 'Your Name'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={lang === 'km' ? 'ឧទាហរណ៍: សុខ ជា' : 'e.g., Phon Phal'}
                    required
                    className="w-full px-3 py-2.5 pl-9 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500 transition-colors"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Gmail Address Field */}
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                  {lang === 'km' ? 'អាសយដ្ឋាន Gmail' : 'Gmail Address'}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    required
                    className="w-full px-3 py-2.5 pl-9 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500 transition-colors font-mono"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                  {lang === 'km' ? 'ពាក្យសម្ងាត់ (Password)' : 'Password'}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-3 py-2.5 pl-9 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500 transition-colors font-mono"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <span>
                  {isRegisterMode
                    ? (lang === 'km' ? 'ចុះឈ្មោះប្រើប្រាស់ (Register)' : 'Register Account')
                    : (lang === 'km' ? 'ចូលប្រើប្រាស់ (Sign In)' : 'Sign In')}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-3 text-[11px] text-slate-400">
              <div className="flex-1 border-t border-slate-200 dark:border-slate-800"></div>
              <span className="px-2">{lang === 'km' ? 'ឬស្កេនចូល' : 'Or Scan QR'}</span>
              <div className="flex-1 border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            {/* QR Login Button */}
            <button
              type="button"
              onClick={onOpenQRScanner}
              className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <QrCode className="w-4 h-4 text-blue-500" />
              <span>{lang === 'km' ? 'ចូលតាមរយៈ QR Code' : 'Sign in with QR Code'}</span>
            </button>

            {/* Developer Admin Access Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenDevPanel}
                className="w-full py-2 bg-slate-900 hover:bg-black text-amber-400 font-bold text-[11px] rounded-xl border border-amber-500/30 flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'km' ? 'ចូលទៅកាន់ផ្ទាំង Developer (Admin)' : 'Open Developer Admin Panel'}</span>
              </button>
            </div>

            {/* Quick Helper Credentials Preview */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Dev: <b>Phon Phal</b> (phonphaihdvk@gmail.com)</span>
              <span className="text-emerald-500 font-bold">Auto-Approved</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
