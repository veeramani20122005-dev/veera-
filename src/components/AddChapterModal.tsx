import React, { useState } from 'react';
import { X, Plus, Trash2, Image, Sparkles, BookOpen, MessageSquare, Volume2 } from 'lucide-react';
import { Chapter, ComicPage, ComicPanel, SpeechBubble, SfxSticker } from '../types/comic';
import { playClickSound, playBooyahSound } from '../utils/audio';

interface AddChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddChapter: (chapter: Chapter) => void;
  nextChapterNumber: number;
  availableArtwork: string[];
  soundEnabled: boolean;
}

export const AddChapterModal: React.FC<AddChapterModalProps> = ({
  isOpen,
  onClose,
  onAddChapter,
  nextChapterNumber,
  availableArtwork,
  soundEnabled
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badge, setBadge] = useState('New Arc');
  const [synopsis, setSynopsis] = useState('');
  const [coverImage, setCoverImage] = useState(availableArtwork[0] || '');
  const [readingTime, setReadingTime] = useState('4 min read');

  // Pages state
  const [pages, setPages] = useState<ComicPage[]>([
    {
      id: `custom-p1-${Date.now()}`,
      pageNumber: 1,
      title: 'The Unforeseen Challenge',
      subtitle: 'Part I',
      imageSrc: availableArtwork[0] || '',
      pageNarrative: 'A fresh challenge awaits the squad on the battlegrounds.',
      panels: [
        {
          id: `custom-pan1-${Date.now()}`,
          panelNumber: 1,
          title: '1. Regroup & Re-arm',
          caption: 'The squad prepares for the new mission.',
          characters: ['Veera', 'Arun'],
          speechBubbles: [
            {
              id: 'c-sb-1',
              speaker: 'Veera',
              roleTag: 'IGL',
              text: 'Stay focused. This territory is uncharted.',
              style: 'speech',
              position: { x: 25, y: 20 }
            },
            {
              id: 'c-sb-2',
              speaker: 'Arun',
              roleTag: 'Rusher',
              text: 'Let\'s rush in and claim the victory!',
              style: 'shout',
              position: { x: 75, y: 25 }
            }
          ],
          sfxStickers: [
            { id: 'c-sfx-1', text: 'LETS GO!', color: '#f59e0b', position: { x: 50, y: 75 } }
          ]
        }
      ]
    }
  ]);

  if (!isOpen) return null;

  const handleAddPage = () => {
    playClickSound(soundEnabled);
    const newPageNum = pages.length + 1;
    const nextArtIndex = (newPageNum - 1) % availableArtwork.length;
    const newPage: ComicPage = {
      id: `custom-p${newPageNum}-${Date.now()}`,
      pageNumber: newPageNum,
      title: `Page ${newPageNum}: The Tactical Move`,
      subtitle: `Part ${newPageNum}`,
      imageSrc: availableArtwork[nextArtIndex] || availableArtwork[0],
      pageNarrative: 'The battle intensifies as both squads clash.',
      panels: [
        {
          id: `custom-pan-${newPageNum}-${Date.now()}`,
          panelNumber: 1,
          title: `Action Scene ${newPageNum}`,
          caption: 'High-octane squad maneuver',
          characters: ['Karthi', 'Surya'],
          speechBubbles: [
            {
              id: `c-sb-${newPageNum}-1`,
              speaker: 'Karthi',
              roleTag: 'Sniper',
              text: 'Clear line of sight. Ready to engage!',
              style: 'speech',
              position: { x: 30, y: 25 }
            },
            {
              id: `c-sb-${newPageNum}-2`,
              speaker: 'Surya',
              roleTag: 'Support',
              text: 'Shields active! Moving into position.',
              style: 'radio',
              position: { x: 70, y: 30 }
            }
          ],
          sfxStickers: [
            { id: `c-sfx-${newPageNum}-1`, text: 'BOOM!', color: '#eab308', position: { x: 50, y: 70 } }
          ]
        }
      ]
    };
    setPages([...pages, newPage]);
  };

  const handleRemovePage = (index: number) => {
    playClickSound(soundEnabled);
    if (pages.length <= 1) return;
    const updated = pages.filter((_, i) => i !== index).map((p, idx) => ({
      ...p,
      pageNumber: idx + 1
    }));
    setPages(updated);
  };

  const handleAddPanel = (pageIndex: number) => {
    playClickSound(soundEnabled);
    const targetPage = pages[pageIndex];
    const newPanelNumber = targetPage.panels.length + 1;
    const newPanel: ComicPanel = {
      id: `custom-pan-${pageIndex}-${newPanelNumber}-${Date.now()}`,
      panelNumber: newPanelNumber,
      title: `Panel ${newPanelNumber}: Combat Sequence`,
      caption: 'Squad coordination in action',
      characters: ['Veera', 'Arun'],
      speechBubbles: [
        {
          id: `c-sb-new-${Date.now()}`,
          speaker: 'Veera',
          roleTag: 'IGL',
          text: 'Hold position! Execute the flank now!',
          style: 'shout',
          position: { x: 50, y: 25 }
        }
      ],
      sfxStickers: [
        { id: `c-sfx-new-${Date.now()}`, text: 'RAT-A-TAT!', color: '#ef4444', position: { x: 50, y: 75 } }
      ]
    };

    const updatedPages = [...pages];
    updatedPages[pageIndex] = {
      ...targetPage,
      panels: [...targetPage.panels, newPanel]
    };
    setPages(updatedPages);
  };

  const handleAddSpeechBubble = (pageIndex: number, panelIndex: number) => {
    playClickSound(soundEnabled);
    const updatedPages = [...pages];
    const targetPanel = updatedPages[pageIndex].panels[panelIndex];
    const newBubble: SpeechBubble = {
      id: `bubble-${Date.now()}`,
      speaker: 'Arun',
      roleTag: 'Rusher',
      text: 'Pushing now! Cover me!',
      style: 'shout',
      position: { x: 50, y: 30 }
    };
    targetPanel.speechBubbles.push(newBubble);
    setPages(updatedPages);
  };

  const handleAddSfxSticker = (pageIndex: number, panelIndex: number) => {
    playClickSound(soundEnabled);
    const updatedPages = [...pages];
    const targetPanel = updatedPages[pageIndex].panels[panelIndex];
    const sfxOptions = ['BOOYAH!', 'HEADSHOT!', 'KABOOM!', 'SWOOSH!', 'RAT-A-TAT!'];
    const randomSfx = sfxOptions[Math.floor(Math.random() * sfxOptions.length)];
    const newSfx: SfxSticker = {
      id: `sfx-${Date.now()}`,
      text: randomSfx,
      color: '#f59e0b',
      position: { x: 50, y: 65 }
    };
    if (!targetPanel.sfxStickers) targetPanel.sfxStickers = [];
    targetPanel.sfxStickers.push(newSfx);
    setPages(updatedPages);
  };

  const handleFillTemplate = () => {
    playClickSound(soundEnabled);
    setTitle(`The Bermuda Core`);
    setSubtitle(`Squad Veera Unveils The Secret Protocol`);
    setBadge('Special Episode');
    setReadingTime('5 min read');
    setSynopsis('Deep beneath the Bermuda clock tower, the squad uncovers the cyber generator fueling the island anomalies. A masterclass in teamwork.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a Chapter Title');
      return;
    }

    const newChapter: Chapter = {
      id: `chapter-${nextChapterNumber}-${Date.now()}`,
      number: nextChapterNumber,
      title: title.trim(),
      subtitle: subtitle.trim() || 'A New Squad Journey Begins',
      coverImage: coverImage || availableArtwork[0],
      synopsis: synopsis.trim() || 'The saga continues as the Free Fire squad faces fresh rivals and unravels new mysteries.',
      badge: badge.trim() || 'Custom Chapter',
      readingTime: readingTime || '4 min read',
      pages: pages,
      isCustom: true,
      createdAt: new Date().toLocaleDateString()
    };

    playBooyahSound(soundEnabled);
    onAddChapter(newChapter);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="w-full max-w-3xl bg-[#0f1626] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-label="Add Chapter"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#141e33] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-400 text-black">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-comic text-2xl text-white tracking-wide">
                CREATE NEW CHAPTER #{nextChapterNumber}
              </h2>
              <p className="text-xs text-slate-300">
                Craft a new comic book chapter with custom panels, dialogue, and artwork
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleFillTemplate}
              className="text-xs text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1.5 rounded border border-amber-500/30 transition-colors"
            >
              Fill Sample Story
            </button>
            <button
              type="button"
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Metadata Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Chapter Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., The Bermuda Core"
                className="w-full bg-[#1b263b] border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Subtitle
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g., The Final Storm Approaches"
                className="w-full bg-[#1b263b] border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Arc / Tag Badge
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g., Survival Arc, Special Edition"
                className="w-full bg-[#1b263b] border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Reading Time
              </label>
              <input
                type="text"
                value={readingTime}
                onChange={(e) => setReadingTime(e.target.value)}
                placeholder="e.g., 4 min read"
                className="w-full bg-[#1b263b] border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 transition-colors"
              />
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Chapter Synopsis / Plot Summary
            </label>
            <textarea
              rows={2}
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="Describe what happens in this chapter of the story..."
              className="w-full bg-[#1b263b] border border-slate-700 rounded-lg p-3 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Cover Art Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Select Chapter Cover Art
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {availableArtwork.map((art, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    playClickSound(soundEnabled);
                    setCoverImage(art);
                  }}
                  className={`relative aspect-3/4 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                    coverImage === art
                      ? 'border-amber-400 ring-2 ring-amber-400/50 scale-102'
                      : 'border-slate-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={art}
                    alt={`Art ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {coverImage === art && (
                    <div className="absolute top-1 right-1 bg-amber-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                      Selected
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Comic Pages & Panels Editor */}
          <div className="border-t border-slate-800 pt-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-comic text-xl text-white tracking-wide">
                  PAGES & PANELS ({pages.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Configure comic page artwork, speech bubbles, and sound FX
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddPage}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-lg border border-slate-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Page</span>
              </button>
            </div>

            {/* List of Pages */}
            <div className="space-y-4">
              {pages.map((p, pageIdx) => (
                <div
                  key={p.id}
                  className="bg-[#141b2c] border border-slate-800 rounded-xl p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-comic text-lg text-amber-400">
                      PAGE {p.pageNumber}: {p.title}
                    </span>
                    {pages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePage(pageIdx)}
                        className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 hover:underline"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Page</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Page Title</label>
                      <input
                        type="text"
                        value={p.title}
                        onChange={(e) => {
                          const updated = [...pages];
                          updated[pageIdx].title = e.target.value;
                          setPages(updated);
                        }}
                        className="w-full bg-[#1b263b] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Page Artwork</label>
                      <select
                        value={p.imageSrc}
                        onChange={(e) => {
                          const updated = [...pages];
                          updated[pageIdx].imageSrc = e.target.value;
                          setPages(updated);
                        }}
                        className="w-full bg-[#1b263b] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                      >
                        {availableArtwork.map((art, idx) => (
                          <option key={idx} value={art}>
                            Illustration Style #{idx + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Panels inside this page */}
                  <div className="space-y-3 pl-3 border-l-2 border-amber-500/30">
                    {p.panels.map((panel, panelIdx) => (
                      <div
                        key={panel.id}
                        className="bg-[#192237] rounded-lg p-3 space-y-2.5 border border-slate-700/60"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                            {panel.title}
                          </span>
                          <span className="text-slate-400">{panel.speechBubbles.length} Dialogues</span>
                        </div>

                        {/* Speech bubbles editor */}
                        <div className="space-y-2">
                          {panel.speechBubbles.map((sb, sbIdx) => (
                            <div key={sb.id} className="flex gap-2 items-center text-xs">
                              <select
                                value={sb.speaker}
                                onChange={(e) => {
                                  const updated = [...pages];
                                  updated[pageIdx].panels[panelIdx].speechBubbles[sbIdx].speaker = e.target.value;
                                  setPages(updated);
                                }}
                                className="bg-[#0f172a] border border-slate-700 text-amber-400 rounded px-2 py-1 text-xs font-semibold"
                              >
                                <option value="Veera">Veera (IGL)</option>
                                <option value="Arun">Arun (Rusher)</option>
                                <option value="Karthi">Karthi (Sniper)</option>
                                <option value="Surya">Surya (Support)</option>
                                <option value="Opponent">Rival Squad</option>
                              </select>

                              <input
                                type="text"
                                value={sb.text}
                                onChange={(e) => {
                                  const updated = [...pages];
                                  updated[pageIdx].panels[panelIdx].speechBubbles[sbIdx].text = e.target.value;
                                  setPages(updated);
                                }}
                                className="flex-1 bg-[#0f172a] border border-slate-700 rounded px-2.5 py-1 text-xs text-white"
                                placeholder="Enter character dialogue..."
                              />

                              <select
                                value={sb.style}
                                onChange={(e) => {
                                  const updated = [...pages];
                                  updated[pageIdx].panels[panelIdx].speechBubbles[sbIdx].style = e.target.value as any;
                                  setPages(updated);
                                }}
                                className="bg-[#0f172a] border border-slate-700 text-slate-300 rounded px-2 py-1 text-xs"
                              >
                                <option value="speech">Speech</option>
                                <option value="shout">Shout</option>
                                <option value="whisper">Whisper</option>
                                <option value="radio">Radio</option>
                              </select>
                            </div>
                          ))}

                          <div className="flex gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => handleAddSpeechBubble(pageIdx, panelIdx)}
                              className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Dialogue</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAddSfxSticker(pageIdx, panelIdx)}
                              className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add SFX Sticker</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => handleAddPanel(pageIdx)}
                      className="w-full py-1.5 text-xs text-slate-300 hover:text-amber-400 bg-slate-800/60 hover:bg-slate-800 border border-dashed border-slate-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Panel to Page {p.pageNumber}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3 sticky bottom-0 bg-[#0f1626] py-2">
            <button
              type="button"
              onClick={() => {
                playClickSound(soundEnabled);
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-md shadow-amber-400/20 active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Publish Chapter</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
