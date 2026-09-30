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
  Volume2,
  Upload,
  Layers,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Chapter, ComicPage, PaperTheme, ReadingMode } from '../types/comic';
import { playPageFlipSound, playClickSound, playBooyahSound, speakDialogue } from '../utils/audio';
import { ComicImage } from './ComicImage';

interface ComicReaderProps {
  chapter: Chapter;
  allChapters: Chapter[];
  onSelectChapter: (chapterId: string) => void;
  onOpenAddChapter: () => void;
  onOpenGuidedPanel: (panelIndex: number) => void;
  onUpdatePageImage?: (chapterId: string, pageId: string, newImageSrc: string) => void;
  soundEnabled: boolean;
}

export const ComicReader: React.FC<ComicReaderProps> = ({
  chapter,
  allChapters,
  onSelectChapter,
  onOpenAddChapter,
  onOpenGuidedPanel,
  onUpdatePageImage,
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

  // Touch and mouse drag swipe state
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const mouseStartX = useRef<number | null>(null);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalPages = chapter.pages.length;
  const currentPage = chapter.pages[currentPageIndex] || chapter.pages[0];
  const nextChapter = allChapters.find((ch) => ch.number === chapter.number + 1);
  const prevChapter = allChapters.find((ch) => ch.number === chapter.number - 1);

  // Reset page index when chapter changes
  useEffect(() => {
    setCurrentPageIndex(0);
    setDragOffset(0);
  }, [chapter.id]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        goToNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        goToPrevPage();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPageIndex, totalPages, soundEnabled]);

  // Auto-swap feature
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (autoPlay) {
      interval = setInterval(() => {
        if (currentPageIndex < totalPages - 1) {
          triggerPageSwap('next', currentPageIndex + 1);
        } else {
          setAutoPlay(false);
        }
      }, 4500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoPlay, currentPageIndex, totalPages]);

  // Celebrate Booyah! on final panels
  useEffect(() => {
    const isBooyah = currentPage?.panels?.some((p) =>
      p.speechBubbles?.some((sb) => sb.text.toLowerCase().includes('booyah') || sb.text.toLowerCase().includes('did it'))
    );
    if (isBooyah && currentPageIndex === totalPages - 1) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        playBooyahSound(soundEnabled);
      } catch {
        // Fallback
      }
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
    if (Math.abs(diff) < 180) {
      setDragOffset(diff * 0.45);
    }
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) {
      setDragOffset(0);
      return;
    }
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 40) {
      goToNextPage();
    } else if (distance < -40) {
      goToPrevPage();
    }
    touchStartX.current = null;
    touchEndX.current = null;
    setDragOffset(0);
  };

  // Mouse Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement)?.closest('button, a, input, select, .speech-bubble-item, label')) return;
    setIsMouseDown(true);
    mouseStartX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || mouseStartX.current === null) return;
    const diff = e.clientX - mouseStartX.current;
    if (Math.abs(diff) < 220) {
      setDragOffset(diff * 0.4);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isMouseDown || mouseStartX.current === null) return;
    const distance = mouseStartX.current - e.clientX;
    if (distance > 45) {
      goToNextPage();
    } else if (distance < -45) {
      goToPrevPage();
    }
    setIsMouseDown(false);
    mouseStartX.current = null;
    setDragOffset(0);
  };

  const handleMouseLeave = () => {
    if (isMouseDown) {
      setIsMouseDown(false);
      mouseStartX.current = null;
      setDragOffset(0);
    }
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

  // Page image file replacement handler
  const handlePageImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdatePageImage && currentPage) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          playBooyahSound(soundEnabled);
          onUpdatePageImage(chapter.id, currentPage.id, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Paper Theme Classes
  const getThemeClasses = () => {
    switch (paperTheme) {
      case 'vintage':
        return 'bg-[#f7f0e3] text-stone-900 border-[#d3c0a5] shadow-[0_20px_50px_rgba(40,30,20,0.35)]';
      case 'manga':
        return 'bg-[#eaeaea] text-black border-zinc-400 grayscale contrast-110 shadow-2xl';
      case 'modern':
        return 'bg-white text-slate-900 border-slate-200 shadow-2xl';
      case 'dark':
      default:
        return 'bg-[#0f1422] text-slate-100 border-slate-800 shadow-[0_25px_60px_rgba(0,0,0,0.8)]';
    }
  };

  return (
    <div
      ref={containerRef}
      className={`flex-1 flex flex-col relative select-none ${
        isFullscreen ? 'fixed inset-0 z-50 bg-[#070a12]' : 'w-full'
      }`}
    >
      {/* Reader Controls Toolbar */}
      <div className="bg-[#0b101c]/90 backdrop-blur-md border-b border-slate-800 px-3 py-2 sm:px-6 z-30">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Chapter & Page Progress */}
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-black font-action font-black px-2 py-0.5 rounded text-[11px] uppercase tracking-wider">
              Issue #{chapter.number}
            </span>
            <span className="font-comic text-white text-sm sm:text-base hidden sm:inline">
              {chapter.title}
            </span>
            <span className="text-slate-400 font-mono text-xs">
              Page {currentPageIndex + 1}/{totalPages}
            </span>
          </div>

          {/* Reader Mode & View Tools */}
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            {/* Reading Mode Switcher */}
            <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60">
              <button
                onClick={() => {
                  playClickSound(soundEnabled);
                  setReadingMode('single');
                }}
                className={`p-1.5 rounded text-xs flex items-center gap-1 transition-all ${
                  readingMode === 'single'
                    ? 'bg-amber-400 text-black font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Single Page Mode (Swipe to swap)"
              >
                <Book className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-[11px]">Single</span>
              </button>

              <button
                onClick={() => {
                  playClickSound(soundEnabled);
                  setReadingMode('double');
                }}
                className={`p-1.5 rounded text-xs flex items-center gap-1 transition-all ${
                  readingMode === 'double'
                    ? 'bg-amber-400 text-black font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Double Spread (Book Mode)"
              >
                <Columns className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-[11px]">Book Spread</span>
              </button>

              <button
                onClick={() => {
                  playClickSound(soundEnabled);
                  setReadingMode('webtoon');
                }}
                className={`p-1.5 rounded text-xs flex items-center gap-1 transition-all ${
                  readingMode === 'webtoon'
                    ? 'bg-amber-400 text-black font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Webtoon Vertical Scroll"
              >
                <Rows className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-[11px]">Webtoon</span>
              </button>
            </div>

            {/* Paper Theme Selector */}
            <select
              value={paperTheme}
              onChange={(e) => {
                playClickSound(soundEnabled);
                setPaperTheme(e.target.value as PaperTheme);
              }}
              className="bg-slate-800 text-slate-300 text-xs rounded-md px-2 py-1.5 border border-slate-700 focus:outline-hidden hover:border-slate-500 cursor-pointer"
            >
              <option value="dark">Dark Comic</option>
              <option value="vintage">Vintage Print</option>
              <option value="manga">Manga Halftone</option>
              <option value="modern">Clean Light</option>
            </select>

            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-0.5 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60">
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 10, 70))}
                className="p-1 text-slate-400 hover:text-white rounded"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono text-slate-300 px-1">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 10, 140))}
                className="p-1 text-slate-400 hover:text-white rounded"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              {zoomLevel !== 100 && (
                <button
                  onClick={() => setZoomLevel(100)}
                  className="p-1 text-amber-400 hover:text-amber-300 rounded"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Upload / Replace Current Page Image Button */}
            {onUpdatePageImage && (
              <label
                title="Upload custom comic scan for this page"
                className="cursor-pointer flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-400/40 text-[11px] font-action font-bold transition-all active:scale-95"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Upload Image</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePageImageFileSelect}
                  className="hidden"
                />
              </label>
            )}

            {/* Guided Panels Shortcut */}
            <button
              onClick={() => onOpenGuidedPanel(0)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-semibold transition-all active:scale-95"
              title="Open Cinematic Panel-by-Panel View"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Panels</span>
            </button>

            {/* Auto-Swap Button */}
            <button
              onClick={() => {
                playClickSound(soundEnabled);
                setAutoPlay(!autoPlay);
              }}
              className={`p-1.5 rounded-md border transition-colors ${
                autoPlay
                  ? 'bg-amber-400 text-black border-amber-400 font-bold'
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
        className="flex-1 relative flex items-center justify-center p-2 sm:p-6 overflow-hidden cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Left Click Hotspot to swap previous */}
        <div
          onClick={goToPrevPage}
          className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 z-20 cursor-pointer flex items-center justify-start pl-2 sm:pl-4 opacity-30 hover:opacity-100 transition-opacity group"
          title="Click to swap to previous page"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/80 border border-slate-700 flex items-center justify-center text-white group-hover:scale-110 shadow-xl transition-all">
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
          </div>
        </div>

        {/* Right Click Hotspot to swap next */}
        <div
          onClick={goToNextPage}
          className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 z-20 cursor-pointer flex items-center justify-end pr-2 sm:pr-4 opacity-30 hover:opacity-100 transition-opacity group"
          title="Click to swap to next page"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/80 border border-slate-700 flex items-center justify-center text-white group-hover:scale-110 shadow-xl transition-all">
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
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
                  <ComicImage
                    src={pg.imageSrc}
                    alt={pg.title}
                    className="w-full h-full object-cover"
                    fallbackTitle={pg.title}
                    fallbackBadge={`PAGE ${pIdx + 1}`}
                    allowUpload={true}
                    onImageUploaded={(newSrc) => onUpdatePageImage?.(chapter.id, pg.id, newSrc)}
                  />

                  {/* Floating speech bubbles */}
                  {pg.panels?.map((pan) =>
                    pan.speechBubbles?.map((sb) => (
                      <div
                        key={sb.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          speakDialogue(sb.text, sb.speaker);
                        }}
                        className="speech-bubble-item absolute cursor-pointer transition-transform hover:scale-105 active:scale-95 bg-white text-black font-semibold rounded-2xl px-3 py-1.5 text-xs shadow-xl border-2 border-black max-w-[200px]"
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
                  {pg.panels?.map((pan) => (
                    <div key={pan.id} className="p-3 rounded-lg bg-black/40 border border-slate-700/60">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-comic text-base text-amber-400">{pan.title}</span>
                        <button
                          onClick={() => onOpenGuidedPanel(0)}
                          className="text-[11px] text-slate-300 hover:text-white underline cursor-pointer"
                        >
                          Cinematic View
                        </button>
                      </div>
                      {pan.caption && (
                        <p className="text-xs text-slate-300 italic mb-2">"{pan.caption}"</p>
                      )}
                      <div className="space-y-1.5">
                        {pan.speechBubbles?.map((sb) => (
                          <div key={sb.id} className="text-xs flex items-center justify-between">
                            <span className="text-slate-200">
                              <strong className="text-amber-400">{sb.speaker}:</strong> "{sb.text}"
                            </span>
                            <button
                              onClick={() => speakDialogue(sb.text, sb.speaker)}
                              className="text-slate-400 hover:text-amber-400 p-1"
                              title="Listen voice line"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
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
              <ComicImage
                src={currentPage.imageSrc}
                alt={currentPage.title}
                className="w-full h-full object-cover"
                fallbackTitle={currentPage.title}
                fallbackBadge={`PAGE ${currentPageIndex + 1}`}
                allowUpload={true}
                onImageUploaded={(newSrc) => onUpdatePageImage?.(chapter.id, currentPage.id, newSrc)}
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
                  <ComicImage
                    src={chapter.pages[currentPageIndex + 1].imageSrc}
                    alt={chapter.pages[currentPageIndex + 1].title}
                    className="w-full h-full object-cover"
                    fallbackTitle={chapter.pages[currentPageIndex + 1].title}
                    fallbackBadge={`PAGE ${currentPageIndex + 2}`}
                    allowUpload={true}
                    onImageUploaded={(newSrc) =>
                      onUpdatePageImage?.(chapter.id, chapter.pages[currentPageIndex + 1].id, newSrc)
                    }
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
                    {nextChapter ? `Ready for Issue #${nextChapter.number}?` : 'You have completed all current issues!'}
                  </p>
                  {nextChapter ? (
                    <button
                      onClick={() => onSelectChapter(nextChapter.id)}
                      className="mt-4 px-4 py-2 bg-amber-400 text-black font-bold text-xs rounded-lg shadow-md hover:bg-amber-300 transition-colors cursor-pointer"
                    >
                      Read Next Chapter
                    </button>
                  ) : (
                    <button
                      onClick={onOpenAddChapter}
                      className="mt-4 px-4 py-2 bg-amber-400 text-black font-bold text-xs rounded-lg shadow-md hover:bg-amber-300 transition-colors cursor-pointer"
                    >
                      Create More Chapters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Single Page Mode with realistic Page Swap effect & Touch/Mouse drag */
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
                <ComicImage
                  src={currentPage.imageSrc}
                  alt={currentPage.title}
                  className="w-full h-full object-cover select-none pointer-events-none"
                  fallbackTitle={currentPage.title}
                  fallbackBadge={`ISSUE #${chapter.number} · PAGE ${currentPageIndex + 1}`}
                  allowUpload={true}
                  onImageUploaded={(newSrc) => onUpdatePageImage?.(chapter.id, currentPage.id, newSrc)}
                />

                {/* Subtle paper lighting glare */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-white/10 pointer-events-none" />

                {/* Interactive Dialogue Speech Bubbles */}
                {currentPage.panels?.map((panel) =>
                  panel.speechBubbles?.map((sb) => (
                    <div
                      key={sb.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        speakDialogue(sb.text, sb.speaker);
                      }}
                      className={`speech-bubble-item absolute cursor-pointer transition-all hover:scale-110 active:scale-95 z-10 px-3 py-1.5 rounded-2xl border-2 border-black max-w-[210px] text-xs shadow-xl ${
                        sb.style === 'shout'
                          ? 'bg-amber-300 text-black font-extrabold uppercase animate-pulse'
                          : sb.style === 'thought'
                          ? 'bg-blue-100 text-blue-950 italic border-dashed rounded-3xl'
                          : sb.style === 'whisper'
                          ? 'bg-slate-200 text-slate-900 border-dotted text-[11px]'
                          : 'bg-white text-slate-900 font-semibold'
                      }`}
                      style={{
                        top: `${sb.position?.y ?? 25}%`,
                        left: `${sb.position?.x ?? 30}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      title={`Click to hear ${sb.speaker}'s voice`}
                    >
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="font-action font-black text-[10px] uppercase tracking-wider text-amber-700">
                          {sb.speaker} {sb.roleTag && `(${sb.roleTag})`}
                        </span>
                        <Volume2 className="w-2.5 h-2.5 text-slate-500 ml-auto opacity-70" />
                      </div>
                      <div className="leading-snug">{sb.text}</div>
                    </div>
                  ))
                )}

                {/* Action Sound Effect Stickers (BOOYAH!, WOOOOSH!) */}
                {currentPage.panels?.map((panel) =>
                  panel.sfxStickers?.map((sfx) => (
                    <div
                      key={sfx.id}
                      className="absolute font-action text-2xl sm:text-3xl font-black drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)] select-none pointer-events-none tracking-wider animate-bounce"
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
                  PAGE {currentPageIndex + 1} / {totalPages}
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
                    className="shrink-0 text-amber-400 hover:text-amber-300 font-bold ml-2 underline text-[11px] cursor-pointer"
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
      <div className="bg-[#0e1524] border-t border-slate-800 p-3 sm:px-6 z-30">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Previous Page or Previous Chapter */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevPage}
              disabled={currentPageIndex === 0 && !prevChapter}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-white transition-all active:scale-95 cursor-pointer shadow"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>{currentPageIndex === 0 && prevChapter ? `Prev Chapter` : `Swap Prev`}</span>
            </button>
          </div>

          {/* Page Scrubber Dots */}
          <div className="flex items-center gap-1.5 max-w-full overflow-x-auto py-1 px-2">
            {chapter.pages.map((pg, idx) => (
              <button
                key={pg.id}
                onClick={() => {
                  playPageFlipSound(soundEnabled);
                  setCurrentPageIndex(idx);
                }}
                className={`transition-all rounded-full cursor-pointer ${
                  currentPageIndex === idx
                    ? 'w-7 h-2.5 bg-amber-400 ring-2 ring-amber-400/40'
                    : 'w-2.5 h-2.5 bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Go to Page ${idx + 1}`}
              />
            ))}
          </div>

          {/* Next Page or Next Chapter */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToNextPage}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-xs font-black text-black transition-all active:scale-95 shadow-md shadow-amber-400/20 cursor-pointer"
            >
              <span>{currentPageIndex === totalPages - 1 && nextChapter ? `Next Chapter` : `Swap Next`}</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>

        {/* Reader swap instructions hint */}
        <div className="text-center text-[11px] text-slate-400 mt-2 font-mono">
          Tip: Drag left/right with touch or mouse, click screen edges, or use <kbd className="px-1 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">←</kbd> <kbd className="px-1 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">→</kbd> arrow keys to swap pages.
        </div>
      </div>
    </div>
  );
};
