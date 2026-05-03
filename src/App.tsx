import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, Star, Clock, Download, Printer, Gift, 
  ChevronDown, ShieldCheck, X, ArrowRight, Trophy, 
  Paintbrush, Utensils, BookOpen, AlertTriangle,
  Heart, Sparkles, XCircle, CheckSquare, Truck, Medal,
  TrainFront, Bird, Play
} from 'lucide-react';

// --- Helper Components ---

const NumberCounter = ({ to = 400, duration = 2 }: { to?: number, duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let rafId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const current = Math.min(Math.floor((progress / (duration * 1000)) * to), to);
      
      setCount(current);
      
      if (current < to) {
        rafId = window.requestAnimationFrame(step);
      }
    };

    rafId = window.requestAnimationFrame(step);

    return () => window.cancelAnimationFrame(rafId);
  }, [to, duration]);

  return <>{count}</>;
};

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState(15 * 60 + 37); // 15m 37s

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <span className="font-mono font-black tabular-nums tracking-tighter">
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </span>
  );
};

const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-4">
      <div 
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)} 
        className="flex w-full justify-between items-center text-left font-bold text-gray-800 cursor-pointer"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsOpen(!isOpen) }}
      >
        {question}
        <ChevronDown className={`transition-transform flex-shrink-0 ml-4 ${isOpen ? 'rotate-180 text-[#0a7337]' : 'text-gray-400'}`} />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pt-3 text-gray-600 leading-relaxed text-sm font-medium">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main Application ---

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12') e.preventDefault();
      if (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) e.preventDefault();
      if (e.ctrlKey && ['U', 'u'].includes(e.key)) e.preventDefault();
    };
    
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  const toggleVideo = () => {
    if (!iframeRef.current) return;
    if (!isVideoPlaying) {
      setIsVideoPlaying(true);
      setIsPaused(false);
      iframeRef.current.contentWindow?.postMessage('{"method":"play"}', '*');
    } else {
      if (isPaused) {
        iframeRef.current.contentWindow?.postMessage('{"method":"play"}', '*');
        setIsPaused(false);
      } else {
        iframeRef.current.contentWindow?.postMessage('{"method":"pause"}', '*');
        setIsPaused(true);
      }
    }
  };

  const handleCheckout = (url: string) => {
    // Fire Meta Pixel InitiateCheckout Event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout');
    }
    
    // Redirect with query params
    if (typeof window !== 'undefined') {
      const finalUrl = new URL(url);
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.forEach((value, key) => {
        finalUrl.searchParams.set(key, value);
      });
      window.location.href = finalUrl.toString();
    }
  };

  const handleBasicClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true); // Abre Upsell
  };

  const ctaClasses = "inline-flex items-center justify-center w-full sm:w-auto bg-[#ffc107] hover:bg-yellow-400 text-[#0a7337] font-bold text-xl py-5 px-8 rounded-full shadow-[0_6px_0_#b45309] hover:shadow-[0_3px_0_#b45309] hover:translate-y-[3px] transition-all uppercase animate-pulse duration-1000";

  return (
    <div 
      className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20 md:pb-0 overflow-x-hidden select-none"
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
    >
      
      {/* =========================================
          HERO: BANNER FIXO SUPERIOR
      ========================================= */}
      <div className="bg-[#7d0000] text-white text-sm md:text-base font-bold text-center py-2.5 px-4 sticky top-0 z-50 flex items-center justify-center gap-2 shadow-md uppercase tracking-wider leading-snug">
        <span>
          SOMENTE HOJE, <span className="text-[#ffc107]">{new Date().toLocaleDateString('pt-BR', { weekday: 'long' }).toUpperCase()}, {new Date().getDate()} DE {new Date().toLocaleDateString('pt-BR', { month: 'long' }).toUpperCase()}</span> É O ÚLTIMO DIA PARA APROVEITAR A OFERTA POR APENAS <span className="text-[#ffc107]">R$10,00</span>!
        </span>
      </div>

      {/* =========================================
          HERO SECTION (Headline, Subheadline, Capa)
      ========================================= */}
      <header className="bg-gradient-to-b from-[#0a7337] to-[#0b5c2d] text-white pt-4 pb-16 px-4 relative overflow-hidden">
        {/* Luzes de Estádio Fundo */}
        <div className="absolute top-0 left-1/4 w-40 h-40 bg-[#ffc107] opacity-20 blur-3xl rounded-full"></div>
        <div className="absolute top-0 right-1/4 w-40 h-40 bg-[#ffc107] opacity-20 blur-3xl rounded-full"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          
          {/* LOGO STARTKIDS (IMAGE) */}
          <div className="flex flex-col items-center justify-center -mt-2 -mb-2 relative z-20">
            <img 
              src="https://iili.io/BiS3b5P.png" 
              alt="StartKids Álbum da Copa do Mundo Infantil" 
              className="w-full max-w-[280px] md:max-w-[320px] drop-shadow-2xl hover:scale-105 transition-transform duration-300" 
              referrerPolicy="no-referrer"
            />
          </div>

          {/* HEADLINE & SUBHEADLINE */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            O ÁLBUM COMPLETO DA COPA DO MUNDO 2026 COM <br className="hidden md:block"/>
            <span className="text-[#ffc107] drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] relative inline-flex items-center transform hover:scale-105 transition-transform" style={{ WebkitTextStroke: '1px #b45309' }}>
              +<NumberCounter to={400} duration={2.5} /> FIGURINHAS!
            </span>
          </h1>
          
          <h2 className="text-lg md:text-xl text-green-50/90 mb-10 font-bold drop-shadow-md max-w-3xl mx-auto leading-relaxed">
            <span className="text-[#ffd300]">PARE DE GASTAR CARO NO ALBUM DA COPA DO MUNDO!</span> Garanta o Álbum da copa do mundo 2026 completo com Envio no mesmo DIA! Para colecionar, colar as figurinhas e reviver a emoção de preencher um álbum completo.
          </h2>

          {/* VIDEO CAPA MUITO IMPORTANTE */}
          <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[560px] mb-12 mt-8">
             <div className="bg-gradient-to-br from-[#ffc107] via-yellow-400 to-[#0a7337] p-1 md:p-1.5 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] shadow-yellow-500/20 relative">
                
                <div className="bg-black rounded-[1.25rem] overflow-hidden border-2 border-white relative aspect-[9/16] sm:aspect-video group">
                   {/* Transparent Overlay to capture clicks */}
                   <div 
                     className="absolute inset-0 z-20 cursor-pointer" 
                     onClick={toggleVideo}
                   >
                     {/* Initial Thumbnail and Play Overlay */}
                     {!isVideoPlaying && (
                       <div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-colors">
                          <img 
                             src="https://iili.io/BsLxE4S.png" 
                             alt="Thumbnail" 
                             className="absolute inset-0 w-full h-full object-cover opacity-70"
                          />
                          <div className="w-20 h-20 bg-[#e63946] rounded-full flex items-center justify-center animate-pulse border-4 border-white shadow-[0_0_30px_rgba(230,57,70,0.8)] relative z-30 transform hover:scale-110 transition-transform">
                             <Play fill="white" className="text-white ml-2" size={32} />
                          </div>
                       </div>
                     )}

                     {/* Pause Overlay (shown briefly when toggled or hovered while playing) */}
                     {isVideoPlaying && isPaused && (
                       <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-colors">
                          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/50 relative z-30">
                             <Play fill="white" className="text-white ml-2" size={32} />
                          </div>
                       </div>
                     )}
                   </div>

                   <iframe
                     ref={iframeRef}
                     src="https://player.vimeo.com/video/1188311975?autoplay=0&muted=0&controls=0&title=0&byline=0&portrait=0&dnt=1"
                     className="absolute top-0 left-0 w-full h-full z-10"
                     allow="autoplay; fullscreen; picture-in-picture"
                     style={{ border: 'none' }}
                     title="Vídeo de Apresentação"
                   ></iframe>
                </div>
             </div>
             
             {/* Sombra no chao */}
             <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-6 bg-black/40 blur-xl rounded-[100%]"></div>
          </div>

          {/* TEXTO SUPLEMENTAR */}
          <div className="bg-[#0b5c2d]/50 p-4 rounded-3xl backdrop-blur max-w-2xl mx-auto mb-8 border border-green-600/30">
            <p className="text-green-50 text-sm md:text-base font-medium italic">
              "Um fenônemo de entretenimento familiar. Mais de 4.000 famílias já receberam e transformaram a espera da Copa em momentos mágicos."
            </p>
          </div>

          {/* CTA */}
          <a href="#presentes-especiais" className={ctaClasses}>
            QUERO O MEU ÁLBUM AGORA <ArrowRight className="ml-2" />
          </a>
          
          {/* BADGES INFORMATIVAS MOVIDAS */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <span className="flex items-center gap-1.5 bg-green-900/40 text-green-100 px-4 py-2 rounded-full text-xs font-bold border border-green-500/30 shadow-inner backdrop-blur-sm">
              <ShieldCheck size={16} className="text-[#ffc107]"/> Compra 100% Segura
            </span>
            <span className="flex items-center gap-1.5 bg-green-900/40 text-green-100 px-4 py-2 rounded-full text-xs font-bold border border-green-500/30 shadow-inner backdrop-blur-sm">
              <Download size={16} className="text-[#3a86ff]"/> Envio Imediato
            </span>
            <span className="flex items-center gap-1.5 bg-green-900/40 text-green-100 px-4 py-2 rounded-full text-xs font-bold border border-green-500/30 shadow-inner backdrop-blur-sm hidden sm:flex">
              <Star size={16} className="text-[#ffc107]" fill="currentColor"/> Oferta Limitada
            </span>
          </div>
        </div>
      </header>


      {/* =========================================
          O QUE VOCÊ VAI RECEBER (Carrossel + Lista)
      ========================================= */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true, margin: "-50px" }} 
        transition={{ duration: 0.5 }}
        className="py-20 px-4 bg-white relative overflow-hidden"
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-center text-[#0a7337] mb-12 uppercase drop-shadow-sm tracking-tight">O Que Você Vai <span className="text-[#00426f]">Receber?</span></h2>
          
          {/* CARROSSEL DE IMAGENS (Entregável) */}
          <div className="overflow-hidden pb-12 -mx-4 md:mx-0 px-4 md:px-0">
            <motion.div 
              className="flex gap-4 md:gap-6 w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ ease: "linear", duration: 15, repeat: Infinity }}
            >
              {[ 
                { title: "Album Estádios copa 2026", color: "bg-[#0a7337]", icon: <BookOpen size={40}/> },
                { title: "+400 Figurinhas Alta Qualidade", color: "bg-[#3a86ff]", icon: <Printer size={40}/> },
                { title: "Certificado de Colecionador Oficial", color: "bg-[#ffc107] text-[#b45309]", icon: <Medal size={40}/> },
                { title: "Figurinhas Jogadores Premium", color: "bg-[#e63946]", icon: <CheckSquare size={40}/> },
                { title: "Álbum Copa do Mundo 2026", color: "bg-[#0a7337]", icon: <BookOpen size={40}/> },
                { title: "+400 Figurinhas Alta Qualidade", color: "bg-[#3a86ff]", icon: <Printer size={40}/> },
                { title: "Certificado de Colecionador Oficial", color: "bg-[#ffc107] text-[#b45309]", icon: <Medal size={40}/> },
                { title: "Materiais Bônus Copa 2026", color: "bg-[#e63946]", icon: <CheckSquare size={40}/> }
              ].map((item, idx) => (
                <div key={idx} className={`shrink-0 w-[240px] md:w-[280px] aspect-square rounded-[2rem] p-6 flex flex-col items-center justify-center text-center shadow-lg transform transition-transform hover:-translate-y-2 border-4 border-gray-100 ${item.color} ${item.color.includes('text') ? '' : 'text-white'}`}>
                  <div className="mb-4 drop-shadow-md">{item.icon}</div>
                  <h3 className="font-bold text-xl leading-tight">{item.title}</h3>
                  <p className="text-xs mt-3 opacity-80 font-semibold uppercase tracking-wider">Envio Imediato</p>
                </div>
              ))}
            </motion.div>
          </div>
          
          {/* IDENTIFICAÇÃO DE PÚBLICO (Pensado para você) */}
          <div className="mt-8 bg-gray-50 rounded-[2rem] p-8 md:p-12 shadow-inner border-2 border-gray-100">
            <h3 className="font-black text-2xl text-gray-800 mb-6 text-center uppercase tracking-tight flex items-center justify-center gap-2">
              Feito Pensando em Você
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <CheckCircle2 className="text-[#0a7337] shrink-0 mt-1" size={24} />
                  <p className="text-gray-700 font-medium">Você coleciona apenas as figurinhas que quiser ou em lotes.</p>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle2 className="text-[#0a7337] shrink-0 mt-1" size={24} />
                  <p className="text-gray-700 font-medium">As bordas de recorte grandes facilitam para as <strong>crianças menores usarem tesoura sem ponta</strong> sozinhas.</p>
                </li>
              </ul>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <CheckCircle2 className="text-[#0a7337] shrink-0 mt-1" size={24} />
                  <p className="text-gray-700 font-medium">Design lúdico que transforma a brincadeira em um <strong>exercício de identificação de números e alfabeto</strong>.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      {/* =========================================
          PORQUE ESCOLHER O "PRODUTO"? (Quebra Objeções)
      ========================================= */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true, margin: "-50px" }} 
        transition={{ duration: 0.5 }}
        className="py-20 px-4 bg-[#ffc107] relative border-y-8 border-yellow-300"
      >
        <div className="absolute inset-0 bg-white/20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMSIgZmlsbD0iI2QxZDVkYiIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-center text-[#b45309] mb-16 uppercase drop-shadow-sm leading-tight">Por que escolher o formato<br/><span className="text-[#0a7337] text-5xl md:text-7xl drop-shadow-md bg-white px-4 py-1 rounded-[2rem] inline-block mt-2 transform -rotate-2">StartKids?</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-[2rem] p-8 shadow-xl relative mt-8 md:mt-0">
              <div className="w-20 h-20 bg-[#e63946] text-white rounded-full flex items-center justify-center absolute -top-10 left-1/2 -translate-x-1/2 shadow-lg border-4 border-white">
                <XCircle size={36} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800 text-center mt-6">O Fim das "Repetidas"</h3>
              <p className="text-sm text-gray-600 text-center font-medium leading-relaxed">Sabe aquela frustração de gastar R$50 na padaria e só tirar figurinha que já tem? Aqui nós te entregamos o álbum 100% completo. Acabaram as lágrimas!</p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-xl relative mt-8 md:mt-0 transform md:-translate-y-4 border-4 border-[#0a7337]">
              <div className="w-24 h-24 bg-[#0a7337] text-white rounded-full flex items-center justify-center absolute -top-12 left-1/2 -translate-x-1/2 shadow-xl border-4 border-white">
                <Star size={44} fill="currentColor"/>
              </div>
              <h3 className="font-bold text-2xl mb-3 text-[#0a7337] text-center mt-8 uppercase tracking-tight">Reposição Infinita</h3>
              <p className="text-sm text-gray-600 text-center font-medium leading-relaxed">Criança derramou suco na página? Rasgou a figurinha especial na hora de descolar? Sem pânico! É só abrir o Suporte e pedir a mesma figurinha novamente.</p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-xl relative mt-8 md:mt-0">
              <div className="w-20 h-20 bg-[#3a86ff] text-white rounded-full flex items-center justify-center absolute -top-10 left-1/2 -translate-x-1/2 shadow-lg border-4 border-white">
                <Heart size={36} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800 text-center mt-6">Momento de Conexão</h3>
              <p className="text-sm text-gray-600 text-center font-medium leading-relaxed">A atividade de colar e colecionar figurinhas, é a desculpa perfeita para vocês sentarem no chão da sala e brincarem juntos por horas.</p>
            </div>
          </div>

          {/* CTA Opcional */}
          <div className="text-center mt-16">
            <a href="#ofertas" className="inline-flex items-center justify-center w-full sm:w-auto bg-[#0a7337] hover:bg-green-700 text-white font-bold text-xl py-5 px-10 rounded-full shadow-[0_6px_0_#064e3b] hover:shadow-[0_3px_0_#064e3b] hover:translate-y-[3px] transition-all uppercase animate-pulse-light">
              FAZ SENTIDO! QUERO AGORA <ArrowRight className="ml-2" />
            </a>
          </div>
        </div>
      </motion.section>

      {/* =========================================
          APRESENTAÇÃO DOS BÔNUS
      ========================================= */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true, margin: "-50px" }} 
        transition={{ duration: 0.5 }}
        id="presentes-especiais" className="py-20 px-4 bg-gray-50 border-b-8 border-[#e63946]"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#e63946] text-white font-black px-6 py-2 rounded-full text-sm mb-6 uppercase tracking-widest shadow-lg">
              <Gift size={18} fill="currentColor" /> Presentes Especiais
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase leading-tight">
              Hoje você leva uma super coleção de <span className="text-[#ff0000] underline decoration-[#ffc107] decoration-8 underline-offset-4">Bônus Inéditos</span>!
            </h2>
            <p className="text-gray-600 font-bold mt-6 text-lg">Apenas para quem garantir o PACOTE PREMIUM nesta página.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[ 
              { title: "Livro de Colorir Jogadores", desc: "Os craques em versão desenho animado para as crianças soltarem as cores.", img: "https://iili.io/BLL4sb1.png", val: "R$ 29,90" },
              { title: "Receitas Kids da Copa", desc: "Aprenda a fazer os lanchinhos tematicos da copa do mundo!", img: "https://iili.io/BLL4tsa.png", val: "R$ 19,90" },
              { title: "Envelope Jogadores Premium", desc: "Figurinhas dos jogadores premium douradas.", img: "https://iili.io/BLL4ZWg.png", val: "R$ 35,00" },
              { title: "Álbum de Estádios", desc: "Álbum e figurinhas de todos estádios da copa do mundo 2026.", img: "https://iili.io/BLL4bqJ.png", val: "R$ 25,00" }
            ].map((bonus, i) => (
              <div key={i} className={`bg-white p-6 rounded-[2rem] shadow-md border-2 border-dashed border-red-200 flex ${bonus.img ? 'flex-col items-center' : 'flex-col sm:flex-row items-center sm:items-start text-center sm:text-left'} gap-4 hover:border-red-500 transition-colors group`}>
                {bonus.img ? (
                  <div className="w-full flex items-center justify-center group-hover:scale-105 transition-transform">
                     <img src={bonus.img} alt={bonus.title} className="w-full max-w-[140px] md:max-w-[160px] object-contain drop-shadow-2xl" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <div className="scale-150">{bonus.icon}</div>
                  </div>
                )}
                <div className={bonus.img ? "text-center w-full" : ""}>
                  <h4 className="font-bold text-lg text-gray-800 uppercase tracking-tight mb-1">{bonus.title}</h4>
                  <p className="text-sm text-gray-600 mb-2 font-medium">{bonus.desc}</p>
                  <p className="text-sm font-black text-[#e63946] bg-red-50 inline-block px-3 py-1.5 rounded">Valor: <span className="line-through text-gray-400 font-bold">{bonus.val}</span> <span className="ml-1 uppercase">Grátis Hoje!</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* =========================================
          ANCORAGEM DE VALOR
      ========================================= */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true, margin: "-50px" }} 
        transition={{ duration: 0.5 }}
        className="py-16 bg-white text-center px-4"
      >
        <div className="max-w-2xl mx-auto">
          <p className="text-[#fa0000] font-bold uppercase tracking-widest text-sm mb-4">Colocando na Ponta do Lápis...</p>
          <div className="bg-gray-100 rounded-3xl p-8 shadow-inner border border-gray-200 text-left md:text-center space-y-4 max-w-md mx-auto">
            <div className="flex justify-between font-medium text-gray-600 border-b border-gray-200 pb-2"><span>Álbum Digital Completo:</span> <span>R$ 39,90</span></div>
            <div className="flex justify-between font-medium text-gray-600 border-b border-gray-200 pb-2"><span>Kit Figurinhas (+400):</span> <span>R$ 47,20</span></div>
            <div className="flex justify-between font-medium text-gray-600 border-b border-gray-200 pb-2"><span>Coleção de 4 Bônus VIP:</span> <span>R$ 109,90</span></div>
            <div className="flex justify-between font-black text-gray-400 text-xl pt-2 line-through decoration-[#ff0000]"><span>VALOR TOTAL:</span> <span className="text-[#ff0000]">R$ 197,00</span></div>
          </div>
          <p className="mt-12 text-xl md:text-2xl font-bold text-white leading-relaxed bg-[#0a7337] w-screen relative left-1/2 -translate-x-1/2 py-10 px-4 max-w-none">
            <span className="block max-w-4xl mx-auto">
              <span className="text-[#ffc107]">MAS CALMA!</span> Você não precisa gastar um absurdo para garantir a alegria dos pequenos. Liberamos o álbum completo com +400 figurinhas <span className="text-[#ffc107]">POR APENAS R$ 10,00</span>. Assim que realizar a confirmação do pagamento, você recebera os dados no WhatsApp e todo material será enviado no mesmo dia, tá bom?
              <br /><br />
              <span className="text-[#ffc107]">Dá uma olhada nas reações de quem já recebeu o material 👇</span>
            </span>
          </p>
        </div>
      </motion.section>

      {/* =========================================
          PROVAS SOCIAIS
      ========================================= */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true, margin: "-50px" }} 
        transition={{ duration: 0.5 }}
        className="py-20 px-4 bg-white border-y border-gray-100"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase">
              Quem comprou, <span className="text-[#ffc107] bg-[#0a7337] px-4 py-1 rounded-2xl inline-block transform rotate-2">aprovou!</span>
            </h2>
          </div>
          
          <div className="w-full overflow-hidden relative py-4">
            <div className="absolute inset-y-0 left-0 w-12 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-12 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
            
            <motion.div 
              animate={{ x: ["0%", "-50%"] }}
              transition={{ ease: "linear", duration: 20, repeat: Infinity }}
              className="flex gap-4 sm:gap-6 w-max"
            >
              {[
                "https://iili.io/BsL3z1s.jpg",
                "https://iili.io/BsL3nLX.jpg",
                "https://iili.io/BsL3IrG.jpg",
                "https://iili.io/BsL3xBn.jpg",
                "https://iili.io/BsL3z1s.jpg",
                "https://iili.io/BsL3nLX.jpg",
                "https://iili.io/BsL3IrG.jpg",
                "https://iili.io/BsL3xBn.jpg"
              ].map((img, i) => (
                 <div key={i} className="w-[280px] sm:w-[320px] bg-gray-50 rounded-3xl overflow-hidden shadow-lg border-4 border-white flex-shrink-0">
                   <img src={img} alt={`Avaliação ${i+1}`} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300" />
                 </div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* =========================================
          SESSÃO OFERTA (TACADA FINAL)
      ========================================= */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true, margin: "-50px" }} 
        transition={{ duration: 0.5 }}
        id="ofertas" className="py-20 px-4 bg-[#0a7337] relative overflow-hidden"
      >
        {/* Decorative BG */}
        <div className="absolute inset-0 bg-[#064e26] opacity-50 bg-[radial-gradient(#156d35_2px,transparent_2px)] [background-size:24px_24px]"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase drop-shadow-md">Garanta AGORA e receba hoje Seu <span className="text-[#ffc107]">Album da copa 2026!</span></h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center lg:items-end justify-center">
            
            {/* PACOTE BÁSICO (Downsell/Standard) */}
            <div className="w-full max-w-sm bg-white rounded-[2.5rem] shadow-xl flex flex-col p-8 opacity-95 transform lg:scale-95">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-500 uppercase tracking-tight">Pacote Básico</h3>
                <div className="mt-4 flex justify-center items-baseline gap-1 text-[#3a86ff]">
                  <span className="text-xl font-bold">R$</span>
                  <span className="text-6xl font-black tracking-tighter">10</span>
                  <span className="text-xl font-bold">,00</span>
                </div>
                <p className="text-xs font-black text-white bg-[#3a86ff] inline-block px-3 py-1 rounded-full mt-2 uppercase">Pagamento Único</p>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex gap-3 items-center"><CheckCircle2 className="text-[#3a86ff] shrink-0" size={24} /> <span className="text-sm font-bold text-gray-700">Álbum Completo Copa 2026</span></li>
                <li className="flex gap-3 items-center"><CheckCircle2 className="text-[#3a86ff] shrink-0" size={24} /> <span className="text-sm font-bold text-gray-700">+400 Figurinhas Jogadores</span></li>
                <li className="flex gap-3 items-start opacity-40"><X className="text-gray-400 shrink-0 mt-0.5" size={24} /> <span className="text-sm font-medium text-gray-500 line-through">Sem Nenhum Bônus</span></li>
              </ul>

              <div 
                role="button"
                tabIndex={0}
                onClick={handleBasicClick}
                className="w-full py-6 rounded-[80px] border-solid border-4 border-[#48afff] bg-[#48afff] text-black font-black hover:bg-blue-400 hover:border-blue-400 transition-all uppercase text-xl text-center cursor-pointer animate-pulse-light block"
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleBasicClick(e as any) }}
              >
                Comprar Básico
              </div>
            </div>

            {/* PACOTE PREMIUM (The target) */}
            <div className="w-full max-w-[420px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-8 border-[#ffc107] flex flex-col p-8 relative z-20 transform lg:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[60%] bg-[#ffc107] text-[#0a7337] font-black px-6 py-2 rounded-full text-base uppercase tracking-widest shadow-xl whitespace-nowrap border-4 border-white flex items-center gap-2">
                <Trophy fill="currentColor" size={20}/> Escolha Favorita
              </div>
              
              <div className="text-center mb-6 mt-4">
                <h3 className="text-3xl font-black text-[#e63946] uppercase tracking-tighter">Pacote Premium</h3>
                <div className="mt-2 flex justify-center items-baseline gap-1 text-[#0a7337]">
                  <span className="text-2xl font-bold opacity-80">R$</span>
                  <span className="text-7xl font-black tracking-tighter">27</span>
                  <span className="text-2xl font-bold opacity-80">,00</span>
                </div>
                <div className="mt-3 bg-red-100 text-red-600 text-sm font-black py-1.5 rounded-full inline-block px-4 uppercase animate-pulse">Menos de R$ 1 por dia!</div>
              </div>

              <div className="bg-green-50 rounded-2xl p-5 mb-6 border border-green-200 shadow-inner">
                <div className="text-xs font-black text-[#0a7337] uppercase tracking-widest mb-3 flex items-center gap-2"><CheckSquare size={14}/> Tudo Incluído:</div>
                <ul className="space-y-3">
                  <li className="flex gap-3 items-center"><CheckCircle2 className="text-[#0a7337] shrink-0" size={20} /> <span className="text-sm text-gray-800 font-bold">Álbum Completo & +400 Figurinhas</span></li>
                  <li className="flex gap-3 items-center"><CheckCircle2 className="text-[#0a7337] shrink-0" size={20} /> <span className="text-sm font-bold text-[#e63946]">Bônus: Livro de Colorir Jogadores</span></li>
                  <li className="flex gap-3 items-center"><CheckCircle2 className="text-[#0a7337] shrink-0" size={20} /> <span className="text-sm font-bold text-[#e63946]">Bônus: Receitas Kids da Copa</span></li>
                  <li className="flex gap-3 items-center"><CheckCircle2 className="text-[#0a7337] shrink-0" size={20} /> <span className="text-sm font-bold text-[#e63946]">Bônus: Envelope Jogadores Premium</span></li>
                  <li className="flex gap-3 items-center"><CheckCircle2 className="text-[#0a7337] shrink-0" size={20} /> <span className="text-sm font-bold text-[#e63946]">Bônus: Álbum dos Estádios</span></li>
                  <li className="flex gap-3 items-center"><CheckCircle2 className="text-[#0a7337] shrink-0" size={20} /> <span className="text-sm text-gray-800 font-bold">Receba em menos de 24H</span></li>
                  <li className="flex gap-3 items-center"><Truck className="text-[#0a7337] shrink-0" size={20} /> <span className="text-sm text-[#0a7337] font-black uppercase">ENVIO GRÁTIS</span></li>
                </ul>
              </div>

              <button 
                onClick={(e) => { e.preventDefault(); handleCheckout('https://pay.lowify.com.br/checkout.php?product_id=OeqTOG'); }}
                className="w-full bg-[#ffc107] hover:bg-yellow-400 text-[#0a7337] font-black text-xl py-6 rounded-2xl shadow-[0_6px_0_#b45309] hover:shadow-[0_3px_0_#b45309] hover:translate-y-[3px] transition-all uppercase animate-pulse-light text-center cursor-pointer block inline-block"
              >
                COMPRAR PACOTE PREMIUM
              </button>
              
              <p className="text-xs text-center text-gray-400 mt-4 font-bold flex justify-center items-center gap-1">
                <ShieldCheck size={14}/> Compra Segura via plataforma oficial
              </p>
            </div>
          </div>
          

        </div>
      </motion.section>

      {/* =========================================
          FAQ E GARANTIA
      ========================================= */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true, margin: "-50px" }} 
        transition={{ duration: 0.5 }}
        className="py-20 px-4 bg-gray-50"
      >
        <div className="max-w-4xl mx-auto">
          
          <h2 className="text-3xl md:text-4xl font-black text-center mb-10 text-gray-900 uppercase">Ficou Alguma Dúvida?</h2>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 md:p-10 mb-16">
            <FaqItem 
              question="Vou estar recebendo meu album copa do mundo 2026 completo?" 
              answer="SIM! O álbum copa do mundo 2026 completo com +400 figurinhas e todo material restante será enviado para você dentro de 24 Horas. " 
            />
            <FaqItem 
              question="Tenho suporte pós compra?" 
              answer="Sim! Assim que o pagamento for realizado, entraremos em contato com você via whatsapp ou email." 
            />
            <FaqItem 
              question="Como eu realizo o pagamento?" 
              answer="Basta clicar nos botões acima e preencher com todas informações correta que sera pedido, após preencher, gerar PIX e realizar pagamento no seu banco de confiança. " 
            />
            <FaqItem 
              question="Terei que comprar mais figurinhas depois?" 
              answer="Não! Vem com todas as mais de 400 figurinhas atualizando semanalmente! Você se diverte, cola e coleciona o album completo da copa do mundo 2026!" 
            />
          </div>

          {/* Garantia in-face */}
          <div className="bg-[#0a7337] rounded-[2rem] p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center gap-8 text-center md:text-left relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
             <img src="https://iili.io/BsPnY1n.png" alt="Garantia" className="w-full max-w-[280px] md:max-w-[320px] shrink-0 drop-shadow-2xl" />
             <div>
                <p className="text-green-100 font-medium text-sm md:text-base leading-relaxed">Nós confiamos tanto na alegria que esse material vai gerar na sua casa que damos uma garantia incondicional. Comprou, recebeu, não gostou da qualidade? Mande um e-mail que devolvemos seu dinheiro na hora. Zero risco para você.</p>
             </div>
          </div>
        </div>
      </motion.section>

      {/* =========================================
          FOOTER
      ========================================= */}
      <footer className="bg-gray-900 text-gray-500 text-center py-12 px-4 text-xs">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <img 
            src="https://iili.io/BiS3b5P.png" 
            alt="StartKids Álbum da Copa do Mundo Infantil" 
            className="w-full max-w-[120px] mb-8 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            referrerPolicy="no-referrer"
          />
          <p>&copy; {new Date().getFullYear()} StartKids Álbum Digital - Todos os direitos reservados. Compra 100% processada com segurança HTTPS e Criptografia.</p>
        </div>
      </footer>

      {/* =========================================
          UPSELL MODAL (Intercepts R$10 button)
      ========================================= */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="bg-white rounded-[2rem] w-full max-w-lg shadow-[0_0_50px_rgba(255,193,7,0.4)] relative z-10 overflow-hidden flex flex-col max-h-[90vh] border-8 border-[#ffc107]"
            >
              {/* Header */}
              <div className="bg-[#e63946] text-white p-5 text-center relative border-b-4 border-red-800">
                <div className="flex items-center justify-center gap-2 font-black text-xl uppercase tracking-wider">
                  <AlertTriangle className="text-yellow-300" />
                  ESPERE! NÃO FECHE!
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 md:p-8 overflow-y-auto">
                <img src="https://iili.io/BsLL4dF.png" alt="Bônus Exclusivos" className="w-full max-w-[250px] sm:max-w-[320px] md:max-w-[400px] mx-auto mb-3 md:mb-5 drop-shadow-xl" />

                <div className="bg-yellow-50 rounded-2xl p-3 sm:p-4 border-2 border-yellow-300 mb-4 sm:mb-6 relative shadow-inner">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ffc107] text-[#0a7337] text-[10px] sm:text-xs font-black px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-widest shadow-sm whitespace-nowrap">
                    Apenas nessa janela
                  </div>
                  
                  <div className="flex justify-center items-center gap-3 mb-1 sm:mb-2">
                    <div className="line-through text-gray-400 text-base sm:text-xl font-bold">R$ 27,00</div>
                    <div className="text-[10px] sm:text-xs bg-red-100 text-[#e63946] px-2 py-0.5 sm:py-1 rounded-full font-black animate-pulse">LOUCURA -32% OFF</div>
                  </div>
                  <div className="text-center text-[#0a7337] leading-tight">
                    <span className="text-sm sm:text-xl font-bold">Libere os Bônus por apenas</span><br/>
                    <span className="text-5xl sm:text-6xl font-black tracking-tighter">R$ 17<span className="text-xl sm:text-2xl">,00</span></span>
                  </div>
                  <div className="text-center mt-2 sm:mt-3">
                    <span className="text-[10px] sm:text-xs font-black bg-green-100 text-green-800 py-1 rounded-full px-3 inline-block">São apenas R$ 7,00 a mais!</span>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-[10px] sm:text-xs text-[#0a7337] font-black uppercase flex justify-center items-center gap-1">
                      <Truck size={14} /> ENVIO GRÁTIS
                    </span>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <button 
                    onClick={(e) => { e.preventDefault(); handleCheckout('https://pay.lowify.com.br/go.php?offer=2not4ae'); }}
                    className="w-full bg-[#f1ff00] hover:bg-yellow-400 text-[#1c6110] font-black text-sm sm:text-lg py-3 sm:py-4 px-2 sm:px-4 rounded-[16px] shadow-[0_4px_0_#b45309] sm:shadow-[0_6px_0_#b45309] hover:shadow-[0_2px_0_#b45309] hover:translate-y-[2px] sm:hover:translate-y-[4px] transition-all uppercase flex justify-center items-center gap-2 leading-none text-center cursor-pointer block animate-pulse-light inline-block"
                  >
                    SIM! QUERO OS BÔNUS POR R$17
                  </button>
                  
                  <button 
                     onClick={(e) => { e.preventDefault(); handleCheckout('https://pay.lowify.com.br/checkout?product_id=rJu6er'); }}
                     className="w-full text-center text-[10px] sm:text-xs font-bold text-gray-400 hover:text-gray-700 pt-3 pb-1 transition-colors uppercase decoration-gray-300 underline underline-offset-4 cursor-pointer block inline-block"
                  >
                    Ignorar bônus exclusivos. Quero apenas o pacote Básico por R$10.
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
