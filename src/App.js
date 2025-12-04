import React, { useState, useEffect } from 'react';
// IMPORTANT : On utilise la vraie authentification Firebase pour que tes données ne disparaissent plus
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, query, onSnapshot, doc, updateDoc, orderBy } from "firebase/firestore";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, TrendingUp, Save, CheckCircle2, Dumbbell, ChevronRight, ChevronLeft, Zap, Info, Utensils, Coffee, Moon, ArrowRightLeft, Sparkles, Loader2, ChefHat } from 'lucide-react';

// --- CONFIGURATION FIREBASE (Laisse comme ça, Netlify gère les clés) ---
// ATTENTION : Si ça plante en local, il faudra remettre tes clés temporairement.
const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG || '{}');
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const apiKey = process.env.REACT_APP_GEMINI_API_KEY || ""; 

// --- CITATIONS DE DAXTER ---
const DAXTER_QUOTES = [
  "Wow ! T'es une vraie bête ! Même les Metal Heads auraient peur de toi !",
  "Allez hop hop hop ! On se bouge le fessier, héros !",
  "C'est tout ce que t'as ? Je suis sûr que tu peux faire mieux !",
  "Joli mouvement ! Presque aussi gracieux que moi... presque.",
  "Hé ! Si tu continues comme ça, tu vas finir par sauver le monde !",
  "On lâche rien ! Pense à la pile d'énergie qui t'attend à la fin !",
  "T'as vu ces muscles ? Fais gaffe, tu vas craquer ton t-shirt !",
  "Bien joué ! Maintenant, on va manger ? J'ai faim moi !",
  "Regarde-moi cette forme olympique ! T'es prêt pour l'Arène !"
];

