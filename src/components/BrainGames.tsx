import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  RotateCcw, 
  Play, 
  Brain, 
  CheckCircle, 
  Star, 
  Heart, 
  Flame, 
  Compass, 
  Smile, 
  Zap, 
  Volume2, 
  HelpCircle,
  HelpCircle as QuestionIcon
} from 'lucide-react';

// Safe Web Audio API Sound generator
interface AudioHelper {
  playTone: (freq: number, type?: OscillatorType, duration?: number) => void;
}

const createAudioHelper = (): AudioHelper => {
  let audioCtx: AudioContext | null = null;
  return {
    playTone: (freq: number, type: OscillatorType = 'sine', duration: number = 0.25) => {
      try {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtxClass) return;
        if (!audioCtx) {
          audioCtx = new AudioCtxClass();
        }
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.frequency.value = freq;
        osc.type = type;
        
        // Linear fade out to sound pleasant and not harsh
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
        
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch (e) {
        console.warn("Audio Context not allowed or initialized yet.", e);
      }
    }
  };
};

const audio = createAudioHelper();

// Card symbol options for matching game (represented as Lucide elements)
const CARD_SYMBOLS = [
  { item: 'heart', icon: Heart, color: 'text-rose-500 bg-rose-50' },
  { item: 'brain', icon: Brain, color: 'text-violet-500 bg-violet-50' },
  { item: 'flame', icon: Flame, color: 'text-amber-500 bg-amber-50' },
  { item: 'compass', icon: Compass, color: 'text-emerald-500 bg-emerald-50' },
  { item: 'smile', icon: Smile, color: 'text-sky-500 bg-sky-50' },
  { item: 'star', icon: Star, color: 'text-yellow-500 bg-yellow-50' },
  { item: 'zap', icon: Zap, color: 'text-fuchsia-500 bg-fuchsia-50' },
  { item: 'trophy', icon: Trophy, color: 'text-blue-500 bg-blue-50' }
];

interface Card {
  id: number;
  symbolIndex: number;
  item: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function BrainGames({ 
  onScoreEarned,
  neoBlur, // passed down for consistent styling
  glassOpacity
}: { 
  onScoreEarned: (points: number) => void;
  neoBlur: number;
  glassOpacity: number;
}) {
  const [activeGame, setActiveGame] = useState<'match' | 'simon'>('match');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // ----------------------------------------------------
  // GAME A: MEMORY CARD MATCH
  // ----------------------------------------------------
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [matchMoves, setMatchMoves] = useState<number>(0);
  const [matchStreak, setMatchStreak] = useState<number>(0);
  const [matchComplete, setMatchComplete] = useState<boolean>(false);
  const [matchBestScore, setMatchBestScore] = useState<number>(() => {
    return Number(localStorage.getItem('matchBestScore') || '99');
  });
  const [matchTime, setMatchTime] = useState<number>(0);
  const matchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Memory match
  const initMatchGame = () => {
    // Generate 16 cards (8 pairs of the 8 card symbols)
    const cardSet: Card[] = [];
    let cardId = 0;
    
    // Duplicate symbols
    CARD_SYMBOLS.forEach((symbol, symIdx) => {
      cardSet.push({ id: cardId++, symbolIndex: symIdx, item: symbol.item, isFlipped: false, isMatched: false });
      cardSet.push({ id: cardId++, symbolIndex: symIdx, item: symbol.item, isFlipped: false, isMatched: false });
    });

    // Shuffle cards
    for (let i = cardSet.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardSet[i], cardSet[j]] = [cardSet[j], cardSet[i]];
    }

    setCards(cardSet);
    setSelectedCards([]);
    setMatchMoves(0);
    setMatchStreak(0);
    setMatchComplete(false);
    setMatchTime(0);

    if (matchTimerRef.current) {
      clearInterval(matchTimerRef.current);
    }
    matchTimerRef.current = setInterval(() => {
      setMatchTime((prev) => prev + 1);
    }, 1000);
    
    if (soundEnabled) {
      audio.playTone(330, 'sine', 0.15);
      setTimeout(() => audio.playTone(440, 'sine', 0.2), 150);
    }
  };

