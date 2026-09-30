import React from 'react';
import { X, Volume2, Shield, Crosshair, Zap, Award } from 'lucide-react';
import { SQUAD_MEMBERS } from '../data/chaptersData';
import { SquadMember } from '../types/comic';
import { playClickSound, speakDialogue } from '../utils/audio';

interface SquadModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
}

export const SquadModal: React.FC<SquadModalProps> = ({ isOpen, onClose, soundEnabled }) => {
  if (!isOpen) return null;

  const getRoleIcon = (role: string) => {
    if (role.includes('IGL')) return <Award className="w-4 h-4 text-amber-400" />;
    if (role.includes('Rusher')) return <Zap className="w-4 h-4 text-rose-400" />;
    if (role.includes('Sniper')) return <Crosshair className="w-4 h-4 text-cyan-400" />;
    return <Shield className="w-4 h-4 text-emerald-400" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="w-full max-w-4xl bg-[#0e1524] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-label="Squad Roster"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#131d33] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-comic text-2xl text-white tracking-wide">
                THE SQUAD ROSTER
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                Tournament Champions
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Four players. One dream. The champions of the Bermuda Tournament.
            </p>
          </div>
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

        {/* Squad Members Grid */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {SQUAD_MEMBERS.map((member) => (
            <div
              key={member.id}
              className="bg-[#151e33] border border-slate-800 rounded-xl p-4 sm:p-5 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-comic text-2xl font-bold text-black shadow-lg"
                      style={{ backgroundColor: member.color }}
                    >
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-comic text-2xl text-white tracking-wide">
                        {member.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs">
                        {getRoleIcon(member.role)}
                        <span className="font-semibold text-slate-300">{member.role}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-medium text-slate-400 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60">
                    {member.tag}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0d1422] border border-slate-800/80 mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400 font-medium">Signature Quote</span>
                    <button
                      onClick={() => speakDialogue(member.quote, member.name)}
                      className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 transition-colors"
                      title="Listen to character voice line"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Play Voice</span>
                    </button>
                  </div>
                  <p className="text-xs italic text-amber-200/90 font-medium">
                    "{member.quote}"
                  </p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {member.description}
                </p>
              </div>

              <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Specialty:</span>
                <span className="font-medium text-slate-200">{member.specialty}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
