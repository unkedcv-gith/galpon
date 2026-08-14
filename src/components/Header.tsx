import React, { useState, useEffect } from 'react';
import { Calendar, Shield, Menu, X, Heart } from 'lucide-react';

interface HeaderProps {
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  onOpenVirtualCard: () => void;
}

const NAV_ITEMS = [
  {
    id: 'cumpleanos',
    label: 'CUMPLEAÑOS',
    color: '#ED3078',
    glowColor: 'rgba(237, 48, 120, 0.4)',
    solidBg: 'bg-[#ED3078]',
    solidText: 'text-white',
    solidBorder: 'border-[#ED3078]',
    invertHover: 'hover:bg-black hover:text-[#ED3078] hover:border-[#ED3078] hover:shadow-[0_0_16px_rgba(237,48,120,0.5)]',
    activeStyle: 'bg-black text-[#ED3078] border-[#ED3078] shadow-[0_0_18px_rgba(237,48,120,0.6)] scale-105',
  },
  {
    id: 'talleres',
    label: 'TALLERES',
    color: '#1EB8BF',
    glowColor: 'rgba(30, 184, 191, 0.4)',
    solidBg: 'bg-[#1EB8BF]',
    solidText: 'text-black',
    solidBorder: 'border-[#1EB8BF]',
    invertHover: 'hover:bg-black hover:text-[#1EB8BF] hover:border-[#1EB8BF] hover:shadow-[0_0_16px_rgba(30,184,191,0.5)]',
    activeStyle: 'bg-black text-[#1EB8BF] border-[#1EB8BF] shadow-[0_0_18px_rgba(30,184,191,0.6)] scale-105',
  },
  {
    id: 'por-un-dia',
    label: 'POR UN DÍA',
    color: '#A3BA13',
    glowColor: 'rgba(163, 186, 19, 0.4)',
    solidBg: 'bg-[#A3BA13]',
    solidText: 'text-black',
    solidBorder: 'border-[#A3BA13]',
    invertHover: 'hover:bg-black hover:text-[#A3BA13] hover:border-[#A3BA13] hover:shadow-[0_0_16px_rgba(163,186,19,0.5)]',
    activeStyle: 'bg-black text-[#A3BA13] border-[#A3BA13] shadow-[0_0_18px_rgba(163,186,19,0.6)] scale-105',
  },
  {
    id: 'faqs',
    label: 'PREGUNTAS (FAQ)',
    color: '#F2C700',
    glowColor: 'rgba(242, 199, 0, 0.4)',
    solidBg: 'bg-[#F2C700]',
    solidText: 'text-black',
    solidBorder: 'border-[#F2C700]',
    invertHover: 'hover:bg-black hover:text-[#F2C700] hover:border-[#F2C700] hover:shadow-[0_0_16px_rgba(242,199,0,0.5)]',
    activeStyle: 'bg-black text-[#F2C700] border-[#F2C700] shadow-[0_0_18px_rgba(242,199,0,0.6)] scale-105',
  },
];

