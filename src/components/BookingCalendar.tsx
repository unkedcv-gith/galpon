import React, { useState, useMemo } from 'react';
import { Reservation } from '../types';
import { TIME_SLOTS, BRAND_INFO } from '../data/initialData';
import { getReservations, getBlockedDates, addReservation } from '../services/storage';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, MessageCircle, User, Phone, Mail, Send, Gift } from 'lucide-react';

interface BookingCalendarProps {
  isOpenModal?: boolean;
  onCloseModal?: () => void;
  onReservationCreated?: () => void;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  onReservationCreated,
}) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2); // Default to 2 days ahead
    return d.toISOString().split('T')[0];
  });
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');

  // Form State
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState(6);
  const [estimatedKids, setEstimatedKids] = useState(20);
  const [additionalPackage, setAdditionalPackage] = useState<'base_20' | 'adicional_21_28' | 'adicional_29_35'>('base_20');
  const [adultsFoodInfo, setAdultsFoodInfo] = useState('');
  const [notes, setNotes] = useState('');

  const [submittedReservation, setSubmittedReservation] = useState<Reservation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync kids with package selection
  const handleKidsCountChange = (count: number) => {
    setEstimatedKids(count);
    if (count <= 20) {
      setAdditionalPackage('base_20');
    } else if (count <= 28) {
      setAdditionalPackage('adicional_21_28');
    } else {
      setAdditionalPackage('adicional_29_35');
    }
  };

  // Get current bookings & blocked dates from localStorage
  const reservations = useMemo(() => getReservations(), [submittedReservation]);
  const blockedDates = useMemo(() => getBlockedDates(), []);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday

  // Get status for a given YYYY-MM-DD
  const getDayStatus = (dateStr: string) => {
    const isBlocked = blockedDates.some((b) => b.date === dateStr);
    if (isBlocked) return 'blocked';

    const dayBookings = reservations.filter(
      (r) => r.date === dateStr && (r.status === 'approved' || r.status === 'pending')
    );

    if (dayBookings.length >= 3) return 'full';
    if (dayBookings.length > 0) return 'partial';
    return 'available';
  };

  // Slots availability for selectedDateStr
  const activeBookingsForSelectedDate = useMemo(() => {
    return reservations.filter(
      (r) => r.date === selectedDateStr && (r.status === 'approved' || r.status === 'pending')
    );
  }, [reservations, selectedDateStr]);

  const isSlotBooked = (slotId: string) => {
    return activeBookingsForSelectedDate.some((r) => r.slotId === slotId);
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotId) {
      alert('Por favor elegí un turno horario disponible (Mañana, Tarde Temprano o Tarde/Noche).');
      return;
    }

    if (!parentName || !parentPhone || !childName) {
      alert('Por favor completá los campos obligatorios: Tu Nombre, WhatsApp y Nombre del Cumpleañero/a.');
      return;
    }

    const slotObj = TIME_SLOTS.find((s) => s.id === selectedSlotId);
    setIsSubmitting(true);

    try {
      const newRes = addReservation({
        date: selectedDateStr,
        slotId: selectedSlotId,
        slotTime: slotObj?.timeRange || '15:00 a 17:30 hs',
        parentName,
        parentPhone,
        parentEmail,
        childName,
        childAge,
        estimatedKids,
        additionalPackage,
        adultsFoodInfo,
        notes,
      });

      setSubmittedReservation(newRes);
      if (onReservationCreated) onReservationCreated();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reservar" className="w-full bg-gradient-to-b from-[#1EB8BF] via-[#1EB8BF] via-45% to-black text-white py-16 sm:py-24 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Header Bento Box */}
        <div className="bg-black/60 backdrop-blur-md rounded-3xl border-2 border-white/20 p-6 sm:p-10 text-center space-y-3 shadow-2xl text-white">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#1EB8BF] text-black font-heading font-black text-xs tracking-widest uppercase shadow-md">
            Almanaque Interactivo
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white">
            Reservá tu <span className="text-[#F2C700] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">Fecha y Turno</span>
          </h2>
          <p className="text-zinc-200 text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            Consultá disponibilidad en tiempo real, seleccioná el horario conveniente y solicitá la reserva para congelar la tarifa con tu seña.
          </p>
        </div>

        {submittedReservation ? (
          /* Confirmation Receipt View */
          <div className="max-w-2xl mx-auto bg-black/60 backdrop-blur-md border-2 border-white/20 rounded-3xl p-6 sm:p-8 space-y-6 text-center shadow-2xl text-white">
            <div className="w-16 h-16 rounded-2xl bg-zinc-950/60 border border-[#A3BA13] text-[#A3BA13] flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="font-heading text-2xl sm:text-3xl font-black text-white uppercase">
                ¡Solicitud de Reserva Registrada!
              </h3>
              <p className="text-zinc-200 text-sm font-medium">
                Hemos recibido tu pedido para el festejo de <strong className="text-[#ED3078]">{submittedReservation.childName}</strong>.
              </p>
            </div>

            <div className="bg-zinc-950/60 rounded-2xl p-5 border border-white/20 text-left space-y-3 text-xs sm:text-sm font-medium text-white shadow-inner">
              <div className="flex justify-between border-b border-white/15 pb-2">
                <span className="text-zinc-400">Código de Reserva:</span>
                <span className="font-mono text-[#F2C700] font-black">{submittedReservation.id}</span>
              </div>
              <div className="flex justify-between border-b border-white/15 pb-2">
                <span className="text-zinc-400">Fecha Solicitada:</span>
                <span className="font-bold">{submittedReservation.date}</span>
              </div>
              <div className="flex justify-between border-b border-white/15 pb-2">
                <span className="text-zinc-400">Turno Elegido:</span>
                <span className="text-[#ED3078] font-bold">{submittedReservation.slotTime}</span>
              </div>
              <div className="flex justify-between border-b border-white/15 pb-2">
                <span className="text-zinc-400">Adulto Responsable:</span>
                <span>{submittedReservation.parentName} ({submittedReservation.parentPhone})</span>
              </div>
              <div className="flex justify-between border-b border-white/15 pb-2">
                <span className="text-zinc-400">Paquete Invitados:</span>
                <span className="text-[#1EB8BF] font-bold">
                  {submittedReservation.estimatedKids} chicos ({submittedReservation.additionalPackage === 'base_20' ? 'Contrato Base 20' : submittedReservation.additionalPackage === 'adicional_21_28' ? 'Adicional 21-28' : 'Adicional 29-35'})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Estado Inicial:</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#F2C700] text-black uppercase">
                  Pendiente de aprobación de seña
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <p className="text-xs text-zinc-200 font-medium">
                Para congelar la tarifa y confirmar definitivamente el turno, enviá tu comprobante de seña por WhatsApp a la administración:
              </p>

              <a
                href={`${BRAND_INFO.whatsappUrl}?text=${encodeURIComponent(`Hola El Galpón! Acabo de hacer la reserva #${submittedReservation.id} para el festejo de ${submittedReservation.childName} el día ${submittedReservation.date} (${submittedReservation.slotTime}). Quisiera enviar la seña.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#1EB8BF] hover:bg-[#19a1a7] text-black font-black text-xs uppercase tracking-wider py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 text-black" />
                <span>Confirmar Seña por WhatsApp</span>
              </a>

              <button
                onClick={() => setSubmittedReservation(null)}
                className="text-xs text-zinc-300 hover:text-white font-bold underline pt-2 cursor-pointer"
              >
                Hacer otra reserva o modificar datos
              </button>
            </div>
          </div>
        ) : (
          /* Main Calendar + Form Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Calendar Widget Column */}
            <div className="lg:col-span-5 bg-black/60 backdrop-blur-md border-2 border-white/20 rounded-3xl p-6 space-y-5 shadow-2xl text-white">
              
              {/* Month Navigation */}
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <h3 className="font-heading text-lg font-black text-white capitalize flex items-center gap-2 uppercase">
                  <CalendarIcon className="w-5 h-5 text-[#1EB8BF]" />
                  {monthName}
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMonthChange('prev')}
                    className="p-2 rounded-xl bg-zinc-950/60 border border-white/20 text-white hover:bg-zinc-900 font-bold cursor-pointer transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMonthChange('next')}
                    className="p-2 rounded-xl bg-zinc-950/60 border border-white/20 text-white hover:bg-zinc-900 font-bold cursor-pointer transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day Name Headers */}
              <div className="grid grid-cols-7 text-center text-xs font-black text-[#1EB8BF] uppercase tracking-wider">
                <span>Do</span><span>Lu</span><span>Ma</span><span>Mi</span><span>Ju</span><span>Vi</span><span>Sá</span>
              </div>

              {/* Calendar Days Grid */}
              <div className="grid grid-cols-7 gap-1.5 text-center text-sm font-bold">
                {/* Empty offset padding */}
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-2" />
                ))}

                {/* Days of Month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                  const status = getDayStatus(dStr);
                  const isSelected = selectedDateStr === dStr;

                  const todayStr = new Date().toISOString().split('T')[0];
                  const isPast = dStr < todayStr;

                  let fileteColor = 'border-2 border-[#A3BA13] text-white hover:bg-zinc-900';
                  if (status === 'partial') fileteColor = 'border-2 border-[#1EB8BF] text-white hover:bg-zinc-900';
                  if (status === 'full' || status === 'blocked') fileteColor = 'border-2 border-[#ED3078] text-[#ED3078]';

                  return (
                    <button
                      key={dStr}
                      disabled={isPast || status === 'blocked'}
                      onClick={() => {
                        setSelectedDateStr(dStr);
                      }}
                      className={`relative p-2 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isPast
                          ? 'opacity-20 cursor-not-allowed bg-zinc-950 border border-zinc-900 text-zinc-600'
                          : status === 'blocked'
                          ? 'opacity-40 cursor-not-allowed bg-zinc-950 border-2 border-[#ED3078] text-[#ED3078]'
                          : isSelected
                          ? 'bg-[#1EB8BF] text-black font-black scale-105 border-2 border-white shadow-lg'
                          : `bg-zinc-950 ${fileteColor}`
                      }`}
                    >
                      <span className="font-heading">{dayNum}</span>
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="pt-2 border-t-2 border-white/20 flex items-center justify-around text-[10px] font-black text-zinc-300 uppercase">
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-md border-2 border-[#A3BA13] bg-zinc-950" /> Disponible
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-md border-2 border-[#1EB8BF] bg-zinc-950" /> Con turnos
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-md border-2 border-[#ED3078] bg-zinc-950" /> Completo
                </span>
              </div>

              {/* Slot Picker for selected date */}
              <div className="pt-3 border-t border-white/20 space-y-2.5">
                <div className="text-xs font-black text-white flex items-center justify-between uppercase">
                  <span>Turnos para el {selectedDateStr}:</span>
                  <span className="text-black font-black text-[11px] bg-[#F2C700] px-2 py-0.5 rounded-full">2:30 hs c/u</span>
                </div>

                <div className="space-y-2">
                  {TIME_SLOTS.map((slot) => {
                    const booked = isSlotBooked(slot.id);
                    const isSelected = selectedSlotId === slot.id;

                    return (
                      <button
                        key={slot.id}
                        disabled={booked}
                        type="button"
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                          booked
                            ? 'bg-zinc-950 border-zinc-800 text-zinc-600 cursor-not-allowed opacity-50'
                            : isSelected
                            ? 'bg-[#1EB8BF] border-[#1EB8BF] text-black shadow-lg scale-[1.01]'
                            : 'bg-zinc-950 border-white/20 text-white hover:border-[#1EB8BF] hover:bg-zinc-900'
                        }`}
                      >
                        <div>
                          <div className="font-heading font-black text-xs uppercase">{slot.title}</div>
                          <div className={`text-[11px] font-bold ${isSelected ? 'text-black' : 'text-[#1EB8BF]'}`}>{slot.timeRange}</div>
                        </div>

                        {booked ? (
                          <span className="text-[10px] uppercase font-black text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded-md border border-zinc-800">
                            Reservado
                          </span>
                        ) : isSelected ? (
                          <span className="text-[11px] font-black text-white bg-black px-2.5 py-0.5 rounded-lg uppercase shadow-xs">
                            Elegido
                          </span>
                        ) : (
                          <span className="text-[11px] font-black text-black bg-[#A3BA13] px-2.5 py-0.5 rounded-lg uppercase">
                            Disponible
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Reservation Form Column */}
            <div className="lg:col-span-7 bg-black/60 backdrop-blur-md border-2 border-white/20 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl text-white">
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <div>
                  <h3 className="font-heading text-xl font-black text-white uppercase">
                    Datos para la Reserva
                  </h3>
                  <p className="text-xs text-zinc-300 font-medium">
                    Fecha elegida: <strong className="text-[#1EB8BF]">{selectedDateStr}</strong> {selectedSlotId ? `(${TIME_SLOTS.find(s=>s.id===selectedSlotId)?.timeRange})` : '• (Seleccioná un turno disponible)'}
                  </p>
                </div>
                <span className="px-3 py-1 bg-[#1EB8BF] text-black text-xs font-black rounded-full uppercase">
                  Paso 2/2
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Adults Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-white uppercase flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#1EB8BF]" /> Nombre del Adulto *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Laura Pérez"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="w-full bg-zinc-950/60 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs font-medium text-white focus:border-[#1EB8BF] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-white uppercase flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#A3BA13]" /> Celular / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej: 221 1234567"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      className="w-full bg-zinc-950/60 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs font-medium text-white focus:border-[#A3BA13] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-white uppercase flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#F2C700]" /> Email de Contacto
                  </label>
                  <input
                    type="email"
                    placeholder="ejemplo@gmail.com"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    className="w-full bg-zinc-950/60 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs font-medium text-white focus:border-[#F2C700] focus:outline-none"
                  />
                </div>

                {/* Birthday Child Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/20">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-white uppercase flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-[#ED3078]" /> Nombre del Cumpleañer@ *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Santino"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      className="w-full bg-zinc-950/60 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs font-medium text-white focus:border-[#ED3078] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-white uppercase">¿Cuántos años cumple?</label>
                    <input
                      type="number"
                      min={1}
                      max={15}
                      value={childAge}
                      onChange={(e) => setChildAge(Number(e.target.value))}
                      className="w-full bg-zinc-950/60 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs font-medium text-white focus:border-[#1EB8BF] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Kids Count Selector */}
                <div className="space-y-2 pt-2 border-t border-white/20">
                  <div className="flex justify-between items-center text-xs font-black text-white uppercase">
                    <span>Cantidad estimada de invitados (chicos):</span>
                    <span className="text-[#1EB8BF] font-black text-sm">{estimatedKids} chicos</span>
                  </div>

                  <input
                    type="range"
                    min={10}
                    max={35}
                    value={estimatedKids}
                    onChange={(e) => handleKidsCountChange(Number(e.target.value))}
                    className="w-full accent-[#1EB8BF] cursor-pointer"
                  />

                  {/* Package Badge explanation */}
                  <div className="bg-zinc-950/60 p-3 rounded-xl border border-white/20 text-xs text-white font-medium shadow-inner">
                    <div>
                      <span className="font-black text-[#F2C700] uppercase">
                        {additionalPackage === 'base_20' ? 'Contrato Base (Hasta 20 chicos)' : additionalPackage === 'adicional_21_28' ? 'Adicional 1 (21 a 28 chicos)' : 'Adicional 2 (29 a 35 chicos)'}
                      </span>
                      <p className="text-[11px] text-zinc-300">
                        {additionalPackage === 'base_20'
                          ? 'Incluye 20 chicos y profesores a cargo.'
                          : 'Requiere personal adicional de apoyo para seguridad.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Catering note for adults */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-white uppercase">
                    ¿Van a traer comida para el sector Adultos? (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Embutidos, empanadas, gaseosas para los padres..."
                    value={adultsFoodInfo}
                    onChange={(e) => setAdultsFoodInfo(e.target.value)}
                    className="w-full bg-zinc-950/60 border border-white/20 rounded-xl px-3.5 py-2 text-xs font-medium text-white focus:border-[#1EB8BF] focus:outline-none"
                  />
                  <p className="text-[11px] text-zinc-300 font-medium">
                    *Recordá que para los chicos incluye el menú saludable de 1 pancho x chico por la actividad física constante.
                  </p>
                </div>

                {/* Notes */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-white uppercase">Notas o Consultas Adicionales</label>
                  <textarea
                    rows={2}
                    placeholder="Ej: Temática especial, alergias o consultas particulares..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-zinc-950/60 border border-white/20 rounded-xl px-3.5 py-2 text-xs font-medium text-white focus:border-[#1EB8BF] focus:outline-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1EB8BF] hover:bg-white text-black font-black text-xs uppercase tracking-wider py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <Send className="w-4 h-4 text-black" />
                  <span>Enviar Solicitud de Reserva</span>
                </button>

              </form>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};

