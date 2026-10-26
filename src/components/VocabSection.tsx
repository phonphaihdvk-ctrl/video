import React, { useState } from 'react';
import { BookA, Volume2, CheckCircle2, Bookmark, BookmarkCheck, Search } from 'lucide-react';
import { VocabItem, Language } from '../types/video';
import { translations } from '../utils/translations';

interface VocabSectionProps {
  vocabList: VocabItem[];
  lang: Language;
  onToggleLearned: (id: string) => void;
}

export const VocabSection: React.FC<VocabSectionProps> = ({
  vocabList,
  lang,
  onToggleLearned,
}) => {
  const t = translations[lang];
  const [filter, setFilter] = useState<'all' | 'learned' | 'toLearn'>('all');
  const [search, setSearch] = useState('');

  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const filtered = vocabList.filter((item) => {
    if (filter === 'learned' && !item.learned) return false;
    if (filter === 'toLearn' && item.learned) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.word.toLowerCase().includes(q) ||
        item.meaningKm.toLowerCase().includes(q) ||
        item.meaningEn.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const masteredCount = vocabList.filter((v) => v.learned).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header and stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookA className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>{t.vocab}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {lang === 'km'
              ? 'ពាក្យគន្លឹះភាសាអង់គ្លេស ការបញ្ចេញសំឡេង និងឧទាហរណ៍ជាក់ស្តែង'
              : 'Essential vocabulary words, phonetic pronunciation, and practical sentence examples'}
          </p>
        </div>

        {/* Mastered progress pill */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl shadow-xs shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {masteredCount} / {vocabList.length} {t.learned}
          </span>
        </div>
      </div>

      {/* Filter and Search bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {t.all} ({vocabList.length})
          </button>
          <button
            onClick={() => setFilter('learned')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === 'learned'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {t.learned} ({masteredCount})
          </button>
          <button
            onClick={() => setFilter('toLearn')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filter === 'toLearn'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {lang === 'km' ? 'កំពុងរៀន' : 'In Progress'} ({vocabList.length - masteredCount})
          </button>
        </div>

        <div className="relative sm:w-60">
          <input
            type="text"
            placeholder={lang === 'km' ? 'ស្វែងរកពាក្យ...' : 'Search word...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
        </div>
      </div>

      {/* Vocabulary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                      {item.word}
                    </h3>
                    <button
                      onClick={() => speakWord(item.word)}
                      className="p-1 rounded-full text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
                      title={t.listenAudio}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <span>{item.phonetic}</span>
                    <span>·</span>
                    <span className="italic">{item.partOfSpeech}</span>
                  </div>
                </div>

                <button
                  onClick={() => onToggleLearned(item.id)}
                  className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                    item.learned
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                      : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                  title={item.learned ? 'Mastered' : 'Mark as mastered'}
                >
                  {item.learned ? (
                    <BookmarkCheck className="w-4 h-4 fill-current" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Meanings in Khmer and English */}
              <div className="my-3 space-y-1">
                <div className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                  {item.meaningKm}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {item.meaningEn}
                </div>
              </div>

              {/* Example sentence */}
              <div className="p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-100 dark:border-slate-700 text-xs space-y-1">
                <p className="text-slate-800 dark:text-slate-200 font-medium">
                  "{item.exampleSentence}"
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  {item.exampleKhmer}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
              <span className="capitalize">{item.category} level</span>
              <button
                onClick={() => speakWord(item.exampleSentence)}
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Volume2 className="w-3 h-3" />
                <span>{lang === 'km' ? 'ស្តាប់ប្រយោគ' : 'Listen sentence'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
