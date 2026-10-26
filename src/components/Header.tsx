import React from 'react';
import {
  Menu,
  Film,
  Layers,
  Video,
  Image as ImageIcon,
  Heart,
  Upload,
  Search,
  Languages,
  Moon,
  Sun,
} from 'lucide-react';
import { Language, UserAccount, AppTab } from '../types/video';
import { translations } from '../utils/translations';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  account: UserAccount;
  onOpenAccount: () => void;
  onOpenUploadModal: () => void;
  onToggleSidebar: () => void;
  currentTab: AppTab;
  onChangeTab: (tab: AppTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  accent?: string;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  isDark,
  onToggleTheme,
  account,
  onOpenAccount,
  onOpenUploadModal,
  onToggleSidebar,
  currentTab,
  onChangeTab,
  searchQuery,
  onSearchChange,
  accent = '#0284c7',
}) => {
  const t = translations[lang];

  return (
    <header className="bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 backdrop-blur-md shadow-xs transition-colors duration-200 px-3 sm:px-6 py-2.5 sm:py-3">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          
          {/* Left: Sidebar Toggle & App Brand */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-sky-500 dark:hover:text-white transition-colors cursor-pointer"
              title="Open Menu & Settings"
            >
              <Menu className="w-5 h-5 cursor-pointer" />
            </button>

            <div
              className="flex items-center gap-2 sm:gap-2.5 cursor-pointer"
              onClick={() => onChangeTab('categories')}
            >
              <div
                style={{ backgroundColor: accent }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-white shadow-md transition-colors"
              >
                <Film className="w-4 h-4 ml-0.5 fill-current" />
              </div>
              <div>
                <h1 className="font-bold text-xs sm:text-base leading-tight text-slate-900 dark:text-white">
                  {t.appTitle}
                </h1>
                <p className="text-[10px] text-emerald-500 font-medium leading-none mt-0.5">
                  5TB Cloud Connected
                </p>
              </div>
            </div>
          </div>

          {/* Right Controls: Upload Button moved to top row, Theme, Lang, Avatar */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Search Input on Desktop */}
            <div className="relative hidden md:block w-32 lg:w-48">
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:border-sky-500 transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            </div>

            {/* 1. Header លើកប៊ូតុង Upload មកជួរលើ */}
            <button
              onClick={onOpenUploadModal}
              style={{ backgroundColor: accent }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold shadow-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              title={t.upload}
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden xs:inline sm:inline">{t.upload}</span>
            </button>

            {/* ប្ដូរ Light / Dark */}
            <button
              onClick={onToggleTheme}
              className="p-1.5 sm:p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:opacity-80 transition-colors cursor-pointer"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1 hover:opacity-80 transition-colors cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-sky-500" />
              <span>{lang.toUpperCase()}</span>
            </button>

            {/* User Profile Avatar with PP / Initial and Green Dot */}
            <button
              onClick={onOpenAccount}
              className="relative rounded-full focus:outline-hidden hover:opacity-90 transition-opacity cursor-pointer shrink-0"
              title={`${account.name} (${account.email})`}
            >
              {account.avatarUrl ? (
                <img
                  src={account.avatarUrl}
                  alt={account.name}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-sky-500 object-cover shadow-xs"
                />
              ) : (
                <div
                  style={{ backgroundColor: accent }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full text-white flex items-center justify-center text-xs font-bold ring-2 ring-sky-500/30"
                >
                  {account.initial || 'PP'}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </button>
          </div>
        </div>

        {/* 2. Tabs + Favorites (ប្រើ SVG Heart គ្មាន Emoji) */}
        <nav className="flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3 overflow-x-auto no-scrollbar py-1 text-xs font-semibold">
          {/* Categories Tab */}
          <button
            onClick={() => onChangeTab('categories')}
            style={currentTab === 'categories' ? { backgroundColor: accent } : undefined}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'categories'
                ? 'text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t.lessons}</span>
          </button>

          {/* Videos Tab */}
          <button
            onClick={() => onChangeTab('videos')}
            style={currentTab === 'videos' ? { backgroundColor: accent } : undefined}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'videos'
                ? 'text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>{t.allVideos}</span>
          </button>

          {/* Photos Tab */}
          <button
            onClick={() => onChangeTab('photos')}
            style={currentTab === 'photos' ? { backgroundColor: accent } : undefined}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'photos'
                ? 'text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{t.photos}</span>
          </button>

          {/* Favorites Tab: SVG Heart icon only, without emoji */}
          <button
            onClick={() => onChangeTab('favorites')}
            style={currentTab === 'favorites' ? { backgroundColor: accent } : undefined}
            className={`px-3 sm:px-3.5 py-1.5 rounded-xl shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'favorites'
                ? 'text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                currentTab === 'favorites' ? 'fill-white text-white' : 'text-rose-500 fill-rose-500'
              }`}
            />
            <span>{t.favorites}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
