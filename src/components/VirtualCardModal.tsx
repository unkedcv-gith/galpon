import React, { useState, useRef } from 'react';
import { 
  X, 
  Heart, 
  MessageCircle, 
  Copy, 
  Check, 
  Phone, 
  Download, 
  Upload, 
  Sparkles, 
  Image as ImageIcon, 
  Trash2, 
  Palette, 
  Share2, 
  Camera, 
  CheckCircle2,
  Calendar,
  Clock,
  MapPin
} from 'lucide-react';
import { BRAND_INFO } from '../data/initialData';
import { toPng } from 'html-to-image';

interface VirtualCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CardTheme = 'galpon' | 'aventura' | 'neon' | 'ninja';
type CardMode = 'interactive' | 'generic';

export const VirtualCardModal: React.FC<VirtualCardModalProps> = ({ isOpen, onClose }) => {
  const [cardMode, setCardMode] = useState<CardMode>('interactive');
  const [childName, setChildName] = useState('Benjamín');
  const [age, setAge] = useState(7);
  const [eventDate, setEventDate] = useState('Sábado 24 de Mayo');
  const [eventTime, setEventTime] = useState('15:00 a 17:30 hs');
  const [targetPhone, setTargetPhone] = useState('221 573-1047');
  const [customMessage, setCustomMessage] = useState('¡Vení con ropa cómoda para escalar, saltar y divertirte sin parar!');
  const [childPhoto, setChildPhoto] = useState<string | null>(null);
  const [theme, setTheme] = useState<CardTheme>('galpon');
  const [copied, setCopied] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const rsvpMessage = `¡Hola! Confirmo la asistencia para el cumpleaños de ${childName} el ${eventDate} de ${eventTime} en El Galpón.`;
  const cleanPhone = targetPhone.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/549${cleanPhone}?text=${encodeURIComponent(rsvpMessage)}`;

  const handleCopyText = () => {
    const cardText = `🎈 ¡Estás invitado al Cumpleaños de ${childName}! 🎂\n\n🗓️ Fecha: ${eventDate}\n⏰ Horario: ${eventTime}\n📍 Lugar: ${BRAND_INFO.address}\n\n👉 Por favor confirmá tu asistencia haciendo click acá: ${whatsappUrl}`;
    navigator.clipboard.writeText(cardText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('La imagen seleccionada es muy pesada. Por favor elegí una de hasta 8MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setChildPhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setChildPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    setIsGeneratingImage(true);
    setDownloadSuccess(false);

    try {
      // Create high-res PNG
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        quality: 0.98,
        filter: (node) => {
          // Exclude any element marked with no-export
          return !(node instanceof HTMLElement && node.classList.contains('no-export'));
        }
      });

      const fileName = `invitacion-${childName.toLowerCase().replace(/\s+/g, '-')}-${age}anios-el-galpon.png`;
      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Error al generar la imagen de la tarjeta:', err);
      // Fallback: download the generic card if available
      const fallbackLink = document.createElement('a');
      fallbackLink.download = 'invitacion-el-galpon.png';
      fallbackLink.href = '/tarjeta_generica.png';
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      document.body.removeChild(fallbackLink);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleShareNative = async () => {
    const cardText = `🎈 ¡Estás invitado al Cumpleaños de ${childName}! 🎂\n\n🗓️ Fecha: ${eventDate}\n⏰ Horario: ${eventTime}\n📍 Lugar: ${BRAND_INFO.address}\n\n👉 Confirmar asistencia aquí: ${whatsappUrl}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Cumpleaños de ${childName} en El Galpón`,
          text: cardText,
          url: whatsappUrl,
        });
      } catch {
        handleCopyText();
      }
    } else {
      handleCopyText();
    }
  };

  // Theme configuration styles
  const getThemeStyles = () => {
    switch (theme) {
      case 'aventura':
        return {
          border: 'border-[#1EB8BF]',
          shadow: 'shadow-[6px_6px_0px_0px_#1EB8BF]',
          tagBg: 'bg-[#1EB8BF] text-black',
          badgeAge: 'bg-[#1EB8BF] text-black',
          nameColor: 'text-[#1EB8BF]',
          accentBorder: 'border-[#1EB8BF]/40',
          gradientBg: 'from-zinc-950 via-[#0a2326] to-zinc-950'
        };
      case 'neon':
        return {
          border: 'border-[#ED3078]',
          shadow: 'shadow-[6px_6px_0px_0px_#ED3078]',
          tagBg: 'bg-[#ED3078] text-white',
          badgeAge: 'bg-[#ED3078] text-white',
          nameColor: 'text-[#ED3078]',
          accentBorder: 'border-[#ED3078]/40',
          gradientBg: 'from-zinc-950 via-[#260817] to-zinc-950'
        };
      case 'ninja':
        return {
          border: 'border-[#A3BA13]',
          shadow: 'shadow-[6px_6px_0px_0px_#A3BA13]',
          tagBg: 'bg-[#A3BA13] text-black',
          badgeAge: 'bg-[#A3BA13] text-black',
          nameColor: 'text-[#A3BA13]',
          accentBorder: 'border-[#A3BA13]/40',
          gradientBg: 'from-zinc-950 via-[#182405] to-zinc-950'
        };
      case 'galpon':
      default:
        return {
          border: 'border-[#F2C700]',
          shadow: 'shadow-[6px_6px_0px_0px_#F2C700]',
          tagBg: 'bg-[#ED3078] text-white',
          badgeAge: 'bg-[#F2C700] text-black',
          nameColor: 'text-white',
          accentBorder: 'border-white/20',
          gradientBg: 'from-zinc-950 via-zinc-900 to-black'
        };
    }
  };

  const activeTheme = getThemeStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-black/80 backdrop-blur-xl border-2 border-white/25 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl my-6">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-zinc-950/70 border-b-2 border-white/15 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-white font-heading font-black text-base sm:text-lg uppercase">
            <Heart className="w-5 h-5 fill-[#ED3078] text-[#ED3078] shrink-0" />
            <span>Creador & Simulador de Tarjeta Virtual WhatsApp</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="bg-zinc-950/90 px-5 sm:px-8 pt-4 pb-2 border-b border-white/10 flex flex-wrap gap-2 sm:gap-3 items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCardMode('interactive')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border-2 ${
                cardMode === 'interactive'
                  ? 'bg-[#ED3078] text-white border-white shadow-md'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>1. Tarjeta Personalizada con Foto / Temas</span>
            </button>

            <button
              onClick={() => setCardMode('generic')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border-2 ${
                cardMode === 'generic'
                  ? 'bg-[#1EB8BF] text-black border-white shadow-md'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>2. Flyer Oficial Genérico</span>
            </button>
          </div>

          <span className="text-[11px] text-[#F2C700] font-black uppercase tracking-wider hidden md:inline-block">
            ⚡ Lista para descargar y compartir por WhatsApp
          </span>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start max-h-[75vh] overflow-y-auto">
          
          {/* Controls Column */}
          <div className="lg:col-span-6 space-y-4 text-xs">
            
            {cardMode === 'interactive' ? (
              <>
                <div className="flex items-center justify-between border-b border-white/15 pb-2">
                  <h4 className="font-heading text-sm sm:text-base font-black text-white uppercase flex items-center gap-2">
                    <Palette className="w-4 h-4 text-[#ED3078]" /> Personalizá los Datos & Diseño
                  </h4>
                  <span className="text-[10px] text-[#A3BA13] font-black uppercase">Edición en vivo</span>
                </div>

                {/* Theme Picker */}
                <div className="space-y-1.5">
                  <label className="font-black text-white uppercase text-[11px]">Elegir Paleta Temática</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setTheme('galpon')}
                      className={`p-2 rounded-xl border-2 text-[10px] font-black uppercase text-center transition-all cursor-pointer ${
                        theme === 'galpon' ? 'bg-[#F2C700] text-black border-white shadow-sm' : 'bg-zinc-900 text-white border-zinc-800 hover:border-zinc-600'
                      }`}
                    >
                      🎪 Clásico
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('aventura')}
                      className={`p-2 rounded-xl border-2 text-[10px] font-black uppercase text-center transition-all cursor-pointer ${
                        theme === 'aventura' ? 'bg-[#1EB8BF] text-black border-white shadow-sm' : 'bg-zinc-900 text-white border-zinc-800 hover:border-zinc-600'
                      }`}
                    >
                      🧗‍♂️ Escalada
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('neon')}
                      className={`p-2 rounded-xl border-2 text-[10px] font-black uppercase text-center transition-all cursor-pointer ${
                        theme === 'neon' ? 'bg-[#ED3078] text-white border-white shadow-sm' : 'bg-zinc-900 text-white border-zinc-800 hover:border-zinc-600'
                      }`}
                    >
                      ✨ Neón Fest
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('ninja')}
                      className={`p-2 rounded-xl border-2 text-[10px] font-black uppercase text-center transition-all cursor-pointer ${
                        theme === 'ninja' ? 'bg-[#A3BA13] text-black border-white shadow-sm' : 'bg-zinc-900 text-white border-zinc-800 hover:border-zinc-600'
                      }`}
                    >
                      ⚡ Ninja Park
                    </button>
                  </div>
                </div>

                {/* Photo Upload Section */}
                <div className="space-y-1.5 bg-zinc-950/70 border border-white/15 p-3.5 rounded-2xl">
                  <label className="font-black text-white uppercase text-[11px] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-[#1EB8BF]" /> Foto del Cumpleañer@ (Opcional)
                    </span>
                    {childPhoto && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="text-[10px] text-red-400 hover:text-red-300 font-black flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" /> Quitar foto
                      </button>
                    )}
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="child-photo-upload"
                  />

                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="child-photo-upload"
                      className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white border-2 border-dashed border-zinc-700 hover:border-[#1EB8BF] rounded-xl p-2.5 flex items-center justify-center gap-2 cursor-pointer transition-all text-xs font-bold"
                    >
                      <Upload className="w-4 h-4 text-[#1EB8BF]" />
                      <span>{childPhoto ? 'Cambiar Foto Seleccionada' : 'Subir Foto del Cumpleañer@'}</span>
                    </label>
                  </div>
                  <p className="text-[10px] text-zinc-400 font-medium">
                    *Podés subir cualquier foto y se adaptará con marco circular de festejo.
                  </p>
                </div>

                {/* Name & Age Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-8 space-y-1">
                    <label className="font-black text-white uppercase">Nombre del Cumpleañer@</label>
                    <input
                      type="text"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-[#1EB8BF] focus:outline-none text-xs font-medium"
                    />
                  </div>

                  <div className="sm:col-span-4 space-y-1">
                    <label className="font-black text-white uppercase">Edad</label>
                    <input
                      type="number"
                      min={1}
                      max={18}
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-[#1EB8BF] focus:outline-none text-xs font-medium"
                    />
                  </div>
                </div>

                {/* Date & Time Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-black text-white uppercase">Fecha del Festejo</label>
                    <input
                      type="text"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-[#1EB8BF] focus:outline-none text-xs font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-black text-white uppercase">Horario (2:30 hs)</label>
                    <input
                      type="text"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-[#1EB8BF] focus:outline-none text-xs font-medium"
                    />
                  </div>
                </div>

                {/* Custom Slogan / Message */}
                <div className="space-y-1">
                  <label className="font-black text-white uppercase">Mensaje o Frase Invitación</label>
                  <input
                    type="text"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Ej: ¡Vení a saltar y festejar conmigo!"
                    className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-[#1EB8BF] focus:outline-none text-xs font-medium"
                  />
                </div>
              </>
            ) : (
              /* Generic Mode Info */
              <div className="space-y-4 bg-zinc-950/70 border border-white/15 p-5 rounded-2xl">
                <div className="flex items-center gap-2 text-[#1EB8BF] font-heading font-black text-base uppercase">
                  <ImageIcon className="w-5 h-5" /> Flyer Oficial El Galpón
                </div>
                <p className="text-zinc-300 font-medium text-xs leading-relaxed">
                  Esta es la tarjeta y flyer oficial genérico de El Galpón (<code className="text-[#F2C700]">tarjeta_generica.png</code>). Es ideal si preferís enviar la imagen institucional fija junto con el texto de confirmación RSVP interactivo por WhatsApp.
                </p>
                <div className="border-t border-white/10 pt-3 space-y-2">
                  <div className="text-[11px] text-white font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#A3BA13]" /> Incluye la identidad visual completa del salón.
                  </div>
                  <div className="text-[11px] text-white font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#A3BA13]" /> Botón de descarga directa en formato PNG.
                  </div>
                </div>
              </div>
            )}

            {/* Target Phone Input */}
            <div className="space-y-1 pt-1">
              <label className="font-black text-white uppercase flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#A3BA13]" /> WhatsApp para recibir confirmaciones de los invitados
              </label>
              <input
                type="text"
                value={targetPhone}
                onChange={(e) => setTargetPhone(e.target.value)}
                placeholder="Ej: 221 573-1047"
                className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-[#A3BA13] focus:outline-none text-xs font-medium"
              />
              <p className="text-[10px] text-zinc-400 font-medium">
                *Cada invitado que haga click en "Confirmar Asistencia" te enviará un mensaje directo a este número.
              </p>
            </div>

            {/* Action Buttons Row */}
            <div className="space-y-2 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleDownloadCard}
                  disabled={isGeneratingImage}
                  className="w-full bg-[#ED3078] hover:bg-[#d62166] text-white font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer shadow-lg hover:scale-[1.02] disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>{isGeneratingImage ? 'Generando PNG...' : downloadSuccess ? '¡Tarjeta Descargada!' : 'Descargar Tarjeta (PNG)'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyText}
                  className="w-full bg-[#1EB8BF] hover:bg-[#19a1a7] text-black font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer shadow-md hover:scale-[1.02]"
                >
                  {copied ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4 text-black" />}
                  <span>{copied ? '¡Texto Copiado!' : 'Copiar Texto RSVP'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleShareNative}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white border-2 border-zinc-700 hover:border-white font-black py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer text-xs"
              >
                <Share2 className="w-3.5 h-3.5 text-[#F2C700]" />
                <span>Compartir Invitación Directa</span>
              </button>
            </div>

          </div>

          {/* Card Preview Column */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-4">
            
            <div className="text-[11px] uppercase font-black tracking-widest text-[#F2C700] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Vista Previa de la Invitación</span>
            </div>

            {/* Target Card for rendering & image export */}
            {cardMode === 'interactive' ? (
              <div 
                ref={cardRef}
                className={`w-full max-w-[320px] sm:max-w-[340px] bg-gradient-to-b ${activeTheme.gradientBg} border-2 ${activeTheme.border} rounded-3xl p-5 sm:p-6 ${activeTheme.shadow} relative overflow-hidden text-center space-y-3.5 transition-all select-none`}
              >
                {/* Decorative festive emojis */}
                <div className="absolute top-2.5 left-3 text-xl select-none">🎈</div>
                <div className="absolute top-2.5 right-3 text-xl select-none">✨</div>

                {/* Official Brand Logo */}
                <div className="flex justify-center items-center pt-1">
                  <img 
                    src="/marca_el_galpon_blanca.svg" 
                    alt="El Galpón" 
                    className="h-9 w-auto max-w-[190px] object-contain drop-shadow" 
                    crossOrigin="anonymous"
                  />
                </div>

                {/* Child Photo (if provided) or celebration badge */}
                {childPhoto ? (
                  <div className="flex justify-center py-1">
                    <div className="relative">
                      <img 
                        src={childPhoto} 
                        alt={childName}
                        className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 ${activeTheme.border} shadow-lg`}
                        crossOrigin="anonymous"
                      />
                      <span className="absolute -bottom-1 -right-1 bg-[#ED3078] text-white text-xs px-2 py-0.5 rounded-full font-black">
                        🎂
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-0.5 pt-1">
                    <div className="text-[11px] uppercase font-black text-[#F2C700] tracking-widest">
                      ¡TE INVITAMOS A CELEBRAR!
                    </div>
                  </div>
                )}

                {/* Child Name & Age */}
                <div className="space-y-1">
                  <h3 className={`font-heading text-2xl sm:text-3xl font-black ${activeTheme.nameColor} uppercase tracking-tight break-words`}>
                    {childName || 'Nombre'}
                  </h3>
                  <div className={`inline-block px-3.5 py-1 ${activeTheme.badgeAge} rounded-full font-heading font-black text-xs uppercase shadow-sm`}>
                    Cumple {age} Años 🎂
                  </div>
                </div>

                {/* Event Schedule & Location Box */}
                <div className={`bg-black/70 backdrop-blur-sm border ${activeTheme.accentBorder} p-3.5 rounded-2xl text-xs space-y-1.5 text-white font-medium text-left shadow-inner`}>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#F2C700] shrink-0" />
                    <span className="font-bold text-white">{eventDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#1EB8BF] shrink-0" />
                    <span className="font-bold text-white">{eventTime}</span>
                  </div>
                  <div className="flex items-start gap-2 pt-0.5 border-t border-white/10 text-[11px] text-zinc-300">
                    <MapPin className="w-3.5 h-3.5 text-[#ED3078] shrink-0 mt-0.5" />
                    <span className="font-medium">{BRAND_INFO.address}</span>
                  </div>
                </div>

                {/* Slogan */}
                <p className="text-[11px] text-zinc-200 font-medium leading-snug px-2">
                  {customMessage || '¡Vení a escalar el muro, tirarte por la tirolesa y jugar sin parar!'}
                </p>

                {/* Interactive RSVP Button (Simulated on card) */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#A3BA13] hover:bg-[#91a610] text-black font-black text-xs py-3 rounded-xl shadow-[3px_3px_0px_0px_#F2C700] transition-all flex items-center justify-center gap-1.5 uppercase cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-black text-black" />
                  <span>Confirmar Asistencia (RSVP)</span>
                </a>
              </div>
            ) : (
              /* Generic Card Image Display */
              <div 
                ref={cardRef}
                className="w-full max-w-[320px] sm:max-w-[340px] bg-black border-2 border-[#1EB8BF] rounded-3xl p-3 shadow-[6px_6px_0px_0px_#1EB8BF] relative overflow-hidden space-y-3"
              >
                <div className="rounded-2xl overflow-hidden border border-white/15 bg-zinc-950">
                  <img 
                    src="/tarjeta_generica.png" 
                    alt="Tarjeta Genérica Oficial El Galpón" 
                    className="w-full h-auto object-cover"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      // fallback if image not found
                      (e.target as HTMLImageElement).src = '/marca_el_galpon_blanca.svg';
                    }}
                  />
                </div>

                {/* Event Schedule Info pill for generic mode */}
                <div className="bg-zinc-950 border border-white/20 p-2.5 rounded-xl text-xs space-y-1 text-white font-medium text-center">
                  <div className="text-[10px] text-[#F2C700] font-black uppercase">Festejo: {eventDate} - {eventTime}</div>
                  <div className="text-[11px] text-zinc-300 font-semibold">{BRAND_INFO.address}</div>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#A3BA13] hover:bg-[#91a610] text-black font-black text-xs py-2.5 rounded-xl shadow-[3px_3px_0px_0px_#F2C700] transition-all flex items-center justify-center gap-1.5 uppercase"
                >
                  <MessageCircle className="w-4 h-4 fill-black text-black" />
                  <span>Confirmar Asistencia por WhatsApp</span>
                </a>
              </div>
            )}

            <p className="text-[11px] text-zinc-400 text-center font-medium max-w-xs leading-relaxed">
              💡 Podés descargar la tarjeta en foto PNG para enviarla por WhatsApp junto con el link de confirmación de asistencia.
            </p>

          </div>

        </div>

      </div>
    </div>
  );
};
