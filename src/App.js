import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, Save, CheckCircle2, Dumbbell, ChevronRight, ChevronLeft, Zap, Info, Utensils, Coffee, Moon, Sparkles, Loader2, ChefHat, User, Flame } from 'lucide-react';

// ==========================================
// 1. CONFIGURATION & IMAGES
// ==========================================
const APP_TITLE = "BATTOSAI";

// TES IMAGES (Liens directs fiables)
const AVATARS = {
  sensei: "https://i.imgur.com/Qj2pFgY.png", // Ton image à toi
  daxter: "https://i.imgur.com/h592WqJ.png", // Mascotte Daxter
  invite: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
};

// ==========================================
// 2. DONNÉES DU PROGRAMME (Descriptions Détaillées)
// ==========================================
const PROGRAMME_SPORT = {
  1: { 
    title: "Haut du corps & Abdos", subtitle: "Focus Hypertrophie", color: "from-blue-500 to-indigo-600",
    exercises: [
      { 
        name: "Shoulder Press", target: "4 x 10-12", 
        desc: "Assieds-toi sur un banc avec le dossier à 90°. Pousse les haltères verticalement sans les faire s'entrechoquer en haut. Contrôle la descente jusqu'à ce que les haltères soient au niveau des oreilles. Garde les coudes légèrement vers l'avant.", 
        img: "https://media.giphy.com/media/3o7TjqCSr0f96w3K5q/giphy.gif" 
      },
      { 
        name: "Rowing Unilatéral", target: "4 x 12 / côté", 
        desc: "Genou et main en appui sur le banc. Le dos doit être plat comme une table. Tire la charge vers ta hanche (pas vers l'épaule) en serrant l'omoplate. Relâche doucement vers le sol pour étirer le grand dorsal.", 
        img: "https://media.giphy.com/media/10006Z2u7L1Wc/giphy.gif" 
      },
      { 
        name: "Curl Biceps", target: "3 x 12", 
        desc: "Debout, pieds largeur bassin. Garde les coudes VISSSÉS aux côtes. Monte l'haltère en rotation (supination) et contracte fort en haut. Redescends en 2 secondes. Ne balance pas le buste !", 
        img: "https://media.giphy.com/media/H4DjXQXamtTiIuCcRu/giphy.gif" 
      },
      { 
        name: "Extensions Triceps", target: "3 x 12", 
        desc: "Haltère tenu à deux mains derrière la nuque. Garde les coudes serrés près de la tête. Tends les bras vers le plafond. C'est l'exercice roi pour la longue portion du triceps.", 
        img: "https://media.giphy.com/media/xT9Igwe1F5Xg7q6sDe/giphy.gif" 
      },
      { 
        name: "Gainage Planche", target: "3 x 45-60s", 
        desc: "En appui sur les avant-bras. Rentre le ventre (aspire le nombril). Contracte les fessiers et les cuisses. Ton corps doit former une ligne droite parfaite. Respire calmement.", 
        img: "https://media.giphy.com/media/xT8qBff8cKDDRGTWlW/giphy.gif" 
      }
    ]
  },
  2: { 
    title: "Bas du corps", subtitle: "Jambes & Puissance", color: "from-orange-500 to-red-600",
    exercises: [
      { 
        name: "Squat Haltères", target: "4 x 12", 
        desc: "Pieds largeur d'épaules, pointes légèrement vers l'extérieur. Descends les fesses en arrière comme pour t'asseoir sur une chaise invisible. Garde le buste fier et le regard loin devant.", 
        img: "https://media.giphy.com/media/12h4r12uD9eKli/giphy.gif" 
      },
      { 
        name: "Fentes", target: "3 x 12 / jambe", 
        desc: "Fais un grand pas. Descends verticalement jusqu'à ce que le genou arrière frôle le sol. Le poids est sur le talon avant. Pousse fort pour revenir en position initiale.", 
        img: "https://media.giphy.com/media/3o7qDQ4kcSD1PLM3BK/giphy.gif" 
      },
      { 
        name: "Soulevé de Terre (RDL)", target: "3 x 12", 
        desc: "Jambes semi-tendues. Pousse les fesses loin derrière en longeant tes cuisses avec les haltères. Sens l'étirement intense derrière les cuisses. Remonte en contractant les fessiers.", 
        img: "https://media.giphy.com/media/p8wLy6i3OEI1i/giphy.gif" 
      },
      { 
        name: "Hip Thrust", target: "3 x 15", 
        desc: "Le meilleur pour les fessiers. Haut du dos sur le banc, poids sur le bassin. Monte les hanches vers le plafond jusqu'à l'alignement complet. Contracte 1 seconde en haut.", 
        img: "https://media.giphy.com/media/l41Yy4J96X8ehz8xG/giphy.gif" 
      }
    ]
  },
  3: { 
    title: "HIIT & Cardio", subtitle: "Brûle Graisse", color: "from-emerald-500 to-teal-600",
    exercises: [
      { name: "Corde à sauter", target: "20 min", desc: "Rebondis sur la pointe des pieds. Garde les coudes près du corps, ce sont les poignets qui tournent.", img: "https://media.giphy.com/media/l0HlPtbGpcnqa0fja/giphy.gif" },
      { name: "Burpees", target: "3 x 12", desc: "Squat, planche, pompe (optionnelle), ramène les pieds, saut ! C'est dur, mais c'est ça qui marche.", img: "https://media.giphy.com/media/26BkNHX097r61A1uE/giphy.gif" },
      { name: "Mountain Climbers", target: "3 x 45s", desc: "En position pompe, cours sur place en ramenant les genoux vers la poitrine. Garde le dos plat, ne monte pas les fesses !", img: "https://media.giphy.com/media/26BkN7ZJggJ8YQ9uE/giphy.gif" },
      { name: "Sprint sur place", target: "3 x 30s", desc: "Monte les genoux le plus haut possible. Utilise tes bras pour la cadence. Donne tout !", img: "https://media.giphy.com/media/3o7qDEq2lvneUAtWc8/giphy.gif" }
    ]
  },
  4: { title: "Full Body", subtitle: "Rappel Global", color: "from-violet-500 to-purple-600", exercises: [{ name: "Rowing", target: "3x12", desc: "Dos.", img: "" }, { name: "Squat", target: "3x12", desc: "Jambes.", img: "" }, { name: "Curl", target: "3x12", desc: "Bras.", img: "" }] }, // Simplifié pour l'exemple
  5: { title: "Abdos & Cardio", subtitle: "Finition", color: "from-pink-500 to-rose-600", exercises: [{ name: "Crunch", target: "3x20", desc: "Abdos.", img: "" }] },
  6: { title: "Gros Cardio", subtitle: "Endurance", color: "from-cyan-500 to-blue-600", exercises: [{ name: "Vélo", target: "45 min", desc: "Zone 2.", img: "" }] },
  0: { title: "Repos", subtitle: "Récupération", color: "from-slate-500 to-gray-600", exercises: [{ name: "Dormir", target: "8h", desc: "Zzz.", img: "" }] }
};

