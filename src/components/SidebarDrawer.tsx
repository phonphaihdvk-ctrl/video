import React from 'react';
import {
  X,
  HardDrive,
  Users,
  Clock,
  Star,
  Cloud,
  ExternalLink,
  Palette,
  Check,
} from 'lucide-react';
import { UserAccount, Language, DriveView } from '../types/video';
import { translations, formatBytes } from '../utils/translations';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  account: UserAccount;
  lang: Language;
  currentDriveView: DriveView;
  onSelectDriveView: (view: DriveView) => void;
  accent: string;
  onSelectAccent: (accent: string) => void;
  bgMode: 'dark' | 'black' | 'light';
  onSelectBgMode: (mode: 'dark' | 'black' | 'light') => void;
  isDark: boolean;
}

export const ACCENT_COLORS = ['#0284c7', '#10b981', '#f43f5e', '#8b5cf6'];

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  account,
  lang,
  currentDriveView,
  onSelectDriveView,
  accent,
  onSelectAccent,
  bgMode,
  onSelectBgMode,
  isDark,
}) => {
  const t = translations[lang];

  const storageUsedPercent = Math.min(
    100,
    Math.max(0.1, (account.storageUsedBytes / account.storageQuotaBytes) * 100)
  ).toFixed(1);

  // Background and text style matching active bgMode
  const drawerBgClass =
    !isDark || bgMode === 'light'
      ? 'bg-white text-gray-900 border-r border-gray-200'
      : bgMode === 'black'
      ? 'bg-[#0a0a0a] text-white border-r border-neutral-800'
      : 'bg-[#0f172a] text-slate-100 border-r border-slate-800';

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Slide-out Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 sm:w-80 ${drawerBgClass} z-50 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col justify-between overflow-y-auto no-scrollbar ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-4">
          {/* Header Close Button */}
          <div className="flex justify-between items-center pb-3 border-b border-inherit/20">
            <div className="flex items-center gap-2">
              <Cloud style={{ color: accent }} className="w-5 h-5" />
              <span className="font-bold text-sm">
                {lang === 'km' ? 'ការកំណត់ & Cloud' : 'Theme & Settings'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Section */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-500/10 border border-inherit/10">
            {account.avatarUrl ? (
              <img
                src={account.avatarUrl}
                alt={account.name}
                className="w-10 h-10 rounded-full object-cover border border-sky-400 shrink-0"
              />
            ) : (
              <div
                style={{ backgroundColor: accent }}
                className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-xs ring-2 ring-sky-400/30 shrink-0"
              >
                {account.initial || 'PP'}
              </div>
            )}
            <div className="overflow-hidden min-w-0">
              <div className="font-semibold text-xs truncate">
                {account.name}
              </div>
              <div className="text-[11px] opacity-70 truncate font-mono">
                {account.email}
              </div>
            </div>
          </div>

          {/* Accent Color Picker (Requirement 4) */}
          <div className="p-3 rounded-xl bg-slate-500/10 border border-inherit/10">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Palette className="w-3.5 h-3.5 opacity-70" />
              <label className="text-xs font-semibold block opacity-80 uppercase tracking-wide">
                {lang === 'km' ? 'ពណ៌ ACCENT COLOR' : 'ACCENT COLOR'}
              </label>
            </div>
            <div className="flex items-center gap-3">
              {ACCENT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => onSelectAccent(c)}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-white transition-all cursor-pointer ${
                    accent === c
                      ? 'ring-2 ring-offset-2 ring-sky-500 scale-110 shadow-md'
                      : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                  title={c}
                >
                  {accent === c && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Background Selector (Requirement 4) */}
          <div className="p-3 rounded-xl bg-slate-500/10 border border-inherit/10">
            <label className="text-xs font-semibold block mb-2 opacity-80 uppercase tracking-wide">
              {lang === 'km' ? 'ម៉ូតផ្ទាំងខាងក្រោយ (BACKGROUND)' : 'BACKGROUND MODE'}
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onSelectBgMode('dark')}
                style={
                  isDark && bgMode === 'dark'
                    ? { borderColor: accent, backgroundColor: `${accent}15` }
                    : undefined
                }
                className={`p-2.5 rounded-lg border text-center font-medium transition-all cursor-pointer ${
                  isDark && bgMode === 'dark'
                    ? 'font-bold shadow-xs'
                    : 'border-slate-700/60 opacity-60 hover:opacity-100'
                }`}
              >
                Dark Slate
              </button>
              <button
                onClick={() => onSelectBgMode('black')}
                style={
                  isDark && bgMode === 'black'
                    ? { borderColor: accent, backgroundColor: `${accent}15` }
                    : undefined
                }
                className={`p-2.5 rounded-lg border text-center font-medium transition-all cursor-pointer ${
                  isDark && bgMode === 'black'
                    ? 'font-bold shadow-xs'
                    : 'border-slate-700/60 opacity-60 hover:opacity-100'
                }`}
              >
                Pure Black
              </button>
            </div>
          </div>

          {/* Google Drive Links */}
          <div className="space-y-1 text-xs pt-1">
            <span className="text-[11px] font-semibold opacity-60 px-2 block mb-1 uppercase tracking-wider">
              {t.googleDriveMenu}
            </span>

            <button
              onClick={() => {
                onSelectDriveView('my_drive');
                onClose();
              }}
              style={
                currentDriveView === 'my_drive'
                  ? { backgroundColor: `${accent}20`, color: accent }
                  : undefined
              }
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-colors text-left cursor-pointer ${
                currentDriveView === 'my_drive'
                  ? 'font-bold'
                  : 'opacity-80 hover:opacity-100 hover:bg-slate-500/10'
              }`}
            >
              <HardDrive className="w-4 h-4 shrink-0" />
              <span>{t.myDrive}</span>
            </button>

            <button
              onClick={() => {
                onSelectDriveView('shared');
                onClose();
              }}
              style={
                currentDriveView === 'shared'
                  ? { backgroundColor: `${accent}20`, color: accent }
                  : undefined
              }
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-colors text-left cursor-pointer ${
                currentDriveView === 'shared'
                  ? 'font-bold'
                  : 'opacity-80 hover:opacity-100 hover:bg-slate-500/10'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>{t.sharedWithMe}</span>
            </button>

            <button
              onClick={() => {
                onSelectDriveView('recent');
                onClose();
              }}
              style={
                currentDriveView === 'recent'
                  ? { backgroundColor: `${accent}20`, color: accent }
                  : undefined
              }
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-colors text-left cursor-pointer ${
                currentDriveView === 'recent'
                  ? 'font-bold'
                  : 'opacity-80 hover:opacity-100 hover:bg-slate-500/10'
              }`}
            >
              <Clock className="w-4 h-4 shrink-0" />
              <span>{t.recent}</span>
            </button>

            <button
              onClick={() => {
                onSelectDriveView('starred');
                onClose();
              }}
              style={
                currentDriveView === 'starred'
                  ? { backgroundColor: `${accent}20`, color: accent }
                  : undefined
              }
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-colors text-left cursor-pointer ${
                currentDriveView === 'starred'
                  ? 'font-bold'
                  : 'opacity-80 hover:opacity-100 hover:bg-slate-500/10'
              }`}
            >
              <Star className="w-4 h-4 shrink-0" />
              <span>{t.starred}</span>
            </button>
          </div>
        </div>

        {/* ផ្នែកក្រោម Drawer: Storage Quota 5TB */}
        <div className="p-4 border-t border-inherit/20 bg-slate-500/5">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5 opacity-90">
            <span className="flex items-center gap-1.5">
              <Cloud style={{ color: accent }} className="w-4 h-4" />
              <span>{t.storageInfo}</span>
            </span>
            <span className="font-mono tabular-nums opacity-75 text-[11px]">
              {storageUsedPercent}% {t.usedOf5TB}
            </span>
          </div>

          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700/80 rounded-full overflow-hidden mb-2.5">
            <div
              style={{
                backgroundColor: accent,
                width: `${Math.max(2, parseFloat(storageUsedPercent))}%`,
              }}
              className="h-full rounded-full transition-all duration-300"
            />
          </div>

          <div className="text-[11px] opacity-70 mb-3 flex justify-between font-mono tabular-nums">
            <span>{formatBytes(account.storageUsedBytes)}</span>
            <span>5.0 TB Google Cloud</span>
          </div>

          <a
            href="https://drive.google.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: accent }}
            className="w-full py-2 hover:opacity-90 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <span>{t.openGoogleDrive}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </aside>
    </>
  );
};
