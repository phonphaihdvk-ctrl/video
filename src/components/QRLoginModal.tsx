/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { QrCode, X, CheckCircle2, Camera, Sparkles } from 'lucide-react';
import { Language } from '../types/video';

interface QRLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lang: Language;
}

export const QRLoginModal: React.FC<QRLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  lang,
}) => {
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setScanning(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xs w-full p-6 shadow-2xl text-center space-y-4 text-slate-900 dark:text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {lang === 'km' ? 'ស្កេន QR Code ដើម្បីចូល' : 'Scan QR Code to Login'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Scanner Animated Viewfinder */}
        <div className="relative w-48 h-48 mx-auto bg-slate-100 dark:bg-slate-800/80 border-2 border-dashed border-blue-500 rounded-2xl p-4 flex flex-col items-center justify-center overflow-hidden shadow-inner">
          {/* Corner brackets */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-blue-600"></div>
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-blue-600"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-blue-600"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-blue-600"></div>

          {/* QR Icon */}
          <QrCode className="w-24 h-24 text-slate-700 dark:text-slate-300 opacity-90 transition-transform hover:scale-105" />

          {/* Animated Laser Scanning Line */}
          {scanning && (
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse top-1/2"></div>
          )}

          <div className="absolute bottom-2 flex items-center gap-1 text-[10px] text-blue-500 font-semibold bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded-full backdrop-blur-xs">
            <Camera className="w-3 h-3 animate-pulse" />
            <span>{lang === 'km' ? 'កាមេរ៉ាកំពុងស្កេន...' : 'Camera scanning...'}</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          {lang === 'km'
            ? 'តម្រង់កាមេរ៉ាទូរស័ព្ទទៅកាន់ QR Code របស់ប្រព័ន្ធដើម្បីចូលប្រើប្រាស់ភ្លាមៗ'
            : 'Point phone camera at the QR code to authenticate instantly'}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 transition-colors"
          >
            {lang === 'km' ? 'បោះបង់' : 'Cancel'}
          </button>
          <button
            onClick={onSuccess}
            className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-1.5 active:scale-95"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{lang === 'km' ? 'ស្កេនជោគជ័យ' : 'Simulate Success'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