// --- NUTRITION ( inchangé ) ---
const DAILY_MEAL_PLAN = {
  title: "Diète 2500 kcal", subtitle: "Objectif Masse Propre",
  meals: [
    { type: "Collation (16h)", icon: Coffee, calories: "~500 kcal", items: [{ name: "Fromage Blanc", qty: "300g" }, { name: "Muesli / Avoine", qty: "50g" }, { name: "Fruit", qty: "1 pièce" }, { name: "Oléagineux", qty: "1 poignée" }] },
    { type: "Le Grand Dîner", icon: Moon, calories: "~2000 kcal", isFlexible: true, items: [{ category: "Féculents", options: ["Riz (125g)", "Pâtes (125g)", "PDT (400g)"] }, { category: "Protéines", options: ["Viande (200g)", "Poisson (200g)", "Oeufs (4-5)"] }, { category: "Légumes", options: ["Légumes verts", "Salade"] }] }
  ]
};

// ==========================================
// 3. COMPOSANTS (DESIGN AMÉLIORÉ)
// ==========================================

const GlassCard = ({ children, className = "", onClick, colorBorder = "border-white/40" }) => (
  <div onClick={onClick} className={`bg-white/60 backdrop-blur-xl border ${colorBorder} shadow-lg shadow-slate-200/50 rounded-3xl p-5 ${className} transition-all duration-300 hover:shadow-xl hover:scale-[1.01]`}>
    {children}
  </div>
);

