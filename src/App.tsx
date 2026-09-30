/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ComicHeader } from './components/ComicHeader';
import { ComicReader } from './components/ComicReader';
import { ChapterDrawer } from './components/ChapterDrawer';
import { AddChapterModal } from './components/AddChapterModal';
import { SquadModal } from './components/SquadModal';
import { GuidedPanelModal } from './components/GuidedPanelModal';
import { INITIAL_CHAPTERS } from './data/chaptersData';
import { Chapter } from './types/comic';
import { playClickSound, playBooyahSound } from './utils/audio';
import { BookOpen, Sparkles, ChevronRight, HelpCircle, Layers, Users } from 'lucide-react';

const STORAGE_KEY_CHAPTERS = 'squad_chronicles_chapters_v1';
const STORAGE_KEY_LAST_READ = 'squad_chronicles_last_chapter_v1';

const AVAILABLE_ARTWORKS = [
  '/src/assets/images/comic_ch1_squad_call_1790748208639.jpg',
  '/src/assets/images/comic_ch2_shadow_rift_1790748220650.jpg',
  '/src/assets/images/comic_ch3_storm_battle_1790748236018.jpg',
  '/src/assets/images/comic_ch4_booyah_victory_1790748249982.jpg'
];

export default function App() {
  const [chapters, setChapters] = useState<Chapter[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CHAPTERS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_CHAPTERS;
  });

  const [currentChapterId, setCurrentChapterId] = useState<string>(() => {
    try {
      const last = localStorage.getItem(STORAGE_KEY_LAST_READ);
      if (last && chapters.some((c) => c.id === last)) {
        return last;
      }
    } catch {
      // Fallback
    }
    return chapters[0]?.id || 'chapter-1';
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'reader' | 'chapters' | 'characters'>('reader');

  // Modals state
  const [isChapterDrawerOpen, setIsChapterDrawerOpen] = useState<boolean>(false);
  const [isAddChapterOpen, setIsAddChapterOpen] = useState<boolean>(false);
  const [isSquadModalOpen, setIsSquadModalOpen] = useState<boolean>(false);
  const [isGuidedViewOpen, setIsGuidedViewOpen] = useState<boolean>(false);
  const [guidedPanelIndex, setGuidedPanelIndex] = useState<number>(0);
  const [showHowToPlayTip, setShowHowToPlayTip] = useState<boolean>(false);

  // Sync chapters to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHAPTERS, JSON.stringify(chapters));
    } catch {
      // Storage quota exceeded or disabled
    }
  }, [chapters]);

  // Sync active chapter to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LAST_READ, currentChapterId);
    } catch {
      // Storage error
    }
  }, [currentChapterId]);

  const currentChapter = chapters.find((ch) => ch.id === currentChapterId) || chapters[0];

  const handleSelectChapter = (chapterId: string) => {
    setCurrentChapterId(chapterId);
    setActiveTab('reader');
  };

  const handleAddChapter = (newChapter: Chapter) => {
    const updated = [...chapters, newChapter];
    setChapters(updated);
    setCurrentChapterId(newChapter.id);
    setActiveTab('reader');
  };

  const handleDeleteChapter = (chapterId: string) => {
    const updated = chapters.filter((ch) => ch.id !== chapterId);
    setChapters(updated);
    if (currentChapterId === chapterId && updated.length > 0) {
      setCurrentChapterId(updated[0].id);
    }
  };

  const handleOpenGuidedPanel = (panelIndex: number) => {
    setGuidedPanelIndex(panelIndex);
    setIsGuidedViewOpen(true);
  };

  const handleNavigateGuidedPanel = (direction: 'next' | 'prev') => {
    // Count total panels in current chapter
    let totalPanels = 0;
    currentChapter.pages.forEach((p) => {
      totalPanels += p.panels.length;
    });

    if (direction === 'next') {
      setGuidedPanelIndex((prev) => Math.min(prev + 1, totalPanels - 1));
    } else {
      setGuidedPanelIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      {/* Top Header */}
      <ComicHeader
        currentChapterNum={currentChapter.number}
        totalChapters={chapters.length}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        onOpenChapterDrawer={() => setIsChapterDrawerOpen(true)}
        onOpenAddChapter={() => setIsAddChapterOpen(true)}
        onOpenSquadModal={() => setIsSquadModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'reader' && (
          <ComicReader
            chapter={currentChapter}
            allChapters={chapters}
            onSelectChapter={handleSelectChapter}
            onOpenAddChapter={() => setIsAddChapterOpen(true)}
            onOpenGuidedPanel={handleOpenGuidedPanel}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'chapters' && (
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-xs uppercase font-action tracking-wider text-amber-400">
                  Graphic Novel Series
                </span>
                <h1 className="font-comic text-4xl text-white tracking-wide mt-1">
                  ALL COMIC CHAPTERS ({chapters.length})
                </h1>
                <p className="text-sm text-slate-300 mt-1">
                  Explore the full Free Fire squad tournament storyline and user-created issues.
                </p>
              </div>

              <button
                onClick={() => {
                  playClickSound(soundEnabled);
                  setIsAddChapterOpen(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm rounded-xl shadow-lg shadow-amber-400/20 active:scale-95 transition-all self-start sm:self-auto"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create New Chapter</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {chapters.map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => handleSelectChapter(ch.id)}
                  className={`group rounded-2xl overflow-hidden border bg-[#111827] cursor-pointer hover:border-amber-400/80 transition-all duration-300 flex flex-col shadow-xl ${
                    ch.id === currentChapterId ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-slate-800'
                  }`}
                >
                  <div className="relative aspect-3/4 overflow-hidden bg-black">
                    <img
                      src={ch.coverImage}
                      alt={ch.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 bg-black/85 backdrop-blur-xs text-amber-400 font-comic text-sm px-2.5 py-0.5 rounded border border-amber-400/30">
                      ISSUE #{ch.number}
                    </div>
                    {ch.badge && (
                      <div className="absolute top-2 right-2 bg-amber-400 text-black font-action text-xs font-bold px-2 py-0.5 rounded">
                        {ch.badge}
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-comic text-xl text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                        {ch.title}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-2 mt-1.5 leading-relaxed">
                        {ch.synopsis}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <span>{ch.pages.length} Pages</span>
                      <span>·</span>
                      <span>{ch.readingTime}</span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'characters' && (
          <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 flex-1">
            <div className="mb-8">
              <span className="text-xs uppercase font-action tracking-wider text-amber-400">
                Squad Lineup
              </span>
              <h1 className="font-comic text-4xl text-white tracking-wide mt-1">
                MEET THE FREE FIRE SQUAD
              </h1>
              <p className="text-sm text-slate-300 mt-1">
                The four teammates fighting together for the tournament championship.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {chapters.length > 0 && (
                <button
                  onClick={() => setIsSquadModalOpen(true)}
                  className="w-full text-left p-6 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 hover:bg-amber-500/15 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-400 text-black flex items-center justify-center font-comic text-2xl font-bold">
                      FF
                    </div>
                    <div>
                      <h3 className="font-comic text-2xl text-white">Full Squad Dossier & Audio</h3>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Listen to character quotes, view tactical loadouts, and discover character lore.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-amber-400" />
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Floating Quick Action & Reader Helper */}
      <div className="fixed bottom-18 sm:bottom-6 right-4 sm:right-6 z-30 flex flex-col gap-2">
        <button
          onClick={() => {
            playClickSound(soundEnabled);
            setShowHowToPlayTip(!showHowToPlayTip);
          }}
          className="p-2.5 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700 shadow-xl transition-transform active:scale-95"
          title="Reader Tips & Keyboard Shortcuts"
          aria-label="Reader Help"
        >
          <HelpCircle className="w-5 h-5 text-amber-400" />
        </button>

        {showHowToPlayTip && (
          <div className="absolute bottom-12 right-0 w-72 bg-[#121a2c] border border-slate-700 rounded-xl p-4 shadow-2xl text-xs space-y-2.5 text-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <span className="font-comic text-base text-amber-400">READER SHORTCUTS</span>
              <button
                onClick={() => setShowHowToPlayTip(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <ul className="space-y-1.5 text-slate-300">
              <li>👉 <strong>Swap Pages:</strong> Touch swipe left/right, click left/right edges, or press <kbd className="bg-slate-800 px-1 py-0.5 rounded text-[10px]">Arrow Keys</kbd></li>
              <li>💬 <strong>Speech Bubbles:</strong> Click any dialogue bubble on the page to hear character voice!</li>
              <li>🔍 <strong>Cinematic Mode:</strong> Zooms panel-by-panel for guided reading.</li>
              <li>➕ <strong>Add Chapters:</strong> Create and publish more custom story issues!</li>
            </ul>
          </div>
        )}
      </div>

      {/* Modals and Drawers */}
      <ChapterDrawer
        isOpen={isChapterDrawerOpen}
        onClose={() => setIsChapterDrawerOpen(false)}
        chapters={chapters}
        currentChapterId={currentChapterId}
        onSelectChapter={handleSelectChapter}
        onOpenAddChapter={() => setIsAddChapterOpen(true)}
        onDeleteChapter={handleDeleteChapter}
        soundEnabled={soundEnabled}
      />

      <AddChapterModal
        isOpen={isAddChapterOpen}
        onClose={() => setIsAddChapterOpen(false)}
        onAddChapter={handleAddChapter}
        nextChapterNumber={chapters.length + 1}
        availableArtwork={AVAILABLE_ARTWORKS}
        soundEnabled={soundEnabled}
      />

      <SquadModal
        isOpen={isSquadModalOpen}
        onClose={() => setIsSquadModalOpen(false)}
        soundEnabled={soundEnabled}
      />

      <GuidedPanelModal
        isOpen={isGuidedViewOpen}
        onClose={() => setIsGuidedViewOpen(false)}
        chapter={currentChapter}
        currentPanelIndex={guidedPanelIndex}
        onNavigatePanel={handleNavigateGuidedPanel}
        soundEnabled={soundEnabled}
      />
    </div>
  );
}
