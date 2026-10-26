import React from 'react';
import {
  TrendingUp,
  Clock,
  Film,
  CheckCircle2,
  HardDrive,
  Award,
  Smartphone,
  Laptop,
  Tablet,
  CloudCheck,
} from 'lucide-react';
import { UserAccount, Language, StoredVideo, VocabItem } from '../types/video';
import { translations, formatBytes } from '../utils/translations';

interface AnalyticsSectionProps {
  account: UserAccount;
  videos: StoredVideo[];
  vocabList: VocabItem[];
  lang: Language;
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  account,
  videos,
  vocabList,
  lang,
}) => {
  const t = translations[lang];

  const totalDurationSeconds = videos.reduce((acc, v) => acc + (v.duration || 0), 0);
  const totalHours = (totalDurationSeconds / 3600).toFixed(1);
  const masteredVocab = vocabList.filter((v) => v.learned).length;
  const storagePercent = Math.min(
    100,
    Math.max(1, Math.round((account.storageUsedBytes / account.storageQuotaBytes) * 100))
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>{t.analytics}</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {lang === 'km'
            ? 'ស្ថិតិនៃការសិក្សា វីដេអូដែលបានរក្សាទុក និងទំហំផ្ទុក Cloud Vault'
            : 'Learning progress metrics, stored video content, and Google Cloud Vault quota'}
        </p>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
            {totalHours}h
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.studyTime}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
            <Film className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
            {videos.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.completedLessons}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-slate-700 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
            <Award className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
            {masteredVocab} / {vocabList.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {lang === 'km' ? 'ពាក្យគន្លឹះចេះស្ទាត់' : 'Vocabulary Mastered'}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-slate-700 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
            <HardDrive className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
            {formatBytes(account.storageUsedBytes)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t.storageUsed}
          </div>
        </div>
      </div>

      {/* Cloud Vault Storage Details */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {lang === 'km' ? 'កូតាទំហំផ្ទុក Google Cloud Vault' : 'Google Cloud Vault Quota'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {account.email} (Connected & Verified)
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t.cloudSynced}</span>
          </span>
        </div>

        <div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${storagePercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono tabular-nums">
            <span>{formatBytes(account.storageUsedBytes)} used</span>
            <span>{formatBytes(account.storageQuotaBytes)} total quota</span>
          </div>
        </div>
      </div>

      {/* Connected devices strip */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
          {lang === 'km' ? 'ឧបករណ៍ដែលគាំទ្រ និងធ្វើសមកាលកម្ម' : 'Synced Devices via Gmail'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">Mobile Devices</div>
              <div className="text-[11px] text-slate-400">iOS & Android synced</div>
            </div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
            <Laptop className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">Web Browser</div>
              <div className="text-[11px] text-slate-400">Offline & online vault</div>
            </div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
            <Tablet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">Tablet / Classroom</div>
              <div className="text-[11px] text-slate-400">Cast & presentation ready</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