// --- PROGRAMME SPORT (AVEC LES VRAIS GIFs CORRIGÉS) ---
const PROGRAMME_SPORT = {
  1: { 
    title: "Haut du corps & Abdos",
    subtitle: "Focus Haltères",
    exercises: [
      // GIFs corrigés pour correspondre à chaque exercice
      { name: "Shoulder Press (Haltères)", type: "reps", target: "4 x 10-12", volume: 48, desc: "Assis/debout. Pousse les haltères au-dessus de la tête.", img: "https://media.giphy.com/media/3o7TjqCSr0f96w3K5q/giphy.gif" },
      { name: "Rowing un bras", type: "reps", target: "4 x 12 / côté", volume: 48, desc: "Genou sur banc, dos plat. Tire le coude vers le haut.", img: "https://media.giphy.com/media/10006Z2u7L1Wc/giphy.gif" },
      { name: "Curl Biceps", type: "reps", target: "3 x 12", volume: 36, desc: "Coudes serrés au corps. Contracte les biceps.", img: "https://media.giphy.com/media/H4DjXQXamtTiIuCcRu/giphy.gif" },
      { name: "Triceps derrière la tête", type: "reps", target: "3 x 12", volume: 36, desc: "Haltère à deux mains derrière la nuque. Extension vers le ciel.", img: "https://media.giphy.com/media/xT9Igwe1F5Xg7q6sDe/giphy.gif" },
      { name: "Planche", type: "time", target: "3 x 45-60 sec", volume: 3, desc: "Gainage statique sur les avant-bras.", img: "https://media.giphy.com/media/xT8qBff8cKDDRGTWlW/giphy.gif" }, 
      { name: "Relevés de jambes", type: "reps", target: "3 x 12-15", volume: 45, desc: "Dos au sol, lève les jambes tendues.", img: "https://media.giphy.com/media/3o6Zxp7eG5WnQo64Tu/giphy.gif" }
    ]
  },
  2: { 
    title: "Bas du corps & Gainage",
    subtitle: "Haltères Lourds",
    exercises: [
      { name: "Squat Haltères", type: "reps", target: "4 x 12", volume: 48, desc: "Haltères aux épaules ou mains. Fesses en arrière, dos droit.", img: "https://media.giphy.com/media/12h4r12uD9eKli/giphy.gif" },
      { name: "Fentes Haltères", type: "reps", target: "3 x 12 / jambe", volume: 36, desc: "Grand pas en avant, genou arrière frôle le sol.", img: "https://media.giphy.com/media/3o7qDQ4kcSD1PLM3BK/giphy.gif" },
      { name: "Soulevé de terre (Jambes tendues)", type: "reps", target: "3 x 12", volume: 36, desc: "Dos plat, penche-toi en avant, sens l'étirement des ischios.", img: "https://media.giphy.com/media/p8wLy6i3OEI1i/giphy.gif" },
      { name: "Hip Thrust Haltères", type: "reps", target: "3 x 15", volume: 45, desc: "Dos sur banc, poids sur le bassin. Monte les fesses.", img: "https://media.giphy.com/media/l41Yy4J96X8ehz8xG/giphy.gif" },
      { name: "Planche Latérale", type: "time", target: "2 x 30-40 sec / côté", volume: 2, desc: "Sur le côté, bassin haut et aligné.", img: "https://media.giphy.com/media/xT8qBff8cKDDRGTWlW/giphy.gif" }
    ]
  },
  3: { 
    title: "HIIT + Corde",
    subtitle: "Cardio Intensif",
    exercises: [
      { name: "Corde à sauter", type: "cardio", target: "15-20 min", volume: 20, desc: "Rythme soutenu pour faire monter le cardio.", img: "https://media.giphy.com/media/l0HlPtbGpcnqa0fja/giphy.gif" },
      { name: "Circuit : Burpees", type: "reps", target: "3 tours : 12 reps", volume: 36, desc: "Squat, planche, pompe, saut. Explosif !", img: "https://media.giphy.com/media/26BkNHX097r61A1uE/giphy.gif" },
      // Correction du GIF Mountain Climbers
      { name: "Circuit : Mountain Climbers", type: "time", target: "3 tours : 30 sec", volume: 3, desc: "Position pompe, cours sur place.", img: "https://media.giphy.com/media/l0HlI6NdcrtKbXAkE/giphy.gif" },
      { name: "Circuit : Squat Jumps", type: "reps", target: "3 tours : 12 reps", volume: 36, desc: "Squat + saut à la remontée.", img: "https://media.giphy.com/media/12h4r12uD9eKli/giphy.gif" },
      { name: "Circuit : Sprint sur place", type: "time", target: "3 tours : 30 sec", volume: 3, desc: "Genoux hauts, à fond !", img: "https://media.giphy.com/media/3o7qDEq2lvneUAtWc8/giphy.gif" }
    ]
  },
  4: { 
    title: "Full Body Haltères",
    subtitle: "Mobilité & Renfo",
    exercises: [
      { name: "Rowing Haltères", type: "reps", target: "3 x 12", volume: 36, desc: "Buste penché, tire les deux haltères ensemble.", img: "https://media.giphy.com/media/10006Z2u7L1Wc/giphy.gif" },
      { name: "Squat Haltères", type: "reps", target: "3 x 12", volume: 36, desc: "Contrôle bien la descente.", img: "https://media.giphy.com/media/12h4r12uD9eKli/giphy.gif" },
      { name: "Développé Épaules", type: "reps", target: "3 x 10", volume: 30, desc: "Pousse vers le ciel sans cambrer.", img: "https://media.giphy.com/media/3o7TjqCSr0f96w3K5q/giphy.gif" },
      { name: "Curl Biceps", type: "reps", target: "2 x 12", volume: 24, desc: "Mouvement propre.", img: "https://media.giphy.com/media/H4DjXQXamtTiIuCcRu/giphy.gif" },
      { name: "Triceps", type: "reps", target: "2 x 12", volume: 24, desc: "Extension au dessus de la tête ou kickback.", img: "https://media.giphy.com/media/xT9Igwe1F5Xg7q6sDe/giphy.gif" },
      { name: "Étirements + Mobilité", type: "cardio", target: "10 min", volume: 10, desc: "Récupération active, étirements.", img: "https://media.giphy.com/media/l0HlI6NdcrtKbXAkE/giphy.gif" }
    ]
  },
  5: { 
    title: "Abdos + Core + Cardio",
    subtitle: "Sangle abdominale",
    exercises: [
      { name: "Relevés de jambes", type: "reps", target: "4 x 12-15", volume: 60, desc: "Contrôle la descente.", img: "https://media.giphy.com/media/3o6Zxp7eG5WnQo64Tu/giphy.gif" },
      { name: "Crunch inversé", type: "reps", target: "3 x 15", volume: 45, desc: "Ramène genoux vers poitrine, décolle le bassin.", img: "https://media.giphy.com/media/3o6Zxp7eG5WnQo64Tu/giphy.gif" },
      { name: "Russian Twist (avec haltère)", type: "reps", target: "3 x 20", volume: 60, desc: "Rotation du buste avec un poids.", img: "https://media.giphy.com/media/3o6Zxp7eG5WnQo64Tu/giphy.gif" },
      { name: "Planche", type: "time", target: "3 x 1 min", volume: 3, desc: "Reste solide.", img: "https://media.giphy.com/media/xT8qBff8cKDDRGTWlW/giphy.gif" },
      { name: "Mountain Climbers", type: "time", target: "2 x 40 sec", volume: 2, desc: "Rythme rapide.", img: "https://media.giphy.com/media/l0HlI6NdcrtKbXAkE/giphy.gif" },
      { name: "Cardio Finition", type: "cardio", target: "15-20 min", volume: 20, desc: "Vélo ou marche rapide.", img: "https://media.giphy.com/media/l0HlPtbGpcnqa0fja/giphy.gif" }
    ]
  },
  6: { 
    title: "Gros Cardio",
    subtitle: "Brûle-graisse",
    exercises: [
      { name: "Vélo ou Corde/Vélo", type: "cardio", target: "40-60 min", volume: 60, desc: "Zone d'endurance fondamentale.", img: "https://media.giphy.com/media/l0HlPtbGpcnqa0fja/giphy.gif" }
    ]
  },
  0: { 
    title: "HIIT Léger + Rappel",
    subtitle: "Finition Semaine",
    exercises: [
      { name: "HIIT", type: "time", target: "10-15 min", volume: 15, desc: "Court mais intense.", img: "https://media.giphy.com/media/l0HlPtbGpcnqa0fja/giphy.gif" },
      { name: "Rowing", type: "reps", target: "2 x 12", volume: 24, desc: "Rappel dos.", img: "https://media.giphy.com/media/10006Z2u7L1Wc/giphy.gif" },
      { name: "Curl", type: "reps", target: "2 x 12", volume: 24, desc: "Rappel biceps.", img: "https://media.giphy.com/media/H4DjXQXamtTiIuCcRu/giphy.gif" },
      { name: "Épaules", type: "reps", target: "2 x 10", volume: 20, desc: "Rappel épaules.", img: "https://media.giphy.com/media/3o7TjqCSr0f96w3K5q/giphy.gif" },
      { name: "Abdos", type: "time", target: "5 min", volume: 5, desc: "Libre.", img: "https://media.giphy.com/media/3o6Zxp7eG5WnQo64Tu/giphy.gif" }
    ]
  }
};