const Mascot = ({ showQuote, quote, onClick }) => (
  <div className="fixed bottom-24 right-2 z-50 flex flex-col items-end pointer-events-none">
    <div className={`bg-slate-900 text-white p-4 rounded-2xl rounded-br-none shadow-2xl border-2 border-white/20 max-w-[200px] mb-2 mr-4 transition-all duration-500 transform ${showQuote ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90'} pointer-events-auto`}>
      <p className="text-xs font-bold leading-relaxed">"{quote}"</p>
    </div>
    <div onClick={onClick} className="relative w-32 h-32 cursor-pointer pointer-events-auto hover:scale-110 transition-transform duration-300">
      <img src={AVATARS.daxter} alt="Daxter" className="w-full h-full object-contain drop-shadow-2xl" />
    </div>
  </div>
);

const WorkoutView = ({ todaysWorkout, todayLog, handleLogChange, saveWorkout, currentDate, changeDate, getGeminiAdvice, loadingAdvice, history, themeColor }) => {
  const [infoOpen, setInfoOpen] = useState(null);
  
  // Couleur dynamique selon le jour
  const gradientClass = todaysWorkout?.color || "from-blue-600 to-indigo-700";

  return (
    <div className="space-y-6 pb-28">
      {/* HEADER DU JOUR AVEC COULEUR DYNAMIQUE */}
      <div className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${gradientClass} text-white p-6 shadow-2xl shadow-blue-900/20`}>
        <div className="absolute top-0 right-0 p-4 opacity-20"><Dumbbell size={120} /></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => changeDate(-1)} className="p-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition"><ChevronLeft size={20} /></button>
            <div className="text-center">
                <div className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Aujourd'hui</div>
                <div className="text-xl font-black capitalize">{currentDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric' })}</div>
            </div>
            <button onClick={() => changeDate(1)} className="p-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition"><ChevronRight size={20} /></button>
          </div>
          
          <div className="mb-6">
            <h2 className="text-3xl font-black leading-tight mb-1">{todaysWorkout?.title || "Repos"}</h2>
            <div className="flex items-center gap-2 opacity-90"><Activity size={16} /> <span className="font-medium">{todaysWorkout?.subtitle || "Récupération"}</span></div>
          </div>

          <button onClick={getGeminiAdvice} disabled={loadingAdvice} className="w-full flex justify-center items-center gap-2 bg-white text-slate-900 px-4 py-3 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all active:scale-95">
            {loadingAdvice ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} className="text-amber-500" />}
            {loadingAdvice ? "Daxter réfléchit..." : "Demander conseil à Daxter"}
          </button>
        </div>
      </div>

      {/* LISTE DES EXERCICES */}
      <div className="space-y-4">
        {todaysWorkout?.exercises.map((ex, idx) => {
          const isDone = todayLog[ex.name]?.done;
          const isOpen = infoOpen === idx;
          
          return (
            <div key={idx} className={`relative bg-white rounded-3xl p-1 shadow-sm border border-slate-100 transition-all duration-300 ${isDone ? 'opacity-60 grayscale-[0.5]' : 'hover:shadow-md'}`}>
              {/* Barre de couleur latérale */}
              <div className={`absolute left-0 top-6 bottom-6 w-1 rounded-r-full bg-gradient-to-b ${gradientClass}`}></div>
              
              <div className="p-4 pl-5">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-slate-800 leading-tight">{ex.name}</h3>
                        <button onClick={() => setInfoOpen(isOpen ? null : idx)} className="text-slate-400 hover:text-blue-500 transition"><Info size={18} /></button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg flex items-center gap-1"><Zap size={10} /> {ex.target}</span>
                    </div>
                  </div>
                  <button onClick={() => handleLogChange(ex.name, 'done', !isDone)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isDone ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-300 hover:bg-slate-200'}`}>
                    <CheckCircle2 size={24} />
                  </button>
                </div>

                {/* ZONE D'INFORMATION (GIF + DESC) */}
                {isOpen && (
                    <div className="mt-4 mb-4 bg-slate-50 rounded-2xl p-3 border border-slate-100 animate-in fade-in slide-in-from-top-2">
                        {ex.img && (
                            <div className="aspect-video rounded-xl overflow-hidden bg-white shadow-sm mb-3">
                                <img src={ex.img} alt={ex.name} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">{ex.desc}</p>
                    </div>
                )}

                {/* INPUTS */}
                <div className={`grid grid-cols-2 gap-3 mt-3 transition-all duration-300 ${isDone ? 'opacity-50' : ''}`}>
                    <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Séries</label>
                        <input type="number" placeholder="0" className="w-full bg-white rounded-lg p-2 text-center font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100" value={todayLog[ex.name]?.sets || ''} onChange={(e) => handleLogChange(ex.name, 'sets', e.target.value)} />
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">{ex.type === 'time' ? 'Secondes' : 'Répétitions'}</label>
                        <input type="number" placeholder="0" className="w-full bg-white rounded-lg p-2 text-center font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100" value={todayLog[ex.name]?.val || ''} onChange={(e) => handleLogChange(ex.name, 'val', e.target.value)} />
                    </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button id="save-btn" onClick={saveWorkout} className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-900/20 flex justify-center items-center gap-3 transition-all active:scale-[0.98]">
        <Save size={20} /> ENREGISTRER LA SÉANCE
      </button>
    </div>
  );
};

// --- COMPOSANTS NUTRITION & STATS (Simplifiés pour tenir) ---
const NutritionView = ({ todaysNutrition }) => (
    <div className="space-y-6 pb-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Utensils size={100} /></div>
            <h2 className="text-3xl font-black relative z-10">{todaysNutrition.title}</h2>
        </div>
        {todaysNutrition.meals.map((meal, idx) => (
            <GlassCard key={idx}>
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><div className="p-2 bg-orange-100 text-orange-600 rounded-full"><meal.icon size={18} /></div> {meal.type}</h3>
                <div className="space-y-2">{meal.items.map((it, i) => <div key={i} className="flex justify-between text-sm bg-white/50 p-2 rounded-lg"><span>{it.category || it.name}</span><span className="font-bold">{it.qty || "Choix"}</span></div>)}</div>
            </GlassCard>
        ))}
    </div>
);

const StatsView = ({ history }) => (
    <div className="space-y-6 pb-24">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black text-slate-800 mb-1">Ta Progression</h2>
            <p className="text-slate-500 mb-6">Continue comme ça Battosai !</p>
            <div className="h-64 flex items-end justify-center gap-2">
                {history.slice(-7).map((h, i) => (
                    <div key={i} className="w-full bg-blue-100 rounded-t-xl relative group">
                        <div className="absolute bottom-0 w-full bg-blue-600 rounded-t-xl transition-all duration-500" style={{height: '100%'}}></div>
                        <div className="absolute -bottom-6 w-full text-center text-[10px] text-slate-400">{h.date.slice(8)}</div>
                    </div>
                ))}
                {history.length === 0 && <div className="text-slate-400 italic">Pas encore de données...</div>}
            </div>
        </div>
    </div>
);

// ==========================================
// 4. MAIN APP
// ==========================================
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

  // --- LOGIQUE SAUVEGARDE LOCALE ---
  const getStorageKey = () => `fitness_history_${user}`;
  const getDraftKey = () => `workout_draft_${user}_${currentDate.toISOString().split('T')[0]}`;

  useEffect(() => {
    const saved = localStorage.getItem(getStorageKey());
    setHistory(saved ? JSON.parse(saved) : []);
    setMascotQuote(`Salut ${user} ! Prêt à tout casser ?`);
    setShowMascotQuote(true);
    setTimeout(() => setShowMascotQuote(false), 4000);
  }, [user]);

  useEffect(() => {
    const dateStr = currentDate.toISOString().split('T')[0];
    const draft = localStorage.getItem(getDraftKey());
    const existing = history.find(h => h.date === dateStr);
    
    if (existing) {
        const restored = {};
        existing.exercises.forEach(ex => restored[ex.name] = ex.performed);
        setTodayLog(restored);
    } else {
        setTodayLog(draft ? JSON.parse(draft) : {});
    }
  }, [currentDate, history, user]);

  useEffect(() => {
     if (Object.keys(todayLog).length > 0) localStorage.setItem(getDraftKey(), JSON.stringify(todayLog));
  }, [todayLog, currentDate, user]);

  const changeDate = (d) => { const n = new Date(currentDate); n.setDate(n.getDate() + d); setCurrentDate(n); };
  const handleLogChange = (name, field, val) => setTodayLog(prev => ({ ...prev, [name]: { ...prev[name], [field]: val } }));

  const saveWorkout = () => {
    const dateStr = currentDate.toISOString().split('T')[0];
    const newEntry = {
      date: dateStr, dayIndex: currentDate.getDay(),
      exercises: PROGRAMME_SPORT[currentDate.getDay()]?.exercises.map(ex => ({
        name: ex.name, target: ex.target, performed: todayLog[ex.name] || { done: false }
      })) || []
    };
    const newHist = [...history.filter(h => h.date !== dateStr), newEntry];
    setHistory(newHist);
    localStorage.setItem(getStorageKey(), JSON.stringify(newHist));
    localStorage.removeItem(getDraftKey());
    
    const btn = document.getElementById('save-btn');
    if(btn) { btn.innerHTML = "Validé !"; setTimeout(() => btn.innerHTML = "ENREGISTRER", 2000); }
    setMascotQuote("Yesss ! Bien joué Sensei !");
    setShowMascotQuote(true);
    setTimeout(() => setShowMascotQuote(false), 3000);
  };

  const getGeminiAdvice = () => {
      setLoadingAdvice(true);
      setTimeout(() => {
          setMascotQuote("Concentre-toi sur la contraction en haut du mouvement !");
          setShowMascotQuote(true);
          setLoadingAdvice(false);
          setTimeout(() => setShowMascotQuote(false), 5000);
      }, 1500);
  };

  const currentUser = USER_CONFIG[user];

  return (
    <div className="min-h-screen font-sans text-slate-800 bg-slate-50 pb-10">
        <Mascot showQuote={showMascotQuote} quote={mascotQuote} onClick={() => setMascotQuote("Gogogo !")} />
        
        {/* HEADER FIXE */}
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
            <div className="max-w-md mx-auto relative flex justify-center items-center">
                {/* TITRE CENTRÉ */}
                <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 tracking-tighter italic">
                    {APP_TITLE}
                </h1>
                
                {/* BOUTON PROFIL ABSOLU À DROITE */}
                <div className="absolute right-0">
                    <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="relative">
                        <img src={currentUser.avatar} alt="Profil" className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover bg-slate-200" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </button>
                    
                    {showProfileMenu && (
                        <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 animate-in fade-in zoom-in-95">
                            {Object.keys(USER_CONFIG).map((u) => (
                                <button key={u} onClick={() => { setUser(u); setShowProfileMenu(false); }} className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 text-sm font-bold ${user === u ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-600'}`}>
                                    <User size={16} /> {u}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* CONTENU PRINCIPAL */}
        <div className="max-w-md mx-auto p-4 pt-6">
            {activeTab === 'today' && <WorkoutView todaysWorkout={PROGRAMME_SPORT[currentDate.getDay()]} todayLog={todayLog} handleLogChange={handleLogChange} saveWorkout={saveWorkout} currentDate={currentDate} changeDate={changeDate} getGeminiAdvice={getGeminiAdvice} loadingAdvice={loadingAdvice} history={history} themeColor={currentUser.theme} />}
            {activeTab === 'nutrition' && <NutritionView todaysNutrition={DAILY_MEAL_PLAN} />}
            {activeTab === 'stats' && <StatsView history={history} />}
        </div>

        {/* BARRE DE NAVIGATION FLOTTANTE */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-sm z-40">
            <div className="bg-slate-900/90 backdrop-blur-xl text-white rounded-2xl p-2 shadow-2xl flex justify-between items-center border border-white/10">
                <button onClick={() => setActiveTab('today')} className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${activeTab === 'today' ? 'bg-white/20 shadow-inner text-white' : 'text-slate-400 hover:text-white'}`}><Activity size={20} /><span className="text-[10px] font-bold">Sport</span></button>
                <button onClick={() => setActiveTab('nutrition')} className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${activeTab === 'nutrition' ? 'bg-white/20 shadow-inner text-white' : 'text-slate-400 hover:text-white'}`}><Utensils size={20} /><span className="text-[10px] font-bold">Miam</span></button>
                <button onClick={() => setActiveTab('stats')} className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${activeTab === 'stats' ? 'bg-white/20 shadow-inner text-white' : 'text-slate-400 hover:text-white'}`}><TrendingUp size={20} /><span className="text-[10px] font-bold">Stats</span></button>
            </div>
        </div>
    </div>
  );
};

export default App;