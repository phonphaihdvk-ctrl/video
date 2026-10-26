import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { StoredVideo, Language, LearningCategory } from '../types/video';
import { translations } from '../utils/translations';

interface EditVideoModalProps {
  video: StoredVideo | null;
  categories: LearningCategory[];
  lang: Language;
  onClose: () => void;
  onSave: (updated: StoredVideo) => void;
}

export const EditVideoModal: React.FC<EditVideoModalProps> = ({
  video,
  categories,
  lang,
  onClose,
  onSave,
}) => {
  const t = translations[lang];
  if (!video) return null;

  const [title, setTitle] = useState(video.title);
  const [category, setCategory] = useState<string>(video.category);
  const [description, setDescription] = useState(video.description || '');
  const [tagsInput, setTagsInput] = useState(video.tags.join(', '));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    onSave({
      ...video,
      title: title.trim(),
      category,
      description: description.trim(),
      tags,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden text-slate-900 dark:text-slate-100">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h3 className="text-base font-bold">{t.edit}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t.title}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 focus:outline-hidden focus:border-blue-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t.category}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 focus:outline-hidden focus:border-blue-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {lang === 'km' ? cat.nameKm : cat.nameEn} ({cat.badge})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {lang === 'km' ? 'ស្លាកសម្គាល់ (Tags)' : 'Tags (comma separated)'}
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Tutorial, Beginner, TMS, Angkor"
              className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 focus:outline-hidden focus:border-blue-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {lang === 'km' ? 'សេចក្តីពិពណ៌នា (Description)' : 'Description'}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Notes or details about this video..."
              className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 focus:outline-hidden focus:border-blue-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t.save}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