// --- NUTRITION ---
const DAILY_MEAL_PLAN = {
  title: "Routine 2500 kcal",
  subtitle: "Collation + Grand Dîner",
  meals: [
    { type: "Collation (16h)", icon: Coffee, calories: "~500 kcal", items: [{ name: "Fromage Blanc", qty: "300g" }, { name: "Muesli / Avoine", qty: "50g" }, { name: "Fruit", qty: "1 pièce" }, { name: "Oléagineux", qty: "1 poignée" }] },
    { type: "Le Grand Dîner", icon: Moon, calories: "~2000 kcal", isFlexible: true, items: [{ category: "Féculents", options: ["Riz (125g cru)", "Pâtes (125g cru)", "PDT (400g)", "Quinoa (125g cru)"] }, { category: "Protéines", options: ["Viande (200g)", "Poisson (200g)", "Oeufs (4-5)"] }, { category: "Légumes", options: ["Légumes verts (300g)", "Salade", "Poêlée"] }, { category: "Compléments", details: "Obligatoire pour les kcal :", options: ["2 c.à.s Huile/Beurre", "Avocat/Fromage", "Dessert"] }] }
  ]
};

// --- COMPOSANTS ---

const GlassCard = ({ children, className = "" }) => (
  <div className={`bg-white/40 backdrop-blur-xl border border-white/40 shadow-lg rounded-3xl p-5 ${className}`}>
    {children}
  </div>
);

