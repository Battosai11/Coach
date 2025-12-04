import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, Save, CheckCircle2, Dumbbell, ChevronRight, ChevronLeft, Zap, Info, Utensils, Coffee, Moon, Sparkles, Loader2, ChefHat, User } from 'lucide-react';

// ==========================================
// 1. DONNÉES ET CONFIGURATION (Tout est ici !)
// ==========================================
const APP_TITLE = "BATTOSAI"; // LA LIGNE QUI MANQUAIT !

const USER_CONFIG = {
  "Battosai": { 
    avatar: "https://i.imgur.com/XqQZ4p5.png", 
    theme: "blue", 
    label: "Sensei"
  },
  "Invité": { 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix", 
    theme: "emerald",
    label: "Visiteur"
  }
};

const PROGRAMME_SPORT = {
  1: { 
    title: "Haut du corps & Abdos", subtitle: "Focus Haltères",
    exercises: [
      { name: "Shoulder Press", type: "reps", target: "4 x 10-12", volume: 48, desc: "Pousse vers le ciel, dos droit.", img: "https://media.giphy.com/media/3o7TjqCSr0f96w3K5q/giphy.gif" },
      { name: "Rowing un bras", type: "reps", target: "4 x 12", volume: 48, desc: "Dos plat, tire le coude.", img: "https://media.giphy.com/media/10006Z2u7L1Wc/giphy.gif" },
      { name: "Curl Biceps", type: "reps", target: "3 x 12", volume: 36, desc: "Contrôle la descente.", img: "https://media.giphy.com/media/H4DjXQXamtTiIuCcRu/giphy.gif" },
      { name: "Triceps extension", type: "reps", target: "3 x 12", volume: 36, desc: "Bras vers le ciel, plie les coudes.", img: "https://media.giphy.com/media/xT9Igwe1F5Xg7q6sDe/giphy.gif" },
      { name: "Planche", type: "time", target: "3 x 45s", volume: 3, desc: "Gainage statique.", img: "https://media.giphy.com/media/xT8qBff8cKDDRGTWlW/giphy.gif" }, 
      { name: "Relevés de jambes", type: "reps", target: "3 x 15", volume: 45, desc: "Dos au sol, jambes tendues.", img: "https://media.giphy.com/media/3o6Zxp7eG5WnQo64Tu/giphy.gif" }
    ]
  },
  2: { 
    title: "Bas du corps", subtitle: "Jambes & Fessiers",
    exercises: [
      { name: "Squat Haltères", type: "reps", target: "4 x 12", volume: 48, desc: "Fesses en arrière, dos droit.", img: "https://media.giphy.com/media/12h4r12uD9eKli/giphy.gif" },
      { name: "Fentes", type: "reps", target: "3 x 12", volume: 36, desc: "Genou arrière frôle le sol.", img: "https://media.giphy.com/media/3o7qDQ4kcSD1PLM3BK/giphy.gif" },
      { name: "Soulevé de terre", type: "reps", target: "3 x 12", volume: 36, desc: "Jambes tendues, dos plat.", img: "https://media.giphy.com/media/p8wLy6i3OEI1i/giphy.gif" },
      { name: "Hip Thrust", type: "reps", target: "3 x 15", volume: 45, desc: "Monte le bassin vers le ciel.", img: "https://media.giphy.com/media/l41Yy4J96X8ehz8xG/giphy.gif" },
      { name: "Planche Latérale", type: "time", target: "2 x 30s", volume: 2, desc: "Bassin haut.", img: "https://media.giphy.com/media/xT8qBff8cKDDRGTWlW/giphy.gif" }
    ]
  },
  3: { 
    title: "HIIT + Corde", subtitle: "Cardio Intensif",
    exercises: [
      { name: "Corde à sauter", type: "cardio", target: "20 min", volume: 20, desc: "Rythme soutenu.", img: "https://media.giphy.com/media/l0HlPtbGpcnqa0fja/giphy.gif" },
      { name: "Burpees", type: "reps", target: "3 x 12", volume: 36, desc: "Explosif !", img: "https://media.giphy.com/media/26BkNHX097r61A1uE/giphy.gif" },
      { name: "Mountain Climbers", type: "time", target: "3 x 30s", volume: 3, desc: "Cours sur place en planche.", img: "https://media.giphy.com/media/26BkN7ZJggJ8YQ9uE/giphy.gif" },
      { name: "Squat Jumps", type: "reps", target: "3 x 12", volume: 36, desc: "Saut à la remontée.", img: "https://media.giphy.com/media/12h4r12uD9eKli/giphy.gif" }
    ]
  },
  4: { 
    title: "Full Body", subtitle: "Mobilité",
    exercises: [
      { name: "Rowing", type: "reps", target: "3 x 12", volume: 36, desc: "Tire les deux haltères.", img: "https://media.giphy.com/media/10006Z2u7L1Wc/giphy.gif" },
      { name: "Squat", type: "reps", target: "3 x 12", volume: 36, desc: "Contrôle la descente.", img: "https://media.giphy.com/media/12h4r12uD9eKli/giphy.gif" },
      { name: "Press Épaules", type: "reps", target: "3 x 10", volume: 30, desc: "Pousse vers le ciel.", img: "https://media.giphy.com/media/3o7TjqCSr0f96w3K5q/giphy.gif" },
      { name: "Curl", type: "reps", target: "2 x 12", volume: 24, desc: "Propre.", img: "https://media.giphy.com/media/H4DjXQXamtTiIuCcRu/giphy.gif" },
      { name: "Triceps", type: "reps", target: "2 x 12", volume: 24, desc: "Kickback.", img: "https://media.giphy.com/media/xT9Igwe1F5Xg7q6sDe/giphy.gif" }
    ]
  },
  5: { title: "Abdos", subtitle: "Repos", exercises: [{ name: "Repos", type: "time", target: "Relax", volume: 0, desc: "Récupération.", img: "https://media.giphy.com/media/4T7e4DmcrP9du/giphy.gif" }] },
  6: { title: "Cardio", subtitle: "Endurance", exercises: [{ name: "Vélo", type: "cardio", target: "45 min", volume: 45, desc: "Zone 2.", img: "https://media.giphy.com/media/l0HlPtbGpcnqa0fja/giphy.gif" }] },
  0: { title: "Repos", subtitle: "Dimanche", exercises: [{ name: "Repos", type: "time", target: "Relax", volume: 0, desc: "Dors bien.", img: "https://media.giphy.com/media/4T7e4DmcrP9du/giphy.gif" }] }
};

