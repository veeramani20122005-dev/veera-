import React, { useState } from 'react';
import { ImageOff, Sparkles, Upload } from 'lucide-react';
import comicCh1 from '../assets/images/comic_ch1_squad_call_1790748208639.jpg';
import comicCh2 from '../assets/images/comic_ch2_shadow_rift_1790748220650.jpg';
import comicCh3 from '../assets/images/comic_ch3_storm_battle_1790748236018.jpg';
import comicCh4 from '../assets/images/comic_ch4_booyah_victory_1790748249982.jpg';

export { comicCh1, comicCh2, comicCh3, comicCh4 };

export const COMIC_ASSETS = {
  ch1: comicCh1,
  ch2: comicCh2,
  ch3: comicCh3,
  ch4: comicCh4,
};

export const AVAILABLE_ARTWORKS: string[] = [
  comicCh1,
  comicCh2,
  comicCh3,
  comicCh4,
];

/**
 * Resolves any image source to a guaranteed valid URL in both dev and production hosting
 */
export function resolveComicImageUrl(src?: string): string {
  if (!src) return comicCh1;

  // If it's a data URL or blob URL (user uploaded file)
  if (src.startsWith('data:') || src.startsWith('blob:')) {
    return src;
  }

  // If it's a standard web URL
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // Check matching bundled assets
  if (src.includes('comic_ch1')) return comicCh1;
  if (src.includes('comic_ch2')) return comicCh2;
  if (src.includes('comic_ch3')) return comicCh3;
  if (src.includes('comic_ch4')) return comicCh4;

  // Handle old /src/assets paths if stored in localStorage
  if (src.startsWith('/src/assets/images/')) {
    const filename = src.replace('/src/assets/images/', '');
    if (filename.includes('comic_ch1')) return comicCh1;
    if (filename.includes('comic_ch2')) return comicCh2;
    if (filename.includes('comic_ch3')) return comicCh3;
    if (filename.includes('comic_ch4')) return comicCh4;
    return `/images/${filename}`;
  }

  return src;
}

interface ComicImageProps {
  src?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  fallbackTitle?: string;
  fallbackBadge?: string;
  allowUpload?: boolean;
  onImageUploaded?: (newDataUrl: string) => void;
  priority?: boolean;
}

export const ComicImage: React.FC<ComicImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = 'relative w-full h-full bg-slate-950 overflow-hidden',
  fallbackTitle,
  fallbackBadge,
  allowUpload = false,
  onImageUploaded,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const resolvedSrc = resolveComicImageUrl(src);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageUploaded) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setHasError(false);
          setIsLoaded(true);
          onImageUploaded(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={containerClassName}>
      {/* Loading Shimmer / Placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 animate-pulse flex items-center justify-center">
          <div className="text-center p-4">
            <Sparkles className="w-6 h-6 text-amber-400 mx-auto animate-spin mb-2" />
            <span className="text-[11px] font-comic text-amber-300 uppercase tracking-widest">
              Loading Comic Art...
            </span>
          </div>
        </div>
      )}

      {!hasError ? (
        <img
          src={resolvedSrc}
          alt={alt}
          loading="eager"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            // If primary resolved source failed, try public fallback before showing SVG
            if (!resolvedSrc.startsWith('/images/comic_ch1.jpg')) {
              setHasError(true);
            }
          }}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        />
      ) : (
        /* Stylized Comic Book SVG Fallback (Never shows broken image icon) */
        <div className="relative w-full h-full bg-radial from-slate-900 via-[#0d121f] to-black flex flex-col items-center justify-center p-6 text-center border border-amber-500/30">
          {/* Halftone dot background effect */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #f59e0b 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }}
          />

          <div className="relative z-10 max-w-sm flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-400 mb-3 shadow-lg shadow-amber-500/10">
              <Sparkles className="w-7 h-7" />
            </div>

            <div className="bg-amber-400 text-black font-action font-black text-xs px-2.5 py-0.5 rounded uppercase tracking-wider mb-2">
              {fallbackBadge || 'FREE FIRE SQUAD'}
            </div>

            <h4 className="font-comic text-xl text-white font-bold leading-tight mb-1">
              {fallbackTitle || alt || 'Comic Action Scene'}
            </h4>

            <p className="text-xs text-slate-400 max-w-xs mb-4">
              Visual art panel ready. You can also upload your own comic page scan directly!
            </p>

            {allowUpload && onImageUploaded && (
              <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-black font-bold font-action text-xs rounded-lg shadow-md transition-all active:scale-95">
                <Upload className="w-3.5 h-3.5" />
                Upload Page Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      )}

      {/* Floating Upload button if allowUpload is active */}
      {allowUpload && onImageUploaded && !hasError && (
        <label
          title="Upload or replace image"
          className="absolute bottom-2 right-2 z-20 cursor-pointer bg-black/80 hover:bg-black text-white hover:text-amber-400 p-1.5 rounded-lg border border-slate-700/80 shadow-md backdrop-blur-xs transition-all flex items-center gap-1.5 text-[11px]"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-action text-[10px]">Change Art</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};
