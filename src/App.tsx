import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Brain, 
  BookMarked, 
  Heart, 
  Activity, 
  Users, 
  Settings, 
  ChevronDown, 
  HelpCircle,
  Clock,
  ArrowDown
} from 'lucide-react';
import { PresetTheme, PresetKey } from './types';
import BrainGames from './components/BrainGames';
import CognitiveDiary from './components/CognitiveDiary';
import DocumentationTabs from './components/DocumentationTabs';
import SensoryControls from './components/SensoryControls';

export default function App() {
  // Glow Presets
  const presets: Record<PresetKey, PresetTheme> = {
    dusk: {
      name: "🌌 Aurora Dusk",
      gradient1: "from-[#8b5cf6] to-[#ec4899]",
      gradient2: "from-[#3b82f6] to-[#8b5cf6]",
      bgGlow: "rgba(139, 92, 246, 0.25)",
      glowClass: "bg-gradient-to-tr from-purple-600 via-pink-400 to-indigo-500"
    },
    forest: {
      name: "🌲 Ocean Forest",
      gradient1: "from-[#0d9488] to-[#10b981]",
      gradient2: "from-[#0284c7] to-[#0d9488]",
      bgGlow: "rgba(13, 148, 136, 0.25)",
      glowClass: "bg-gradient-to-tr from-teal-500 via-emerald-400 to-cyan-400"
    },
    solar: {
      name: "☄️ Solar Flare",
      gradient1: "from-[#f97316] to-[#e11d48]",
      gradient2: "from-[#eab308] to-[#f97316]",
      bgGlow: "rgba(249, 115, 22, 0.25)",
      glowClass: "bg-gradient-to-tr from-orange-400 via-rose-400 to-amber-300"
    },
    cosmic: {
      name: "🌀 Cosmic Void",
      gradient1: "from-[#06b6d4] to-[#3b82f6]",
      gradient2: "from-[#6366f1] to-[#06b6d4]",
      bgGlow: "rgba(6, 182, 212, 0.25)",
      glowClass: "bg-gradient-to-tr from-cyan-300 via-blue-400 to-indigo-400"
    }
  };

  // Customizer state
  const [activePreset, setActivePreset] = useState<PresetKey>('dusk');
  const [neoBlur, setNeoBlur] = useState<number>(14);
  const [glassOpacity, setGlassOpacity] = useState<number>(38);
  const [backdropBlur, setBackdropBlur] = useState<number>(18);
  
  // Real time stats to update dynamically
  const [localScore, setLocalScore] = useState<number>(() => {
    return Number(localStorage.getItem('aura_cognitive_score') || '150');
  });
  const [diaryCount, setDiaryCount] = useState<number>(0);

  const updateDiaryCount = () => {
    const saved = localStorage.getItem('aura_cognitive_diary');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDiaryCount(parsed.length);
      } catch (e) {
        setDiaryCount(0);
      }
    } else {
      setDiaryCount(0);
    }
  };

  useEffect(() => {
    updateDiaryCount();
  }, []);

  const handleScoreEarned = (pointsAdded: number) => {
    const nextScore = localScore + pointsAdded;
    setLocalScore(nextScore);
    localStorage.setItem('aura_cognitive_score', nextScore.toString());
  };

  const handleQuickReset = () => {
    setNeoBlur(14);
    setGlassOpacity(38);
    setBackdropBlur(18);
  };

  return (
    <div id="glow_container" className="relative min-h-screen overflow-x-hidden bg-[#E0E5EC] text-[#2D3436] font-sans pb-24">
      
      {/* BACKGROUND GLOW ORBS IN MOTION */}
      <div className="absolute top-0 left-0 right-0 h-full w-full overflow-hidden pointer-events-none z-0">
        <div className={`absolute top-[-10%] left-[-15%] w-[60%] h-[60%] rounded-full opacity-35 blur-[120px] animate-glow-1 transition-all duration-1000 ${presets[activePreset].glowClass}`} />
        <div className={`absolute top-[40%] right-[-10%] w-[55%] h-[55%] rounded-full opacity-30 blur-[110px] animate-glow-2 transition-all duration-1000 ${presets[activePreset].glowClass}`} />
        <div className="absolute bottom-[-5%] left-[15%] w-[45%] h-[50%] rounded-full bg-gradient-to-tr from-sky-450 via-purple-300 to-pink-300 opacity-20 blur-[100px] animate-glow-3" />
      </div>

      {/* TOP NAVIGATION HEADER */}
      <nav id="navbar" className="sticky top-0 z-50 w-full border-b border-black/[0.04] bg-[#E0E5EC]/60 backdrop-blur-md px-6 py-4 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-white/20 border border-white/50 shadow-sm flex items-center justify-center">
            <Brain className="w-5 h-5 text-[#6C5CE7]" />
          </div>
          <span className="font-heading font-black tracking-widest text-[#2D3436] text-lg uppercase pl-1">
            aura<span className="text-[#6C5CE7] font-extrabold text-xs align-super ml-0.5">diario</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-[11px] tracking-widest uppercase font-semibold text-slate-650">
          <a href="#diario" className="hover:text-black transition-colors duration-200">01 // EL DIARIO</a>
          <a href="#gimnasia" className="hover:text-black transition-colors duration-200">02 // GIMNASIA CEREBRAL</a>
          <a href="#biblioteca" className="hover:text-black transition-colors duration-200">03 // BIBLIOTECA APOYO</a>
          <a href="#sensorial" className="hover:text-black transition-colors duration-200">04 // AJUSTES SENSORIALES</a>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] tracking-wider text-emerald-700 font-mono uppercase font-bold">RESERVA ACTIVA</span>
        </div>
      </nav>

      {/* HERO SECTION — MINIMALIST EDITORIAL FOR HEALTHY AGING */}
      <main className="relative z-10 px-6 md:px-12 pt-8 max-w-7xl mx-auto space-y-24">
        
        <section id="hero" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-7 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/40 border border-white/50 rounded-full shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#6C5CE7] animate-pulse" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-indigo-700 font-heading">
                Estimulación Neuronal y Soporte Cognitivo
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight leading-[1.1] text-[#2D3436] font-heading">
              Preserva tu Memoria.<br />
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#2D3436] via-[#6C5CE7] to-indigo-950">
                Fortalece tus Conexiones.
              </span><br />
              Santuario de Enfoque.
            </h1>

            <p className="max-w-xl text-base md:text-lg font-light text-slate-650 leading-relaxed font-sans">
              AURA es un espacio interactivo de diseño táctil enfocado en la prevención y ralentización del deterioro por <strong className="text-slate-900 font-semibold">Alzheimer</strong>, neblina mental por <strong className="text-slate-900 font-semibold">trastornos emocionales</strong> y el desgaste asociado a la <strong className="text-slate-900 font-semibold">senectud</strong>. A través de la evocación diaria guiada y ejercicios de agilidad mental, creamos un escudo de neuroplasticidad.
            </p>

            {/* QUICK TELEMETRY CHIPS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
              <div 
                className="p-4 rounded-2xl text-center"
                style={{
                  background: '#E0E5EC',
                  boxShadow: '4px 4px 10px rgba(163, 177, 198, 0.45), -4px -4px 10px rgba(255, 255, 255, 0.55)'
                }}
              >
                <p className="text-sm font-mono text-slate-500 font-semibold uppercase tracking-wider">Índice Cognitivo</p>
                <p className="text-2xl font-black text-[#6C5CE7] font-heading mt-0.5">{localScore} <span className="text-xs">PTS</span></p>
              </div>

              <div 
                className="p-4 rounded-2xl text-center"
                style={{
                  background: '#E0E5EC',
                  boxShadow: '4px 4px 10px rgba(163, 177, 198, 0.45), -4px -4px 10px rgba(255, 255, 255, 0.55)'
                }}
              >
                <p className="text-sm font-mono text-slate-500 font-semibold uppercase tracking-wider">Días Registrados</p>
                <p className="text-2xl font-black text-pink-500 font-heading mt-0.5">{diaryCount} <span className="text-xs">LOGS</span></p>
              </div>

              <div 
                className="p-4 rounded-2xl text-center col-span-2 sm:col-span-1 border border-white/40 bg-white/20"
                style={{
                  boxShadow: '4px 4px 10px rgba(163, 177, 198, 0.25)'
                }}
              >
                <p className="text-sm font-mono text-emerald-600 font-bold uppercase tracking-wider">Actividad Hoy</p>
                <p className="text-sm font-bold text-slate-800 font-heading mt-1.5 flex items-center justify-center gap-1">
                  ❇️ EJERCITADO
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="#diario" 
                className="px-6 py-3.5 rounded-2xl font-bold tracking-wider text-xs uppercase transition-all duration-300 flex items-center gap-2"
                style={{
                  background: '#E0E5EC',
                  boxShadow: '6px 6px 14px rgba(163, 177, 198, 0.6), -6px -6px 14px rgba(255, 255, 255, 0.5)',
                  color: '#2D3436'
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.boxShadow = 'inset 3px 3px 6px rgba(163, 177, 198, 0.6), inset -3px -3px 6px rgba(255,255,255,0.5)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.boxShadow = '6px 6px 14px rgba(163, 177, 198, 0.6), -6px -6px 14px rgba(255, 255, 255, 0.5)';
                }}
              >
                <BookMarked className="w-4 h-4 text-[#6C5CE7]" /> Iniciar Diario de Hoy
              </a>
              <a 
                href="#gimnasia" 
                className="px-6 py-3.5 rounded-2xl bg-white/20 border border-white/50 hover:bg-white/40 transition-all duration-300 flex items-center gap-2 text-xs uppercase tracking-wider text-slate-705 shadow-sm font-heading font-black"
              >
                Gimnasia Retentiva <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              </a>
            </div>

          </div>

          {/* SENSORY ACCESS CONTROL HUB */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            {/* Soft border indicator */}
            <div className="absolute -inset-8 rounded-full border border-dashed border-black/[0.05] pointer-events-none z-0" />

            {/* Radiant glowing orbs behind panels */}
            <div className="absolute -top-[5%] -right-[5%] w-36 h-36 rounded-full opacity-35 bg-gradient-to-br from-[#6C5CE7] to-pink-400 blur-2xl animate-pulse" />

            <SensoryControls 
              neoBlur={neoBlur}
              setNeoBlur={setNeoBlur}
              glassOpacity={glassOpacity}
              setGlassOpacity={setGlassOpacity}
              backdropBlur={backdropBlur}
              setBackdropBlur={setBackdropBlur}
              activePreset={activePreset}
              setActivePreset={setActivePreset}
              presets={presets}
              onReset={handleQuickReset}
            />
          </div>
        </section>

        {/* CLINICAL DIARY MODULE (Section 1) */}
        <section id="diario" className="space-y-8 border-t border-black/[0.05] pt-12 text-left">
          <div className="space-y-2">
            <span className="text-[#6C5CE7] text-xs font-mono tracking-[0.2em] font-extrabold uppercase block">
              Modulo de Evocación Activa
            </span>
            <h2 className="text-2xl sm:text-4xl font-heading font-black text-slate-800">
              01 // El Diario de Memoria
            </h2>
            <p className="max-w-2xl text-xs sm:text-sm text-slate-600 leading-relaxed font-sans font-light">
              La evocación asistida es un entrenamiento directo que obliga al cerebro a reactivar las huellas dermo-sinápticas (engramas de memoria) que de otro modo se perderían debido al sedentarismo intelectual, depresión o Alzheimer patológico.
            </p>
          </div>

          <CognitiveDiary 
            onEntryAdded={updateDiaryCount}
            neoBlur={neoBlur}
            glassOpacity={glassOpacity}
          />
        </section>

        {/* INTERACTIVE BRAIN GAMES (Section 2) */}
        <section id="gimnasia" className="space-y-8 border-t border-black/[0.05] pt-12 text-left">
          <div className="space-y-2">
            <span className="text-pink-600 text-xs font-mono tracking-[0.2em] font-extrabold uppercase block">
              Estimulación Sensorial Diaria
            </span>
            <h2 className="text-2xl sm:text-4xl font-heading font-black text-slate-800">
              02 // Gimnasia y Rehabilitación Cerebral
            </h2>
            <p className="max-w-2xl text-xs sm:text-sm text-slate-600 leading-relaxed font-sans font-light">
              Dos retos cognitivos optimizados para activar la atención focalizada (Simon / Patrones) y el lóbulo temporal-occipital (Encuentra las parejas de cartas). Acumula puntos de reserva para monitorizar tu actividad diaria.
            </p>
          </div>

          <BrainGames 
            onScoreEarned={handleScoreEarned}
            neoBlur={neoBlur}
            glassOpacity={glassOpacity}
          />
        </section>

        {/* CLINICAL LIBRARY AND EDUCATION (Section 3) */}
        <section id="biblioteca" className="space-y-8 border-t border-black/[0.05] pt-12 text-left pb-12">
          <div className="space-y-2">
            <span className="text-emerald-600 text-xs font-mono tracking-[0.2em] font-extrabold uppercase block">
              Educación, Apoyo e Investigación
            </span>
            <h2 className="text-2xl sm:text-4xl font-heading font-black text-slate-800">
              03 // Biblioteca de Soporte Clínico
            </h2>
            <p className="max-w-2xl text-xs sm:text-sm text-slate-600 leading-relaxed font-sans font-light">
              Consulta nuestra recopilación de documentación clínica elaborada para orientar a pacientes en riesgo de Alzheimer precoz, desórdenes mentales que causan confusión temporal o neblina (brain fog), familias y cuidadores.
            </p>
          </div>

          <DocumentationTabs 
            neoBlur={neoBlur}
            glassOpacity={glassOpacity}
          />
        </section>

      </main>

      {/* FOOTER ACCESSIBILITY NOTICE */}
      <footer className="mt-16 py-8 border-t border-black/[0.04] bg-[#E0E5EC]/40 text-center text-xs text-slate-550 space-y-2 px-6">
        <div className="flex justify-center items-center gap-1.5 font-bold">
          <Brain className="w-4 h-4 text-[#6C5CE7]" />
          <span>AURA DIARIO COGNITIVO</span>
        </div>
        <p className="max-w-md mx-auto text-[11px] leading-relaxed">
          Diseñado bajo rigurosos criterios de psicología gerontológica y ergonomía de lectura de alto contraste. Las informaciones expuestas no sustituyen a un diagnóstico neurológico definitivo.
        </p>
        <p className="text-[10px] font-mono text-slate-450 uppercase pb-4">
          © {new Date().getFullYear()} Aura Lab Software. All data local.
        </p>
      </footer>

    </div>
  );
}