const DAILY_MEAL_PLAN = {
  title: "Routine 2500 kcal", subtitle: "Collation + Grand Dîner",
  meals: [
    { type: "Collation (16h)", icon: Coffee, calories: "~500 kcal", items: [{ name: "Fromage Blanc", qty: "300g" }, { name: "Muesli / Avoine", qty: "50g" }, { name: "Fruit", qty: "1 pièce" }, { name: "Oléagineux", qty: "1 poignée" }] },
    { type: "Le Grand Dîner", icon: Moon, calories: "~2000 kcal", isFlexible: true, items: [{ category: "Féculents", options: ["Riz (125g)", "Pâtes (125g)", "PDT (400g)"] }, { category: "Protéines", options: ["Viande (200g)", "Poisson (200g)", "Oeufs (4-5)"] }, { category: "Légumes", options: ["Légumes verts", "Salade"] }] }
  ]
};

// --- COMPOSANTS ---
const GlassCard = ({ children, className = "", onClick }) => (
  <div onClick={onClick} className={`bg-white/40 backdrop-blur-xl border border-white/40 shadow-lg rounded-3xl p-5 ${className}`}>
    {children}
  </div>
);

const Mascot = ({ showQuote, quote, onClick }) => (
  <div className="fixed bottom-28 right-2 z-50 flex flex-col items-end pointer-events-none">
    <div className={`bg-white text-slate-900 p-4 rounded-3xl rounded-br-sm shadow-2xl border-2 border-slate-900 max-w-[200px] mb-[-5px] mr-12 transition-all duration-500 transform ${showQuote ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-75'} origin-bottom-right pointer-events-auto relative z-20`}>
      <p className="text-sm font-bold font-sans leading-tight">"{quote}"</p>
    </div>
    <div onClick={onClick} className="relative w-40 h-40 cursor-pointer pointer-events-auto flex flex-col items-center justify-end group">
      <img src="https://i.imgur.com/h592WqJ.png" alt="Mascotte" className="w-full h-full object-contain transition-transform group-hover:scale-110" />
    </div>
  </div>
);