const Mascot = ({ showQuote, quote, onClick }) => {
  // RETOUR DE LA VRAIE IMAGE DE DAXTER
  const daxterImg = "https://static.wikia.nocookie.net/fiction1/images/e/ef/Daxter.png/revision/latest?cb=20140817123401"; 
  return (
    <div className="fixed bottom-48 right-2 z-50 flex flex-col items-end pointer-events-none">
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        .mascot-container { animation: float 4s ease-in-out infinite; }
      `}</style>
      <div className={`bg-white text-slate-900 p-4 rounded-3xl rounded-br-sm shadow-2xl border-2 border-slate-900 max-w-[200px] mb-[-5px] mr-12 transition-all duration-500 transform ${showQuote ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-75'} origin-bottom-right pointer-events-auto relative z-20`}>
        <p className="text-sm font-bold font-sans leading-tight">"{quote}"</p>
      </div>
      <div onClick={onClick} className="relative w-40 h-40 cursor-pointer pointer-events-auto flex flex-col items-center justify-end group">
        <img src={daxterImg} alt="Mascotte" className="w-full h-full object-contain mascot-container transition-transform group-hover:scale-110" onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x200/orange/white?text=DAXTER"; }} />
        <div className="w-20 h-3 bg-black rounded-[100%] blur-sm mt-[-8px] opacity-20"></div>
      </div>
    </div>
  );
};

const WorkoutView = ({ todaysWorkout, todayLog, handleLogChange, saveWorkout, currentDate, changeDate, getGeminiAdvice, loadingAdvice, history, currentDayIndex }) => {
  const [infoOpen, setInfoOpen] = useState(null);

  const getLastSessionStats = (exerciseName) => {
    // On cherche la dernière session pour CE jour de la semaine (ex: dernier Jeudi)
    const relevantHistory = history.filter(h => h.dayIndex === currentDayIndex && h.date !== currentDate.toISOString().split('T')[0]);
    if (relevantHistory.length === 0) return null;
    
    // On prend la plus récente
    const lastSession = relevantHistory[relevantHistory.length - 1];
    const lastExData = lastSession.exercises.find(e => e.name === exerciseName);
    
    if (lastExData && lastExData.performed && (lastExData.performed.sets || lastExData.performed.val)) {
        return `${lastExData.performed.sets || '?'} x ${lastExData.performed.val || '?'}`;
    }
    return null;
  };

  const isAlreadySaved = history.some(h => h.date === currentDate.toISOString().split('T')[0]);

  return (
    <div className="space-y-6 pb-24">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/90 to-indigo-700/90 backdrop-blur-md text-white p-6 shadow-2xl shadow-blue-500/30 border border-white/20">
        <div className="absolute top-0 right-0 p-4 opacity-10"><Dumbbell size={100} /></div>
        <div className="relative z-10">
          
          <div className="flex items-center justify-between mb-4 bg-white/20 rounded-xl p-2 backdrop-blur-sm">
            <button onClick={() => changeDate(-1)} className="p-2 hover:bg-white/20 rounded-lg transition-colors"><ChevronLeft size={20} /></button>
            <div className="text-center">
                <div className="text-xs font-medium text-blue-200 uppercase tracking-wider">Date</div>
                <div className="font-bold text-lg capitalize">
                    {currentDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
            </div>
            <button onClick={() => changeDate(1)} className="p-2 hover:bg-white/20 rounded-lg transition-colors"><ChevronRight size={20} /></button>
          </div>

          <div className="text-blue-200 text-sm font-medium tracking-wider mb-1 uppercase">Entraînement</div>
          <h2 className="text-3xl font-bold mb-1 tracking-tight">{todaysWorkout.title}</h2>
          <p className="text-blue-100/90 font-light mb-4">{todaysWorkout.subtitle}</p>
          
          <button onClick={getGeminiAdvice} disabled={loadingAdvice} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all border border-white/20">
            {loadingAdvice ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {loadingAdvice ? "Daxter réfléchit..." : "Demander conseil à Daxter"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {todaysWorkout.exercises.map((ex, idx) => {
          const isDone = todayLog[ex.name]?.done;
          const isInfoOpen = infoOpen === idx;
          const lastStats = getLastSessionStats(ex.name);
          
          return (
            <GlassCard key={idx} className={`transition-all duration-300 ${isDone ? 'bg-green-50/50 border-green-200/50 ring-1 ring-green-400/30' : ''}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2">
                      <h3 className={`font-bold text-lg ${isDone ? 'text-green-900' : 'text-slate-800'}`}>{ex.name}</h3>
                      <button onClick={() => setInfoOpen(isInfoOpen ? null : idx)} className={`p-1 rounded-full transition-colors ${isInfoOpen ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:text-blue-500'}`}><Info size={18} /></button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/40 text-slate-600 text-xs font-medium border border-white/20">
                        <Zap size={10} className={isDone ? 'text-green-600' : 'text-blue-600'} /> {ex.target}
                    </div>
                    {lastStats && (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100/50 text-orange-700 text-xs font-bold border border-orange-200/50">
                            <TrendingUp size={10} /> Préc: {lastStats}
                        </div>
                    )}
                  </div>
                </div>
                <button onClick={() => handleLogChange(ex.name, 'done', !isDone)} className={`p-2 rounded-full transition-colors ${isDone ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-white/50 text-slate-500 hover:bg-white'}`}><CheckCircle2 size={22} /></button>
              </div>

              {isInfoOpen && (
                  <div className="mb-4 mt-2 bg-white/60 rounded-xl p-3 border border-white/50 shadow-inner">
                      <div className="aspect-video bg-slate-200 rounded-lg mb-3 overflow-hidden shadow-sm relative">
                          <img src={ex.img} alt={ex.name} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-sm text-slate-700 font-medium">{ex.desc}</p>
                  </div>
              )}

              <div className={`transition-all duration-500 overflow-hidden ${isDone ? 'max-h-0 opacity-50' : 'max-h-32 opacity-100'}`}>
                <div className="flex gap-3 items-center mt-2">
                  {(ex.type === 'reps' || ex.type === 'time') && (
                    <>
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Séries</label>
                        <input 
                            type="number" 
                            autoComplete="off"
                            className="w-full p-3 bg-white/50 rounded-2xl border border-white/30 text-center font-bold text-slate-700 focus:ring-2 focus:ring-blue-400 focus:outline-none" 
                            placeholder="0" 
                            value={todayLog[ex.name]?.sets || ''} 
                            onChange={(e) => handleLogChange(ex.name, 'sets', e.target.value)} 
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">{ex.type === 'time' ? 'Sec/Min' : 'Reps'}</label>
                        <input 
                            type="number" 
                            autoComplete="off"
                            className="w-full p-3 bg-white/50 rounded-2xl border border-white/30 text-center font-bold text-slate-700 focus:ring-2 focus:ring-blue-400 focus:outline-none" 
                            placeholder="0" 
                            value={todayLog[ex.name]?.val || ''} 
                            onChange={(e) => handleLogChange(ex.name, 'val', e.target.value)} 
                        />
                      </div>
                    </>
                  )}
                  {ex.type === 'cardio' && (
                     <div className="flex-1 space-y-1">
                     <label className="text-[10px] font-bold text-slate-500 uppercase">Minutes</label>
                     <input 
                        type="number" 
                        autoComplete="off"
                        className="w-full p-3 bg-white/50 rounded-2xl border border-white/30 text-center font-bold text-slate-700 focus:ring-2 focus:ring-blue-400 focus:outline-none" 
                        placeholder="0" 
                        value={todayLog[ex.name]?.val || ''} 
                        onChange={(e) => handleLogChange(ex.name, 'val', e.target.value)} 
                     />
                   </div>
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

const NutritionView = ({ todaysNutrition, getGeminiRecipe, loadingRecipe, generatedRecipe }) => (
    <div className="space-y-6 pb-24">
       <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/90 to-teal-600/90 backdrop-blur-md text-white p-6 shadow-2xl shadow-emerald-500/30 border border-white/20">
        <div className="absolute top-0 right-0 p-4 opacity-10"><Utensils size={100} /></div>
        <div className="relative z-10">
          <div className="text-emerald-100 text-sm font-medium tracking-wider mb-1 uppercase">Routine Quotidienne</div>
          <h2 className="text-3xl font-bold mb-1 tracking-tight">{todaysNutrition.title}</h2>
          <p className="text-emerald-50/90 font-light flex items-center gap-2 mb-4">
             <Zap size={14} fill="currentColor" /> {todaysNutrition.subtitle}
          </p>
          <button onClick={getGeminiRecipe} disabled={loadingRecipe} className="flex items-center gap-2 bg-emerald-700/30 hover:bg-emerald-700/50 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all border border-emerald-400/30">
            {loadingRecipe ? <Loader2 size={16} className="animate-spin" /> : <ChefHat size={16} />}
            {loadingRecipe ? "Création en cours..." : "Générer une recette avec l'IA"}
          </button>
        </div>
      </div>
      {generatedRecipe && (
          <div className="animate-fade-in bg-white/80 p-5 rounded-3xl border-2 border-emerald-100 shadow-xl">
              <h3 className="font-bold text-emerald-800 text-lg flex items-center gap-2 mb-2">
                  <Sparkles size={18} className="text-yellow-500" /> Suggestion du Chef
              </h3>
              <div className="text-slate-700 text-sm whitespace-pre-line leading-relaxed">
                  {generatedRecipe}
              </div>
          </div>
      )}
      <div className="space-y-5">
        {todaysNutrition.meals.map((meal, idx) => {
            const Icon = meal.icon;
            if (meal.isFlexible) {
                return (
                    <GlassCard key={idx} className="relative overflow-hidden border-orange-200/50 bg-orange-50/30">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shadow-md">
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-slate-800">{meal.type}</h3>
                                    <span className="text-xs font-bold bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full">{meal.calories}</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {meal.items.map((cat, i) => (
                                <div key={i} className="bg-white/50 rounded-xl p-3 border border-white/60">
                                    <h4 className="text-xs font-bold uppercase text-slate-400 mb-2 flex items-center gap-1">
                                        <ArrowRightLeft size={10} /> {cat.category}
                                    </h4>
                                    {cat.details && <p className="text-xs text-red-500 font-medium mb-1">{cat.details}</p>}
                                    <div className="flex flex-wrap gap-2">
                                        {cat.options.map((opt, k) => (
                                            <span key={k} className="text-sm font-semibold text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm flex-grow text-center">
                                                {opt}
                                            </span>
                                        ))}
                                    </div>
                                    {i < meal.items.length - 1 && cat.category !== "Compléments (Pour atteindre 2000 kcal)" && (
                                         <div className="text-[10px] text-center text-slate-400 font-bold mt-2 -mb-1">CHOISIR 1 OPTION</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                );
            }
            return (
                <GlassCard key={idx} className="relative overflow-hidden">
                    <div className="flex justify-between items-center mb-3">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                                <Icon size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">{meal.type}</h3>
                                <span className="text-xs font-medium text-slate-500">{meal.calories}</span>
                            </div>
                        </div>
                    </div>
                    <ul className="space-y-2">
                        {meal.items.map((item, i) => (
                            <li key={i} className="flex justify-between items-center text-slate-700 font-medium bg-white/40 p-2 rounded-lg">
                                <span>{item.name}</span>
                                <span className="text-sm font-bold text-blue-600">{item.qty}</span>
                            </li>
                        ))}
                    </ul>
                </GlassCard>
            )
        })}
      </div>
    </div>
);

const StatsView = ({ history }) => {
    const completionData = history.map(entry => {
        const workoutDay = PROGRAMME_SPORT[entry.dayIndex];
        let totalExpectedVolume = 0;
        let totalPerformedVolume = 0;

        workoutDay.exercises.forEach(ex => {
            if (ex.volume) {
                totalExpectedVolume += ex.volume;
            }
        });

        entry.exercises.forEach(ex => {
            const planEx = workoutDay.exercises.find(e => e.name === ex.name);
            if (planEx && planEx.volume && ex.performed) {
                if (planEx.type === 'cardio' || planEx.type === 'time') {
                    const val = parseInt(ex.performed.val) || 0;
                    totalPerformedVolume += Math.min(val, planEx.volume);
                } 
                else if (planEx.type === 'reps') {
                    const sets = parseInt(ex.performed.sets) || 0;
                    const reps = parseInt(ex.performed.val) || 0;
                    const currentVol = sets * reps;
                    totalPerformedVolume += Math.min(currentVol, planEx.volume);
                }
            }
        });

        const percentage = totalExpectedVolume > 0 ? Math.round((totalPerformedVolume / totalExpectedVolume) * 100) : 0;
        
        return { 
            date: entry.date.substring(5), 
            percentage: percentage 
        };
    });

    return (
      <div className="space-y-6 pb-24">
        <div className="flex items-end justify-between px-2">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Progression</h2>
                <p className="text-slate-500 text-sm">Qualité de tes séances</p>
            </div>
            <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{history.length}</div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Séances</div>
            </div>
        </div>
        
        {history.length === 0 ? (
            <GlassCard className="flex flex-col items-center justify-center py-12 text-center border-dashed border-2 border-slate-300/50 bg-white/30">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4"><Activity className="text-slate-400" size={32} /></div>
                <p className="text-slate-500 font-medium">En attente de ta première séance...</p>
            </GlassCard>
        ) : (
            <>
                <GlassCard className="h-72">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Taux de réussite (%)</h3>
                    <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={completionData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                        <YAxis domain={[0, 100]} hide />
                        <Tooltip 
                            cursor={{fill: 'transparent'}}
                            contentStyle={{borderRadius: '16px', border: 'none', background: 'rgba(255,255,255,0.9)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} 
                            formatter={(value) => [`${value}%`, 'Complétion']}
                        />
                        <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                            {
                              completionData.map((entry, index) => (
                                <cell key={`cell-${index}`} fill={entry.percentage >= 100 ? '#22c55e' : entry.percentage >= 75 ? '#3b82f6' : '#f97316'} />
                              ))
                            }
                        </Bar>
                    </BarChart>
                    </ResponsiveContainer>
                </GlassCard>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-100 p-4 rounded-2xl flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-green-600">100%</span>
                        <span className="text-xs text-green-800 font-medium">Objectif</span>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-2xl flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-blue-600">
                            {completionData.length > 0 ? Math.round(completionData.reduce((a, b) => a + b.percentage, 0) / completionData.length) : 0}%
                        </span>
                        <span className="text-xs text-blue-800 font-medium">Moyenne</span>
                    </div>
                </div>
            </>
        )}
      </div>
    );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [history, setHistory] = useState([]);
  const [todayLog, setTodayLog] = useState({});
  // IMPORTANT : 'user' contiendra désormais les infos de l'utilisateur connecté
  const [user, setUser] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [mascotQuote, setMascotQuote] = useState("");
  const [showMascotQuote, setShowMascotQuote] = useState(false);
  const [loadingRecipe, setLoadingRecipe] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  // --- GESTION DE L'AUTHENTIFICATION (C'est ça qui règle le problème de données) ---
  useEffect(() => {
    // On écoute si l'utilisateur est connecté ou pas
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Si connecté, on garde ses infos
        setUser(currentUser);
        triggerMascotQuote();
      } else {
        // Si pas connecté, on le connecte anonymement pour commencer
        signInAnonymously(auth).catch((error) => {
           console.error("Erreur de connexion anonyme:", error);
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // --- CHARGEMENT DE L'HISTORIQUE DEPUIS LA VRAIE BASE DE DONNÉES ---
  useEffect(() => {
    if (!user) return; // On attend d'être connecté

    // On va chercher les données dans le dossier de CE user spécifique
    // On trie par date pour que l'affichage soit correct
    const q = query(collection(db, 'users', user.uid, 'workouts'), orderBy('date', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHistory(data);
    }, (error) => console.error("Erreur de chargement de l'historique:", error));
    return () => unsubscribe();
  }, [user]);

  // --- RESTAURATION INTELLIGENTE (Base de données > Brouillon local) ---
  useEffect(() => {
    const dateString = currentDate.toISOString().split('T')[0];
    // On regarde si une séance existe déjà pour ce jour dans l'historique chargé
    const existingEntry = history.find(h => h.date === dateString);
    
    if (existingEntry) {
        // Si oui, on affiche les données enregistrées
        const restoredLog = {};
        existingEntry.exercises.forEach(ex => {
            restoredLog[ex.name] = ex.performed;
        });
        setTodayLog(restoredLog);
    } else {
        // Sinon, on regarde s'il y a un brouillon non sauvegardé
        const draft = localStorage.getItem(`workout_draft_${dateString}`);
        if (draft) {
             setTodayLog(JSON.parse(draft));
        } else {
             setTodayLog({});
        }
    }
  }, [currentDate, history]);

  // --- SAUVEGARDE AUTO DU BROUILLON ---
  useEffect(() => {
     const dateString = currentDate.toISOString().split('T')[0];
     if (Object.keys(todayLog).length > 0) {
         localStorage.setItem(`workout_draft_${dateString}`, JSON.stringify(todayLog));
     }
  }, [todayLog, currentDate]);

  const changeDate = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const currentDayIndex = currentDate.getDay(); 
  const todaysWorkout = PROGRAMME_SPORT[currentDayIndex];
  const todaysNutrition = DAILY_MEAL_PLAN;

  const triggerMascotQuote = () => {
    const randomQuote = DAXTER_QUOTES[Math.floor(Math.random() * DAXTER_QUOTES.length)];
    setMascotQuote(randomQuote);
    setShowMascotQuote(true);
    setTimeout(() => { setShowMascotQuote(false); }, 8000);
  };

  const callGeminiText = async (prompt) => {
    if (!apiKey) {
        console.warn("Clé API Gemini manquante.");
        return "Désolé, mon cerveau IA n'est pas connecté !";
    }
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
      );
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (error) {
      console.error("Gemini Text Error:", error);
      return "Oups, petit bug dans la matrice !";
    }
  };

  const getGeminiRecipe = async () => {
    setLoadingRecipe(true);
    const ingredients = todaysNutrition.meals[1].items.map(cat => cat.category + ": " + cat.options.join(", ")).join("; ");
    const prompt = `Agis comme un chef cuisinier sportif un peu décalé. En utilisant les ingrédients : "${ingredients}", invente une recette saine pour ce soir. Donne un titre fun et les étapes. Réponds en français.`;
    const result = await callGeminiText(prompt);
    if (result) {
        setGeneratedRecipe(result);
        setMascotQuote("Miam ! J'ai demandé au Chef IA une recette spéciale !");
        setShowMascotQuote(true);
        setTimeout(() => setShowMascotQuote(false), 5000);
    }
    setLoadingRecipe(false);
  };

  const getGeminiAdvice = async () => {
    setLoadingAdvice(true);
    const workoutSummary = todaysWorkout.exercises.map(ex => ex.name).join(", ");
    const prompt = `Tu es Daxter (voix de Mark Lesser). CONTEXTE : Ton pote va faire cette séance : ${workoutSummary}. RÈGLE ABSOLUE : NE FAIS PAS LA LISTE DES EXERCICES. TA MISSION : Choisis UN SEUL mouvement et donne un conseil technique de pro. STYLE : Hystérique, drôle, utilise "Ma poule", "L'ami". Court (max 2 phrases).`;
    const result = await callGeminiText(prompt);
    if (result) {
        setMascotQuote(result);
        setShowMascotQuote(true);
        setTimeout(() => setShowMascotQuote(false), 8000);
    }
    setLoadingAdvice(false);
  };

  const handleLogChange = (exerciseName, field, value) => {
    setTodayLog(prev => ({
      ...prev,
      [exerciseName]: { ...prev[exerciseName], [field]: value }
    }));
  };

  // --- SAUVEGARDE DANS LA VRAIE BASE DE DONNÉES ---
  const saveWorkout = async () => {
    if (!user) {
        alert("Erreur : Tu n'es pas connecté. Rafraîchis la page.");
        return;
    }

    const dateString = currentDate.toISOString().split('T')[0];
    const newEntry = {
      date: dateString,
      dayIndex: currentDayIndex,
      exercises: todaysWorkout.exercises.map(ex => ({
        name: ex.name,
        target: ex.target,
        performed: todayLog[ex.name] || { done: false }
      }))
    };

    try {
        // On regarde si une séance existe déjà pour ce jour
        const existingEntry = history.find(h => h.date === dateString);

        if (existingEntry) {
            // MISE À JOUR : On modifie l'existant
            // On utilise l'ID du document existant
            await updateDoc(doc(db, 'users', user.uid, 'workouts', existingEntry.id), newEntry);
            const btn = document.getElementById('save-btn');
            if(btn) { btn.innerHTML = "Mis à jour !"; setTimeout(() => btn.innerHTML = "METTRE À JOUR", 2000); }
        } else {
            // NOUVELLE SAUVEGARDE : On crée un nouveau document
            // On enregistre dans le dossier personnel de l'utilisateur
            await addDoc(collection(db, 'users', user.uid, 'workouts'), newEntry);
            const btn = document.getElementById('save-btn');
            if(btn) { btn.innerHTML = "Sauvegardé !"; setTimeout(() => btn.innerHTML = "ENREGISTRER LA SÉANCE", 2000); }
        }
        
        // IMPORTANT : On vide le brouillon local une fois que c'est sécurisé dans le cloud
        localStorage.removeItem(`workout_draft_${dateString}`);
        
        const prompt = "Incarne Daxter (style Mark Lesser). Félicite le joueur pour sa séance. Sois explosif ! 'Yesss !'. (Max 1 phrase)";
        const congrats = await callGeminiText(prompt);
        setMascotQuote(congrats || "Yesss ! Bien joué ma poule ! C'est dans la boîte !");
        setShowMascotQuote(true);
        setTimeout(() => setShowMascotQuote(false), 8000);
    } catch (error) { 
        console.error("Erreur de sauvegarde:", error);
        alert("Oups, la sauvegarde a échoué. Vérifie ta connexion.");
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-blue-200 text-slate-800 relative overflow-hidden">
        <Mascot showQuote={showMascotQuote} quote={mascotQuote} onClick={triggerMascotQuote} />
        
        <style>{`
            @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
            .animate-blob { animation: blob 7s infinite; }
            .animation-delay-2000 { animation-delay: 2s; }
            .animation-delay-4000 { animation-delay: 4s; }
        `}</style>
        <div className="fixed inset-0 -z-10 bg-slate-50 overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-indigo-100/50"></div>
             <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob"></div>
             <div className="absolute top-0 -right-4 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-2000"></div>
             <div className="absolute -bottom-32 left-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-4000"></div>
        </div>
      
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-white/10 border-b border-white/20 px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 tracking-tight flex items-center gap-2">
           <span className="bg-blue-600 text-white rounded-lg p-1 shadow-lg shadow-blue-500/20"><Dumbbell size={16} /></span> BATTOSAI
        </h1>
        {/* Icône de profil avec la belette Daxter */}
        <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg border-2 border-white/50 bg-orange-100">
             <img src="https://static.wikia.nocookie.net/fiction1/images/e/ef/Daxter.png/revision/latest?cb=20140817123401" alt="Profil" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 pt-6 relative z-10">
        {activeTab === 'today' && <WorkoutView 
            todaysWorkout={todaysWorkout} 
            todayLog={todayLog} 
            handleLogChange={handleLogChange} 
            saveWorkout={saveWorkout} 
            currentDate={currentDate}
            changeDate={changeDate}
            getGeminiAdvice={getGeminiAdvice}
            loadingAdvice={loadingAdvice}
            history={history}
            currentDayIndex={currentDayIndex}
        />}
        {activeTab === 'nutrition' && <NutritionView 
            todaysNutrition={todaysNutrition}
            getGeminiRecipe={getGeminiRecipe}
            loadingRecipe={loadingRecipe}
            generatedRecipe={generatedRecipe}
        />}
        {activeTab === 'stats' && <StatsView history={history} />}
      </div>

      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[95%] max-w-sm z-30">
        <div className="bg-slate-900/80 backdrop-blur-2xl text-white rounded-full p-2 shadow-2xl shadow-slate-900/40 flex justify-between items-center border border-white/10">
            <button onClick={() => setActiveTab('today')} className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-full transition-all ${activeTab === 'today' ? 'bg-white/20 font-bold shadow-inner' : 'text-slate-400 hover:text-white'}`}>
                <Activity size={20} /> <span className="text-[10px]">Sport</span>
            </button>
            <button onClick={() => setActiveTab('nutrition')} className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-full transition-all ${activeTab === 'nutrition' ? 'bg-white/20 font-bold shadow-inner' : 'text-slate-400 hover:text-white'}`}>
                <Utensils size={20} /> <span className="text-[10px]">Miam</span>
            </button>
            <button onClick={() => setActiveTab('stats')} className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-full transition-all ${activeTab === 'stats' ? 'bg-white/20 font-bold shadow-inner' : 'text-slate-400 hover:text-white'}`}>
                <TrendingUp size={20} /> <span className="text-[10px]">Stats</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default App;