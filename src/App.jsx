import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import emailjs from '@emailjs/browser';
import { Gamepad2, Loader2, LogOut, Send, Mail, User, Star, StarHalf, MessageSquare, Eye, Camera, Plus, Edit3, Heart, Trophy, Activity, Flame, Search, TrendingUp, Calendar, RefreshCcw, ShieldCheck, Trash2, Pencil, X, CheckCircle, AlertTriangle, AlertCircle, Sparkles, Clock, ArrowRight, Newspaper, Medal } from 'lucide-react';

// ==========================================
// 1. CONFIGURATION (SUDAH BENAR)
// ==========================================
const supabaseUrl = 'https://trawoiknxpbwlbfpmcqj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyYXdvaWtueHBid2xiZnBtY3FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2OTA4MzksImV4cCI6MjA4MDI2NjgzOX0.zL_x2AtuEVGuvQtRRtckU9Egt3DD6e474SyQdZDboIQ';

const EMAILJS_SERVICE_ID = 'service_ad4lxv1';   
const EMAILJS_TEMPLATE_ID = 'template_5zdxbr8'; 
const EMAILJS_PUBLIC_KEY = 'wm7dSNwy4wH7rvib3';     

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- HELPER COMPONENTS ---
const ToastContainer = ({ toasts, removeToast }) => (
  <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
    {toasts.map((toast) => (
      <div key={toast.id} className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl border pointer-events-auto animate-in slide-in-from-right duration-300 ${toast.type === 'success' ? 'bg-[#1e2328] border-emerald-500/50 text-emerald-400' : toast.type === 'error' ? 'bg-[#2a1515] border-red-500/50 text-red-400' : 'bg-[#1e2328] border-blue-500/50 text-blue-400'}`}>
        {toast.type === 'success' && <CheckCircle size={20} />} {toast.type === 'error' && <AlertCircle size={20} />} {toast.type === 'info' && <Activity size={20} />}
        <div><h4 className="font-bold text-sm">{toast.title}</h4><p className="text-xs opacity-90">{toast.message}</p></div>
        <button onClick={() => removeToast(toast.id)} className="ml-4 hover:text-white transition"><X size={16}/></button>
      </div>
    ))}
  </div>
);

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#1e2328] border border-gray-700 p-6 rounded-xl w-full max-w-sm shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4 text-red-500"><div className="bg-red-500/20 p-2 rounded-full"><AlertTriangle size={24} /></div><h3 className="text-xl font-bold text-white">{title}</h3></div>
        <p className="text-gray-400 mb-6 text-sm leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end"><button onClick={onCancel} className="px-4 py-2 text-gray-400 hover:text-white font-bold text-sm transition">Cancel</button><button onClick={onConfirm} className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-lg font-bold text-sm shadow-lg transition">Yes, Delete</button></div>
      </div>
    </div>
  );
};

const StarRatingDisplay = ({ rating, size = 12 }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<Star key={i} size={size} className="fill-emerald-500 text-emerald-500" />);
    else if (rating >= i - 0.5) stars.push(<StarHalf key={i} size={size} className="fill-emerald-500 text-emerald-500" />);
    else stars.push(<Star key={i} size={size} className="text-gray-700" />);
  }
  return <div className="flex gap-0.5">{stars}</div>;
};

const StarRatingInput = ({ value, onChange }) => {
  const [hoverValue, setHoverValue] = useState(0);
  const handleMouseMove = (e, starIndex) => { if ((e.clientX - e.currentTarget.getBoundingClientRect().left) < e.currentTarget.getBoundingClientRect().width / 2) setHoverValue(starIndex - 0.5); else setHoverValue(starIndex); };
  const displayValue = hoverValue || value;
  return (
    <div className="flex gap-1" onMouseLeave={() => setHoverValue(0)}>
      {[1, 2, 3, 4, 5].map((index) => {
        let StarIcon = Star, className = "text-gray-600";
        if (displayValue >= index) className = "fill-emerald-500 text-emerald-500"; else if (displayValue >= index - 0.5) { StarIcon = StarHalf; className = "fill-emerald-500 text-emerald-500"; }
        return <div key={index} className="cursor-pointer transition-transform hover:scale-110" onMouseMove={(e) => handleMouseMove(e, index)} onClick={() => onChange(hoverValue)}><StarIcon size={32} className={className} /></div>;
      })}
      <span className="ml-3 text-2xl font-bold text-white w-10">{displayValue > 0 ? displayValue : "?"}</span>
    </div>
  );
};

// --- DATABASE ---
const GAMES_DB = [
  { id: 101, title: "Baldur's Gate 3", year: "2023", category: "trending", image: "https://m.exophase.com/steam/games/o/50edge.png?a0ee9cf765b1df5cb91fbbdd6b54b77b", rating: 4.9 },
  { id: 102, title: "Metaphor Re:Fantazio", year: "2023", category: "trending", image: "https://gameranx.com/wp-content/uploads/2024/04/Metaphor-ReFantazio-1-2048x2048.jpg", rating: 4.0 },
  { id: 103, title: "Clair Obscur", year: "2023", category: "trending", image: "https://cdn.wccftech.com/wp-content/uploads/2024/06/clair-obscur-expedition-33-HD-scaled.jpg", rating: 4.8 },
  { id: 104, title: "Hollow Knight: Silksong", year: "2023", category: "trending", image: "https://tse4.mm.bing.net/th/id/OIP.bjhMDK_gEWLjNoYV-qvP8wHaHa?rs=1&pid=ImgDetMain&o=7&rm=3", rating: 4.9 },
  { id: 105, title: "Death Stranding 2", year: "2023", category: "trending", image: "https://www.gamerevolution.com/wp-content/uploads/sites/2/2024/02/co7p8z.jpg?resize=94", rating: 4.7 },
  { id: 201, title: "Blue Prince", year: "2024", category: "indie", image: "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2024/12/mixcollage-14-dec-2024-12-20-pm-9626.jpg" },
  { id: 202, title: "Clair Obscur", year: "2017", category: "indie", image: "https://cdn.wccftech.com/wp-content/uploads/2024/06/clair-obscur-expedition-33-HD-scaled.jpg" },
  { id: 203, title: "Despolete", year: "2018", category: "indie", image: "https://cdn1.epicgames.com/spt-assets/3b1fb15048164ce48c85581c42a6b713/despelote-lvvk1.jpg" },
  { id: 204, title: "Dispatch", year: "2016", category: "indie", image: "https://m.media-amazon.com/images/M/MV5BNzIwNmZjYWUtOWIzNC00YTNhLWE3YmEtNzcyM2EzMjhkZmZhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
  { id: 301, title: "GTA VI", year: "2025", category: "upcoming", image: "https://images7.alphacoders.com/133/1335660.jpeg" },
  { id: 302, title: "The Witcher 4", year: "2025", category: "upcoming", image: "https://cdn.wccftech.com/wp-content/uploads/2025/06/Ciri_The_Witcher_4_Demo-scaled.jpeg" },
  { id: 303, title: "Resident Evil Requiem", year: "2025", category: "upcoming", image: "https://mp1st.com/wp-content/uploads/2025/06/Resident_Evil_Requiem_image_1_1920x1080.jpg" },
  { id: 401, title: "Mobile Legends: Bang Bang", year: "2015", category: "classic", image: "https://assets.dearplayers.com/products/channels4_profile_689b95c8_thumbnail_4096_365ee0e3.jpg" },
  { id: 402, title: "Red Dead 2", year: "2018", category: "classic", image: "https://wallpaperaccess.com/full/7051250.jpg" },
  { id: 403, title: "God of War", year: "2018", category: "classic", image: "https://cdn1.epicgames.com/offer/3ddd6a590da64e3686042d108968a6b2/EGS_GodofWar_SantaMonicaStudio_S2_1200x1600-fbdf3cbc2980749091d52751ffabb7b7_1200x1600-fbdf3cbc2980749091d52751ffabb7b7" },
  { id: 404, title: "The Last of Us", year: "2013", category: "classic", image: "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2022/09/last-of-us-box-art.jpg" },
  { id: 1, title: "It Takes Two", year: "2021", category: "classic", image: "https://image.api.playstation.com/vulcan/ap/rnd/202012/0815/7CRynuLSAb0vysSC4TmZy5e4.png" },
  { id: 2, title: "Cyberpunk 2077", year: "2020", category: "classic", image: "https://static1.srcdn.com/wordpress/wp-content/uploads/2022/12/cyberpunk-2077-game-poster.jpg" },
];

const RECENT_REVIEWS_GLOBAL = [
  { id: 901, user: "KojimaFan", avatar: "https://i.pravatar.cc/150?u=1", game: "Death Stranding", rating: 4.5, text: "A masterpiece of walking simulation. Connects us all.", image: "https://buycheapplaycheap.com/wp-content/uploads/2020/08/Death-Stranding-4.jpg" },
  { id: 902, user: "BabekaStore", avatar: "https://i.pravatar.cc/150?u=4", game: "Donkey Kong: Bananza", rating: 5, text: "Fun but short. Platforming perfection as always.", image: "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2025/04/donkey-kong-bananza-tag-page-cover-art.jpg" },
  { id: 903, user: "LetMeSoloHer", avatar: "https://i.pravatar.cc/150?u=8", game: "Elden Ring", rating: 5, text: "I am Malenia, blade of Miquella.", image: "https://tse4.mm.bing.net/th/id/OIP.GfgECo85QIPS6Y-jW8_kWgHaLH?rs=1&pid=ImgDetMain&o=7&rm=3" },
];

const NEWS_DATA = [
  { id: 1, title: "The Game Awards 2025 Nominees Announced", category: "Event", image: "https://cdn.thegameawards.com/frontend/jpegs/media-kit-1-2023.jpg", source: "IGN", desc: "A tight race between GTA VI and Monster Hunter Wilds for GOTY." },
  { id: 2, title: "Discover the new Steam Machine", category: "Hardware", image: "https://www.canirunthegame.com/wp-content/uploads/2025/11/Steam-Machine-Specs-Features-System-Requirements-2025.jpg", source: "Steam", desc: "Powerful PC Gaming made easy, in a small and mighty package." },
  { id: 3, title: "Hollow Knight: Silksong Finally Gets Release Window", category: "Indie", image: "https://gmedia.playstation.com/is/image/SIEPDC/hollow-night-silksong-key-art-ps5-01jul25?$native$", source: "Kotaku", desc: "Team Cherry confirms the long-awaited sequel is coming late 2025." },
];

// ==========================================
// 2. LOGIN PAGE (FIXED REDIRECT URL)
// ==========================================
function LoginPage({ addToast }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [captchaCode, setCaptchaCode] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  const generateCaptcha = () => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < 6; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    setCaptchaCode(result);
    setCaptchaInput("");
  };

  useEffect(() => { generateCaptcha(); }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (captchaInput.toUpperCase() !== captchaCode) { addToast("Access Denied", "Incorrect Captcha.", "error"); generateCaptcha(); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: { 
        // --- SUDAH DIPERBAIKI KE LINK FRONTLOG ---
        emailRedirectTo: 'https://harioct.github.io/frontlog/' 
      },
    });
    if (error) addToast("Login Failed", error.message, "error"); else { setSent(true); addToast("Magic Link Sent", "Check your email.", "success"); }
    setLoading(false);
  };

  if (sent) return (
    <div className="min-h-screen bg-[#14181c] flex items-center justify-center px-4 text-center">
      <div className="bg-[#1e2328] p-8 rounded-lg border border-gray-700 shadow-2xl animate-in zoom-in">
        <Send className="text-emerald-500 w-12 h-12 mx-auto mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold text-white mb-2">Check Your Inbox</h2>
        <p className="text-gray-400">Magic Link sent to {email}</p>
        <button onClick={() => setSent(false)} className="mt-6 text-emerald-500 underline">Go Back</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#14181c] flex items-center justify-center px-4 relative overflow-hidden font-sans">
       <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2070" 
            alt="Background" 
            className="w-full h-full object-cover object-center opacity-10" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#14181c]/10 to-[#14181c]/80"></div>
       </div>

      <div className="bg-[#1e2328]/95 backdrop-blur-md p-10 rounded-xl shadow-2xl w-full max-w-md border border-gray-700 z-10">
        <div className="text-center mb-8">
          <Gamepad2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white">Frontlog</h2>
          <p className="text-gray-400 mt-2 text-sm uppercase tracking-widest">Track. Rate. Share.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2"><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</label><input type="email" required className="w-full bg-[#2c3440] border border-gray-600 text-white rounded-lg py-3 px-4 focus:border-emerald-500 outline-none" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} /></div>
          <div className="bg-[#14181c] p-4 rounded-lg border border-gray-700">
             <label className="flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-widest mb-3"><ShieldCheck size={14} /> Security Check</label>
             <div className="flex flex-col gap-3">
                <div className="relative w-full h-16 bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border border-emerald-500/30 rounded flex items-center justify-center select-none overflow-hidden group"><div className="absolute inset-0 opacity-20" style={{backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "10px 10px"}}></div><span className="text-3xl font-serif italic font-bold text-white tracking-[0.5em] group-hover:scale-110 transition-transform" style={{textShadow: "2px 2px 4px rgba(0,0,0,0.8)"}}>{captchaCode}</span><button type="button" onClick={generateCaptcha} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-emerald-400 hover:text-white transition bg-black/20 rounded-full" title="Refresh Captcha"><RefreshCcw size={16} /></button></div>
                <input type="text" required className="w-full bg-[#2c3440] border border-gray-600 text-white rounded py-2 px-4 text-center font-bold tracking-widest uppercase focus:border-emerald-500 outline-none placeholder-gray-600" placeholder="TYPE THE CODE" value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} maxLength={6} />
             </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all">{loading ? <Loader2 className="animate-spin" /> : "Sign In"}</button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 3. DASHBOARD
// ==========================================
function Dashboard({ session, addToast }) {
  const [activeTab, setActiveTab] = useState('home'); 
  
  // INIT STATE FROM METADATA
  const meta = session.user.user_metadata || {};
  const [username, setUsername] = useState(meta.username || "");
  const [bio, setBio] = useState(meta.bio || "Just a gamer.");
  const [avatar, setAvatar] = useState(meta.avatar || null);
  const [cover, setCover] = useState(meta.cover || "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80");
  const [favorites, setFavorites] = useState(meta.favorites || [null, null, null, null]);
  const [userLog, setUserLog] = useState(meta.userLog || {}); 
  const [wishlist, setWishlist] = useState(meta.wishlist || []);
  
  // MODALS STATE
  const [isSetupOpen, setIsSetupOpen] = useState(!meta.username);
  const [selectedGame, setSelectedGame] = useState(null); 
  const [pickerMode, setPickerMode] = useState(null); 
  const [tempName, setTempName] = useState("");
  const [inputRating, setInputRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  
  const [isEditBioOpen, setIsEditBioOpen] = useState(false);
  const [isEditNameOpen, setIsEditNameOpen] = useState(false);
  const [tempBio, setTempBio] = useState(bio);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState("");

  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const hasSentRef = useRef(false);

  const updateMetadata = async (updates) => {
    const { error } = await supabase.auth.updateUser({ data: updates });
    if (error) console.error("Save failed:", error);
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { 
        const result = reader.result;
        if (type === 'avatar') { setAvatar(result); updateMetadata({ avatar: result }); }
        if (type === 'cover') { setCover(result); updateMetadata({ cover: result }); }
      };
      reader.readAsDataURL(file);
      addToast("Image Updated", `Your ${type} has been changed.`, "success");
    }
  };

  const handleSaveLog = (game, text, rating) => {
    const newLog = { ...userLog, [game.id]: { gameTitle: game.title, gameImage: game.image, gameYear: game.year, reviewText: text, rating, date: new Date().toLocaleDateString() } };
    const newWishlist = wishlist.filter(g => g.id !== game.id);
    setUserLog(newLog); setWishlist(newWishlist);
    updateMetadata({ userLog: newLog, wishlist: newWishlist });
    setPickerMode(null); setSelectedGame(null); setInputRating(0); setReviewText("");
    addToast("Logged Successfully", `You reviewed ${game.title}`, "success");
  };

  const confirmDeleteLog = () => {
    if (deleteTargetId) {
      const newLog = { ...userLog }; delete newLog[deleteTargetId];
      setUserLog(newLog); updateMetadata({ userLog: newLog });
      setDeleteTargetId(null); addToast("Review Deleted", "The game review has been removed.", "error");
    }
  };

  const handleEditLog = (gameId, logData) => {
    const gameObj = { id: gameId, title: logData.gameTitle, image: logData.gameImage, year: logData.gameYear };
    setSelectedGame(gameObj); setPickerMode('review'); setInputRating(logData.rating); setReviewText(logData.reviewText); 
  };

  const openNewReview = (game) => { setSelectedGame(game); setPickerMode('review'); setInputRating(0); setReviewText(""); };

  const toggleWishlist = (game) => {
    let newList;
    if (wishlist.find(g => g.id === game.id)) { newList = wishlist.filter(g => g.id !== game.id); addToast("Removed", "Game removed from wishlist", "info"); } 
    else { newList = [...wishlist, game]; addToast("Wishlisted", `Added ${game.title} to wishlist`, "success"); }
    setWishlist(newList); updateMetadata({ wishlist: newList });
  };

  const handleAddFavorite = (game) => {
    const index = parseInt(pickerMode.split('-')[1]);
    const newFavs = [...favorites]; newFavs[index] = game; setFavorites(newFavs); updateMetadata({ favorites: newFavs }); setPickerMode(null);
    addToast("Favorite Updated", `${game.title} is now in your top 4.`, "success");
  };

  const saveUsername = async (e) => {
    e.preventDefault(); if(!tempName.trim()) return;
    await updateMetadata({ username: tempName });
    setUsername(tempName); setIsSetupOpen(false); setIsEditNameOpen(false);
    addToast("Success", `Username updated to ${tempName}`, "success");
  };

  const saveBio = async () => { await updateMetadata({ bio: tempBio }); setBio(tempBio); setIsEditBioOpen(false); addToast("Profile Updated", "Your bio has been saved.", "success"); };

  useEffect(() => {
    if (hasSentRef.current) return; hasSentRef.current = true;
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, { user_email: session.user.email, time: new Date().toLocaleString() }, EMAILJS_PUBLIC_KEY);
  }, [session.user.email]);

  const GamePoster = ({ game, size = "normal" }) => {
    const isLogged = userLog[game.id];
    const isWishlisted = wishlist.find(g => g.id === game.id);
    const sizeClass = size === 'large' ? 'w-48' : size === 'small' ? 'w-24' : 'w-36';
    return (
      <div className={`group relative flex-shrink-0 cursor-pointer ${sizeClass}`}>
        <div className={`aspect-[2/3] rounded-lg overflow-hidden border-2 transition-all shadow-lg relative ${isLogged ? 'border-emerald-500' : 'border-transparent group-hover:border-white'}`} onClick={() => openNewReview(game)}>
          <img src={game.image} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="" />
          <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
             <div className="flex flex-col gap-2 w-full px-2">
                <button onClick={(e) => { e.stopPropagation(); toggleWishlist(game); }} className={`flex items-center justify-center gap-1 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider w-full ${isWishlisted ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>{isWishlisted ? <><Eye size={12}/> Saved</> : <><Eye size={12}/> List</>}</button>
                <button onClick={(e) => { e.stopPropagation(); openNewReview(game); }} className="flex items-center justify-center gap-1 bg-gray-700 hover:bg-emerald-600 text-gray-300 hover:text-white py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors w-full"><Plus size={12}/> Log</button>
             </div>
          </div>
          {isLogged && <div className="absolute top-1 right-1 bg-black/90 px-1.5 rounded flex items-center gap-0.5 shadow-md border border-emerald-500/50"><Star size={10} className="fill-emerald-500 text-emerald-500"/><span className="text-xs font-bold text-white">{isLogged.rating}</span></div>}
        </div>
      </div>
    );
  };

  const SearchView = () => {
    const results = GAMES_DB.filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return (
      <div className="animate-in fade-in duration-500">
        <h2 className="text-white text-lg font-bold uppercase tracking-widest border-b border-gray-800 pb-4 mb-6 flex items-center gap-2"><Search size={20} className="text-emerald-500"/> Search Results</h2>
        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6">{results.map(game => <GamePoster key={game.id} game={game} />)}</div>
        ) : <div className="text-center py-20 border-2 border-dashed border-gray-800 rounded-xl"><p className="text-gray-500">No games found for "{searchQuery}"</p></div>}
      </div>
    );
  };

  const HomeView = () => (
    <div className="animate-in fade-in duration-500 space-y-16">
      <div className="relative w-full h-[450px] rounded-3xl overflow-hidden shadow-2xl group cursor-pointer" onClick={() => openNewReview(GAMES_DB[0])}>
         <div className="absolute inset-0 bg-gradient-to-t from-[#14181c] via-[#14181c]/20 to-transparent z-10"></div>
         <img src="https://m.exophase.com/steam/games/o/50edge.png?a0ee9cf765b1df5cb91fbbdd6b54b77b" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Hero"/>
         <div className="absolute bottom-0 left-0 p-10 z-20 max-w-3xl">
            <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-2 inline-block shadow-lg">Game of the Week</span>
            <h1 className="text-6xl font-black text-white mb-4 drop-shadow-2xl tracking-tight leading-none">Baldur's Gate 3</h1>
            <div className="flex gap-4">
               <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest flex items-center gap-2 transition shadow-lg"><Plus size={20}/> Log Entry</button>
               <button onClick={(e) => {e.stopPropagation(); toggleWishlist(GAMES_DB[0]);}} className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest flex items-center gap-2 transition border border-white/10"><Eye size={20}/> Wishlist</button>
            </div>
         </div>
      </div>

      <section>
         <h2 className="text-white text-lg font-bold uppercase tracking-widest border-b border-gray-800 pb-4 mb-6 flex items-center gap-2"><Newspaper size={20} className="text-purple-500"/> Recent Stories</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {NEWS_DATA.map(news => (
               <div key={news.id} className="bg-[#1e2328] rounded-xl overflow-hidden group cursor-pointer hover:-translate-y-1 transition-transform duration-300 shadow-lg border border-gray-800 hover:border-gray-600">
                  <div className="h-40 overflow-hidden relative">
                     <img src={news.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt=""/>
                     <div className="absolute top-3 left-3 bg-black/70 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider">{news.category}</div>
                  </div>
                  <div className="p-5">
                     <div className="flex items-center gap-2 mb-2"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span><span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{news.source}</span></div>
                     <h3 className="text-white font-bold text-lg mb-2 leading-tight group-hover:text-emerald-400 transition">{news.title}</h3>
                     <p className="text-gray-400 text-sm line-clamp-2">{news.desc}</p>
                     <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-wider"><span>Read Story</span><ArrowRight size={14}/></div>
                  </div>
               </div>
            ))}
         </div>
      </section>

      <section>
         <div className="flex justify-between items-end border-b border-gray-800 pb-4 mb-6"><h2 className="text-white text-lg font-bold uppercase tracking-widest flex items-center gap-2"><Flame size={20} className="text-orange-500"/> Trending Now</h2></div>
         <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-thin scrollbar-thumb-gray-700">{GAMES_DB.filter(g => g.category === 'trending').map(game => <GamePoster key={game.id} game={game} size="normal" />)}</div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         <section>
            <h2 className="text-white text-lg font-bold uppercase tracking-widest border-b border-gray-800 pb-4 mb-6 flex items-center gap-2"><Calendar size={20} className="text-blue-500"/> Anticipated 2025</h2>
            <div className="flex flex-col gap-4">
               {GAMES_DB.filter(g => g.category === 'upcoming').map(game => (
                  <div key={game.id} className="flex gap-4 bg-[#1e2328] p-4 rounded-xl border border-gray-800 hover:border-gray-600 transition group cursor-pointer" onClick={() => {toggleWishlist(game)}}>
                     <img src={game.image} className="w-32 h-20 object-cover rounded-lg" alt=""/>
                     <div className="flex flex-col justify-center">
                        <h3 className="text-white font-bold text-lg group-hover:text-emerald-400 transition">{game.title}</h3>
                        <p className="text-gray-500 text-sm mb-2">{game.year} • Coming Soon</p>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider"><Eye size={12}/> Watchlist</div>
                     </div>
                  </div>
               ))}
            </div>
         </section>
         <section>
            <h2 className="text-white text-lg font-bold uppercase tracking-widest border-b border-gray-800 pb-4 mb-6 flex items-center gap-2"><Sparkles size={20} className="text-purple-500"/> Indie Darlings</h2>
            <div className="grid grid-cols-3 gap-4">{GAMES_DB.filter(g => g.category === 'indie').map(game => <GamePoster key={game.id} game={game} size="small" />)}</div>
         </section>
      </div>

      <section>
         <div className="flex justify-between items-end border-b border-gray-800 pb-4 mb-6"><h2 className="text-white text-lg font-bold uppercase tracking-widest flex items-center gap-2"><Medal size={20} className="text-yellow-500"/> Highest Rated All Time</h2></div>
         <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-thin scrollbar-thumb-gray-700">{GAMES_DB.filter(g => g.category === 'classic').map(game => <GamePoster key={game.id} game={game} size="normal" />)}</div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2">
            <h2 className="text-white text-lg font-bold uppercase tracking-widest border-b border-gray-800 pb-4 mb-6 flex items-center gap-2"><Activity size={20} className="text-green-500"/> Community Pulse</h2>
            <div className="space-y-6">
               {RECENT_REVIEWS_GLOBAL.map(review => (
                  <div key={review.id} className="flex gap-5 group border-b border-gray-800/50 pb-6 last:border-0">
                     <div className="w-24 flex-shrink-0"><img src={review.image} className="w-full aspect-[2/3] object-cover rounded-lg border border-gray-700 shadow-md group-hover:scale-105 transition-transform cursor-pointer" alt=""/></div>
                     <div className="flex-1">
                        <div className="flex justify-between items-start mb-2"><div><h3 className="text-white font-bold text-xl cursor-pointer hover:text-emerald-500 transition">{review.game}</h3><div className="flex items-center gap-2 text-xs text-gray-500"><StarRatingDisplay rating={review.rating} size={12} /></div></div></div>
                        <div className="flex items-center gap-3 mb-4"><img src={review.avatar} className="w-6 h-6 rounded-full border border-gray-600" alt=""/><span className="text-sm font-bold text-gray-300 hover:text-white cursor-pointer">{review.user}</span></div>
                        <p className="text-gray-300 text-sm font-serif leading-relaxed pl-4 border-l-2 border-gray-700 italic">{review.text}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
         <div>
            <h2 className="text-white text-lg font-bold uppercase tracking-widest border-b border-gray-800 pb-4 mb-6">Popular Lists</h2>
            <div className="space-y-4">{[{title: "Essential RPGs", count: 100, color: "bg-blue-500"}, {title: "Games that made me cry", count: 12, color: "bg-pink-500"}, {title: "Soulslike Difficulty Tier", count: 45, color: "bg-red-500"}].map((list, idx) => (
                  <div key={idx} className="bg-[#1e2328] p-4 rounded-xl hover:bg-[#252b31] cursor-pointer transition flex items-center gap-4 group border border-transparent hover:border-gray-700"><div className={`w-12 h-12 ${list.color}/20 rounded-lg flex items-center justify-center font-bold ${list.color.replace('bg-','text-')} group-hover:scale-110 transition`}>#{idx + 1}</div><div><h4 className="text-white font-bold text-sm leading-tight group-hover:text-emerald-400 mb-1">{list.title}</h4><p className="text-xs text-gray-500">{list.count} games</p></div></div>))}</div>
         </div>
      </div>
    </div>
  );

  const ProfileView = () => (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <div className="relative mb-20">
        <div className="h-72 w-full rounded-b-2xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10"></div>
          <img src={cover} className="w-full h-full object-cover" alt="Cover" />
          <button onClick={() => coverInputRef.current.click()} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded z-20 opacity-0 group-hover:opacity-100 transition"><Camera size={18}/></button>
        </div>
        <div className="absolute -bottom-10 left-0 right-0 px-8 flex items-end justify-between z-20">
           <div className="flex items-end gap-6">
              <div className="relative group">
                 <div className="w-36 h-36 rounded-full border-4 border-[#14181c] bg-[#1e2328] overflow-hidden">
                    {avatar ? <img src={avatar} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-4xl text-white font-bold">{(username||"U")[0]}</div>}
                 </div>
                 <button onClick={() => fileInputRef.current.click()} className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white font-bold text-xs uppercase cursor-pointer">Change</button>
              </div>
              <div className="mb-2">
                 <h1 className="text-3xl font-bold text-white flex gap-2 items-center">
                    {username} 
                    <Pencil size={20} className="text-gray-500 cursor-pointer hover:text-emerald-500" onClick={() => { setTempName(username); setIsEditNameOpen(true); }}/>
                 </h1>
                 <p className="text-gray-400 text-sm flex items-center gap-2">
                    {bio} 
                    <Edit3 size={14} className="text-gray-500 cursor-pointer hover:text-white" onClick={() => setIsEditBioOpen(true)}/>
                 </p>
              </div>
           </div>
           <div className="flex gap-8 mb-4 bg-[#14181c]/80 backdrop-blur p-4 rounded-xl border border-gray-800">
              <div className="text-center"><span className="block text-xl font-bold text-white">{Object.keys(userLog).length}</span><span className="text-[10px] uppercase text-emerald-500 font-bold">Logged</span></div>
              <div className="w-[1px] bg-gray-700"></div>
              <div className="text-center"><span className="block text-xl font-bold text-white">{wishlist.length}</span><span className="text-[10px] uppercase text-emerald-500 font-bold">Wishlist</span></div>
           </div>
        </div>
      </div>
      <input type="file" ref={fileInputRef} onChange={(e) => handleImageUpload(e, 'avatar')} className="hidden" />
      <input type="file" ref={coverInputRef} onChange={(e) => handleImageUpload(e, 'cover')} className="hidden" />
      <div className="mb-12">
        <h2 className="text-white text-sm font-bold uppercase tracking-widest border-b border-gray-800 pb-3 mb-4">Favorite Games</h2>
        <div className="flex gap-4">
           {favorites.map((game, i) => (
              <div key={i} onClick={() => setPickerMode(`favorite-${i}`)} className={`w-32 aspect-[2/3] rounded border-2 border-dashed ${game ? 'border-transparent' : 'border-gray-800 hover:border-emerald-500'} bg-[#1e2328] flex items-center justify-center cursor-pointer overflow-hidden relative group`}>
                 {game ? <img src={game.image} className="w-full h-full object-cover" alt=""/> : <Plus className="text-gray-600 group-hover:text-emerald-500"/>}
                 {game && <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-white font-bold uppercase">Change</div>}
              </div>
           ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
         <div className="lg:col-span-3">
            <h2 className="text-white text-sm font-bold uppercase tracking-widest border-b border-gray-800 pb-3 mb-6">Recent Activity</h2>
            {Object.keys(userLog).length > 0 ? (
               <div className="space-y-4">
                  {Object.entries(userLog).reverse().map(([gameId, log]) => (
                     <div key={gameId} className="bg-[#1e2328] p-4 rounded border border-gray-800 flex gap-4 group hover:border-gray-600 transition">
                        <img src={log.gameImage} className="w-20 h-28 object-cover rounded shadow" alt=""/>
                        <div className="flex-1 relative">
                           <div className="absolute top-0 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEditLog(gameId, log)} className="p-1.5 bg-gray-700 rounded text-gray-300 hover:text-emerald-500 hover:bg-gray-600 transition" title="Edit Review"><Pencil size={14}/></button>
                              <button onClick={() => setDeleteTargetId(gameId)} className="p-1.5 bg-gray-700 rounded text-gray-300 hover:text-red-500 hover:bg-gray-600 transition" title="Delete Review"><Trash2 size={14}/></button>
                           </div>
                           <h3 className="text-white font-bold text-lg">{log.gameTitle}</h3>
                           <div className="mb-2"><StarRatingDisplay rating={log.rating} size={14} /></div>
                           <p className="text-gray-300 text-sm font-serif italic">"{log.reviewText}"</p>
                           <p className="text-xs text-gray-600 mt-2">Logged on {log.date}</p>
                        </div>
                     </div>
                  ))}
               </div>
            ) : <p className="text-gray-500 italic">No activity yet.</p>}
         </div>
         <div>
            <h2 className="text-white text-sm font-bold uppercase tracking-widest border-b border-gray-800 pb-3 mb-6">Wishlist</h2>
            <div className="grid grid-cols-3 gap-2">{wishlist.map(game => (
               <div key={game.id} className="relative group cursor-pointer" onClick={() => openNewReview(game)}>
                  <img src={game.image} className="w-full aspect-[2/3] object-cover rounded border border-transparent group-hover:border-emerald-500 transition" alt=""/>
                  <button onClick={(e) => { e.stopPropagation(); toggleWishlist(game); }} className="absolute top-1 right-1 bg-black/60 hover:bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity" title="Remove from Wishlist"><X size={12}/></button>
               </div>
            ))}</div>
         </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#14181c] text-gray-300 font-sans">
      <nav className="bg-[#1e2328] border-b border-gray-800 h-16 sticky top-0 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
           <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}><Gamepad2 className="text-emerald-500 w-8 h-8"/><span className="font-bold text-white uppercase tracking-widest text-lg hidden sm:block">FrontLog</span></div>
           <div className="flex gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
              <button onClick={() => setActiveTab('home')} className={`hover:text-white ${activeTab === 'home' ? 'text-white' : ''}`}>Home</button>
              <button onClick={() => setActiveTab('profile')} className={`hover:text-white ${activeTab === 'profile' ? 'text-white' : ''}`}>Profile</button>
           </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-emerald-500" />
              <input
                 type="text"
                 placeholder="Search games..."
                 className="bg-[#0f1115] border border-gray-700 text-white text-sm rounded-full pl-10 pr-4 py-2 focus:border-emerald-500 focus:outline-none w-32 focus:w-64 transition-all duration-300"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
           
           <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold cursor-pointer overflow-hidden border-2 border-transparent hover:border-emerald-500 transition" onClick={() => setActiveTab('profile')}>
              {avatar ? <img src={avatar} className="w-full h-full object-cover" alt="User"/> : (username||"U")[0].toUpperCase()}
           </div>
           <LogOut size={20} className="text-gray-500 cursor-pointer hover:text-white" onClick={() => supabase.auth.signOut()}/>
        </div>
      </nav>

      {/* ALL MODALS */}
      <ConfirmModal isOpen={!!deleteTargetId} title="Delete Review?" message="Are you sure you want to remove this game from your diary? This action cannot be undone." onCancel={() => setDeleteTargetId(null)} onConfirm={confirmDeleteLog} />
      {isEditBioOpen && (<div className="fixed inset-0 bg-black/90 z-[99] flex items-center justify-center p-4"><div className="bg-[#1e2328] p-6 rounded-lg w-full max-w-md shadow-2xl border border-gray-700"><h2 className="text-white font-bold mb-4 text-lg">Update Profile Bio</h2><textarea className="w-full bg-[#14181c] border border-gray-600 p-3 rounded-lg text-white mb-4 h-32 focus:border-emerald-500 outline-none resize-none" value={tempBio} onChange={(e) => setTempBio(e.target.value)} placeholder="Write something about yourself..."></textarea><div className="flex justify-end gap-2"><button onClick={() => setIsEditBioOpen(false)} className="px-4 py-2 text-gray-400 font-bold text-sm hover:text-white transition">Cancel</button><button onClick={saveBio} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg transition">Save Changes</button></div></div></div>)}
      {isEditNameOpen && (<div className="fixed inset-0 bg-black/90 z-[99] flex items-center justify-center p-4"><div className="bg-[#1e2328] p-6 rounded-lg w-full max-w-sm shadow-2xl border border-gray-700"><h2 className="text-white font-bold mb-4 text-lg">Change Username</h2><input type="text" className="w-full bg-[#14181c] border border-gray-600 p-3 rounded-lg text-white mb-4 outline-none focus:border-emerald-500" value={tempName} onChange={(e) => setTempName(e.target.value)} autoFocus /><div className="flex justify-end gap-2"><button onClick={() => setIsEditNameOpen(false)} className="px-4 py-2 text-gray-400 font-bold text-sm hover:text-white transition">Cancel</button><button onClick={saveUsername} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg transition">Save</button></div></div></div>)}
      {pickerMode && (<div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4"><div className="bg-[#1e2328] w-full max-w-4xl h-[80vh] rounded flex flex-col overflow-hidden border border-gray-700 shadow-2xl"><div className="p-4 border-b border-gray-700 flex justify-between"><h2 className="text-white font-bold uppercase tracking-widest">Select Game</h2><button onClick={() => setPickerMode(null)}><X size={24} className="text-gray-400 hover:text-white"/></button></div><div className="flex-1 overflow-y-auto p-4 grid grid-cols-4 md:grid-cols-6 gap-4">{GAMES_DB.map(game => (<div key={game.id} onClick={() => { if(pickerMode==='review') { openNewReview(game); } else handleAddFavorite(game); }} className="cursor-pointer group"><img src={game.image} className="aspect-[2/3] object-cover rounded border-2 border-transparent group-hover:border-emerald-500 transition" alt=""/></div>))}</div></div></div>)}
      {pickerMode === 'review' && selectedGame && (<div className="fixed inset-0 bg-black/90 z-[70] flex items-center justify-center p-4"><div className="bg-[#2c3440] p-6 rounded-lg w-full max-w-lg relative shadow-2xl border border-gray-600 animate-in zoom-in-95"><button onClick={() => {setPickerMode(null); setSelectedGame(null)}} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24}/></button><h2 className="text-white font-bold text-2xl mb-1">{selectedGame.title}</h2><p className="text-gray-400 text-sm mb-6">{selectedGame.year}</p><form onSubmit={(e) => { e.preventDefault(); handleSaveLog(selectedGame, reviewText, inputRating); }}><div className="mb-4"><label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest">Rating</label><StarRatingInput value={inputRating} onChange={setInputRating} /></div><div className="mb-4"><label className="block text-xs font-bold text-gray-500 uppercase mb-1 tracking-widest">Review</label><textarea name="review" value={reviewText} onChange={(e) => setReviewText(e.target.value)} className="w-full bg-[#14181c] text-white p-3 h-32 rounded-lg resize-none focus:border-emerald-500 outline-none border border-gray-700"></textarea></div><button className="bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg uppercase tracking-widest hover:bg-emerald-500 w-full shadow-lg transition">Save Log</button></form></div></div>)}
      {isSetupOpen && (<div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4"><div className="bg-[#1e2328] p-8 rounded-xl text-center shadow-2xl border border-gray-700 w-full max-w-md"><h2 className="text-white font-bold text-2xl mb-4">Choose Gamertag</h2><form onSubmit={saveUsername}><input value={tempName} onChange={e=>setTempName(e.target.value)} className="bg-black text-white p-4 rounded-lg w-full text-center text-xl font-bold mb-4 outline-none border border-gray-600 focus:border-emerald-500 uppercase tracking-widest" autoFocus placeholder="USERNAME"/><button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 w-full rounded-lg uppercase tracking-widest transition">Start Journey</button></form></div></div>)}

      <div className="max-w-6xl mx-auto px-4 py-8">
         {searchQuery ? <SearchView /> : (activeTab === 'home' ? <HomeView /> : <ProfileView />)}
      </div>
    </div>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [toasts, setToasts] = useState([]);
  const addToast = (title, message, type = 'info') => { const id = Date.now(); setToasts(prev => [...prev, { id, title, message, type }]); setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000); };
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));
  useEffect(() => { supabase.auth.getSession().then(({ data: { session } }) => setSession(session)); const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session)); return () => subscription.unsubscribe(); }, []);
  return ( <> <ToastContainer toasts={toasts} removeToast={removeToast} /> {!session ? <LoginPage addToast={addToast} /> : <Dashboard session={session} addToast={addToast} />} </> );
}

export default App;