const WorkoutView = ({ todaysWorkout, todayLog, handleLogChange, saveWorkout, currentDate, changeDate, getGeminiAdvice, loadingAdvice, history, themeColor }) => {
  const [infoOpen, setInfoOpen] = useState(null);
  
  const getThemeClasses = (isActive) => {
    if (!isActive) return 'text-slate-400 hover:text-slate-600';
    return themeColor === 'emerald' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600';
  };

  const getHeaderGradient = () => {
    return themeColor === 'emerald' ? 'from-emerald-600/90 to-teal-700/90 shadow-emerald-500/30' : 'from-blue-600/90 to-indigo-700/90 shadow-blue-500/30';
  };

  const isAlreadySaved = history.some(h => h.date === currentDate.toISOString().split('T')[0]);

  return (
    <div className="space-y-6 pb-24">
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${getHeaderGradient()} backdrop-blur-md text-white p-6 shadow-2xl border border-white/20 transition-colors duration-500`}>
        <div className="absolute top-0 right-0 p-4 opacity-10"><Dumbbell size={100} /></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4 bg-white/20 rounded-xl p-2 backdrop-blur-sm">
            <button onClick={() => changeDate(-1)} className="p-2 hover:bg-white/20 rounded-lg transition-colors"><ChevronLeft size={20} /></button>
            <div className="text-center">
                <div className="text-xs font-medium text-white/80 uppercase tracking-wider">Date</div>
                <div className="font-bold text-lg capitalize">{currentDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
            </div>
            <button onClick={() => changeDate(1)} className="p-2 hover:bg-white/20 rounded-lg transition-colors"><ChevronRight size={20} /></button>
          </div>
          <div className="text-white/80 text-sm font-medium tracking-wider mb-1 uppercase">Entraînement</div>
          <h2 className="text-3xl font-bold mb-1 tracking-tight">{todaysWorkout?.title || "Repos"}</h2>
          <p className="text-white/70 font-light mb-4">{todaysWorkout?.subtitle || "Profite !"}</p>
          <button onClick={getGeminiAdvice} disabled={loadingAdvice} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all border border-white/20">
            {loadingAdvice ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {loadingAdvice ? "Daxter réfléchit..." : "Demander conseil à Daxter"}
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {todaysWorkout?.exercises.map((ex, idx) => {
          const isDone = todayLog[ex.name]?.done;
          const isInfoOpen = infoOpen === idx;
          return (
            <GlassCard key={idx} className={`transition-all duration-300 ${isDone ? 'bg-green-50/50 border-green-200/50 ring-1 ring-green-400/30' : ''}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2">
                      <h3 className={`font-bold text-lg ${isDone ? 'text-green-900' : 'text-slate-800'}`}>{ex.name}</h3>
                      <button onClick={() => setInfoOpen(isInfoOpen ? null : idx)} className={`p-1 rounded-full transition-colors ${getThemeClasses(isInfoOpen)}`}><Info size={18} /></button>
                  </div>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/40 text-slate-600 text-xs font-medium border border-white/20 mt-1">
                      <Zap size={10} className={isDone ? 'text-green-600' : 'text-slate-500'} /> {ex.target}
                  </div>
                </div>
                <button onClick={() => handleLogChange(ex.name, 'done', !isDone)} className={`p-2 rounded-full transition-colors ${isDone ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-white/50 text-slate-500 hover:bg-white'}`}><CheckCircle2 size={22} /></button>
              </div>
              {isInfoOpen && (
                  <div className="mb-4 mt-2 bg-white/60 rounded-xl p-3 border border-white/50 shadow-inner animate-in fade-in slide-in-from-top-2">
                      <div className="aspect-video bg-slate-900 rounded-lg mb-3 overflow-hidden shadow-sm relative">
                          <img src={ex.img} alt={ex.name} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-sm text-slate-700 font-medium leading-relaxed">{ex.desc}</p>
                  </div>
              )}
              <div className={`transition-all duration-500 overflow-hidden ${isDone ? 'max-h-0 opacity-50' : 'max-h-32 opacity-100'}`}>
                <div className="flex gap-3 items-center mt-2">
                  {(ex.type === 'reps' || ex.type === 'time') && (
                    <>
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Séries</label>
                        <input type="number" className="w-full p-3 bg-white/50 rounded-2xl border border-white/30 text-center font-bold text-slate-700 focus:outline-none" placeholder="0" value={todayLog[ex.name]?.sets || ''} onChange={(e) => handleLogChange(ex.name, 'sets', e.target.value)} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">{ex.type === 'time' ? 'Sec/Min' : 'Reps'}</label>
                        <input type="number" className="w-full p-3 bg-white/50 rounded-2xl border border-white/30 text-center font-bold text-slate-700 focus:outline-none" placeholder="0" value={todayLog[ex.name]?.val || ''} onChange={(e) => handleLogChange(ex.name, 'val', e.target.value)} />
                      </div>
                    </>
                  )}
                  {ex.type === 'cardio' && (
                     <div className="flex-1 space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Minutes</label><input type="number" className="w-full p-3 bg-white/50 rounded-2xl border border-white/30 text-center font-bold text-slate-700 focus:outline-none" placeholder="0" value={todayLog[ex.name]?.val || ''} onChange={(e) => handleLogChange(ex.name, 'val', e.target.value)} /></div>
                  )}
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
      <button id="save-btn" onClick={saveWorkout} className={`w-full ${isAlreadySaved ? 'bg-orange-500 hover:bg-orange-600' : 'bg-slate-900 hover:bg-black'} text-white font-bold py-5 rounded-3xl shadow-xl flex justify-center items-center gap-3 transition-all active:scale-[0.98] border border-white/10`}>
        <Save size={20} /> {isAlreadySaved ? "METTRE À JOUR" : "ENREGISTRER LA SÉANCE"}
      </button>
    </div>
  );
};

