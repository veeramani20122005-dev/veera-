import React from 'react';
import { X, Plus, BookOpen, Clock, Trash2, CheckCircle2, ChevronRight } from 'lucide-react';
import { Chapter } from '../types/comic';
import { playClickSound } from '../utils/audio';

interface ChapterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: Chapter[];
  currentChapterId: string;
  onSelectChapter: (chapterId: string) => void;
  onOpenAddChapter: () => void;
  onDeleteChapter?: (chapterId: string) => void;
  soundEnabled: boolean;
}

export const ChapterDrawer: React.FC<ChapterDrawerProps> = ({
  isOpen,
  onClose,
  chapters,
  currentChapterId,
  onSelectChapter,
  onOpenAddChapter,
  onDeleteChapter,
  soundEnabled
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity">
      <div 
        className="w-full max-w-md bg-[#0e1422] border-l border-slate-800 h-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="Chapter Index"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#131b2e]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-comic text-2xl text-white tracking-wide">
                CHAPTER INDEX
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                {chapters.length} Total
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Select an issue to begin reading or swap between story arcs
            </p>
          </div>
          <button
            onClick={() => {
              playClickSound(soundEnabled);
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close chapter index"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Button: Create New Chapter */}
        <div className="p-4 border-b border-slate-800 bg-[#0f172a]/50">
          <button
            onClick={() => {
              playClickSound(soundEnabled);
              onClose();
              onOpenAddChapter();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm rounded-lg transition-all shadow-md active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Chapter</span>
          </button>
        </div>

        {/* Chapters List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chapters.map((ch) => {
            const isCurrent = ch.id === currentChapterId;
            return (
              <div
                key={ch.id}
                onClick={() => {
                  playClickSound(soundEnabled);
                  onSelectChapter(ch.id);
                  onClose();
                }}
                className={`group relative rounded-xl p-3.5 transition-all cursor-pointer border ${
                  isCurrent
                    ? 'bg-amber-500/10 border-amber-500/60 shadow-lg shadow-amber-500/5'
                    : 'bg-[#151c2e] hover:bg-[#1a233a] border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex gap-3.5 items-start">
                  {/* Thumbnail / Cover Art */}
                  <div className="relative w-20 h-28 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shrink-0">
                    <img
                      src={ch.coverImage}
                      alt={ch.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-1 left-1 bg-black/85 backdrop-blur-xs text-[10px] font-action px-1.5 py-0.5 rounded text-amber-400">
                      CH.{ch.number}
                    </div>
                  </div>

                  {/* Chapter Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                        {ch.badge || `Issue #${ch.number}`}
                      </span>
                      {isCurrent && (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Reading
                        </span>
                      )}
                    </div>

                    <h3 className="font-comic text-lg text-white group-hover:text-amber-300 transition-colors truncate mt-0.5">
                      {ch.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                      {ch.synopsis}
                    </p>

                    <div className="flex items-center gap-3 mt-2.5 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-slate-400" />
                        {ch.pages.length} Pages
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {ch.readingTime}
                      </span>
                      {ch.isCustom && (
                        <>
                          <span>·</span>
                          <span className="text-purple-400 font-medium">User Created</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="self-center">
                    <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
                  </div>
                </div>

                {/* Delete button for custom chapter */}
                {ch.isCustom && onDeleteChapter && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete custom chapter "${ch.title}"?`)) {
                        playClickSound(soundEnabled);
                        onDeleteChapter(ch.id);
                      }
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete chapter"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
