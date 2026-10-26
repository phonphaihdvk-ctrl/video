import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { QuizQuestion, Language, LearningCategory } from '../types/video';
import { translations } from '../utils/translations';

interface QuizSectionProps {
  questions: QuizQuestion[];
  categories: LearningCategory[];
  lang: Language;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  questions,
  categories,
  lang,
}) => {
  const t = translations[lang];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  const filteredQuestions = questions.filter(
    (q) => selectedCategoryFilter === 'all' || q.categoryId === selectedCategoryFilter
  );

  const activeQuestion = filteredQuestions[currentIdx];

  const handleSelectOption = (optId: string) => {
    if (isAnswered) return;
    setSelectedOption(optId);
  };

  const handleSubmit = () => {
    if (!selectedOption || isAnswered || !activeQuestion) return;
    setIsAnswered(true);
    const chosen = activeQuestion.options.find((o) => o.id === selectedOption);
    if (chosen?.isCorrect) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < filteredQuestions.length) {
      setCurrentIdx((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Category selector */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>{t.quiz}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {lang === 'km'
              ? 'អនុវត្តធ្វើតេស្តសំណួរភាសាអង់គ្លេសពង្រឹងសមត្ថភាព'
              : 'Interactive English knowledge check & video comprehension tests'}
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => {
              setSelectedCategoryFilter('all');
              handleRestart();
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              selectedCategoryFilter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {t.all}
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCategoryFilter(c.id);
                handleRestart();
              }}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategoryFilter === c.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {lang === 'km' ? c.nameKm : c.nameEn}
            </button>
          ))}
        </div>
      </div>

      {filteredQuestions.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {t.noVideos}
          </p>
        </div>
      ) : isFinished ? (
        /* Completed Screen */
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 sm:p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-slate-700 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-200 dark:border-slate-600 shadow-sm">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {t.quizCompleted}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {lang === 'km'
              ? `អ្នកឆ្លើយត្រូវ ${score} ក្នុងចំណោម ${filteredQuestions.length} សំណួរ!`
              : `You scored ${score} out of ${filteredQuestions.length} questions!`}
          </p>
          <div className="inline-block px-5 py-2.5 bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold rounded-xl text-lg mb-6">
            {Math.round((score / filteredQuestions.length) * 100)}% Accuracy
          </div>
          <div>
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 shadow-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.restartQuiz}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Question Card */
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-xs">
          {/* Progress */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4">
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {t.question} {currentIdx + 1} / {filteredQuestions.length}
            </span>
            <span className="font-mono tabular-nums">
              {t.score}: {score}
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mb-6">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{
                width: `${((currentIdx + 1) / filteredQuestions.length) * 100}%`,
              }}
            />
          </div>

          {/* Question Text */}
          <div className="mb-6">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-1 leading-snug">
              {lang === 'km' ? activeQuestion.questionKm : activeQuestion.questionEn}
            </h3>
            {lang === 'km' && (
              <p className="text-xs text-slate-400 font-mono">
                {activeQuestion.questionEn}
              </p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-2.5 mb-6">
            {activeQuestion.options.map((opt) => {
              const isSelected = selectedOption === opt.id;
              let optionStyle =
                'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700';

              if (isSelected) {
                optionStyle =
                  'bg-blue-50 dark:bg-blue-900/40 border-blue-500 text-blue-700 dark:text-blue-300 font-semibold';
              }

              if (isAnswered) {
                if (opt.isCorrect) {
                  optionStyle =
                    'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-semibold';
                } else if (isSelected && !opt.isCorrect) {
                  optionStyle =
                    'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-700 dark:text-red-300';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs sm:text-sm flex items-center justify-between gap-3 ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                      {opt.id}
                    </span>
                    <span>{opt.text}</span>
                  </div>

                  {isAnswered && opt.isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  )}
                  {isAnswered && isSelected && !opt.isCorrect && (
                    <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation box after answer */}
          {isAnswered && activeQuestion.explanation && (
            <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-slate-700/70 border border-blue-100 dark:border-slate-600 text-xs text-slate-700 dark:text-slate-300 mb-6 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">{lang === 'km' ? 'ពន្យល់' : 'Explanation'}: </span>
                <span>{activeQuestion.explanation}</span>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end">
            {!isAnswered ? (
              <button
                onClick={handleSubmit}
                disabled={!selectedOption}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:pointer-events-none rounded-xl transition-colors shadow-xs"
              >
                {t.submitAnswer}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl inline-flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>{t.nextQuestion}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
