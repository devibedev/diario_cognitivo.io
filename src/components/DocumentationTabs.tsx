import React, { useState } from 'react';
import { 
  Brain, 
  HeartPulse, 
  CalendarRange, 
  UsersRound, 
  Check, 
  AlertTriangle,
  Lightbulb,
  FileText
} from 'lucide-react';
import { documentations } from '../data/documentation';

// Dynamic Lucide mapper
const getIconComp = (iconName: string) => {
  switch(iconName) {
    case 'Brain': return Brain;
    case 'HeartPulse': return HeartPulse;
    case 'CalendarRange': return CalendarRange;
    case 'UsersRound': return UsersRound;
    default: return FileText;
  }
};

export default function DocumentationTabs({
  neoBlur,
  glassOpacity
}: {
  neoBlur: number;
  glassOpacity: number;
}) {
  const [activeTab, setActiveTab] = useState('alzheimer');

  const currentSection = documentations.find(doc => doc.id === activeTab) || documentations[0];
  const ActiveIcon = getIconComp(currentSection.icon);

  const currentShadow = `${neoBlur}px ${neoBlur}px ${neoBlur * 2.5}px rgba(163, 177, 198, 0.45), -${neoBlur}px -${neoBlur}px ${neoBlur * 2.5}px rgba(255, 255, 255, 0.55)`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
      
      {/* LEFT ACCORDION INDEX SELECTOR */}
      <div className="lg:col-span-4 space-y-3.5">
        <span className="text-[10px] font-mono text-[#6C5CE7] uppercase tracking-widest font-extrabold block pl-1">
          Índice Clínico e Formativo
        </span>
        
        <div className="space-y-3">
          {documentations.map((doc) => {
            const isActive = doc.id === activeTab;
            const Icon = getIconComp(doc.icon);
            
            return (
              <button
                key={doc.id}
                onClick={() => setActiveTab(doc.id)}
                className={`w-full p-4 rounded-2xl flex items-center gap-3.5 border transition-all duration-350 text-left cursor-pointer focus:outline-none ${
                  isActive
                    ? 'border-[#6C5CE7]/30 bg-white/60 text-slate-800'
                    : 'border-black/[0.03] bg-black/[0.01] hover:bg-white/20 text-slate-650'
                }`}
                style={{
                  boxShadow: isActive
                    ? '5px 5px 12px rgba(163, 177, 198, 0.35), -5px -5px 12px rgba(255, 255, 255, 0.5)'
                    : 'none'
                }}
              >
                {/* Responsive colored dot indicator / icon */}
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  isActive 
                    ? 'bg-[#6C5CE7]/15 border-[#6C5CE7]/30 text-[#6C5CE7]' 
                    : 'bg-white/40 border-white/50 text-slate-550'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="overflow-hidden">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                    {doc.category}
                  </span>
                  <h4 className="text-xs font-heading font-black truncate text-slate-800 leading-tight">
                    {doc.title}
                  </h4>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic quote box */}
        <div className="p-4 rounded-2xl bg-indigo-50/40 border border-[#6C5CE7]/20 text-[11px] text-[#6C5CE7] leading-relaxed hidden lg:block font-mono">
          📌 <strong>Dato de Reserva Cognitiva:</strong> Las personas intelectual y socialmente activas retardan significativamente la fase clínica de demencias gracias al aumento de sus conexiones dendríticas alternativas.
        </div>
      </div>

      {/* RIGHT DISPLAY PANEL — HIGHLY EDITORIAL TEXT */}
      <div 
        className="lg:col-span-8 rounded-[2.5rem] p-6 sm:p-8 bg-[#E0E5EC] space-y-6 min-h-[480px] relative overflow-hidden"
        style={{ boxShadow: currentShadow }}
      >
        {/* Subtle decorative mesh */}
        <div className="absolute bottom-[-100px] right-[-100px] w-52 h-52 rounded-full bg-cyan-400/10 blur-2xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex justify-between items-start border-b border-black/[0.05] pb-4">
          <div className="space-y-1.5 flex-1 pr-4">
            <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 font-bold uppercase tracking-wider">
              {currentSection.category}
            </span>
            <h3 className="text-xl sm:text-2xl font-heading font-black text-slate-805 leading-tight">
              {currentSection.title}
            </h3>
            <p className="text-xs text-slate-655 font-sans leading-relaxed">
              {currentSection.summary}
            </p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-inner text-[#6C5CE7] shrink-0 border border-white/60">
            <ActiveIcon className="w-6 h-6" />
          </div>
        </div>

        {/* Dynamic Content paragraphs & advice */}
        <div className="space-y-6">
          {currentSection.content.map((block, bIdx) => (
            <div key={bIdx} className="space-y-3.5">
              <h4 className="text-sm font-heading font-black text-slate-800 border-l-2 border-[#6C5CE7] pl-2.5">
                {block.subtitle}
              </h4>
              
              <div className="space-y-3">
                {block.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans font-light">
                    {p}
                  </p>
                ))}
              </div>

              {/* Tips container with neat icons */}
              {block.tips && block.tips.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {block.tips.map((tip, tIdx) => (
                    <div 
                      key={tIdx} 
                      className="p-3 rounded-xl bg-white/45 border border-white/60 text-xs flex gap-2 w-full text-slate-750 font-sans"
                    >
                      <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <strong className="text-[10px] font-mono uppercase text-slate-550 block font-bold">Consejo de agilidad</strong>
                        <p className="leading-relaxed text-[11px] text-slate-600">{tip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Warning card */}
              {block.warnings && block.warnings.length > 0 && (
                <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200/50 text-[11px] text-orange-850 flex gap-2.5 items-start">
                  <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-mono text-[9px] uppercase block mb-0.5 tracking-wider font-bold">Diagnóstico Diferencial</strong>
                    {block.warnings.map((w, wIdx) => (
                      <span key={wIdx} className="font-sans leading-relaxed block">{w}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
