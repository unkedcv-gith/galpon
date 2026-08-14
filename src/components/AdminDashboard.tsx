import React, { useState, useEffect } from 'react';
import { Reservation, BlockedDate } from '../types';
import { getReservations, updateReservationStatus, deleteReservation, getBlockedDates, toggleBlockDate, addReservation, setAdminAuthenticated } from '../services/storage';
import { TIME_SLOTS, BRAND_INFO } from '../data/initialData';
import { Shield, CheckCircle2, XCircle, Clock, Search, Trash2, MessageCircle, DollarSign, Lock, Plus, LogOut, FileText, Check } from 'lucide-react';

interface AdminDashboardProps {
  onCloseAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onCloseAdmin }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [activeTab, setActiveTab] = useState<'reservas' | 'bloqueo' | 'nueva'>('reservas');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Block date form state
  const [blockDateStr, setBlockDateStr] = useState(new Date().toISOString().split('T')[0]);
  const [blockReason, setBlockReason] = useState('Evento Privado / Mantenimiento');

  // Manual reservation state
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualSlot, setManualSlot] = useState('turn_afternoon_1');
  const [manualParent, setManualParent] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualChild, setManualChild] = useState('');
  const [manualAge, setManualAge] = useState(6);
  const [manualKids, setManualKids] = useState(20);
  const [manualNotes, setManualNotes] = useState('');

  const loadData = () => {
    setReservations(getReservations());
    setBlockedDates(getBlockedDates());
  };

  useEffect(() => {
    loadData();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleLogout = () => {
    setAdminAuthenticated(false);
    onCloseAdmin();
  };

  const handleUpdateStatus = (id: string, status: Reservation['status']) => {
    const updated = updateReservationStatus(id, status, status === 'approved');
    setReservations(updated);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta reserva?')) {
      const updated = deleteReservation(id);
      setReservations(updated);
    }
  };

  const handleToggleBlock = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = toggleBlockDate(blockDateStr, blockReason);
    setBlockedDates(updated);
  };

  const handleCreateManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualParent || !manualChild) {
      alert('Por favor completá Nombre del Adulto y Nombre del Cumpleañer@.');
      return;
    }
    const slotObj = TIME_SLOTS.find(s => s.id === manualSlot);
    addReservation({
      date: manualDate,
      slotId: manualSlot,
      slotTime: slotObj?.timeRange || '15:00 a 17:30 hs',
      parentName: manualParent,
      parentPhone: manualPhone,
      parentEmail: '',
      childName: manualChild,
      childAge: manualAge,
      estimatedKids: manualKids,
      additionalPackage: manualKids <= 20 ? 'base_20' : manualKids <= 28 ? 'adicional_21_28' : 'adicional_29_35',
      notes: `[Carga Manual Admin] ${manualNotes}`,
    });
    // Approve manually added reservation
    loadData();
    setActiveTab('reservas');
    // Reset
    setManualParent('');
    setManualPhone('');
    setManualChild('');
    setManualNotes('');
  };

  // Filtered reservations list
  const filteredReservations = reservations.filter((r) => {
    const matchesStatus = filterStatus === 'todos' || r.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      r.parentName.toLowerCase().includes(q) ||
      r.childName.toLowerCase().includes(q) ||
      r.parentPhone.toLowerCase().includes(q) ||
      r.date.includes(q);
    return matchesStatus && matchesSearch;
  });

  // Analytics Metrics
  const totalReservations = reservations.length;
  const approvedCount = reservations.filter((r) => r.status === 'approved').length;
  const pendingCount = reservations.filter((r) => r.status === 'pending').length;
  const totalRevenueDeposits = reservations
    .filter((r) => r.status === 'approved' && r.depositPaid)
    .reduce((sum, r) => sum + (r.depositAmount || 50000), 0);

  return (
    <div className="fixed inset-0 z-50 bg-black text-white overflow-y-auto">
      
      {/* Top Admin Navbar */}
      <div className="bg-zinc-950 border-b-2 border-zinc-800 sticky top-0 z-20 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/marca_el_galpon_blanca.svg" alt="El Galpón" className="h-10 w-auto object-contain" />
          <div>
            <h1 className="font-heading font-black text-lg text-white flex items-center gap-2 uppercase">
              Panel de Administración <span className="text-black text-xs px-2.5 py-0.5 rounded-full bg-[#1EB8BF] font-black">El Galpón</span>
            </h1>
            <p className="text-xs text-zinc-400 font-medium">Gestión de turnos de cumpleaños, señas y disponibilidad</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onCloseAdmin}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-black text-white uppercase transition-colors"
          >
            Volver a la Web
          </button>
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl bg-[#ED3078] hover:bg-[#d42767] text-xs font-black text-white transition-colors flex items-center gap-1.5 uppercase"
          >
            <LogOut className="w-3.5 h-3.5" />
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        
        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-1">
            <div className="text-xs font-black text-zinc-400 uppercase tracking-wider">Total Reservas</div>
            <div className="text-3xl font-heading font-black text-white">{totalReservations}</div>
            <p className="text-[11px] font-medium text-zinc-500">Solicitudes registradas en sistema</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-1">
            <div className="text-xs font-black text-[#1EB8BF] uppercase tracking-wider flex items-center justify-between">
              <span>Turnos Aprobados</span>
              <CheckCircle2 className="w-4 h-4 text-[#1EB8BF]" />
            </div>
            <div className="text-3xl font-heading font-black text-[#1EB8BF]">{approvedCount}</div>
            <p className="text-[11px] font-medium text-zinc-500">Cumpleaños confirmados con seña</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-1">
            <div className="text-xs font-black text-[#F2C700] uppercase tracking-wider flex items-center justify-between">
              <span>Pendientes</span>
              <Clock className="w-4 h-4 text-[#F2C700]" />
            </div>
            <div className="text-3xl font-heading font-black text-[#F2C700]">{pendingCount}</div>
            <p className="text-[11px] font-medium text-zinc-500">A la espera de pago o confirmación</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-1">
            <div className="text-xs font-black text-zinc-300 uppercase tracking-wider flex items-center justify-between">
              <span>Señas Recaudadas</span>
              <DollarSign className="w-4 h-4 text-zinc-300" />
            </div>
            <div className="text-2xl font-heading font-black text-white">
              ${totalRevenueDeposits.toLocaleString('es-AR')}
            </div>
            <p className="text-[11px] font-medium text-zinc-500">Congelamiento de tarifa activo</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('reservas')}
              className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase transition-all flex items-center gap-2 ${
                activeTab === 'reservas'
                  ? 'bg-[#1EB8BF] text-black font-black'
                  : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Gestión de Reservas</span>
            </button>

            <button
              onClick={() => setActiveTab('bloqueo')}
              className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase transition-all flex items-center gap-2 ${
                activeTab === 'bloqueo'
                  ? 'bg-[#1EB8BF] text-black font-black'
                  : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Bloqueo de Fechas</span>
            </button>

            <button
              onClick={() => setActiveTab('nueva')}
              className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase transition-all flex items-center gap-2 ${
                activeTab === 'nueva'
                  ? 'bg-[#1EB8BF] text-black font-black'
                  : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Cargar Reserva Manual</span>
            </button>
          </div>

          {activeTab === 'reservas' && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Buscar cliente, niño, tel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-zinc-950 border-2 border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-[#1EB8BF] w-56"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-zinc-950 border-2 border-zinc-800 rounded-xl px-3 py-2 text-xs font-black text-white focus:outline-none focus:border-[#1EB8BF] uppercase"
              >
                <option value="todos">Todos los estados</option>
                <option value="pending">Pendientes</option>
                <option value="approved">Aprobados</option>
                <option value="rejected">Rechazados</option>
              </select>
            </div>
          )}
        </div>

        {/* Tab 1: Reservas List */}
        {activeTab === 'reservas' && (
          <div className="space-y-4">
            {filteredReservations.length === 0 ? (
              <div className="bg-black border-2 border-zinc-800 rounded-3xl p-12 text-center text-zinc-400 font-medium text-sm">
                No se encontraron reservas con los criterios especificados.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredReservations.map((res) => {
                  const isApproved = res.status === 'approved';
                  const isPending = res.status === 'pending';
                  const isRejected = res.status === 'rejected';

                  const whatsappNotifyUrl = `https://wa.me/549${res.parentPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Hola ${res.parentName}! Te escribimos de El Galpón. Tu reserva para el cumpleaños de ${res.childName} el día ${res.date} (${res.slotTime}) ha sido ${
                      isApproved ? 'APROBADA Y CONFIRMADA 🎉. ¡Seña registrada correctamente!' : 'revisada. Por favor comunicate con nosotros.'
                    }`
                  )}`;

                  return (
                    <div
                      key={res.id}
                      className={`bg-zinc-900 border rounded-2xl p-6 transition-all space-y-4 ${
                        isApproved
                          ? 'border-[#A3BA13]/50'
                          : isPending
                          ? 'border-[#F2C700]/50'
                          : 'border-zinc-800'
                      }`}
                    >
                      {/* Top Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-zinc-800 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-black font-black bg-[#1EB8BF] px-2.5 py-1 rounded-lg">
                            #{res.id}
                          </span>
                          <span className="font-heading font-black text-lg text-white uppercase">
                            Cumple de {res.childName} ({res.childAge} Años)
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {isApproved && (
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#A3BA13] text-black uppercase flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-black" /> Aprobado & Congelado
                            </span>
                          )}
                          {isPending && (
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#F2C700] text-black uppercase flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-black" /> Pendiente de Seña
                            </span>
                          )}
                          {isRejected && (
                            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#ED3078] text-white uppercase flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5 text-white" /> Rechazado
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-medium">
                        <div>
                          <span className="text-zinc-400 block font-black uppercase">Fecha y Turno:</span>
                          <strong className="text-white text-sm">{res.date}</strong>
                          <div className="text-[#ED3078] font-bold">{res.slotTime}</div>
                        </div>

                        <div>
                          <span className="text-zinc-400 block font-black uppercase">Adulto Responsable:</span>
                          <strong className="text-white">{res.parentName}</strong>
                          <div className="text-zinc-400">{res.parentPhone}</div>
                        </div>

                        <div>
                          <span className="text-zinc-400 block font-black uppercase">Invitados & Paquete:</span>
                          <strong className="text-[#F2C700] font-bold">{res.estimatedKids} chicos</strong>
                          <div className="text-zinc-400">
                            {res.additionalPackage === 'base_20' ? 'Contrato Base 20' : res.additionalPackage === 'adicional_21_28' ? 'Adicional 21-28' : 'Adicional 29-35'}
                          </div>
                        </div>

                        <div>
                          <span className="text-zinc-400 block font-black uppercase">Seña Registrada:</span>
                          <strong className={res.depositPaid ? 'text-[#A3BA13] font-black' : 'text-[#F2C700] font-black'}>
                            {res.depositPaid ? `$${res.depositAmount || 50000} (Abonado)` : 'Sin registrar'}
                          </strong>
                        </div>
                      </div>

                      {/* Notes if any */}
                      {(res.notes || res.adultsFoodInfo) && (
                        <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-xs text-white font-medium space-y-1">
                          {res.notes && <div><strong>Notas:</strong> {res.notes}</div>}
                          {res.adultsFoodInfo && <div><strong>Comida Adultos:</strong> {res.adultsFoodInfo}</div>}
                        </div>
                      )}

                      {/* Actions Toolbar */}
                      <div className="pt-2 border-t-2 border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          {!isApproved && (
                            <button
                              onClick={() => handleUpdateStatus(res.id, 'approved')}
                              className="bg-[#A3BA13] hover:bg-[#91a610] text-black font-black text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 uppercase"
                            >
                              <Check className="w-4 h-4" /> Aprobar y Confirmar Seña
                            </button>
                          )}

                          {isApproved && (
                            <button
                              onClick={() => handleUpdateStatus(res.id, 'pending')}
                              className="bg-[#F2C700] hover:bg-[#d9b300] text-black font-black text-xs px-3 py-2 rounded-xl transition-all uppercase"
                            >
                              Pasar a Pendiente
                            </button>
                          )}

                          {!isRejected && (
                            <button
                              onClick={() => handleUpdateStatus(res.id, 'rejected')}
                              className="bg-zinc-900 border border-zinc-700 text-white font-black text-xs px-3 py-2 rounded-xl hover:border-[#ED3078] transition-all uppercase"
                            >
                              Rechazar
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={whatsappNotifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#1EB8BF] hover:bg-[#19a1a7] text-black font-black text-xs px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 uppercase"
                          >
                            <MessageCircle className="w-4 h-4 text-black" />
                            Avisar por WhatsApp
                          </a>

                          <button
                            onClick={() => handleDelete(res.id)}
                            className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-[#ED3078] hover:bg-zinc-800 border border-zinc-800"
                            title="Eliminar reserva"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Bloqueo de Fechas */}
        {activeTab === 'bloqueo' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-5 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-heading font-black text-lg text-white uppercase">Bloquear Fecha en Calendario</h3>
              <p className="text-xs text-zinc-400 font-medium">
                Bloqueá fechas completas por feriados, mantenimiento o eventos privados para que los clientes no puedan solicitar turnos.
              </p>

              <form onSubmit={handleToggleBlock} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-white uppercase">Fecha a bloquear / desbloquear</label>
                  <input
                    type="date"
                    required
                    value={blockDateStr}
                    onChange={(e) => setBlockDateStr(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs font-medium text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-white uppercase">Motivo</label>
                  <input
                    type="text"
                    required
                    placeholder="Mantenimiento muro / Evento privado"
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs font-medium text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1EB8BF] hover:bg-[#19a1a7] text-black font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-all"
                >
                  Cambiar Estado de Disponibilidad
                </button>
              </form>
            </div>

            <div className="md:col-span-7 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-heading font-black text-lg text-white uppercase">Fechas Bloqueadas Activas</h3>
              
              {blockedDates.length === 0 ? (
                <p className="text-xs text-zinc-400 font-medium">No hay fechas bloqueadas manualmente.</p>
              ) : (
                <div className="space-y-2">
                  {blockedDates.map((b) => (
                    <div
                      key={b.date}
                      className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <strong className="text-[#1EB8BF] font-bold text-sm">{b.date}</strong>
                        <span className="text-zinc-400 font-medium block">{b.reason}</span>
                      </div>
                      <button
                        onClick={() => toggleBlockDate(b.date)}
                        className="p-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white font-black hover:bg-zinc-800 text-xs uppercase"
                      >
                        Desbloquear
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Cargar Reserva Manual */}
        {activeTab === 'nueva' && (
          <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-5">
            <h3 className="font-heading font-black text-xl text-white uppercase">Cargar Cumpleaños Presencial o Telefónico</h3>

            <form onSubmit={handleCreateManual} className="space-y-4 text-xs font-medium">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-black text-white uppercase">Fecha</label>
                  <input
                    type="date"
                    required
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-black text-white uppercase">Turno</label>
                  <select
                    value={manualSlot}
                    onChange={(e) => setManualSlot(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-bold"
                  >
                    {TIME_SLOTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title} ({s.timeRange})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-black text-white uppercase">Nombre Adulto</label>
                  <input
                    type="text"
                    required
                    placeholder="Padre / Madre"
                    value={manualParent}
                    onChange={(e) => setManualParent(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-black text-white uppercase">WhatsApp</label>
                  <input
                    type="text"
                    placeholder="221..."
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-black text-white uppercase">Cumpleañer@</label>
                  <input
                    type="text"
                    required
                    placeholder="Nombre niño"
                    value={manualChild}
                    onChange={(e) => setManualChild(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-black text-white uppercase">Edad</label>
                  <input
                    type="number"
                    value={manualAge}
                    onChange={(e) => setManualAge(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-black text-white uppercase">Chicos Est.</label>
                  <input
                    type="number"
                    value={manualKids}
                    onChange={(e) => setManualKids(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-black text-white uppercase">Notas Adicionales</label>
                <textarea
                  rows={2}
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1EB8BF] hover:bg-[#19a1a7] text-black font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-all"
              >
                Cargar y Confirmar Reserva
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

