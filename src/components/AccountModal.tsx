import React, { useState } from 'react';
import { X, CheckCircle2, Cloud, HardDrive, Smartphone, Laptop, Trash2, RefreshCw, ShieldCheck } from 'lucide-react';
import { UserAccount, Language } from '../types/video';
import { translations, formatBytes } from '../utils/translations';

interface AccountModalProps {
  account: UserAccount;
  lang: Language;
  onClose: () => void;
  onUpdateAccount: (updated: Partial<UserAccount>) => void;
  onClearVault: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  account,
  lang,
  onClose,
  onUpdateAccount,
  onClearVault,
}) => {
  const t = translations[lang];
  const [emailInput, setEmailInput] = useState(account.email);
  const [nameInput, setNameInput] = useState(account.name);
  const [isEditing, setIsEditing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const usedPercent = Math.min(
    100,
    Math.max(1, Math.round((account.storageUsedBytes / account.storageQuotaBytes) * 100))
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    onUpdateAccount({
      email: emailInput.trim(),
      name: nameInput.trim() || 'Phon Phal',
      initial: (nameInput.trim() || emailInput.trim()).charAt(0).toUpperCase(),
    });
    setIsEditing(false);
  };

  const handleSimulateSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {t.accountDetails}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Card */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200/80 dark:border-slate-600">
            <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-xs shrink-0 ring-4 ring-blue-400/20">
              {account.initial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                  {account.name}
                </h4>
                <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{t.googleConnected}</span>
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5 font-mono">
                {account.email}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Google OAuth Secured Vault</span>
              </div>
            </div>
          </div>

          {/* Edit account info form */}
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-3 p-4 bg-slate-50/50 dark:bg-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-600">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'km' ? 'ឈ្មោះអ្នកប្រើប្រាស់' : 'Account Name'}
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-hidden focus:border-blue-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Gmail / Google Account Email
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:outline-hidden focus:border-blue-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  {t.save}
                </button>
              </div>
            </form>
          ) : (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                {t.switchAccount}
              </button>
            </div>
          )}

          {/* Storage Quota Meter */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-2">
              <div className="flex items-center gap-1.5 font-medium">
                <HardDrive className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{t.storageUsed}</span>
              </div>
              <div className="font-mono tabular-nums text-slate-700 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-slate-100">{formatBytes(account.storageUsedBytes)}</span>
                <span className="text-slate-400"> / </span>
                <span>{formatBytes(account.storageQuotaBytes)}</span>
                <span className="text-slate-500 ml-1">({usedPercent}%)</span>
              </div>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden border border-slate-200 dark:border-slate-600">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${usedPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
              {lang === 'km'
                ? 'ទំហំផ្ទុក Cloud សម្រាប់រក្សាទុកវីដេអូកម្រិតច្បាស់ HD និង 4K ដោយឥតគិតថ្លៃ'
                : 'Google Cloud storage allocated for high definition HD and 4K videos'}
            </p>
          </div>

          {/* Multi-Device Support */}
          <div className="p-3.5 bg-blue-50/50 dark:bg-slate-700/50 rounded-xl border border-blue-100 dark:border-slate-600 text-xs text-slate-700 dark:text-slate-300">
            <h5 className="font-semibold text-blue-900 dark:text-blue-300 mb-1 flex items-center gap-1.5">
              <Laptop className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{t.uploadSubtitle}</span>
            </h5>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              {lang === 'km'
                ? 'វីដេអូដែលបានរក្សាទុកក្នុង Vault នេះអាចបើកមើលបានភ្លាមៗពីទូរស័ព្ទ កុំព្យូទ័រ និង Tablet តាមរយៈការចូលប្រើគណនី Gmail របស់អ្នក។'
                : 'Videos stored in this Vault sync seamlessly across smartphone, desktop, and tablet devices connected to your Google account.'}
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <button
              onClick={handleSimulateSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
              <span>{isSyncing ? t.processing : (lang === 'km' ? 'ធ្វើសមកាលកម្មឥឡូវ' : 'Sync Now')}</span>
            </button>

            <button
              onClick={onClearVault}
              className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{lang === 'km' ? 'សម្អាតវីដេអូទាំងអស់' : 'Clear All Vault Videos'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
