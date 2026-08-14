import React from 'react';
import { ATTRACTIONS } from '../data/initialData';
import {
  ShieldCheck,
  CheckCircle2,
  Heart,
  Sparkles,
  Cake,
  PartyPopper,
  Users,
  Clock,
  Zap,
  Mountain,
  Wind,
  Trophy,
  Activity,
  Flame,
  Palette,
} from 'lucide-react';
import { AttractionsGallery } from './AttractionsGallery';

interface BirthdaysSectionProps {
  onOpenBooking: () => void;
  onOpenVirtualCard: () => void;
}

const getAttractionIcon = (iconName: string, id: string) => {
  switch (id) {
    case 'muro':
      return <Mountain className="w-5 h-5" />;
    case 'tirolesa':
      return <Wind className="w-5 h-5" />;
    case 'circuitos':
      return <Trophy className="w-5 h-5" />;
    case 'telas_aros':
      return <Activity className="w-5 h-5" />;
    case 'elasticas':
      return <Flame className="w-5 h-5" />;
    case 'arte_creatividad':
      return <Palette className="w-5 h-5" />;
    default:
      if (iconName === 'Mountain') return <Mountain className="w-5 h-5" />;
      return <Zap className="w-5 h-5" />;
  }
};

export const BirthdaysSection: React.FC<BirthdaysSectionProps> = ({
  onOpenBooking,
  onOpenVirtualCard,
}) => {
  return (
    <section id="cumpleanos" className="w-full bg-gradient-to-b from-black via-[#ED3078] via-35% to-[#1EB8BF] text-white py-16 sm:py-24 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Section Header Bento Box */}
        <div className="bg-black/60 backdrop-blur-md rounded-3xl border-2 border-white/25 p-6 sm:p-10 text-center space-y-3 shadow-2xl">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#ED3078] text-white font-heading font-black text-xs tracking-widest uppercase shadow-md">
            Festejos Únicos e Inolvidables
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white">
            Cumpleaños en <span className="text-[#F2C700] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">El Galpón</span>
          </h2>
          <p className="text-white/90 text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            2 horas y media de máxima adrenalina, movimiento y sonrisas. Un ambiente supervisado por profesores donde cada invitado vive una verdadera fiesta deportiva.
          </p>
        </div>

        {/* 3 Core Highlights Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-black/60 backdrop-blur-md border-2 border-white/20 hover:border-white/60 p-6 rounded-2xl flex flex-col justify-between space-y-3 shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-zinc-950/60 border border-white/20 flex items-center justify-center text-[#1EB8BF] shadow-xs">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading text-xl font-black text-white mb-1 uppercase">2:30 Hs de Acción</h3>
              <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                Tiempo perfecto de juego intenso. Hacen deportes desde que llegan hasta que se van y terminan agotados y felices.
              </p>
            </div>
          </div>

          <div className="bg-black/60 backdrop-blur-md border-2 border-white/20 hover:border-white/60 p-6 rounded-2xl flex flex-col justify-between space-y-3 shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-zinc-950/60 border border-white/20 flex items-center justify-center text-[#1EB8BF] shadow-xs">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading text-xl font-black text-white mb-1 uppercase">Base para 20 Chicos</h3>
              <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                Podés invitar hasta 35 niños en total. Una semana antes definimos Adicional 1 (21 a 28) o Adicional 2 (29 a 35).
              </p>
            </div>
          </div>

          <div className="bg-black/60 backdrop-blur-md border-2 border-white/20 hover:border-white/60 p-6 rounded-2xl flex flex-col justify-between space-y-3 shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-zinc-950/60 border border-white/20 flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading text-xl font-black text-white mb-1 uppercase">Profes a Cargo</h3>
              <p className="text-xs text-white font-medium leading-relaxed">
                Muro de escalada, tirolesa, telas y camas elásticas totalmente supervisados con pulseras identificatorias.
              </p>
            </div>
          </div>
        </div>

        {/* Attractions Grid */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-8 bg-white rounded-full shadow-md" />
            <h3 className="font-heading text-2xl font-black text-white uppercase tracking-wide drop-shadow-sm">
              Atracciones y Juegos Incluidos
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ATTRACTIONS.map((item) => {
              return (
                <div
                  key={item.id}
                  className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20 flex flex-col justify-between space-y-4 hover:border-white hover:scale-[1.01] shadow-xl transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="p-2.5 rounded-xl bg-zinc-950/60 border border-white/20 text-white font-black">
                        {getAttractionIcon(item.icon, item.id)}
                      </span>
                      {item.staffSupervised ? (
                        <span className="text-[10px] font-black bg-[#1EB8BF] text-black px-2.5 py-1 rounded-full uppercase shadow-xs">
                          Supervisado
                        </span>
                      ) : (
                        <span className="text-[10px] font-black bg-zinc-900/60 text-white border border-white/20 px-2.5 py-1 rounded-full uppercase">
                          Libre
                        </span>
                      )}
                    </div>

                    <h4 className="font-heading text-lg font-black text-white mb-1 uppercase">{item.title}</h4>
                    <p className="text-xs text-white leading-relaxed font-medium">{item.description}</p>
                  </div>

                  <div className="pt-2 border-t border-white/15 text-[11px] text-[#A3BA13] font-black flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#A3BA13]" />
                    Garantía de entretenimiento sano
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dynamic Slow Scrolling Photo Gallery */}
          <AttractionsGallery />
        </div>

        {/* Tarjeta Virtual RSVP Feature Bento Card */}
        <div className="bg-black/60 backdrop-blur-md rounded-3xl border-2 border-white/25 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ED3078] text-white text-xs font-black shadow-xs">
                <Heart className="w-3.5 h-3.5 fill-current" /> Tarjeta Virtual Personalizada
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-black text-white">
                ¿Cómo confirman asistencia los invitados de tu cumple?
              </h3>
              <p className="text-zinc-200 text-sm leading-relaxed font-medium">
                Generamos una <strong className="text-[#F2C700]">Tarjeta Virtual Interactiva</strong> con botón de "Confirmar Asistencia". Las respuestas llegan directo a tu celular por WhatsApp para que lleves el control exacto.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={onOpenVirtualCard}
                  className="bg-[#ED3078] hover:bg-[#d62166] text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105"
                >
                  <Cake className="w-4 h-4 text-white" /> Probar Demo Tarjeta Virtual
                </button>
                <button
                  onClick={onOpenBooking}
                  className="bg-zinc-950/60 hover:bg-black text-white border-2 border-white/30 hover:border-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all cursor-pointer"
                >
                  Reservar Cumpleaños
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-zinc-950/60 border border-white/20 rounded-2xl p-5 text-center space-y-3 shadow-inner">
              <div className="text-[11px] uppercase font-black tracking-wider text-[#F2C700]">Vista previa simulación</div>
              <div className="bg-[#ED3078] text-white p-3 rounded-xl font-heading font-black text-base shadow-md">
                ¡Felipe cumple 6 años! 🎂
              </div>
              <p className="text-xs text-zinc-300 font-medium">Te esperamos en El Galpón para jugar y escalar juntos.</p>
              <button
                onClick={onOpenVirtualCard}
                className="w-full bg-[#A3BA13] hover:bg-[#91a70f] text-black font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
              >
                <span>Confirmar mi asistencia por WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

