import React from 'react';
import { BookOpen, Volume2, VolumeX, PlusCircle, Users, Compass, Sparkles } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface ComicHeaderProps {
  currentChapterNum: number;
  totalChapters: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenChapterDrawer: () => void;
  onOpenAddChapter: () => void;
  onOpenSquadModal: () => void;
  activeTab: 'reader' | 'chapters' | 'characters';
  setActiveTab: (tab: 'reader' | 'chapters' | 'characters') => void;
}

export const ComicHeader: React.FC<ComicHeaderProps> = ({
  currentChapterNum,
  totalChapters,
  soundEnabled,
  onToggleSound,
  onOpenChapterDrawer,
  onOpenAddChapter,
  onOpenSquadModal,
  activeTab,
  setActiveTab
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0d131f]/95 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playClickSound(soundEnabled);
              setActiveTab('reader');
            }}
            className="flex items-center gap-2 group text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center font-comic text-black text-xl font-bold shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              FF
            </div>
            <div>
              <span className="font-comic text-2xl tracking-wide text-white group-hover:text-amber-400 transition-colors">
                SQUAD CHRONICLES
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-action tracking-wider text-amber-400/90 uppercase">
                Comic Reader
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => {
              playClickSound(soundEnabled);
              setActiveTab('reader');
            }}
            className={`transition-colors hover:text-amber-400 flex items-center gap-1.5 ${
              activeTab === 'reader' ? 'text-amber-400 font-semibold' : 'text-slate-300'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Comic Reader</span>
          </button>

          <button
            onClick={() => {
              playClickSound(soundEnabled);
              onOpenChapterDrawer();
            }}
            className="text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4" />
            <span>Chapters ({totalChapters})</span>
          </button>

          <button
            onClick={() => {
              playClickSound(soundEnabled);
              onOpenSquadModal();
            }}
            className="text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" />
            <span>Squad Roster</span>
          </button>

          <button
            onClick={() => {
              playClickSound(soundEnabled);
              onOpenAddChapter();
            }}
            className="text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Create Chapter</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound FX Toggle */}
          <button
            onClick={() => {
              playClickSound(!soundEnabled);
              onToggleSound();
            }}
            title={soundEnabled ? 'Mute comic sound FX' : 'Enable comic sound FX'}
            className={`p-2 rounded-lg border transition-all ${
              soundEnabled
                ? 'bg-slate-800 text-amber-400 border-amber-400/30 hover:bg-slate-700'
                : 'bg-slate-900/80 text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Chapter Quick Switcher Button */}
          <button
            onClick={() => {
              playClickSound(soundEnabled);
              onOpenChapterDrawer();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
          >
            <span className="text-amber-400">CH.{currentChapterNum}</span>
            <span className="text-slate-400">/ {totalChapters}</span>
          </button>

          {/* Add New Chapter Button */}
          <button
            onClick={() => {
              playClickSound(soundEnabled);
              onOpenAddChapter();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-lg transition-transform active:scale-95 shadow-sm shadow-amber-400/20 whitespace-nowrap"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Chapter</span>
          </button>
        </div>
      </div>
    </header>
  );
};