  useEffect(() => {
    initMatchGame();
    return () => {
      if (matchTimerRef.current) clearInterval(matchTimerRef.current);
    };
  }, []);

  const handleCardClick = (clickedIndex: number) => {
    // Block input if we already have 2 flipped cards or clicked card is matched/already active
    if (selectedCards.length >= 2) return;
    if (cards[clickedIndex].isFlipped || cards[clickedIndex].isMatched) return;

    if (soundEnabled) {
      audio.playTone(440 + clickedIndex * 30, 'triangle', 0.12);
    }

    const updatedCards = [...cards];
    updatedCards[clickedIndex].isFlipped = true;
    setCards(updatedCards);

    const newSelection = [...selectedCards, clickedIndex];
    setSelectedCards(newSelection);

    // If we have selected two, analyze matching
    if (newSelection.length === 2) {
      const [firstIdx, secondIdx] = newSelection;
      setMatchMoves((m) => m + 1);

      if (cards[firstIdx].item === cards[secondIdx].item) {
        // MATCH SUCCESS
        setTimeout(() => {
          setCards((prevCards) => {
            const nextCards = [...prevCards];
            nextCards[firstIdx].isMatched = true;
            nextCards[secondIdx].isMatched = true;
            
            // Check win
            const allMatched = nextCards.every((c) => c.isMatched);
            if (allMatched) {
              setMatchComplete(true);
              if (matchTimerRef.current) clearInterval(matchTimerRef.current);
              
              // Points earned - quicker match = more points
              const calculatedPoints = Math.max(10, 100 - matchMoves - Math.floor(matchTime / 2));
              onScoreEarned(calculatedPoints);
              
              // Try high score
              if (matchMoves < matchBestScore) {
                setMatchBestScore(matchMoves);
                localStorage.setItem('matchBestScore', matchMoves.toString());
              }

              if (soundEnabled) {
                audio.playTone(523.25, 'sine', 0.15);
                setTimeout(() => audio.playTone(659.25, 'sine', 0.15), 100);
                setTimeout(() => audio.playTone(784.00, 'sine', 0.3), 200);
              }
            }
            return nextCards;
          });
          
          if (soundEnabled && !matchComplete) {
            audio.playTone(587.33, 'sine', 0.2);
          }
          setMatchStreak((s) => s + 1);
          setSelectedCards([]);
        }, 550);
      } else {
        // NO MATCH
        setTimeout(() => {
          setCards((prevCards) => {
            const nextCards = [...prevCards];
            nextCards[firstIdx].isFlipped = false;
            nextCards[secondIdx].isFlipped = false;
            return nextCards;
          });
          if (soundEnabled) {
            audio.playTone(220, 'sawtooth', 0.18);
          }
          setMatchStreak(0);
          setSelectedCards([]);
        }, 1200);
      }
    }
  };


  // ----------------------------------------------------
  // GAME B: SECUENCIA LUMÍNICA (SIMON pattern recall)
  // ----------------------------------------------------
  const [simonActive, setSimonActive] = useState<boolean>(false);
  const [simonSeq, setSimonSeq] = useState<number[]>([]);
  const [simonUserSeq, setSimonUserSeq] = useState<number[]>([]);
  const [simonLevel, setSimonLevel] = useState<number>(0);
  const [simonFlash, setSimonFlash] = useState<number | null>(null);
  const [simonState, setSimonState] = useState<'idle' | 'showing' | 'user' | 'fail' | 'success'>('idle');
  const [simonHighScore, setSimonHighScore] = useState<number>(() => {
    return Number(localStorage.getItem('simonHighScore') || '0');
  });

