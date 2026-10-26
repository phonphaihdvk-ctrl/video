import React, { useState } from 'react';
import { X, Plus, Trash2, Save, Layers } from 'lucide-react';
import { LearningCategory, Language } from '../types/video';
import { translations } from '../utils/translations';

interface CategoryModalProps {
  categories: LearningCategory[];
  lang: Language;
  onClose: () => void;
  onSave: (updated: LearningCategory[]) => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  categories,
  lang,
  onClose,
  onSave,
}) => {
  const t = translations[lang];
  const [list, setList] = useState<LearningCategory[]>(() =>
    categories.map((c) => ({ ...c }))
  );

  const handleFieldChange = (
    index: number,
    field: 'nameKm' | 'nameEn' | 'badge',
    value: string
  ) => {
    setList((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAddCategory = () => {
    const newId = 'cat_' + Date.now();
    const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500'];
    const chosenColor = colors[list.length % colors.length];

    setList((prev) => [
      ...prev,
      {
        id: newId,
        nameKm: 'ប្រភេទថ្មី',
        nameEn: 'New Category',
        badge: `Tier ${prev.length + 1}`,
        color: chosenColor,
        descriptionKm: 'មេរៀន និងវីដេអូបន្ថែម',
        descriptionEn: 'Custom curriculum videos and lessons',
      },
    ]);
  };

  const handleRemoveCategory = (index: number) => {
    if (list.length <= 1) return;
    setList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(list);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-base">{t.editCatTitle}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-3.5">
            {list.map((cat, i) => (
              <div
                key={cat.id}
                className="p-3.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Category {i + 1} ({cat.badge})
                    </span>
                  </div>
                  {list.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(i)}
                      className="text-slate-400 hover:text-red-500 p-1"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      {lang === 'km' ? 'ឈ្មោះជាភាសាខ្មែរ (Khmer)' : 'Khmer Name'}
                    </label>
                    <input
                      type="text"
                      value={cat.nameKm}
                      onChange={(e) => handleFieldChange(i, 'nameKm', e.target.value)}
                      required
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500"
                      placeholder="ឈ្មោះជាភាសាខ្មែរ"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      English Name
                    </label>
                    <input
                      type="text"
                      value={cat.nameEn}
                      onChange={(e) => handleFieldChange(i, 'nameEn', e.target.value)}
                      required
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500"
                      placeholder="English Name"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddCategory}
            className="w-full py-2 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addCategory}</span>
          </button>

          <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
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
