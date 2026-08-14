import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, ShieldCheck, Trophy, Flame, Play } from 'lucide-react';
import { BRAND_INFO } from '../data/initialData';

interface HeroProps {
  onOpenBooking?: () => void;
  onOpenVirtualCard?: () => void;
}

const ACTIVITY_SLIDES = [
  {
    tag: 'AVENTURA & ALTURA',
    title: 'MURO DE ESCALADA & TIROLESA',
    description: 'Desafíos de altura, cruce aéreo, arneses y superación motriz con instructores calificados.',
    color: '#ED3078',
    icon: Flame
  },
  {
    tag: 'FESTEJOS ÚNICOS',
    title: 'CUMPLEAÑOS ACTIVOS E INOLVIDABLES',
    description: '2 horas y media de diversión guiada, juegos dinámicos, música y cero pantallas.',
    color: '#1EB8BF',
    icon: Trophy
  },
  {
    tag: 'DESTREZA MOTRIZ',
    title: 'CIRCUITOS DEPORTIVOS & PARKOUR',
    description: 'Obstáculos, estaciones de salto, coordinación, velocidad y trabajo en equipo para descargar energía.',
    color: '#F2C700',
    icon: ShieldCheck
  },
  {
    tag: 'ACROBACIA AÉREA',
    title: 'TELAS, AROS & CAMAS ELÁSTICAS',
    description: 'Figuras aéreas, saltos gigantes y actividades circenses protegidas sobre colchonetas de alta densidad.',
    color: '#A3BA13',
    icon: Flame
  },
  {
    tag: 'ESPACIO TODOS LOS DÍAS',
    title: 'TALLERES DEPORTIVOS & PASE POR UN DÍA',
    description: 'Peques en Acción y Crossfteens todas las semanas para jugar, aprender y hacer amigos.',
    color: '#1EB8BF',
    icon: Trophy
  }
];

