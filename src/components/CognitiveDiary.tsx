import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Smile, 
  AlertCircle, 
  Heart, 
  Users, 
  Clock, 
  CheckCircle, 
  Search, 
  Download, 
  Trash2, 
  BookOpen, 
  AlertOctagon, 
  ChevronRight,
  BookMarked
} from 'lucide-react';
import { DiaryEntry } from '../types';

export default function CognitiveDiary({ 
  onEntryAdded,
  neoBlur,
  glassOpacity
}: { 
  onEntryAdded: () => void;
  neoBlur: number;
  glassOpacity: number;
}) {
  // Local states
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<Partial<DiaryEntry>>({
    mood: 'Lúcido y Claro',
    moodLevel: 4,
    mealRecall: '',
    socialRecall: '',
    activityRecall: '',
    positiveRecall: '',
    generalNotes: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMood, setFilterMood] = useState('all');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [selectedViewingEntry, setSelectedViewingEntry] = useState<DiaryEntry | null>(null);

  // Emojis for mood levels
  const moodPresets = [
    { label: 'Lúcido y Claro', emoji: '🌟', level: 5, bg: 'bg-emerald-50 text-emerald-700' },
    { label: 'Olvidé algunas cosas', emoji: '🧐', level: 3, bg: 'bg-yellow-50 text-yellow-700' },
    { label: 'Un poco confundido', emoji: '🌀', level: 2, bg: 'bg-amber-50 text-amber-700' },
    { label: 'Triste o Ansioso', emoji: '😔', level: 2, bg: 'bg-indigo-50 text-indigo-700' },
    { label: 'Alegre y Social', emoji: '☀️', level: 5, bg: 'bg-[#6C5CE7]/10 text-[#6C5CE7]' }
  ];

  // Load entries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('aura_cognitive_diary');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse diary entries.", e);
      }
    }
  }, []);

  const saveEntriesToLocalStorage = (newEntries: DiaryEntry[]) => {
    localStorage.setItem('aura_cognitive_diary', JSON.stringify(newEntries));
    setEntries(newEntries);
  };

  const handleInputChange = (field: keyof DiaryEntry, value: any) => {
    setEditingEntry(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Core memory anchor check
    if (!editingEntry.mealRecall?.trim() && !editingEntry.socialRecall?.trim() && !editingEntry.activityRecall?.trim()) {
      alert("Por favor, intenta responder al menos una de las preguntas de memoria. ¡Queremos ejercitar tus sinapsis hoy!");
      return;
    }

    const newFullEntry: DiaryEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      mood: editingEntry.mood || 'Lúcido y Claro',
      moodLevel: editingEntry.moodLevel || 4,
      mealRecall: editingEntry.mealRecall || 'No lo recuerdo en este momento (un cuidador puede ayudar).',
      socialRecall: editingEntry.socialRecall || 'Hoy no mantuve conversaciones detalladas.',
      activityRecall: editingEntry.activityRecall || 'No registré actividades concretas esta mañana.',
      positiveRecall: editingEntry.positiveRecall || 'El simple hecho de respirar y existir bajo el sol.',
      generalNotes: editingEntry.generalNotes || ''
    };

    const updated = [newFullEntry, ...entries];
    saveEntriesToLocalStorage(updated);
    
    // Clear form
    setEditingEntry({
      mood: 'Lúcido y Claro',
      moodLevel: 4,
      mealRecall: '',
      socialRecall: '',
      activityRecall: '',
      positiveRecall: '',
      generalNotes: ''
    });

    onEntryAdded();
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  const deleteEntry = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("¿Estás seguro de que deseas eliminar este recuerdo del diario?")) {
      const updated = entries.filter(item => item.id !== id);
      saveEntriesToLocalStorage(updated);
      if (selectedViewingEntry?.id === id) {
        setSelectedViewingEntry(null);
      }
    }
  };

  const exportDiaryText = () => {
    if (entries.length === 0) return;
    
    let content = "=== DIARIO COGNITIVO AURA - REPORTE CLÍNICO DE MEMORIA ===\n";
    content += `Generado el: ${new Date().toLocaleDateString('es-ES')}\n`;
    content += `Total de registros: ${entries.length}\n\n`;

    entries.forEach((item, index) => {
      content += `--------------------------------------------------\n`;
      content += `REGISTRO #${entries.length - index} | FECHA: ${item.timestamp}\n`;
      content += `Estado de Lucidez: ${item.mood} (Nivel: ${item.moodLevel}/5)\n\n`;
      content += `[1. Memoria de Alimentación]\n¿Qué comió hoy?: ${item.mealRecall}\n\n`;
      content += `[2. Memoria de Interacción Social]\n¿Con quién habló hoy?: ${item.socialRecall}\n\n`;
      content += `[3. Secuenciación de Tareas]\nActividades de la mañana: ${item.activityRecall}\n\n`;
      content += `[4. Anclajes Positivos Emocionales]\nCosas que le hicieron feliz: ${item.positiveRecall}\n\n`;
      content += `[Notas Libres]: ${item.generalNotes || 'Ninguna'}\n`;
      content += `--------------------------------------------------\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `diario_cognitivo_reporte_${new Date().toISOString().substring(0,10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Filter entries
  const filteredEntries = entries.filter(item => {
    const matchesSearch = 
      item.mealRecall.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.socialRecall.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.activityRecall.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.positiveRecall.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.generalNotes.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterMood === 'all') return matchesSearch;
    return matchesSearch && item.mood === filterMood;
  });

  const currentShadow = `${neoBlur}px ${neoBlur}px ${neoBlur * 2.5}px rgba(163, 177, 198, 0.45), -${neoBlur}px -${neoBlur}px ${neoBlur * 2.5}px rgba(255, 255, 255, 0.55)`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* LEFT COLUMN: THERAPEUTIC REGISTRATION FORM */}
      <div 
        className="lg:col-span-7 rounded-[2.5rem] p-6 sm:p-8 space-y-6 bg-[#E0E5EC] relative overflow-hidden"
        style={{ boxShadow: currentShadow }}
      >
        {/* Glow particle in the box */}
        <div className="absolute top-[-50px] right-[-50px] w-24 h-24 rounded-full bg-[#6C5CE7]/10 blur-xl pointer-events-none" />

        <div className="border-b border-black/[0.05] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <BookMarked className="w-5 h-5 text-[#6C5CE7]" />
            <h3 className="text-xl font-heading font-black text-slate-800 uppercase tracking-wide">
              Anclaje de Recuerdos Diarios
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Las demencias y el Alzheimer debilitan primero la memoria de corto plazo. Este formulario estructurado entrena tu mente haciendo el esfuerzo consciente de evocar la cronología de tus últimas 12 horas.
          </p>
        </div>

        {showSuccessToast && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-500/35 text-emerald-800 text-xs flex items-center gap-3 animate-fade-in">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <strong className="font-bold">¡Recuerdo Guardado Exitosamente!</strong>
              <p className="text-[11px] text-emerald-700 mt-0.5">Tus sinapsis de evitación se han estimulado. Tu registro ahora es seguro y permanente en tu dispositivo local.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* STEP 1: Mood & Lucidity Selector */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono tracking-wider text-slate-600 block uppercase font-bold flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5 text-[#6C5CE7]" /> ¿Cómo sientes tu claridad mental ahora mismo?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {moodPresets.map((preset) => {
                const active = editingEntry.mood === preset.label;
                return (
                  <button
                    type="button"
                    key={preset.label}
                    onClick={() => {
                      handleInputChange('mood', preset.label);
                      handleInputChange('moodLevel', preset.level);
                    }}
                    className={`text-left p-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all duration-200 ${
                      active
                        ? 'border-[#6C5CE7]/40 bg-[#6C5CE7]/10 text-[#6C5CE7]'
                        : 'border-black/[0.04] bg-white/10 hover:bg-white/30 text-slate-700'
                    }`}
                    style={{
                      boxShadow: active 
                        ? 'inset 2px 2px 4px rgba(163,177,198,0.3)'
                        : '2px 2px 5px rgba(163,177,198,0.2)'
                    }}
                  >
                    <span className="text-lg shrink-0">{preset.emoji}</span>
                    <span className="truncate leading-tight">{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Nutrition Recall */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-mono tracking-wider text-slate-600 block uppercase font-bold flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500" /> 1. Nutrición: ¿Qué comiste o desayunaste hoy?
              </label>
              <span className="text-[9px] font-mono text-[#6C5CE7] font-semibold bg-white/40 px-2 py-0.5 rounded-full border border-white/50">Memoria Reciente</span>
            </div>
            <textarea
              rows={2}
              value={editingEntry.mealRecall}
              onChange={(e) => handleInputChange('mealRecall', e.target.value)}
              placeholder="Haz el esfuerzo: evoca aromas, platos, vasos o si requiriste ayuda..."
              className="w-full px-4 py-3 text-xs bg-[#E0E5EC] text-slate-800 placeholder-slate-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#6C5CE7]/30 border border-transparent transition-all"
              style={{
                boxShadow: 'inset 4px 4px 8px rgba(163, 177, 198, 0.45), inset -4px -4px 8px rgba(255, 255, 255, 0.55)'
              }}
            />
          </div>

          {/* STEP 3: Social Recall */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-mono tracking-wider text-slate-600 block uppercase font-bold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-sky-500" /> 2. Conectividad: ¿Con quién hablaste hoy y qué compartieron?
              </label>
              <span className="text-[9px] font-mono text-sky-600 font-semibold bg-white/40 px-2 py-0.5 rounded-full border border-white/50">Anclaje Social</span>
            </div>
            <textarea
              rows={2}
              value={editingEntry.socialRecall}
              onChange={(e) => handleInputChange('socialRecall', e.target.value)}
              placeholder="Nombre del familiar, vecino, médico, llamadas por teléfono..."
              className="w-full px-4 py-3 text-xs bg-[#E0E5EC] text-slate-800 placeholder-slate-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500/30 border border-transparent transition-all"
              style={{
                boxShadow: 'inset 4px 4px 8px rgba(163, 177, 198, 0.45), inset -4px -4px 8px rgba(255, 255, 255, 0.55)'
              }}
            />
          </div>

          {/* STEP 4: Activity Sequencing */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-mono tracking-wider text-slate-600 block uppercase font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-500" /> 3. Secuencia Temporal: ¿Qué hiciste por la mañana?
              </label>
              <span className="text-[9px] font-mono text-emerald-600 font-semibold bg-white/40 px-2 py-0.5 rounded-full border border-white/50">Orden de Sucesos</span>
            </div>
            <textarea
              rows={2}
              value={editingEntry.activityRecall}
              onChange={(e) => handleInputChange('activityRecall', e.target.value)}
              placeholder="Escribe en orden lógico: despertarse, ducharse, tomar aire, organizar la mesa..."
              className="w-full px-4 py-3 text-xs bg-[#E0E5EC] text-slate-800 placeholder-slate-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/30 border border-transparent transition-all"
              style={{
                boxShadow: 'inset 4px 4px 8px rgba(163, 177, 198, 0.45), inset -4px -4px 8px rgba(255, 255, 255, 0.55)'
              }}
            />
          </div>

          {/* STEP 5: Emotional Positivity Anchor */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-mono tracking-wider text-slate-600 block uppercase font-bold flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5 text-pink-500" /> 4. Salud Emocional: ¿Qué 3 cosas te trajeron paz hoy?
              </label>
              <span className="text-[9px] font-mono text-pink-600 font-semibold bg-white/40 px-2 py-0.5 rounded-full border border-white/50">Resta Cortisol</span>
            </div>
            <textarea
              rows={2}
              value={editingEntry.positiveRecall}
              onChange={(e) => handleInputChange('positiveRecall', e.target.value)}
              placeholder="El canto de un pájaro, el sabor del café, una sonrisa, una foto familiar..."
              className="w-full px-4 py-3 text-xs bg-[#E0E5EC] text-slate-800 placeholder-slate-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-pink-500/30 border border-transparent transition-all"
              style={{
                boxShadow: 'inset 4px 4px 8px rgba(163, 177, 198, 0.45), inset -4px -4px 8px rgba(255, 255, 255, 0.55)'
              }}
            />
          </div>

          {/* STEP 6: General notes */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono tracking-wider text-slate-600 block uppercase font-bold">
              Pensamientos Libres u Observaciones del Cuidador
            </label>
            <textarea
              rows={2}
              value={editingEntry.generalNotes}
              onChange={(e) => handleInputChange('generalNotes', e.target.value)}
              placeholder="Cualquier síntoma físico, estado clínico o sensación de lucidez adicional..."
              className="w-full px-4 py-3 text-xs bg-[#E0E5EC] text-slate-800 placeholder-slate-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#6C5CE7]/20 border border-transparent transition-all"
              style={{
                boxShadow: 'inset 4px 4px 8px rgba(163, 177, 198, 0.45), inset -4px -4px 8px rgba(255, 255, 255, 0.55)'
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl font-heading font-black text-xs tracking-widest uppercase text-white transition-all bg-gradient-to-r from-[#6C5CE7] to-indigo-600 hover:shadow-lg focus:outline-none"
            style={{
              boxShadow: '3px 6px 14px rgba(108, 92, 231, 0.3)'
            }}
          >
            Fijar Registro Cerebral del Día
          </button>

        </form>
      </div>

      {/* RIGHT COLUMN: RECOLLECTIONS TIMELINE */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Memory Search & Actions Card (Glassmorphism Panel) */}
        <div 
          className="rounded-[2rem] p-5 space-y-4 bg-white/20 border border-white/50 backdrop-blur-md"
          style={{
            boxShadow: '8px 8px 18px rgba(163, 177, 198, 0.35), -8px -8px 18px rgba(255, 255, 255, 0.45)'
          }}
        >
          <div className="flex justify-between items-center border-b border-black/[0.05] pb-3">
            <div>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold">Tú Álbum de Historias</p>
              <h4 className="text-base font-heading font-black text-slate-850">Línea de Vida Temporal</h4>
            </div>
            
            {entries.length > 0 && (
              <button
                onClick={exportDiaryText}
                className="p-2 border border-black/[0.06] hover:border-[#6C5CE7] text-[#6C5CE7] bg-[#E0E5EC]/50 hover:bg-white rounded-xl text-xs flex items-center gap-1.5 font-bold transition-all"
                title="Descargar reporte para el médico"
                style={{ boxShadow: '2px 2.5px 6px rgba(163,177,198,0.2)' }}
              >
                <Download className="w-3.5 h-3.5" /> Reportar
              </button>
            )}
          </div>

          {/* Search Inputs & Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar recuerdos (ej: 'café', 'comida'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-white/40 focus:bg-white text-slate-800 rounded-xl focus:outline-none transition-all border border-black/[0.04]"
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Filtrar por lucidez:</span>
              <select
                value={filterMood}
                onChange={(e) => setFilterMood(e.target.value)}
                className="text-[11px] font-semibold bg-white/45 border border-black/[0.04] text-slate-700 rounded-lg px-2 py-1 outline-none"
              >
                <option value="all">Ver Todos</option>
                <option value="Lúcido y Claro">🌟 Lúcido y Claro</option>
                <option value="Olvíde algunas cosas">🧐 Olvidadizo</option>
                <option value="Un poco confundido">🌀 Confundido</option>
                <option value="Triste o Ansioso">😔 Triste/Ansioso</option>
                <option value="Alegre y Social">☀️ Alegre/Social</option>
              </select>
            </div>
          </div>
        </div>

        {/* TIMELINE LOG LIST */}
        <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12 px-6 rounded-2xl bg-white/10 border border-dashed border-black/[0.08] text-slate-500 space-y-3">
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-semibold">No se encontraron recuerdos guardados.</p>
              <p className="text-[10px] leading-relaxed text-slate-550 max-w-xs mx-auto">
                {searchQuery ? 'Prueba refinando la caja de búsqueda.' : 'Crea tu primer anclaje en el formulario de la izquierda para comenzar el ejercicio de retención.'}
              </p>
            </div>
          ) : (
            filteredEntries.map((item, index) => {
              const matchingPreset = moodPresets.find(m => m.label === item.mood);
              const emojiValue = matchingPreset?.emoji || '🌟';
              const emojiBg = matchingPreset?.bg || 'bg-white';

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedViewingEntry(item)}
                  className="p-4 rounded-2xl bg-[#E0E5EC] hover:bg-[#E5EBF2] cursor-pointer border border-transparent hover:border-[#6C5CE7]/10 transition-all duration-300 relative overflow-hidden group text-left"
                  style={{
                    boxShadow: '4px 4px 10px rgba(163, 177, 198, 0.4), -4px -4px 10px rgba(255, 255, 255, 0.5)'
                  }}
                >
                  <div className="flex gap-3.5 items-start">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center text-lg shadow-inner ${emojiBg} shrink-0`}>
                      {emojiValue}
                    </div>
                    
                    <div className="flex-1 space-y-1.5 overflow-hidden">
                      <div className="flex justify-between items-start gap-1">
                        <span className="text-[9px] font-mono text-[#6C5CE7] font-bold uppercase tracking-wider block">
                          Recuerdo #{entries.length - entries.findIndex(e => e.id === item.id)}
                        </span>
                        
                        <button
                          onClick={(e) => deleteEntry(item.id, e)}
                          className="text-slate-400 hover:text-red-500 p-0.5 rounded transition-colors"
                          title="Eliminar este recuerdo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h5 className="text-xs font-heading font-black text-slate-800 capitalize leading-tight">
                        {item.timestamp.split(',')[0]}
                      </h5>
                      
                      <p className="text-[11px] text-slate-550 truncate font-sans">
                        🍒 Diet: {item.mealRecall}
                      </p>
                      
                      <p className="text-[11px] text-slate-550 truncate font-sans">
                        💬 Social: {item.socialRecall}
                      </p>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400 self-center group-hover:text-[#6C5CE7] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* FULL RECORD DETAIL DIALOG (GORGEOUS GLASSMORPHISM MODAL OVERLAY) */}
      {selectedViewingEntry && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/35 backdrop-blur-sm animate-fade-in">
          <div 
            className="w-full max-w-lg rounded-[2.5rem] p-6 sm:p-8 space-y-6 relative overflow-hidden glass-panel-heavy"
            style={{
              background: `rgba(255, 255, 255, 0.45)`,
              backdropFilter: `blur(40px)`,
              WebkitBackdropFilter: `blur(40px)`,
              boxShadow: '0 50px 100px -20px rgba(0,0,0,0.3)'
            }}
          >
            {/* Ambient colorful light ring */}
            <div className="absolute top-[-20%] right-[-20%] w-40 h-40 rounded-full bg-gradient-to-tr from-cyan-400 via-purple-400 to-pink-300 opacity-30 blur-2xl pointer-events-none" />

            <div className="flex justify-between items-start border-b border-black/[0.08] pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#6C5CE7] tracking-widest font-extrabold uppercase">Lectura de Retención</span>
                <h4 className="text-lg font-heading font-black text-slate-850">
                  Bitácora Temporal de Recuerdos
                </h4>
                <p className="text-[10px] text-slate-655 font-semibold mt-1 font-mono">
                  🗓️ {selectedViewingEntry.timestamp}
                </p>
              </div>
              <button
                onClick={() => setSelectedViewingEntry(null)}
                className="h-8 w-8 rounded-full bg-[#E0E5EC] hover:bg-white text-slate-600 hover:text-black flex items-center justify-center transition-all border border-black/[0.04] shadow-sm font-bold text-xs"
              >
                ✕
              </button>
            </div>

            {/* Questions detail timeline listing */}
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 text-left">
              
              <div className="p-3 bg-white/40 rounded-xl border border-white/50">
                <span className="text-[9px] font-mono text-[#6C5CE7] block tracking-wide uppercase font-bold">Estado Clínico Presenciado</span>
                <p className="text-xs font-semibold text-slate-800 mt-1">
                  Lucidez: <span className="font-bold text-indigo-700">{selectedViewingEntry.mood}</span> (Nivel {selectedViewingEntry.moodLevel}/5 de claridad cerebral)
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold">🥦 Alimentación Reciente</span>
                <p className="text-xs text-slate-700 bg-[#E0E5EC]/50 p-3 rounded-xl border border-white/60 leading-relaxed">
                  {selectedViewingEntry.mealRecall}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold">💬 Redes y Socialización</span>
                <p className="text-xs text-slate-700 bg-[#E0E5EC]/50 p-3 rounded-xl border border-white/60 leading-relaxed">
                  {selectedViewingEntry.socialRecall}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#0d9488] block uppercase font-bold">✨ Estructura de Actividades</span>
                <p className="text-xs text-slate-700 bg-[#E0E5EC]/50 p-3 rounded-xl border border-white/60 leading-relaxed">
                  {selectedViewingEntry.activityRecall}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-pink-600 block uppercase font-bold">❤️ Alegría y Gratitud Emocional</span>
                <p className="text-xs text-slate-700 bg-[#E0E5EC]/50 p-3 rounded-xl border border-white/60 leading-relaxed font-semibold italic">
                  "{selectedViewingEntry.positiveRecall}"
                </p>
              </div>

              {selectedViewingEntry.generalNotes && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold">📝 Anotaciones Clínicas / Observaciones</span>
                  <p className="text-xs text-slate-655 bg-[#E0E5EC]/70 p-3 rounded-xl border border-white/50 leading-relaxed">
                    {selectedViewingEntry.generalNotes}
                  </p>
                </div>
              )}
            </div>

            {/* Medical Advice Box */}
            <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-[10px] text-orange-850 flex gap-2.5 leading-relaxed items-start">
              <AlertCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <strong>Recomendación importante:</strong> Lee periódicamente tus registros. La lectura repetida de eventos recientes ("Re-Consolidación Hipocampal") re-entrena los núcleos de memoria residual en pacientes de Alzheimer y senectud.
              </div>
            </div>

            <button
              onClick={() => setSelectedViewingEntry(null)}
              className="w-full py-3 bg-[#E0E5EC] hover:bg-white text-[#2D3436] font-bold text-xs uppercase font-heading tracking-widest rounded-xl transition-all shadow-inner border border-white/65"
            >
              Cerrar Diapositiva
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
