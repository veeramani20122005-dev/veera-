import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Sparkles, 
  Play, 
  Pause, 
  Book, 
  Columns, 
  Rows, 
  Focus,
  Volume2,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Chapter, ComicPage, ComicPanel, PaperTheme, ReadingMode } from '../types/comic';
import { playPageFlipSound, playClickSound, playBooyahSound, speakDialogue } from '../utils/audio';

interface ComicReaderProps {
  chapter: Chapter;
  allChapters: Chapter[];
  onSelectChapter: (chapterId: string) => void;
  onOpenAddChapter: () => void;
  onOpenGuidedPanel: (panelIndex: number) => void;
  soundEnabled: boolean;
}

export const ComicReader: React.FC<ComicReaderProps> = ({
  chapter,
  allChapters,
  onSelectChapter,
  onOpenAddChapter,
  onOpenGuidedPanel,
  soundEnabled
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [readingMode, setReadingMode] = useState<ReadingMode>('single');
  const [paperTheme, setPaperTheme] = useState<PaperTheme>('dark');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const [pageTurnDirection, setPageTurnDirection] = useState<'next' | 'prev'>('next');
  const [isSwapping, setIsSwapping] = useState<boolean>(false);

  // Touch and drag swipe state
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPages = chapter.pages.length;
  const currentPage = chapter.pages[currentPageIndex] || chapter.pages[0];
  const nextChapter = allChapters.find((ch) => ch.number === chapter.number + 1);
  const prevChapter = allChapters.find((ch) => ch.number === chapter.number - 1);

  // Reset page index when chapter changes
  useEffect(() => {
    setCurrentPageIndex(0);
  }, [chapter.id]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goToNextPage();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPageIndex, totalPages, soundEnabled]);

  // Autoplay timer
  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      if (currentPageIndex < totalPages - 1) {
        goToNextPage();
      } else {
        setAutoPlay(false);
      }
    }, 4500);
    return () => clearInterval(interval);
  }, [autoPlay, currentPageIndex, totalPages]);

  // Check if final page with Booyah reached
  useEffect(() => {
    const isBooyah = currentPage?.panels.some((p) =>
      p.speechBubbles.some((sb) => sb.text.toLowerCase().includes('booyah') || sb.text.toLowerCase().includes('did it'))
    );
    if (isBooyah && currentPageIndex === totalPages - 1) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      playBooyahSound(soundEnabled);
    }
  }, [currentPageIndex, totalPages, currentPage, soundEnabled]);

  const triggerPageSwap = (direction: 'next' | 'prev', targetIdx: number) => {
    setPageTurnDirection(direction);
    setIsSwapping(true);
    playPageFlipSound(soundEnabled);
    setTimeout(() => {
      setCurrentPageIndex(targetIdx);
      setIsSwapping(false);
      setDragOffset(0);
    }, 180);
  };

  const goToNextPage = () => {
    if (currentPageIndex < totalPages - 1) {
      triggerPageSwap('next', currentPageIndex + 1);
    } else if (nextChapter) {
      // Jump to next chapter if at end of current chapter
      playPageFlipSound(soundEnabled);
      onSelectChapter(nextChapter.id);
    }
  };

  const goToPrevPage = () => {
    if (currentPageIndex > 0) {
      triggerPageSwap('prev', currentPageIndex - 1);
    } else if (prevChapter) {
      playPageFlipSound(soundEnabled);
      onSelectChapter(prevChapter.id);
    }
  };

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchEndX.current = e.targetTouches[0].clientX;
    const diff = touchEndX.current - touchStartX.current;
    if (Math.abs(diff) < 150) {
      setDragOffset(diff * 0.4);
    }
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) {
      setDragOffset(0);
      return;
    }
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 45;
    const isRightSwipe = distance < -45;

    if (isLeftSwipe) {
      goToNextPage();
    } else if (isRightSwipe) {
      goToPrevPage();
    } else {
      setDragOffset(0);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    playClickSound(soundEnabled);
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Paper Theme Classes
  const getThemeClasses = () => {
    switch (paperTheme) {
      case 'vintage':
        return 'bg-[#f4ebd0] text-[#1c1917] border-[#d4c5a9]';
      case 'white':
        return 'bg-[#fafafa] text-[#0f172a] border-slate-300';
      case 'neon':
        return 'bg-[#070b14] text-[#38bdf8] border-cyan-500/40 shadow-cyan-500/10';
      case 'dark':
      default:
        return 'bg-[#111827] text-slate-100 border-slate-800';
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full flex flex-col bg-[#0b0f19] min-h-[calc(100vh-65px)] select-none text-slate-100"
    >
      {/* Chapter Information Banner & Mode Controls Bar */}
      <div className="bg-[#0f1626]/95 border-b border-slate-800/80 px-4 py-2.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Chapter Metadata */}
          <div className="flex items-center gap-2.5">
            <span className="font-action text-sm tracking-wider uppercase px-2 py-0.5 rounded bg-amber-500 text-black font-bold">
              ISSUE #{chapter.number}
            </span>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="font-comic text-base text-white tracking-wide truncate max-w-[200px] sm:max-w-xs">
                {chapter.title}
              </span>
              <span className="hidden sm:inline text-slate-500">·</span>
              <span className="hidden sm:inline text-slate-400">
                Page {currentPageIndex + 1} of {totalPages}
              </span>
            </div>
          </div>

          {/* Reader Controls Toolbar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Reading Mode Segmented Control */}
            <div className="flex items-center p-0.5 bg-slate-900 rounded-lg border border-slate-800">
              <button
                onClick={() => {
                  playClickSound(soundEnabled);
                  setReadingMode('single');
                }}
                className={`p-1.5 rounded-md transition-colors ${
                  readingMode === 'single'
                    ? 'bg-amber-500 text-black font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Single Page Mode (Swipe to swap)"
              >
                <Book className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  playClickSound(soundEnabled);
                  setReadingMode('double');
                }}
                className={`hidden sm:block p-1.5 rounded-md transition-colors ${
                  readingMode === 'double'
                    ? 'bg-amber-500 text-black font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Double Page Spread (Book Mode)"
              >
                <Columns className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  playClickSound(soundEnabled);
                  setReadingMode('webtoon');
                }}
                className={`p-1.5 rounded-md transition-colors ${
                  readingMode === 'webtoon'
                    ? 'bg-amber-500 text-black font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Webtoon / Vertical Scroll Mode"
              >
                <Rows className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Cinematic Guided View Trigger */}
            <button
              onClick={() => {
                playClickSound(soundEnabled);
                onOpenGuidedPanel(0);
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-colors font-medium text-[11px]"
              title="Launch Guided Cinematic Panel View"
            >
              <Focus className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Cinematic View</span>
            </button>

            {/* Paper Theme Selector */}
            <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-400">
              <button
                onClick={() => setPaperTheme('dark')}
                className={`px-2 py-0.5 rounded ${paperTheme === 'dark' ? 'bg-slate-700 text-white' : 'hover:text-slate-200'}`}
              >
                Dark
              </button>
              <button
                onClick={() => setPaperTheme('vintage')}
                className={`px-2 py-0.5 rounded ${paperTheme === 'vintage' ? 'bg-[#f4ebd0] text-black font-bold' : 'hover:text-slate-200'}`}
              >
                Pulp
              </button>
              <button
                onClick={() => setPaperTheme('white')}
                className={`px-2 py-0.5 rounded ${paperTheme === 'white' ? 'bg-white text-black font-bold' : 'hover:text-slate-200'}`}
              >
                White
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 border-l border-slate-800 pl-2">
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 15, 80))}
                className="p-1 text-slate-400 hover:text-white rounded"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono text-slate-400 min-w-8 text-center">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 15, 160))}
                className="p-1 text-slate-400 hover:text-white rounded"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="p-1 text-slate-400 hover:text-white rounded"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Autoplay Slideshow */}
            <button
              onClick={() => {
                playClickSound(soundEnabled);
                setAutoPlay(!autoPlay);
              }}
              className={`p-1.5 rounded-md border transition-colors ${
                autoPlay
                  ? 'bg-amber-500 text-black border-amber-400'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title={autoPlay ? 'Pause Auto-Swap' : 'Start Auto-Swap (4.5s)'}
            >
              {autoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700 hover:text-white transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Comic Canvas Area */}
      <div 
        className="flex-1 relative flex items-center justify-center p-2 sm:p-6 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Left Click Zone to swap previous */}
        <div
          onClick={goToPrevPage}
          className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 z-20 cursor-pointer flex items-center justify-start pl-2 opacity-0 hover:opacity-100 transition-opacity group"
          title="Click or swipe right for previous page"
        >
          <div className="w-10 h-10 rounded-full bg-black/75 border border-slate-700 flex items-center justify-center text-white group-hover:scale-110 shadow-lg transition-transform">
            <ChevronLeft className="w-6 h-6" />
          </div>
        </div>

        {/* Right Click Zone to swap next */}
        <div
          onClick={goToNextPage}
          className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 z-20 cursor-pointer flex items-center justify-end pr-2 opacity-0 hover:opacity-100 transition-opacity group"
          title="Click or swipe left for next page"
        >
          <div className="w-10 h-10 rounded-full bg-black/75 border border-slate-700 flex items-center justify-center text-white group-hover:scale-110 shadow-lg transition-transform">
            <ChevronRight className="w-6 h-6" />
          </div>
        </div>

        {/* Content based on Reading Mode */}
        {readingMode === 'webtoon' ? (
          /* Webtoon Vertical Continuous Reading Mode */
          <div className="w-full max-w-2xl mx-auto space-y-8 py-4 overflow-y-auto max-h-[78vh] pr-2">
            {chapter.pages.map((pg, pIdx) => (
              <div
                key={pg.id}
                className={`rounded-2xl overflow-hidden border shadow-2xl transition-all ${getThemeClasses()}`}
              >
                <div className="p-3 border-b border-inherit/40 flex items-center justify-between text-xs">
                  <span className="font-comic text-base tracking-wide">
                    PAGE {pIdx + 1}: {pg.title}
                  </span>
                  <span className="text-slate-400 font-medium">{pg.subtitle}</span>
                </div>

                <div className="relative aspect-3/4 w-full bg-black">
                  <img
                    src={pg.imageSrc}
                    alt={pg.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {/* Floating speech bubbles */}
                  {pg.panels.map((pan) =>
                    pan.speechBubbles.map((sb) => (
                      <div
                        key={sb.id}
                        onClick={() => speakDialogue(sb.text, sb.speaker)}
                        className="absolute cursor-pointer transition-transform hover:scale-105 active:scale-95 bg-white text-black font-semibold rounded-2xl px-3 py-1.5 text-xs shadow-xl border-2 border-black max-w-[200px]"
                        style={{
                          top: `${sb.position?.y ?? 25}%`,
                          left: `${sb.position?.x ?? 30}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        <div className="text-[10px] font-action text-amber-600 font-bold uppercase">
                          {sb.speaker}
                        </div>
                        <div>"{sb.text}"</div>
                      </div>
                    ))
                  )}
                </div>

                {/* Panel Script Summary */}
                <div className="p-4 space-y-3 bg-black/20">
                  {pg.panels.map((pan) => (
                    <div key={pan.id} className="p-3 rounded-lg bg-black/40 border border-slate-700/60">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-comic text-base text-amber-400">{pan.title}</span>
                        <button
                          onClick={() => onOpenGuidedPanel(0)}
                          className="text-[11px] text-slate-300 hover:text-white underline"
                        >
                          Cinematic View
                        </button>
                      </div>
                      {pan.caption && (
                        <p className="text-xs text-slate-300 italic mb-2">"{pan.caption}"</p>
                      )}
                      <div className="space-y-1.5">
                        {pan.speechBubbles.map((sb) => (
                          <div key={sb.id} className="text-xs flex items-center justify-between">
                            <span className="text-slate-200">
                              <strong className="text-amber-400">{sb.speaker}:</strong> "{sb.text}"
                            </span>
                            <button
                              onClick={() => speakDialogue(sb.text, sb.speaker)}
                              className="text-amber-400 hover:text-amber-300 p-1"
                              title="Listen"
                            >
                              <Volume2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : readingMode === 'double' ? (
          /* Double Page Spread (Book Mode) */
          <div 
            className="flex items-center justify-center gap-1 sm:gap-2 max-w-6xl w-full perspective-1500"
            style={{ transform: `scale(${zoomLevel / 100})`, transition: 'transform 0.2s ease' }}
          >
            {/* Left Page */}
            <div className={`w-1/2 aspect-3/4 rounded-l-2xl overflow-hidden border-2 shadow-2xl relative transition-all ${getThemeClasses()}`}>
              <img
                src={currentPage.imageSrc}
                alt={currentPage.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/60 to-transparent pointer-events-none" />
              <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-xs text-amber-400 px-2 py-0.5 rounded text-xs font-comic">
                PAGE {currentPageIndex + 1}
              </div>
            </div>

            {/* Right Page (Next Page if available or book ending) */}
            <div className={`w-1/2 aspect-3/4 rounded-r-2xl overflow-hidden border-2 shadow-2xl relative transition-all ${getThemeClasses()}`}>
              {chapter.pages[currentPageIndex + 1] ? (
                <>
                  <img
                    src={chapter.pages[currentPageIndex + 1].imageSrc}
                    alt={chapter.pages[currentPageIndex + 1].title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-xs text-amber-400 px-2 py-0.5 rounded text-xs font-comic">
                    PAGE {currentPageIndex + 2}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#131b2e]">
                  <Sparkles className="w-10 h-10 text-amber-400 mb-3" />
                  <h4 className="font-comic text-2xl text-white">END OF CHAPTER #{chapter.number}</h4>
                  <p className="text-xs text-slate-300 mt-2 max-w-xs">
                    {nextChapter ? `Ready for Issue #${nextChapter.number}?` : 'You have completed all issues!'}
                  </p>
                  {nextChapter ? (
                    <button
                      onClick={() => onSelectChapter(nextChapter.id)}
                      className="mt-4 px-4 py-2 bg-amber-400 text-black font-bold text-xs rounded-lg shadow-md hover:bg-amber-300 transition-colors"
                    >
                      Read Next Chapter
                    </button>
                  ) : (
                    <button
                      onClick={onOpenAddChapter}
                      className="mt-4 px-4 py-2 bg-amber-400 text-black font-bold text-xs rounded-lg shadow-md hover:bg-amber-300 transition-colors"
                    >
                      Create More Chapters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Single Page Mode with realistic Page Swap effect & Touch drag */
          <div
            className="relative w-full max-w-xl aspect-3/4 mx-auto perspective-1500"
            style={{
              transform: `scale(${zoomLevel / 100}) translateX(${dragOffset}px)`,
              transition: isSwapping ? 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.18s ease' : 'none'
            }}
          >
            <div
              className={`w-full h-full rounded-2xl overflow-hidden border-2 shadow-2xl relative flex flex-col transition-all duration-300 ${
                isSwapping
                  ? pageTurnDirection === 'next'
                    ? 'rotate-y-[-12deg] scale-98 opacity-90'
                    : 'rotate-y-[12deg] scale-98 opacity-90'
                  : ''
              } ${getThemeClasses()}`}
            >
              {/* Comic Page Artwork */}
              <div className="relative flex-1 bg-black overflow-hidden">
                <img
                  src={currentPage.imageSrc}
                  alt={currentPage.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover select-none pointer-events-none"
                />

                {/* Subtle paper lighting glare */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/10 pointer-events-none" />

                {/* Interactive Dialogue Speech Bubbles */}
                {currentPage.panels.map((panel) =>
                  panel.speechBubbles.map((sb) => (
                    <div
                      key={sb.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        speakDialogue(sb.text, sb.speaker);
                      }}
                      className={`absolute cursor-pointer transition-all hover:scale-110 active:scale-95 z-10 px-3 py-1.5 rounded-2xl border-2 border-black max-w-[210px] text-xs shadow-xl ${
                        sb.style === 'shout'
                          ? 'bg-amber-300 text-black font-black uppercase tracking-wide'
                          : sb.style === 'radio'
                          ? 'bg-cyan-100 text-cyan-950 font-bold'
                          : 'bg-white text-slate-900 font-semibold'
                      }`}
                      style={{
                        top: `${sb.position?.y ?? 25}%`,
                        left: `${sb.position?.x ?? 50}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      title="Click to hear speech line"
                    >
                      <div className="flex items-center justify-between gap-1 text-[9px] font-action tracking-wider text-slate-700">
                        <span>{sb.speaker}</span>
                        <Volume2 className="w-2.5 h-2.5 text-slate-500" />
                      </div>
                      <div className="leading-tight mt-0.5">"{sb.text}"</div>
                    </div>
                  ))
                )}

                {/* Comic Action SFX Stickers */}
                {currentPage.panels.map((panel) =>
                  panel.sfxStickers?.map((sfx) => (
                    <div
                      key={sfx.id}
                      className="absolute font-comic text-2xl sm:text-3xl font-black drop-shadow-[0_4px_4px_rgba(0,0,0,0.9)] select-none pointer-events-none z-15"
                      style={{
                        top: `${sfx.position?.y ?? 70}%`,
                        left: `${sfx.position?.x ?? 50}%`,
                        transform: `translate(-50%, -50%) rotate(${sfx.rotation ?? -4}deg)`,
                        color: sfx.color || '#f59e0b'
                      }}
                    >
                      {sfx.text}
                    </div>
                  ))
                )}

                {/* Page Number & Arc Stamp */}
                <div className="absolute top-3 left-3 bg-black/85 backdrop-blur-xs text-amber-400 font-comic text-sm px-2.5 py-0.5 rounded border border-amber-400/30 shadow">
                  PAGE {currentPageIndex + 1}
                </div>

                <div className="absolute top-3 right-3 bg-black/85 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded border border-slate-700 shadow">
                  {currentPage.subtitle || chapter.title}
                </div>
              </div>

              {/* Page Narrative Footer Strip */}
              {currentPage.pageNarrative && (
                <div className="p-3 bg-[#0d131f] border-t border-slate-800 flex items-center justify-between text-xs">
                  <p className="text-slate-300 italic truncate max-w-md">
                    "{currentPage.pageNarrative}"
                  </p>
                  <button
                    onClick={() => onOpenGuidedPanel(0)}
                    className="shrink-0 text-amber-400 hover:text-amber-300 font-bold ml-2 underline text-[11px]"
                  >
                    Open Panels
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Reader Bottom Navigation Scrubber Bar */}
      <div className="bg-[#0e1524] border-t border-slate-800 p-3 sm:px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Previous Page or Previous Chapter */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevPage}
              disabled={currentPageIndex === 0 && !prevChapter}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-white transition-all active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{currentPageIndex === 0 && prevChapter ? `Prev Chapter` : `Swap Prev`}</span>
            </button>
          </div>

          {/* Page Scrubber & Thumbnails */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
            <input
              type="range"
              min={0}
              max={totalPages - 1}
              value={currentPageIndex}
              onChange={(e) => {
                const target = parseInt(e.target.value, 10);
                triggerPageSwap(target > currentPageIndex ? 'next' : 'prev', target);
              }}
              className="w-36 sm:w-48 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <span className="text-xs font-mono font-bold text-amber-400 whitespace-nowrap">
              {currentPageIndex + 1} / {totalPages}
            </span>
          </div>

          {/* Next Page or Next Chapter */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToNextPage}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-xs font-bold text-black transition-all active:scale-95 shadow-md shadow-amber-400/20"
            >
              <span>{currentPageIndex === totalPages - 1 && nextChapter ? `Next Chapter` : `Swap Next`}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