const NutritionView = ({ todaysNutrition }) => (
    <div className="space-y-6 pb-24">
       <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/90 to-teal-600/90 backdrop-blur-md text-white p-6 shadow-2xl shadow-emerald-500/30 border border-white/20">
        <div className="absolute top-0 right-0 p-4 opacity-10"><Utensils size={100} /></div>
        <div className="relative z-10">
          <div className="text-emerald-100 text-sm font-medium tracking-wider mb-1 uppercase">Routine</div>
          <h2 className="text-3xl font-bold mb-1 tracking-tight">{todaysNutrition.title}</h2>
          <p className="text-emerald-50/90 font-light flex items-center gap-2 mb-4"><Zap size={14} fill="currentColor" /> {todaysNutrition.subtitle}</p>
        </div>
      </div>
      <div className="space-y-5">
        {todaysNutrition.meals.map((meal, idx) => {
            const Icon = meal.icon;
            if (meal.isFlexible) {
                return (
                    <GlassCard key={idx} className="relative overflow-hidden border-orange-200/50 bg-orange-50/30 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shadow-md"><Icon size={24} /></div><div><h3 className="font-bold text-xl text-slate-800">{meal.type}</h3><span className="text-xs font-bold bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full">{meal.calories}</span></div></div>
                        </div>
                        <div className="aspect-video mb-4 rounded-xl overflow-hidden bg-slate-200 shadow-inner"><img src="https://images.unsplash.com/photo-1512621404172-8d76d65c4002" alt="Plat Poulet Riz" className="w-full h-full object-cover" /></div>
                        <div className="space-y-4">
                            {meal.items.map((cat, i) => (
                                <div key={i} className="bg-white/50 rounded-xl p-3 border border-white/60"><h4 className="text-sm font-bold uppercase text-slate-600 mb-2 flex items-center gap-2"><span className="w-5 h-5 bg-orange-400 text-white rounded-full flex items-center justify-center text-xs font-black">{i + 1}</span>{cat.category}</h4><div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100/50">{cat.options.map((opt, k) => (<span key={k} className="text-sm font-semibold text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm flex-grow text-center">{opt}</span>))}</div></div>
                            ))}
                        </div>
                    </GlassCard>
                );
            }
            return (
                <GlassCard key={idx} className="relative overflow-hidden">
                    <div className="flex justify-between items-center mb-3"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm"><Icon size={20} /></div><div><h3 className="font-bold text-lg text-slate-800">{meal.type}</h3><span className="text-xs font-medium text-slate-500">{meal.calories}</span></div></div></div>
                    <ul className="space-y-2">{meal.items.map((item, i) => (<li key={i} className="flex justify-between items-center text-slate-700 font-medium bg-white/40 p-2 rounded-lg"><span>{item.name}</span><span className="text-sm font-bold text-blue-600">{item.qty}</span></li>))}</ul>
                </GlassCard>
            )
        })}
      </div>
    </div>
);

