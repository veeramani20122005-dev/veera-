import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Volume2, Shield, Zap, Crosshair, Award } from 'lucide-react';
import { ComicPanel, Chapter } from '../types/comic';
import { playClickSound, playActionHitSound, playPageFlipSound, speakDialogue } from '../utils/audio';
import { ComicImage } from './ComicImage';

interface GuidedPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: Chapter;
  currentPanelIndex: number;
  onNavigatePanel: (direction: 'next' | 'prev') => void;
  soundEnabled: boolean;
}

export const GuidedPanelModal: React.FC<GuidedPanelModalProps> = ({
  isOpen,
  onClose,
  chapter,
  currentPanelIndex,
  onNavigatePanel,
  soundEnabled
}) => {
  // Collect all panels across the chapter in linear sequence
  const allPanels: { panel: ComicPanel; pageImage: string; pageTitle: string; pageNum: number }[] = [];
  chapter.pages.forEach((page) => {
    page.panels.forEach((panel) => {
      allPanels.push({
        panel,
        pageImage: page.imageSrc,
        pageTitle: page.title,
        pageNum: page.pageNumber
      });
    });
  });

  const activeItem = allPanels[currentPanelIndex] || allPanels[0];
  const activePanel = activeItem?.panel;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        onNavigatePanel('next');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onNavigatePanel('prev');
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onNavigatePanel, onClose]);

  if (!isOpen || !activePanel) return null;

  const handleSpeakerVoice = (text: string, speaker: string) => {
    if (soundEnabled) {
      playActionHitSound(soundEnabled);
    }
    speakDialogue(text, speaker);
  };

  const getSpeakerBadgeColor = (speaker: string) => {
    const s = speaker.toLowerCase();
    if (s.includes('veera')) return 'bg-amber-500 text-black';
    if (s.includes('arun')) return 'bg-rose-500 text-white';
    if (s.includes('karthi')) return 'bg-cyan-500 text-black';
    if (s.includes('surya')) return 'bg-emerald-500 text-black';
    return 'bg-purple-500 text-white';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md">
      <div 
        className="w-full max-w-4xl bg-[#0f172a] border-2 border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
        role="dialog"
        aria-modal="true"
        aria-label="Guided Cinematic Panel View"
      >
        {/* Cinematic Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800 bg-[#162035] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-action text-xs tracking-wider uppercase px-2 py-0.5 rounded bg-amber-500 text-black font-bold">
              CINEMATIC GUIDED VIEW
            </span>
            <span className="text-xs text-slate-300">
              Panel {currentPanelIndex + 1} of {allPanels.length} · Page {activeItem.pageNum}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[11px] text-slate-400">
              Use Left / Right Arrows to Step
            </span>
            <button
              onClick={() => {
                playClickSound(soundEnabled);
                onClose();
              }}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Panel Main Display */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col md:flex-row gap-6 items-center justify-center bg-radial from-[#1e293b]/70 to-[#0b0f17]">
          {/* Visual Artwork Snapshot */}
          <div className="relative w-full md:w-1/2 aspect-4/3 rounded-xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-black group shrink-0">
            <ComicImage
              src={activeItem.pageImage}
              alt={activePanel.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              fallbackTitle={activePanel.title}
              fallbackBadge={`PANEL ${activeItem.panel.panelNumber}`}
            />
            {/* Status Killfeed / Zone overlay if present */}
            {activePanel.statusBanner && (
              <div className="absolute top-2 left-2 right-2 bg-black/85 backdrop-blur-xs border border-amber-500/50 rounded p-1.5 flex items-center justify-between text-[11px]">
                <span className="font-action tracking-wide text-amber-400 font-bold truncate">
                  {activePanel.statusBanner.title}
                </span>
                <span className="text-white font-mono text-[10px]">
                  {activePanel.statusBanner.killFeed || activePanel.statusBanner.alive}
                </span>
              </div>
            )}

            {/* SFX stickers floating over image */}
            {activePanel.sfxStickers?.map((sfx) => (
              <div
                key={sfx.id}
                className="absolute font-comic text-xl sm:text-2xl font-black drop-shadow-[0_4px_4px_rgba(0,0,0,0.9)] transform -rotate-3 select-none pointer-events-none"
                style={{
                  top: `${sfx.position?.y ?? 60}%`,
                  left: `${sfx.position?.x ?? 50}%`,
                  transform: 'translate(-50%, -50%)',
                  color: sfx.color || '#f59e0b'
                }}
              >
                {sfx.text}
              </div>
            ))}
          </div>

          {/* Dialogue & Narrative Column */}
          <div className="w-full md:w-1/2 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-comic text-2xl text-amber-400">
                  {activePanel.title}
                </span>
              </div>
              {activePanel.caption && (
                <p className="text-xs italic text-slate-300 mb-3 bg-slate-800/40 p-2 rounded border border-slate-700/60">
                  {activePanel.caption}
                </p>
              )}

              {/* Dialogues */}
              <div className="space-y-3">
                {activePanel.speechBubbles.map((bubble) => (
                  <div
                    key={bubble.id}
                    className={`relative p-3 rounded-xl border transition-all ${
                      bubble.style === 'shout'
                        ? 'bg-amber-500/10 border-amber-500/50 shadow-md'
                        : bubble.style === 'radio'
                        ? 'bg-cyan-500/10 border-cyan-500/50'
                        : 'bg-[#1b253b] border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-action px-2 py-0.5 rounded font-bold uppercase tracking-wider ${getSpeakerBadgeColor(
                            bubble.speaker
                          )}`}
                        >
                          {bubble.speaker} {bubble.roleTag ? `(${bubble.roleTag})` : ''}
                        </span>
                        <span className="text-[10px] uppercase text-slate-400 font-mono">
                          {bubble.style}
                        </span>
                      </div>

                      <button
                        onClick={() => handleSpeakerVoice(bubble.text, bubble.speaker)}
                        className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-medium bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded transition-colors"
                        title="Listen to dialogue"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Speak</span>
                      </button>
                    </div>

                    <p
                      className={`text-sm leading-relaxed ${
                        bubble.style === 'shout'
                          ? 'font-bold text-white'
                          : bubble.style === 'whisper'
                          ? 'italic text-slate-300'
                          : 'text-slate-100'
                      }`}
                    >
                      "{bubble.text}"
                    </p>
                  </div>
                ))}
              </div>

              {activePanel.narratorNotes && (
                <div className="mt-3 text-[11px] text-amber-300/80 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>{activePanel.narratorNotes}</span>
                </div>
              )}
            </div>

            {/* Navigation Buttons inside dialog */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                disabled={currentPanelIndex === 0}
                onClick={() => {
                  playPageFlipSound(soundEnabled);
                  onNavigatePanel('prev');
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Panel</span>
              </button>

              <button
                disabled={currentPanelIndex === allPanels.length - 1}
                onClick={() => {
                  playPageFlipSound(soundEnabled);
                  onNavigatePanel('next');
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-amber-400 hover:bg-amber-300 disabled:opacity-30 disabled:cursor-not-allowed text-black transition-all shadow-md active:scale-95"
              >
                <span>Next Panel</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