export const Hero: React.FC<HeroProps> = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Auto slide rotation every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % ACTIVITY_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Aggressive & reliable Autoplay / Playback enforcement
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', 'true');

    const forcePlay = () => {
      if (!video) return;
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay blocked by browser policy until first touch/click
          const unlockPlay = () => {
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().catch(() => {});
            }
            window.removeEventListener('click', unlockPlay);
            window.removeEventListener('touchstart', unlockPlay);
            window.removeEventListener('scroll', unlockPlay);
            window.removeEventListener('mousemove', unlockPlay);
          };
          window.addEventListener('click', unlockPlay, { once: true });
          window.addEventListener('touchstart', unlockPlay, { once: true });
          window.addEventListener('scroll', unlockPlay, { once: true });
          window.addEventListener('mousemove', unlockPlay, { once: true });
        });
      }
    };

    // Immediate attempt
    forcePlay();

    // Check again after 300ms in case DOM/media was buffering
    const retryTimeout = setTimeout(forcePlay, 300);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        forcePlay();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(retryTimeout);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % ACTIVITY_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + ACTIVITY_SLIDES.length) % ACTIVITY_SLIDES.length);
  };

  const current = ACTIVITY_SLIDES[currentSlide];
  const IconComponent = current.icon;

  return (
    <section className="relative w-full overflow-hidden bg-zinc-950 text-white min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] flex items-center justify-center">
      
      {/* Background Full Width & Full Height Video - Always Visible & Vivid */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <video
          ref={(el) => {
            if (el) {
              el.muted = true;
              el.defaultMuted = true;
            }
            videoRef.current = el;
          }}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/hero_poster.jpg"
          onLoadedData={(e) => {
            const vid = e.currentTarget;
            vid.muted = true;
            vid.play().catch(() => {});
          }}
          onCanPlay={(e) => {
            const vid = e.currentTarget;
            vid.muted = true;
            vid.play().catch(() => {});
          }}
          onEnded={(e) => {
            const vid = e.currentTarget;
            vid.play().catch(() => {});
          }}
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-opacity duration-700 block"
        >
          <source src="/video.mp4" type="video/mp4" />
          <source src="/hero_video.mp4" type="video/mp4" />
        </video>

        {/* Minimal soft vignette overlay for crisp legibility without darkening video */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 pointer-events-none" />
      </div>

      {/* Foreground Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex flex-col justify-center min-h-[500px] sm:min-h-[560px] lg:min-h-[620px]">
        
        {/* Central Core: Main Headline + Free-Floating Sliding Activity Titles (Centered) */}
        <div className="my-auto py-4 sm:py-6 max-w-4xl mx-auto w-full text-center space-y-5 flex flex-col items-center">
          
          {/* Main Fixed Slogan */}
          <div className="space-y-2 text-center">
            <h1 className="-mt-11 text-4xl sm:text-6xl lg:text-[75px] text-white leading-tight sm:leading-[64px] tracking-wide uppercase drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)]">
              Una excusa más para <br />
              <span className="text-[#ED3078] drop-shadow-[0_0_30px_rgba(237,48,120,0.7)]">
                NO usar pantallas
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-200 font-bold uppercase tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {BRAND_INFO.subtitle}
            </p>
          </div>

          {/* Free-Floating Activity Slide Content (Centered, No box/container, Fixed height to avoid jumps) */}
          <div className="pt-[4px] pb-[1px] mt-[55px] w-full flex flex-col items-center min-h-[160px] sm:min-h-[150px] justify-between transform scale-90 sm:scale-[0.80] origin-top">
            
            {/* Tag Header */}
            <div className="flex items-center justify-center h-7">
              <span 
                className="text-xs font-black px-3.5 py-1 rounded-lg uppercase tracking-wider text-black shadow-lg transition-colors duration-500"
                style={{ backgroundColor: current.color }}
              >
                {current.tag}
              </span>
            </div>

            {/* Free Floating Title (Consistent min-height & line clamps) */}
            <div className="h-[68px] sm:h-[60px] flex items-center justify-center">
              <h2 className="-mb-[18px] font-heading text-2xl sm:text-4xl lg:text-5xl text-white uppercase tracking-tight flex items-center justify-center gap-3 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] transition-all duration-300">
                <IconComponent className="w-7 h-7 sm:w-10 sm:h-10 shrink-0 drop-shadow" style={{ color: current.color }} />
                <span className="font-bold text-[20px] sm:text-[34px] leading-[26px] sm:leading-[40px]" style={{ color: '#ffffff' }}>
                  {current.title}
                </span>
              </h2>
            </div>

            {/* Free Floating Description (Consistent 2-line height box) */}
            <div className="h-[48px] sm:h-[56px] flex items-center justify-center">
              <p className="text-sm sm:text-lg text-zinc-100 font-semibold leading-snug sm:leading-relaxed max-w-2xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] text-center line-clamp-2">
                {current.description}
              </p>
            </div>

            {/* Slider Progress Bar Indicators (Free floating & Centered) */}
            <div className="flex items-center justify-center gap-2 pt-1 h-5">
              {ACTIVITY_SLIDES.map((slide, index) => (
                <button
                  key={slide.title}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer drop-shadow ${
                    currentSlide === index 
                      ? 'w-12 bg-white' 
                      : 'w-3 bg-white/40 hover:bg-white/70'
                  }`}
                  style={{
                    backgroundColor: currentSlide === index ? slide.color : undefined
                  }}
                  title={slide.title}
                />
              ))}
            </div>

          </div>

        </div>

        {/* Subtle Floating WhatsApp Circular Badge with Surrounding Text (Placed to the side) */}
        <div className="absolute bottom-24 right-4 sm:bottom-28 sm:right-8 lg:right-12 z-20">
          <a
            href={`${BRAND_INFO.whatsappUrl}?text=${encodeURIComponent('Hola! Quisiera consultar más información sobre las actividades y cumpleaños en El Galpón.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110"
            title="Consultar por WhatsApp"
          >
            {/* Outer Circular SVG with Curved Rotating Text */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
              <svg 
                className="absolute inset-0 w-full h-full animate-[spin_18s_linear_infinite] group-hover:animate-[spin_8s_linear_infinite] pointer-events-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" 
                viewBox="0 0 100 100"
              >
                <defs>
                  <path
                    id="heroCircleTextPath"
                    d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                  />
                </defs>
                <text 
                  fill="#ffffff" 
                  fontSize="8.5" 
                  fontWeight="900" 
                  className="font-heading uppercase tracking-[0.18em]"
                >
                  <textPath href="#heroCircleTextPath" startOffset="0%">
                    • CONSULTAR • WHATSAPP • ESCRIBINOS •
                  </textPath>
                </text>
              </svg>

              {/* Central WhatsApp Round Button */}
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.6)] border-2 border-white group-hover:bg-[#1EB8BF] transition-all duration-300">
                <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white/20" />
              </div>
            </div>
          </a>
        </div>

        {/* Bottom Bar: Rapid Activity Direct Pills */}
        <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-black/50 border border-white/15 backdrop-blur-md rounded-xl p-2.5">
            <div className="text-[10px] font-bold text-zinc-300 uppercase">Aventura</div>
            <div className="text-xs font-black text-white uppercase">Muro & Tirolesa</div>
          </div>
          <div className="bg-black/50 border border-white/15 backdrop-blur-md rounded-xl p-2.5">
            <div className="text-[10px] font-bold text-zinc-300 uppercase">Festejos</div>
            <div className="text-xs font-black text-white uppercase">Cumples 100% Activos</div>
          </div>
          <div className="bg-black/50 border border-white/15 backdrop-blur-md rounded-xl p-2.5">
            <div className="text-[10px] font-bold text-zinc-300 uppercase">Deporte</div>
            <div className="text-xs font-black text-white uppercase">Circuitos & Parkour</div>
          </div>
          <div className="bg-black/50 border border-white/15 backdrop-blur-md rounded-xl p-2.5">
            <div className="text-[10px] font-bold text-zinc-300 uppercase">Seguridad</div>
            <div className="text-xs font-black text-white uppercase">Docentes de Ed. Física</div>
          </div>
        </div>

      </div>

    </section>
  );
};