const StatsView = ({ history, user }) => {
    const completionData = history.map(entry => {
        return { date: entry.date.substring(5), percentage: 100 }; // Simplifié pour éviter crash
    });
    return (
      <div className="space-y-6 pb-24">
        <div className="flex items-end justify-between px-2"><div><h2 className="text-3xl font-bold text-slate-900 tracking-tight">Progression</h2><p className="text-slate-500 text-sm">Stats de {user}</p></div><div className="text-right"><div className="text-2xl font-bold text-blue-600">{history.length}</div><div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Séances</div></div></div>
        <GlassCard className="flex flex-col items-center justify-center py-12 text-center border-dashed border-2 border-slate-300/50 bg-white/30"><div className="bg-white p-4 rounded-full shadow-sm mb-4"><Activity className="text-slate-400" size={32} /></div><p className="text-slate-500 font-medium">Continue comme ça {user} !</p></GlassCard>
      </div>
    );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [history, setHistory] = useState([]);
  const [todayLog, setTodayLog] = useState({});
  const [user, setUser] = useState("Battosai"); 
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mascotQuote, setMascotQuote] = useState("");
  const [showMascotQuote, setShowMascotQuote] = useState(false);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const getStorageKey = () => `fitness_history_${user}`;
  const getDraftKey = () => `workout_draft_${user}_${currentDate.toISOString().split('T')[0]}`;

  useEffect(() => {
    const savedHistory = localStorage.getItem(getStorageKey());
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    else setHistory([]); 
    setMascotQuote(`Salut ${user} ! Prêt à tout casser ?`);
    setShowMascotQuote(true);
    setTimeout(() => setShowMascotQuote(false), 5000);
  }, [user]);

  useEffect(() => {
    const dateString = currentDate.toISOString().split('T')[0];
    const existingEntry = history.find(h => h.date === dateString);
    if (existingEntry) {
        const restoredLog = {};
        existingEntry.exercises.forEach(ex => { restoredLog[ex.name] = ex.performed; });
        setTodayLog(restoredLog);
    } else {
        const draft = localStorage.getItem(getDraftKey());
        setTodayLog(draft ? JSON.parse(draft) : {});
    }
  }, [currentDate, history, user]);

  useEffect(() => {
     if (Object.keys(todayLog).length > 0) {
         localStorage.setItem(getDraftKey(), JSON.stringify(todayLog));
     }
  }, [todayLog, currentDate, user]);

  const changeDate = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const currentDayIndex = currentDate.getDay(); 
  const todaysWorkout = PROGRAMME_SPORT[currentDayIndex];
  const todaysNutrition = DAILY_MEAL_PLAN;

  const triggerMascotQuote = () => {
    const quotes = ["Allez !", "Courage !", "Force !"];
    setMascotQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    setShowMascotQuote(true);
    setTimeout(() => { setShowMascotQuote(false); }, 8000);
  };

  const getGeminiAdvice = async () => {
    setLoadingAdvice(true);
    setTimeout(() => {
        setMascotQuote("Garde le dos bien droit ma poule !");
        setShowMascotQuote(true);
        setLoadingAdvice(false);
        setTimeout(() => setShowMascotQuote(false), 8000);
    }, 1500);
  };

  const handleLogChange = (exerciseName, field, value) => {
    setTodayLog(prev => ({
      ...prev,
      [exerciseName]: { ...prev[exerciseName], [field]: value }
    }));
  };

  const saveWorkout = async () => {
    const dateString = currentDate.toISOString().split('T')[0];
    const newEntry = {
      date: dateString,
      dayIndex: currentDayIndex,
      exercises: todaysWorkout?.exercises.map(ex => ({
        name: ex.name,
        target: ex.target,
        performed: todayLog[ex.name] || { done: false }
      }))
    };

    const newHistory = [...history.filter(h => h.date !== dateString), newEntry];
    setHistory(newHistory);
    localStorage.setItem(getStorageKey(), JSON.stringify(newHistory));
    localStorage.removeItem(getDraftKey());

    const btn = document.getElementById('save-btn');
    if(btn) { btn.innerHTML = "Sauvegardé !"; setTimeout(() => btn.innerHTML = "ENREGISTRER LA SÉANCE", 2000); }
    setMascotQuote(`Top ${user} ! C'est dans la boîte !`);
    setShowMascotQuote(true);
    setTimeout(() => setShowMascotQuote(false), 8000);
  };

  const currentUserConfig = USER_CONFIG[user] || USER_CONFIG["Invité"];

  return (
    <div className={`min-h-screen font-sans text-slate-800 relative overflow-hidden transition-colors duration-500 bg-slate-50`}>
        <Mascot showQuote={showMascotQuote} quote={mascotQuote} onClick={triggerMascotQuote} />
        
        <div className="fixed inset-0 -z-10 bg-slate-50 overflow-hidden">
             <div className={`absolute inset-0 bg-gradient-to-b ${currentUserConfig.theme === 'blue' ? 'from-blue-50/50 to-indigo-100/50' : 'from-emerald-50/50 to-teal-100/50'}`}></div>
        </div>
      
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-white/10 border-b border-white/20 px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 tracking-tight flex items-center gap-2">
           <span className="bg-blue-600 text-white rounded-lg p-1 shadow-lg shadow-blue-500/20"><Dumbbell size={16} /></span> {APP_TITLE}
        </h1>
        
        <div className="relative">
            <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="relative group flex items-center gap-2">
                <div className="text-right hidden sm:block">
                    <div className="text-xs font-bold text-slate-500">{currentUserConfig.label}</div>
                    <div className="text-sm font-bold text-slate-900 leading-none">{user}</div>
                </div>
                <img src={currentUserConfig.avatar} alt="Profil" className="w-10 h-10 rounded-full border-2 border-white shadow-lg object-cover bg-slate-200 transition-transform group-hover:scale-105" />
            </button>

            {showProfileMenu && (
                <div className="absolute right-0 top-14 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-2 z-50">
                    <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">Changer de compte</div>
                    {Object.keys(USER_CONFIG).map((u) => (
                        <button key={u} onClick={() => { setUser(u); setShowProfileMenu(false); }} className={`w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 transition-colors ${user === u ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-50 text-slate-600'}`}>
                            <img src={USER_CONFIG[u].avatar} className="w-6 h-6 rounded-full" alt="" />
                            <span>{u}</span>
                            {user === u && <CheckCircle2 size={16} className="ml-auto text-blue-500" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 pt-6 relative z-10">
        {activeTab === 'today' && <WorkoutView todaysWorkout={todaysWorkout} todayLog={todayLog} handleLogChange={handleLogChange} saveWorkout={saveWorkout} currentDate={currentDate} changeDate={changeDate} getGeminiAdvice={getGeminiAdvice} loadingAdvice={loadingAdvice} history={history} currentDayIndex={currentDayIndex} themeColor={currentUserConfig.theme} />}
        {activeTab === 'nutrition' && <NutritionView todaysNutrition={todaysNutrition} />}
        {activeTab === 'stats' && <StatsView history={history} user={user} />}
      </div>

      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[95%] max-w-sm z-30">
        <div className="bg-slate-900/80 backdrop-blur-2xl text-white rounded-full p-2 shadow-2xl shadow-slate-900/40 flex justify-between items-center border border-white/10">
            <button onClick={() => setActiveTab('today')} className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-full transition-all ${activeTab === 'today' ? 'bg-white/20 font-bold shadow-inner' : 'text-slate-400 hover:text-white'}`}><Activity size={20} /><span className="text-[10px]">Sport</span></button>
            <button onClick={() => setActiveTab('nutrition')} className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-full transition-all ${activeTab === 'nutrition' ? 'bg-white/20 font-bold shadow-inner' : 'text-slate-400 hover:text-white'}`}><Utensils size={20} /><span className="text-[10px]">Miam</span></button>
            <button onClick={() => setActiveTab('stats')} className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-full transition-all ${activeTab === 'stats' ? 'bg-white/20 font-bold shadow-inner' : 'text-slate-400 hover:text-white'}`}><TrendingUp size={20} /><span className="text-[10px]">Stats</span></button>
        </div>
      </div>
    </div>
  );
};

export default App;