  const simonButtons = [
    { id: 0, name: 'Lavanda', freq: 261.63, shadowGlow: '0 0 25px rgba(108, 92, 231, 0.7)', activeColor: 'bg-[#6C5CE7]', baseColor: 'bg-[#6C5CE7]/35 border-[#6C5CE7]/60' },
    { id: 1, name: 'Coral', freq: 329.63, shadowGlow: '0 0 25px rgba(236, 72, 153, 0.7)', activeColor: 'bg-pink-500', baseColor: 'bg-pink-500/35 border-pink-550/60' },
    { id: 2, name: 'Esmeralda', freq: 392.00, shadowGlow: '0 0 25px rgba(16, 185, 129, 0.7)', activeColor: 'bg-emerald-500', baseColor: 'bg-emerald-500/35 border-emerald-550/60' },
    { id: 3, name: 'Cian', freq: 523.25, shadowGlow: '0 0 25px rgba(6, 182, 212, 0.7)', activeColor: 'bg-cyan-400', baseColor: 'bg-cyan-400/35 border-cyan-450/60' }
  ];

  const triggerSimonFlash = (btnId: number, duration: number = 350) => {
    setSimonFlash(btnId);
    if (soundEnabled) {
      audio.playTone(simonButtons[btnId].freq, 'sine', duration / 1000);
    }
    setTimeout(() => {
      setSimonFlash((f) => f === btnId ? null : f);
    }, duration);
  };

  const startSimonGame = () => {
    setSimonLevel(1);
    const firstVal = Math.floor(Math.random() * 4);
    setSimonSeq([firstVal]);
    setSimonUserSeq([]);
    setSimonState('showing');
    setSimonActive(true);
    setTimeout(() => {
      playSimonSequence([firstVal]);
    }, 600);
  };

  const playSimonSequence = (sequence: number[]) => {
    setSimonState('showing');
    let delay = 0;
    sequence.forEach((btnId, idx) => {
      setTimeout(() => {
        triggerSimonFlash(btnId, 320);
        
        // When sequence ends, yield to user
        if (idx === sequence.length - 1) {
          setTimeout(() => {
            setSimonState('user');
            setSimonUserSeq([]);
          }, 450);
        }
      }, delay);
      delay += 550;
    });
  };

  const handleSimonButtonClick = (btnId: number) => {
    if (simonState !== 'user') return;
    
    triggerSimonFlash(btnId, 250);
    const nextUserSeq = [...simonUserSeq, btnId];
    setSimonUserSeq(nextUserSeq);

    // Validate latest click
    const currentStep = nextUserSeq.length - 1;
    if (nextUserSeq[currentStep] !== simonSeq[currentStep]) {
      // GAME OVER
      setSimonState('fail');
      if (soundEnabled) {
        audio.playTone(130.81, 'sawtooth', 0.5);
      }
      return;
    }

    // Sequence fully matched matching round!
    if (nextUserSeq.length === simonSeq.length) {
      setSimonState('success');
      onScoreEarned(15 + simonLevel * 5);
      
      // Update High Score
      if (simonLevel > simonHighScore) {
        setSimonHighScore(simonLevel);
        localStorage.setItem('simonHighScore', simonLevel.toString());
      }

      setTimeout(() => {
        const nextLevel = simonLevel + 1;
        setSimonLevel(nextLevel);
        const nextInSeq = [...simonSeq, Math.floor(Math.random() * 4)];
        setSimonSeq(nextInSeq);
        setSimonUserSeq([]);
        playSimonSequence(nextInSeq);
      }, 900);
    }
  };

  // Neomorphic shadows setup
  const currentShadow = `${neoBlur}px ${neoBlur}px ${neoBlur * 2.5}px rgba(163, 177, 198, 0.45), -${neoBlur}px -${neoBlur}px ${neoBlur * 2.5}px rgba(255, 255, 255, 0.55)`;