export const Header: React.FC<HeaderProps> = ({
  onOpenBooking,
  onOpenAdmin,
  isAdminLoggedIn,
  onOpenVirtualCard,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  // Active section tracking on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      const sections = NAV_ITEMS.map((item) => {
        const el = document.getElementById(item.id);
        return {
          id: item.id,
          top: el ? el.offsetTop : 0,
          bottom: el ? el.offsetTop + el.offsetHeight : 0,
        };
      });

      const current = sections.find(
        (sec) => scrollPosition >= sec.top && scrollPosition < sec.bottom
      );

      if (current) {
        setActiveSection(current.id);
      } else if (window.scrollY < 300) {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-6 lg:px-8 py-3 bg-black/60 backdrop-blur-lg border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 sm:gap-8">
        
        {/* Logo (Free standing without container box) */}
        <div 
          onClick={() => {
            setActiveSection('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
          className="cursor-pointer flex items-center shrink-0 group py-0.5"
          title="Ir al inicio"
        >
          <img 
            src="/marca_el_galpon_blanca.svg" 
            alt="El Galpón Logo" 
            className="h-11 sm:h-14 max-w-[190px] sm:max-w-[260px] w-auto object-contain group-hover:scale-105 transition-transform drop-shadow" 
          />
        </div>

        {/* Desktop Nav - Solid Filled with Inverted Interaction & generous comfortable spacing */}
        <nav className="hidden lg:flex items-center gap-3.5 xl:gap-4 text-xs font-black uppercase tracking-wider">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`px-4 xl:px-4.5 py-2.5 rounded-xl border-2 transition-all duration-200 cursor-pointer font-black whitespace-nowrap shrink-0 ${
                  isActive
                    ? item.activeStyle
                    : `${item.solidBg} ${item.solidText} ${item.solidBorder} ${item.invertHover}`
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* CTA Actions - Solo Filete Button */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          <button
            onClick={onOpenBooking}
            className="bg-zinc-950/90 hover:bg-[#1EB8BF] text-[#1EB8BF] hover:text-black font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl border-2 border-[#1EB8BF] shadow-[0_0_12px_rgba(30,184,191,0.25)] hover:shadow-[0_0_22px_rgba(30,184,191,0.6)] hover:scale-105 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Calendar className="w-4 h-4 text-current" />
            <span>RESERVAR TURNO</span>
          </button>
        </div>

        {/* Mobile / Tablet Menu Buttons */}
        <div className="lg:hidden flex items-center gap-3">
          <button
            onClick={onOpenBooking}
            className="bg-zinc-950 hover:bg-[#1EB8BF] text-[#1EB8BF] hover:text-black px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 border-2 border-[#1EB8BF] transition-all"
            title="Reservar turno"
          >
            <Calendar className="w-4 h-4 text-current" />
            <span className="hidden sm:inline">RESERVAR</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-zinc-950 border-2 border-white/20 text-white hover:border-[#1EB8BF] hover:text-[#1EB8BF] transition-all"
            title="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu with Solid & Inverted Buttons */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 max-w-7xl mx-auto bg-zinc-950/95 border-2 border-white/15 backdrop-blur-xl rounded-2xl p-4 shadow-2xl space-y-2.5 text-sm font-bold text-white animate-fadeIn">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`w-full text-center py-2.5 px-3.5 rounded-xl font-black uppercase text-xs border-2 transition-all ${
                  isActive
                    ? item.activeStyle
                    : `${item.solidBg} ${item.solidText} ${item.solidBorder} ${item.invertHover}`
                }`}
              >
                {item.label}
              </button>
            );
          })}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenVirtualCard();
            }}
            className="w-full text-left py-2.5 px-3.5 text-[#ED3078] hover:bg-[#ED3078]/10 border-2 border-[#ED3078] rounded-xl font-black uppercase text-xs transition-all flex items-center gap-2"
          >
            <Heart className="w-3.5 h-3.5 text-[#ED3078]" />
            <span>SIMULAR TARJETA VIRTUAL RSVP</span>
          </button>

          <div className="pt-2 border-t border-zinc-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full bg-[#1EB8BF] text-black font-black py-3 rounded-xl text-center flex items-center justify-center gap-2 uppercase text-xs border-2 border-[#1EB8BF] shadow-[0_0_12px_rgba(30,184,191,0.4)]"
            >
              <Calendar className="w-4 h-4 text-black" /> RESERVAR FECHA DE CUMPLE
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full bg-zinc-950 border-2 border-[#ED3078] text-white py-2.5 rounded-xl text-center text-xs font-black uppercase flex items-center justify-center gap-2 hover:bg-[#ED3078]/20 transition-all"
            >
              <Shield className="w-4 h-4 text-[#F2C700]" />
              {isAdminLoggedIn ? 'IR AL PANEL DE ADMINISTRACIÓN' : 'ACCESO ADMINISTRADOR'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

