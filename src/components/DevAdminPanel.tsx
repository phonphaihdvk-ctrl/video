/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  UserCheck,
  X,
  CheckCircle,
  Clock,
  Shield,
  Trash2,
  CheckCheck,
  LogIn,
  Users,
  AlertCircle,
  ArrowLeft,
  RotateCcw,
} from 'lucide-react';
import { AppUser, Language } from '../types/video';

interface DevAdminPanelProps {
  isOpen: boolean;
  users: AppUser[];
  currentUserId?: string;
  lang: Language;
  onClose: () => void;
  onApproveUser: (userIdOrEmail: string) => void;
  onRevokeUser: (userIdOrEmail: string) => void;
  onDeleteUser: (userId: string) => void;
  onApproveAll: () => void;
  onSwitchUser: (user: AppUser) => void;
}

export const DevAdminPanel: React.FC<DevAdminPanelProps> = ({
  isOpen,
  users,
  currentUserId,
  lang,
  onClose,
  onApproveUser,
  onRevokeUser,
  onDeleteUser,
  onApproveAll,
  onSwitchUser,
}) => {
  if (!isOpen) return null;

  const pendingCount = users.filter((u) => u.status === 'pending').length;
  const approvedCount = users.filter((u) => u.status === 'approved').length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl text-white flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base text-amber-400 leading-tight">
                {lang === 'km' ? 'ផ្ទាំង Developer (គ្រប់គ្រងអ្នកប្រើ)' : 'Developer Admin Panel'}
              </h2>
              <p className="text-[10px] text-slate-400">
                {lang === 'km' ? 'អនុម័ត និងគ្រប់គ្រងគណនីចូលប្រើប្រាស់ប្រព័ន្ធ' : 'Approve and manage user accounts'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 py-3 border-b border-slate-800/80 text-center">
          <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="text-[10px] text-slate-400">{lang === 'km' ? 'សរុប' : 'Total'}</div>
            <div className="text-base font-bold text-white tabular-nums">{users.length}</div>
          </div>
          <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
            <div className="text-[10px] text-emerald-400">{lang === 'km' ? 'បានអនុម័ត' : 'Approved'}</div>
            <div className="text-base font-bold text-emerald-400 tabular-nums">{approvedCount}</div>
          </div>
          <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-800/40">
            <div className="text-[10px] text-amber-400">{lang === 'km' ? 'រង់ចាំ' : 'Pending'}</div>
            <div className="text-base font-bold text-amber-400 tabular-nums">{pendingCount}</div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex items-center justify-between py-2.5">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>{lang === 'km' ? 'បញ្ជីអ្នកស្នើសុំចុះឈ្មោះ៖' : 'Registered Users List:'}</span>
          </span>
          {pendingCount > 0 && (
            <button
              onClick={onApproveAll}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg shadow-sm transition-all flex items-center gap-1 active:scale-95"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>{lang === 'km' ? 'អនុម័តទាំងអស់' : 'Approve All'}</span>
            </button>
          )}
        </div>

        {/* Requests List */}
        <div className="space-y-2 overflow-y-auto flex-1 pr-1 my-2 max-h-[46vh]">
          {users.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs">
              {lang === 'km' ? 'គ្មានអ្នកចុះឈ្មោះថ្មីទេ' : 'No registered users found'}
            </div>
          ) : (
            users.map((u) => {
              const isCurrent = u.id === currentUserId;
              const isApproved = u.status === 'approved';

              return (
                <div
                  key={u.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-blue-950/30 border-blue-600/50 ring-1 ring-blue-500/30'
                      : 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600'
                  }`}
                >
                  {/* User Avatar & Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={u.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=2563eb&color=fff`}
                      alt={u.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-600 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-xs sm:text-sm text-white truncate">
                          {u.name}
                        </span>
                        {u.role === 'developer' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            DEV
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            YOU
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono truncate">
                        {u.email}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            isApproved
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {isApproved ? (
                            <>
                              <CheckCircle className="w-2.5 h-2.5" />
                              <span>{lang === 'km' ? 'បានអនុម័ត' : 'Approved'}</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-2.5 h-2.5" />
                              <span>{lang === 'km' ? 'រង់ចាំអនុម័ត' : 'Pending Approval'}</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Approve / Revoke Toggle */}
                    {!isApproved ? (
                      <button
                        onClick={() => onApproveUser(u.id)}
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-xl shadow-md transition-all flex items-center gap-1 active:scale-95"
                        title="Approve user"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{lang === 'km' ? 'អនុម័ត' : 'Approve'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onRevokeUser(u.id)}
                        className="px-2 py-1.5 bg-slate-700 hover:bg-slate-600 text-amber-400 font-medium text-[10px] rounded-xl transition-all"
                        title="Revoke approval"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    )}

                    {/* Switch session to this user */}
                    {!isCurrent && isApproved && (
                      <button
                        onClick={() => onSwitchUser(u)}
                        className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] rounded-xl transition-all flex items-center gap-1"
                        title="Login as this user"
                      >
                        <LogIn className="w-3 h-3" />
                        <span className="hidden sm:inline">{lang === 'km' ? 'ចូល' : 'Login'}</span>
                      </button>
                    )}

                    {/* Delete user */}
                    {u.role !== 'developer' && (
                      <button
                        onClick={() => onDeleteUser(u.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Return Button */}
        <div className="pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'km' ? 'ត្រឡប់ទៅទំព័រដើម' : 'Back to Main Dashboard'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