  return (
    <div id="cognitive_playground" className="space-y-8">
      {/* Game Selector Headers */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex p-1 rounded-2xl bg-[#D9E1EB] border border-white/40 shadow-inner">
          <button
            onClick={() => setActiveGame('match')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-heading font-extrabold uppercase tracking-wider transition-all duration-350 ${
              activeGame === 'match'
                ? 'bg-white text-[#6C5CE7] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Brain className="w-4 h-4" />
            1. Gimnasia Retentiva (Cartas)
          </button>
          <button
            onClick={() => setActiveGame('simon')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-heading font-extrabold uppercase tracking-wider transition-all duration-350 ${
              activeGame === 'simon'
                ? 'bg-white text-pink-500 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4" />
            2. Memoria Secuencial
          </button>
        </div>

        {/* Audio Toggle Controls */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase border flex items-center gap-2 transition-all duration-200 ${
            soundEnabled
              ? 'border-emerald-500/30 bg-emerald-50/50 text-emerald-600'
              : 'border-slate-300 bg-slate-50 text-slate-500'
          }`}
          style={{
            boxShadow: '3px 3px 6px rgba(163,177,198,0.3), -3px -3px 6px rgba(255,255,255,0.4)'
          }}
        >
          <Volume2 className={`w-4 h-4 ${soundEnabled ? 'animate-bounce' : 'opacity-60'}`} />
          Símiles Sonoros: {soundEnabled ? 'ENCENDIDOS' : 'SILENCIADO'}
        </button>
      </div>

      {/* GAME WRAPPER CONTROLLER */}
      {activeGame === 'match' ? (
        <div 
          className="rounded-[2.5rem] p-6 md:p-8 space-y-6 bg-[#E0E5EC] max-w-4xl mx-auto"
          style={{ boxShadow: currentShadow }}
        >
          {/* Game Stats & Rules (Glassmorphic Top Ribbon) */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/35 border border-white/50 backdrop-blur-md">
            <div className="flex items-center gap-5">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-505 font-bold">Tiempo transcurrido</p>
                <p className="text-lg font-heading font-black text-slate-800">
                  {Math.floor(matchTime / 60)}:{(matchTime % 60).toString().padStart(2, '0')}
                </p>
              </div>
              <div className="w-[1px] h-8 bg-slate-300" />
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-505 font-bold">Intentos realizados</p>
                <p className="text-lg font-heading font-black text-slate-800">{matchMoves}</p>
              </div>
              <div className="w-[1px] h-8 bg-slate-300" />
              {matchStreak > 1 && (
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-amber-600 font-bold">Racha</p>
                  <p className="text-sm font-bold text-amber-600 flex items-center gap-1">
                    🔥 x{matchStreak} Match
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-semibold flex items-center gap-1 justify-end">
                  <Trophy className="w-3 h-3 text-yellow-500 inline-block" /> Récord (Menor número de movimientos)
                </p>
                <p className="text-xs font-bold text-slate-700 font-mono">
                  {matchBestScore === 99 ? 'Sin récord' : `${matchBestScore} movimientos`}
                </p>
              </div>
              <button 
                onClick={initMatchGame}
                className="p-3 bg-[#E0E5EC] rounded-xl hover:bg-slate-100 text-slate-600 hover:text-black transition-all border border-black/[0.04]"
                style={{
                  boxShadow: '3px 3px 6px rgba(163,177,198,0.5), -3px -3px 6px rgba(255,255,255,0.6)'
                }}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Grid of memory match cards */}
          {matchComplete ? (
            <div className="text-center py-12 px-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 space-y-4 max-w-lg mx-auto">
              <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-md">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-heading font-black text-slate-800">¡Gimnasia Completada con Éxito!</h4>
              <p className="text-slate-600 text-sm leading-relaxed max-w-sm mx-auto">
                Has emparejado las 16 cartas en <strong className="text-slate-800">{matchMoves} movimientos</strong> y un tiempo total de <strong className="text-slate-800">{matchTime} segundos</strong>. Has estimulado tus centros hipocampales para fijar recuerdos efímeros.
              </p>
              <button
                onClick={initMatchGame}
                className="px-6 py-3 bg-[#E0E5EC] hover:bg-white text-[#6C5CE7] rounded-xl font-heading font-bold text-xs uppercase tracking-widest border border-[#6C5CE7]/20 hover:border-[#6C5CE7] transition-all duration-300"
                style={{ boxShadow: '4px 4px 10px rgba(163,177,198,0.4)' }}
              >
                Jugar de Nuevo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-md mx-auto">
              {cards.map((card, idx) => {
                const isActive = card.isFlipped || card.isMatched;
                const isMatched = card.isMatched;
                const symbolObj = CARD_SYMBOLS[card.symbolIndex];
                const IconComponent = symbolObj.icon;

                return (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(idx)}
                    className="aspect-square rounded-2xl font-bold flex items-center justify-center transition-all duration-400 relative overflow-hidden focus:outline-none"
                    style={{
                      background: '#E0E5EC',
                      boxShadow: isActive
                        ? 'inset 4px 4px 8px rgba(110, 92, 231, 0.15), inset -4px -4px 8px rgba(255, 255, 255, 0.45)'
                        : '6px 6px 12px rgba(163,177,198,0.5), -6px -6px 12px rgba(255, 255, 255, 0.65)'
                    }}
                  >
                    {/* Inner Content transitioning */}
                    <div className="w-full h-full flex items-center justify-center relative p-2">
                      {isActive ? (
                        <div className={`w-full h-full rounded-xl flex items-center justify-center transition-all duration-300 ${symbolObj.color} ${isMatched ? 'opacity-50 scale-90 border border-black/[0.04]' : 'scale-100 shadow-inner'}`}>
                          <IconComponent className="w-6 h-6 shrink-0" />
                        </div>
                      ) : (
                        <div className="p-3 w-8 h-8 rounded-full bg-slate-300/40 border border-white/50 flex items-center justify-center shrink-0">
                          <Brain className="w-5 h-5 text-slate-500" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Clinical Therapeutic advice */}
          <div className="p-4 rounded-xl text-[11px] text-slate-600 bg-white/20 border border-white/30 leading-relaxed max-w-md mx-auto text-center font-mono">
            💡 <strong>Sugerencia clínica:</strong> Invierte 5 minutos del día en este juego. Al escanear visualmente y retener localizaciones absolutas, fortaleces la memoria espacial y de trabajo frente a la senescencia biológica cerebral.
          </div>
        </div>
      ) : (
        <div 
          className="rounded-[2.5rem] p-6 md:p-8 space-y-6 bg-[#E0E5EC] max-w-4xl mx-auto"
          style={{ boxShadow: currentShadow }}
        >
          {/* Simon Game Info Glass Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/35 border border-white/50 backdrop-blur-md">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-550 font-bold">Ronda Actual</p>
              <p className="text-xl font-heading font-black text-slate-800">
                {simonActive ? `Nivel: ${simonLevel}` : 'Inactivo'}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-semibold flex items-center gap-1 justify-end">
                  <Star className="w-3 h-3 text-amber-500 inline-block" /> Récord de Secuencia
                </p>
                <p className="text-xs font-bold text-slate-700 font-mono">
                  Nivel {simonHighScore || '—'}
                </p>
              </div>

              {!simonActive ? (
                <button
                  onClick={startSimonGame}
                  className="px-5 py-2 bg-gradient-to-r from-pink-500 to-[#6C5CE7] hover:opacity-95 text-white rounded-xl text-xs font-heading font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white stroke-none" /> Comenzar
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSimonActive(false);
                    setSimonState('idle');
                  }}
                  className="p-2.5 bg-[#E0E5EC] rounded-xl text-slate-550 hover:text-red-500 transition-all border border-black/[0.04]"
                  style={{
                    boxShadow: '3px 3px 6px rgba(163,177,198,0.5), -3px -3px 6px rgba(255,255,255,0.6)'
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Simon Game Playing Arena */}
          <div className="flex flex-col items-center justify-center space-y-8 py-4">
            
            {/* Action text based on turn */}
            <div className="text-center h-8">
              {simonActive && simonState === 'showing' && (
                <p className="text-xs font-mono uppercase tracking-widest text-[#6C5CE7] font-bold animate-pulse">
                  🌀 Atento al cerebro... Memorizando la secuencia luminosa
                </p>
              )}
              {simonActive && simonState === 'user' && (
                <p className="text-xs font-mono uppercase tracking-widest text-emerald-600 font-bold">
                  👈 Tu Turno: Selecciona la secuencia en orden exacto
                </p>
              )}
              {simonState === 'fail' && (
                <p className="text-xs font-mono uppercase tracking-widest text-red-500 font-bold">
                  ❌ Incorrecto. No te rindas, repite el ejercicio cerebral.
                </p>
              )}
              {simonState === 'success' && (
                <p className="text-xs font-mono uppercase tracking-widest text-emerald-600 font-bold animate-bounce">
                  ✨ ¡Excelente retención! Subiendo nivel...
                </p>
              )}
              {simonState === 'idle' && (
                <p className="text-xs font-mono text-slate-500 leading-relaxed max-w-sm mx-auto">
                  Presiona <strong>Comenzar</strong> para encender la constelación. El tablero emitirá flashes y tonos que deberás repetir.
                </p>
              )}
            </div>

            {/* Concentric Circle Grid */}
            <div className="relative p-6 rounded-full bg-white/5 border border-dashed border-black/[0.06] flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4 w-60 h-60">
                {simonButtons.map((btn) => {
                  const isFlashed = simonFlash === btn.id;
                  return (
                    <button
                      key={btn.id}
                      onClick={() => handleSimonButtonClick(btn.id)}
                      disabled={simonState !== 'user'}
                      className={`rounded-2xl border transition-all duration-200 outline-none select-none relative focus:outline-none ${
                        isFlashed 
                          ? `${btn.activeColor} scale-102 border-transparent` 
                          : `${btn.baseColor} border-black/[0.05] hover:border-black/[0.12]`
                      }`}
                      style={{
                        boxShadow: isFlashed 
                          ? btn.shadowGlow 
                          : '4px 4px 8px rgba(163,177,198,0.35), -4px -4px 8px rgba(255,255,255,0.45)',
                        cursor: simonState === 'user' ? 'pointer' : 'not-allowed'
                      }}
                    >
                      {/* Interactive subtle tactile center ring */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 border border-white/40 shadow-sm flex items-center justify-center text-[10px] font-mono text-slate-700">
                        {btn.id + 1}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Center Ring Indicator */}
              <div className="absolute w-20 h-20 rounded-full bg-[#E0E5EC] flex items-center justify-center border border-white/50" style={{ boxShadow: 'inset 3px 3px 6px rgba(163,177,198,0.3), inset -3px -3px 6px rgba(255,255,255,0.5)' }}>
                <Brain className={`w-8 h-8 text-slate-500 ${simonActive && simonState === 'showing' ? 'animate-spin': ''}`} style={{ animationDuration: '6s' }} />
              </div>
            </div>

          </div>

          {/* Cognitive background scientific info */}
          <div className="p-4 rounded-xl text-[11px] text-slate-650 bg-white/20 border border-white/30 leading-relaxed max-w-md mx-auto text-center font-mono">
            ℹ️ <strong>Estimulación Auditivo-Visual:</strong> El binomio luz-sonido activa múltiples lóbulos sensoriales colindantes, lo que optimiza la neurotransmisión sináptica en pacientes seniles y con pérdida de memoria por trauma mental o senectud.
          </div>
        </div>
      )}
    </div>
  );
}
