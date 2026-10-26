/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { Camera, CheckCircle, Clock, LogOut, ShieldCheck, UserCheck, X } from 'lucide-react';
import { AppUser, Language } from '../types/video';

interface ProfileModalProps {
  isOpen: boolean;
  user: AppUser | null;
  lang: Language;
  onClose: () => void;
  onLogout: () => void;
  onUpdateAvatar: (url: string) => void;
  onOpenDevPanel: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  user,
  lang,
  onClose,
  onLogout,
  onUpdateAvatar,
  onOpenDevPanel,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !user) return null;

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpdateAvatar(url);
    }
  };

  const isApproved = user.status === 'approved';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xs w-full p-6 shadow-2xl text-center space-y-4 text-slate-900 dark:text-slate-100 relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          {lang === 'km' ? 'ព័ត៌មានប្រវត្តិរូប' : 'Profile Information'}
        </h3>

        {/* Avatar Profile Upload Container */}
        <div className="relative w-20 h-20 mx-auto group">
          <img
            src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563eb&color=fff`}
            alt={user.name}
            className="w-full h-full rounded-full object-cover border-2 border-blue-500 shadow-md ring-4 ring-blue-500/10"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center text-xs shadow-lg transition-transform hover:scale-110 active:scale-95"
            title={lang === 'km' ? 'ប្តូររូបភាព' : 'Change Avatar'}
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleAvatarFile}
          />
        </div>

        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            {user.name}
          </h4>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            {user.email}
          </p>

          {/* Status Badge */}
          <div className="mt-2 flex justify-center">
            {isApproved ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded-full">
                <CheckCircle className="w-3 h-3" />
                <span>{lang === 'km' ? 'ត្រូវបានអនុម័តដោយ Developer' : 'Approved by Developer'}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 text-[10px] font-bold rounded-full">
                <Clock className="w-3 h-3" />
                <span>{lang === 'km' ? 'រង់ចាំការអនុម័តពី Developer' : 'Pending Dev Approval'}</span>
              </span>
            )}
          </div>

          <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-blue-500" />
            <span>5TB Google Cloud Storage Connected</span>
          </div>
        </div>

        {/* Developer Admin Panel Shortcut */}
        <div className="pt-1">
          <button
            onClick={() => {
              onClose();
              onOpenDevPanel();
            }}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-amber-500 dark:text-amber-400 text-xs font-semibold rounded-xl border border-amber-500/20 flex items-center justify-center gap-1.5 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{lang === 'km' ? 'ផ្ទាំង Developer (Admin)' : 'Developer Admin Panel'}</span>
          </button>
        </div>

        {/* Modal Buttons */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold rounded-xl text-slate-700 dark:text-slate-300 transition-colors"
          >
            {lang === 'km' ? 'បិទ' : 'Close'}
          </button>
          <button
            onClick={onLogout}
            className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/30 transition-all flex items-center justify-center gap-1.5 active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{lang === 'km' ? 'ចាកចេញ' : 'Logout'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
