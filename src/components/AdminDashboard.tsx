import React, { useState, useEffect, useMemo } from 'react';
import { Reservation, BlockedDate, Branch, AppUser, Inquiry, UserRole } from '../types';
import { 
  getReservations, 
  updateReservationStatus, 
  deleteReservation, 
  getBlockedDates, 
  toggleBlockDate, 
  addReservation, 
  getBranches,
  addBranch,
  updateBranch,
  deleteBranch,
  getAppUsers,
  addAppUser,
  deleteAppUser,
  getInquiries,
  updateInquiryStatus,
  getCurrentUser,
  logoutUser
} from '../services/storage';
import { TIME_SLOTS } from '../data/initialData';
import { 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Trash2, 
  MessageCircle, 
  DollarSign, 
  Lock, 
  Plus, 
  LogOut, 
  FileText, 
  Check,
  Building2,
  Users,
  Crown,
  Store,
  MapPin,
  Calendar as CalendarIcon,
  Filter,
  Phone,
  Mail,
  User,
  RefreshCw,
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface AdminDashboardProps {
  onCloseAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onCloseAdmin }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => getCurrentUser());
  
  // Data states
  const [branches, setBranches] = useState<Branch[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [appUsers, setAppUsers] = useState<AppUser[]>([]);

  // Navigation & Filter states
  const [activeTab, setActiveTab] = useState<'reservas' | 'consultas' | 'bloqueo' | 'nueva' | 'sucursales' | 'usuarios'>('reservas');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('all');
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Block date form state
  const [blockDateStr, setBlockDateStr] = useState(new Date().toISOString().split('T')[0]);
  const [blockReason, setBlockReason] = useState('Evento Privado / Mantenimiento');
  const [blockBranchId, setBlockBranchId] = useState<string>('all');

  // Manual reservation state
  const [manualBranchId, setManualBranchId] = useState<string>('calle-5');
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualSlot, setManualSlot] = useState('turn_afternoon_1');
  const [manualParent, setManualParent] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualChild, setManualChild] = useState('');
  const [manualAge, setManualAge] = useState(6);
  const [manualKids, setManualKids] = useState(20);
  const [manualNotes, setManualNotes] = useState('');

  // SuperAdmin: New Branch Form State
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchAddress, setNewBranchAddress] = useState('');
  const [newBranchCity, setNewBranchCity] = useState('La Plata');
  const [newBranchPhone, setNewBranchPhone] = useState('');
  const [newBranchWhatsapp, setNewBranchWhatsapp] = useState('');
  const [newBranchFranName, setNewBranchFranName] = useState('');
  const [isAddingBranch, setIsAddingBranch] = useState(false);

  // SuperAdmin: New User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('franquista');
  const [newUserBranchId, setNewUserBranchId] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);

  const loadData = () => {
    const loadedBranches = getBranches();
    setBranches(loadedBranches);
    setReservations(getReservations());
    setInquiries(getInquiries());
    setBlockedDates(getBlockedDates());
    setAppUsers(getAppUsers());

    // If user is franquista, force branch filter to their assigned branch
    const user = getCurrentUser();
    setCurrentUser(user);
    if (user && user.role === 'franquista' && user.assignedBranchId) {
      setSelectedBranchFilter(user.assignedBranchId);
      setManualBranchId(user.assignedBranchId);
      setBlockBranchId(user.assignedBranchId);
    } else if (loadedBranches.length > 0) {
      setManualBranchId(loadedBranches[0].id);
    }
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
    logoutUser();
    onCloseAdmin();
  };

  // Role permissions helpers
  const isSuperAdmin = currentUser?.role === 'superadmin';
  const isAdmin = currentUser?.role === 'admin' || isSuperAdmin;
  const isFranquista = currentUser?.role === 'franquista';

  // Available unique months list for filtering
  const availableMonths = useMemo(() => {
    const monthsSet = new Set<string>();
    reservations.forEach((r) => {
      if (r.date && r.date.length >= 7) {
        monthsSet.add(r.date.substring(0, 7)); // "YYYY-MM"
      }
    });
    return Array.from(monthsSet).sort().reverse();
  }, [reservations]);

  // Format YYYY-MM into Spanish string
  const formatMonthLabel = (monthKey: string) => {
    if (monthKey === 'all') return 'Todos los Meses';
    const [y, m] = monthKey.split('-');
    const d = new Date(parseInt(y), parseInt(m) - 1, 1);
    return d.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  };

  // Filtered reservations list based on Role + Branch + Month + Status + Search
  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      // 1. Branch permission filter
      if (isFranquista && currentUser?.assignedBranchId) {
        if (r.branchId !== currentUser.assignedBranchId) return false;
      } else if (selectedBranchFilter !== 'all') {
        if (r.branchId !== selectedBranchFilter) return false;
      }

      // 2. Month filter
      if (selectedMonthFilter !== 'all') {
        if (!r.date.startsWith(selectedMonthFilter)) return false;
      }

      // 3. Status filter
      if (filterStatus !== 'todos') {
        if (r.status !== filterStatus) return false;
      }

      // 4. Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          r.parentName.toLowerCase().includes(q) ||
          r.childName.toLowerCase().includes(q) ||
          r.parentPhone.toLowerCase().includes(q) ||
          r.branchName.toLowerCase().includes(q) ||
          r.date.includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [reservations, isFranquista, currentUser, selectedBranchFilter, selectedMonthFilter, filterStatus, searchQuery]);

  // Filtered inquiries list
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      if (isFranquista && currentUser?.assignedBranchId) {
        return inq.branchId === currentUser.assignedBranchId;
      }
      if (selectedBranchFilter !== 'all') {
        return inq.branchId === selectedBranchFilter;
      }
      return true;
    });
  }, [inquiries, isFranquista, currentUser, selectedBranchFilter]);

  // Status management
  const handleUpdateStatus = async (id: string, status: Reservation['status']) => {
    const updated = await updateReservationStatus(id, status, status === 'approved');
    setReservations(updated);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta reserva?')) {
      const updated = await deleteReservation(id);
      setReservations(updated);
    }
  };

  const handleToggleBlock = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = toggleBlockDate(blockDateStr, blockReason, blockBranchId);
    setBlockedDates(updated);
  };

  const handleCreateManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualParent || !manualChild) {
      alert('Por favor completá Nombre del Adulto y Nombre del Cumpleañer@.');
      return;
    }
    const slotObj = TIME_SLOTS.find(s => s.id === manualSlot);
    const branchObj = branches.find(b => b.id === manualBranchId);

    await addReservation({
      branchId: manualBranchId,
      branchName: branchObj?.name || 'El Galpón',
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
      notes: `[Carga Manual por ${currentUser?.displayName || 'Admin'}] ${manualNotes}`,
      createdByRole: currentUser?.role,
    });

    loadData();
    setActiveTab('reservas');
    setManualParent('');
    setManualPhone('');
    setManualChild('');
    setManualNotes('');
  };

  // SuperAdmin: Add new branch
  const handleAddBranchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName || !newBranchAddress) return;

    await addBranch({
      name: newBranchName,
      address: newBranchAddress,
      city: newBranchCity,
      phone: newBranchPhone || '221 500-0000',
      whatsappNumber: newBranchWhatsapp ? newBranchWhatsapp.replace(/\D/g, '') : '5492215000000',
      franquistaName: newBranchFranName,
      isActive: true,
      color: '#F2C700',
    });

    setNewBranchName('');
    setNewBranchAddress('');
    setNewBranchPhone('');
    setNewBranchWhatsapp('');
    setNewBranchFranName('');
    setIsAddingBranch(false);
    loadData();
  };

  // SuperAdmin: Toggle branch status
  const handleToggleBranchActive = async (branchId: string, currentStatus: boolean) => {
    await updateBranch(branchId, { isActive: !currentStatus });
    loadData();
  };

  // SuperAdmin: Add new user
  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserUsername) return;

    const assignedBranch = branches.find(b => b.id === newUserBranchId);

    await addAppUser({
      displayName: newUserName,
      username: newUserUsername.toLowerCase().trim(),
      email: newUserEmail || `${newUserUsername.toLowerCase().trim()}@elgalpon.com`,
      role: newUserRole,
      assignedBranchId: newUserRole === 'franquista' ? newUserBranchId : undefined,
      assignedBranchName: newUserRole === 'franquista' ? assignedBranch?.name : undefined,
    });

    setNewUserName('');
    setNewUserUsername('');
    setNewUserEmail('');
    setIsAddingUser(false);
    loadData();
  };

  // Analytics Metrics for the active filter
  const totalInFilter = filteredReservations.length;
  const approvedInFilter = filteredReservations.filter((r) => r.status === 'approved').length;
  const pendingInFilter = filteredReservations.filter((r) => r.status === 'pending').length;
  const totalRevenueDeposits = filteredReservations
    .filter((r) => r.status === 'approved' && r.depositPaid)
    .reduce((sum, r) => sum + (r.depositAmount || 50000), 0);

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 text-white overflow-y-auto">
      
      {/* ========================================================================= */}
      {/* TOP ADMIN HEADER BAR                                                      */}
      {/* ========================================================================= */}
      <div className="bg-black border-b-2 border-zinc-800 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Brand & User Role Badge */}
        <div className="flex items-center gap-3">
          <img src="/marca_el_galpon_blanca.svg" alt="El Galpón" className="h-9 w-auto object-contain" />
          
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-black text-base sm:text-lg text-white uppercase flex items-center gap-2">
                Panel Central
              </h1>

              {/* Dynamic Role Badge */}
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase flex items-center gap-1 ${
                isSuperAdmin 
                  ? 'bg-[#ED3078] text-white shadow-[0_0_12px_rgba(237,48,120,0.5)]'
                  : isAdmin 
                  ? 'bg-[#F2C700] text-black shadow-[0_0_12px_rgba(242,199,0,0.4)]'
                  : 'bg-[#1EB8BF] text-black shadow-[0_0_12px_rgba(30,184,191,0.4)]'
              }`}>
                {isSuperAdmin ? <Crown className="w-3 h-3" /> : isAdmin ? <Building2 className="w-3 h-3" /> : <Store className="w-3 h-3" />}
                <span>{currentUser?.displayName || (isSuperAdmin ? 'SuperAdmin' : isAdmin ? 'Admin Dueño' : 'Franquista')}</span>
              </span>
            </div>
            
            <p className="text-[11px] text-zinc-400 font-medium">
              {isSuperAdmin 
                ? 'Control absoluto multi-sucursal, altas de administradores y franquistas.'
                : isAdmin
                ? 'Supervisión general de todas las franquicias y reservas del negocio.'
                : `Gestión exclusiva de la sucursal: ${currentUser?.assignedBranchName || 'Asignada'}`}
            </p>
          </div>
        </div>

        {/* Branch Switcher & Quick Actions */}
        <div className="flex items-center gap-2.5 self-end md:self-auto">
          
          {/* Branch Switcher (Enabled for SuperAdmin & Admin, Locked for Franquista) */}
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-700 rounded-xl px-2.5 py-1.5 text-xs">
            <MapPin className="w-3.5 h-3.5 text-[#1EB8BF]" />
            {isFranquista ? (
              <span className="font-black text-white">{currentUser?.assignedBranchName || 'Mi Sucursal'}</span>
            ) : (
              <select
                value={selectedBranchFilter}
                onChange={(e) => setSelectedBranchFilter(e.target.value)}
                className="bg-transparent text-white font-black text-xs uppercase focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-zinc-900 text-white">Todas las Sucursales</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id} className="bg-zinc-900 text-white">
                    {b.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Close & Logout buttons */}
          <button
            onClick={onCloseAdmin}
            className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-black text-white uppercase transition-colors cursor-pointer"
          >
            Volver a la Web
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-[#ED3078]/20 text-zinc-300 hover:text-[#ED3078] border border-zinc-700 transition-colors cursor-pointer"
            title="Cerrar Sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* MAIN ADMIN BODY                                                           */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b-2 border-zinc-800 pb-3 overflow-x-auto">
          
          <button
            onClick={() => setActiveTab('reservas')}
            className={`px-4 py-2.5 rounded-xl font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'reservas'
                ? 'bg-[#1EB8BF] text-black shadow-md'
                : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Reservas & Festejos</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-black/20 text-current">
              {filteredReservations.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('consultas')}
            className={`px-4 py-2.5 rounded-xl font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'consultas'
                ? 'bg-[#F2C700] text-black shadow-md'
                : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Consultas Web</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-black/20 text-current">
              {filteredInquiries.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('bloqueo')}
            className={`px-4 py-2.5 rounded-xl font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'bloqueo'
                ? 'bg-[#ED3078] text-white shadow-md'
                : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Bloqueo de Fechas</span>
          </button>

          <button
            onClick={() => setActiveTab('nueva')}
            className={`px-4 py-2.5 rounded-xl font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'nueva'
                ? 'bg-[#A3BA13] text-black shadow-md'
                : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Cargar Reserva Manual</span>
          </button>

          {/* SUPERADMIN EXCLUSIVE TABS */}
          {isSuperAdmin && (
            <>
              <button
                onClick={() => setActiveTab('sucursales')}
                className={`px-4 py-2.5 rounded-xl font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'sucursales'
                    ? 'bg-[#ED3078] text-white shadow-md'
                    : 'bg-zinc-900 border border-[#ED3078]/40 text-[#ED3078] hover:bg-[#ED3078]/10'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Gestión de Franquicias</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white/20 text-white">
                  {branches.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('usuarios')}
                className={`px-4 py-2.5 rounded-xl font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'usuarios'
                    ? 'bg-[#F2C700] text-black shadow-md'
                    : 'bg-zinc-900 border border-[#F2C700]/40 text-[#F2C700] hover:bg-[#F2C700]/10'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Usuarios & Permisos</span>
              </button>
            </>
          )}

        </div>

        {/* ========================================================================= */}
        {/* TAB 1: RESERVAS & HISTORIAL MENSUAL                                       */}
        {/* ========================================================================= */}
        {activeTab === 'reservas' && (
          <div className="space-y-6">

            {/* MONTHLY HISTORY FILTER & KPI CARDS */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#F2C700]" />
                  <div>
                    <h2 className="font-heading font-black text-base sm:text-lg text-white uppercase">
                      Historial Mensual & Métricas
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Visualizando: <strong className="text-[#1EB8BF]">{formatMonthLabel(selectedMonthFilter)}</strong>
                      {selectedBranchFilter !== 'all' && ` • ${branches.find(b => b.id === selectedBranchFilter)?.name}`}
                    </p>
                  </div>
                </div>

                {/* Month/Year Filter Dropdown */}
                <div className="flex items-center gap-2 bg-black border border-zinc-700 rounded-2xl px-3 py-2">
                  <CalendarIcon className="w-4 h-4 text-[#F2C700]" />
                  <select
                    value={selectedMonthFilter}
                    onChange={(e) => setSelectedMonthFilter(e.target.value)}
                    className="bg-transparent text-white font-black text-xs uppercase focus:outline-none cursor-pointer"
                  >
                    <option value="all" className="bg-zinc-900 text-white">Todos los Meses (Histórico)</option>
                    {availableMonths.map((monthKey) => (
                      <option key={monthKey} value={monthKey} className="bg-zinc-900 text-white">
                        {formatMonthLabel(monthKey)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Metric Cards Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                
                <div className="bg-black/60 border border-zinc-800 rounded-2xl p-4 space-y-1">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase block">Total Reservas</span>
                  <div className="font-heading font-black text-2xl text-white flex items-center justify-between">
                    <span>{totalInFilter}</span>
                    <CalendarIcon className="w-5 h-5 text-[#1EB8BF]" />
                  </div>
                </div>

                <div className="bg-black/60 border border-zinc-800 rounded-2xl p-4 space-y-1">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase block">Aprobadas / Con Seña</span>
                  <div className="font-heading font-black text-2xl text-[#A3BA13] flex items-center justify-between">
                    <span>{approvedInFilter}</span>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-black/60 border border-zinc-800 rounded-2xl p-4 space-y-1">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase block">Pendientes Seña</span>
                  <div className="font-heading font-black text-2xl text-[#ED3078] flex items-center justify-between">
                    <span>{pendingInFilter}</span>
                    <Clock className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-black/60 border border-zinc-800 rounded-2xl p-4 space-y-1">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase block">Señas Recaudadas</span>
                  <div className="font-heading font-black text-2xl text-[#F2C700] flex items-center justify-between">
                    <span>${totalRevenueDeposits.toLocaleString('es-AR')}</span>
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>

              </div>

            </div>

            {/* SEARCH & STATUS FILTER BAR */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-3.5">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Buscar por niño, adulto, celular..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#1EB8BF] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                {['todos', 'pending', 'approved', 'rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all cursor-pointer whitespace-nowrap ${
                      filterStatus === status
                        ? 'bg-white text-black'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {status === 'todos' ? 'Todos' : status === 'pending' ? 'Pendientes' : status === 'approved' ? 'Aprobadas' : 'Rechazadas'}
                  </button>
                ))}
              </div>
            </div>

            {/* RESERVATIONS TABLE / CARDS */}
            {filteredReservations.length === 0 ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center space-y-2">
                <CalendarIcon className="w-10 h-10 text-zinc-600 mx-auto" />
                <h3 className="font-heading font-black text-lg text-white uppercase">No hay reservas registradas</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  No se encontraron reservas que coincidan con los filtros de sucursal y mes seleccionados.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {filteredReservations.map((res) => {
                  const isApproved = res.status === 'approved';
                  const isPending = res.status === 'pending';

                  return (
                    <div
                      key={res.id}
                      className={`bg-zinc-900/90 border-2 rounded-2xl p-4 sm:p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isApproved
                          ? 'border-[#A3BA13]/50 hover:border-[#A3BA13]'
                          : isPending
                          ? 'border-[#ED3078]/50 hover:border-[#ED3078]'
                          : 'border-zinc-800'
                      }`}
                    >
                      {/* Left: Booking Details */}
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-zinc-800 text-zinc-200 text-xs font-black uppercase flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#1EB8BF]" /> {res.branchName}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md bg-zinc-950 text-[#F2C700] text-xs font-black">
                            {res.date} • {res.slotTime}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase ${
                            isApproved 
                              ? 'bg-[#A3BA13] text-black' 
                              : isPending 
                              ? 'bg-[#ED3078] text-white' 
                              : 'bg-zinc-800 text-zinc-400'
                          }`}>
                            {isApproved ? 'Aprobada / Seña OK' : isPending ? 'Pendiente de Seña' : 'Cancelada'}
                          </span>
                        </div>

                        <div className="space-y-0.5">
                          <h4 className="font-heading font-black text-lg text-white uppercase flex items-center gap-2">
                            Cumple de <span className="text-[#F2C700]">{res.childName}</span> ({res.childAge} años)
                          </h4>
                          <p className="text-xs text-zinc-300">
                            Adulto: <strong>{res.parentName}</strong> • Cel: <strong>{res.parentPhone}</strong> • {res.estimatedKids} chicos estimados
                          </p>
                        </div>

                        {res.notes && (
                          <div className="bg-black/60 border border-zinc-800 rounded-xl p-2 text-xs text-zinc-300">
                            <strong className="text-zinc-400">Nota:</strong> {res.notes}
                          </div>
                        )}
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-wrap md:flex-col items-center md:items-end gap-2 shrink-0 border-t md:border-t-0 border-zinc-800 pt-3 md:pt-0">
                        <div className="flex items-center gap-1.5">
                          {isPending && (
                            <button
                              onClick={() => handleUpdateStatus(res.id, 'approved')}
                              className="px-3 py-1.5 rounded-xl bg-[#A3BA13] hover:bg-[#8fa410] text-black font-black text-xs uppercase flex items-center gap-1 transition-all cursor-pointer"
                              title="Aprobar y Confirmar Seña"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Aprobar Seña</span>
                            </button>
                          )}

                          {isApproved && (
                            <button
                              onClick={() => handleUpdateStatus(res.id, 'pending')}
                              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs uppercase transition-all cursor-pointer"
                              title="Marcar como Pendiente"
                            >
                              Volver a Pendiente
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(res.id)}
                            className="p-2 rounded-xl bg-zinc-950 hover:bg-red-950/60 text-zinc-500 hover:text-red-400 border border-zinc-800 transition-colors cursor-pointer"
                            title="Eliminar Reserva"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* WhatsApp Parent Button */}
                        <a
                          href={`https://wa.me/${res.parentPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `¡Hola ${res.parentName}! Nos comunicamos desde ${res.branchName} por la reserva del cumple de ${res.childName} el ${res.date}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-black border border-[#25D366]/40 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>Contactar WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CONSULTAS WEB                                                      */}
        {/* ========================================================================= */}
        {activeTab === 'consultas' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-black text-lg text-white uppercase flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#F2C700]" /> Consultas Web Recibidas
              </h2>
            </div>

            {filteredInquiries.length === 0 ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center space-y-2">
                <MessageCircle className="w-10 h-10 text-zinc-600 mx-auto" />
                <h3 className="font-heading font-black text-lg text-white uppercase">No hay consultas pendientes</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filteredInquiries.map((inq) => (
                  <div key={inq.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md bg-zinc-800 text-[#1EB8BF] font-black text-xs uppercase flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {inq.branchName}
                      </span>
                      <span className="text-xs text-zinc-400 font-medium">{new Date(inq.createdAt).toLocaleDateString('es-ES')}</span>
                    </div>

                    <div>
                      <h4 className="font-heading font-black text-base text-white">{inq.senderName} ({inq.senderPhone})</h4>
                      <p className="text-xs text-zinc-300 mt-1 bg-black/50 p-3 rounded-xl border border-zinc-800">{inq.message}</p>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <a
                        href={`https://wa.me/${inq.senderPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                          `¡Hola ${inq.senderName}! Te escribimos desde ${inq.branchName} por tu consulta en nuestra web.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-[#25D366] text-black font-black text-xs flex items-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> Responder por WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: BLOQUEO DE FECHAS                                                  */}
        {/* ========================================================================= */}
        {activeTab === 'bloqueo' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
              <h3 className="font-heading font-black text-lg text-white uppercase flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#ED3078]" /> Bloquear Día
              </h3>

              <form onSubmit={handleToggleBlock} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 uppercase">Sucursal a Bloquear</label>
                  <select
                    disabled={isFranquista}
                    value={blockBranchId}
                    onChange={(e) => setBlockBranchId(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-white"
                  >
                    <option value="all">Todas las Sucursales</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 uppercase">Fecha</label>
                  <input
                    type="date"
                    required
                    value={blockDateStr}
                    onChange={(e) => setBlockDateStr(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 uppercase">Motivo</label>
                  <input
                    type="text"
                    required
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#ED3078] hover:bg-[#d82469] text-white font-black text-xs uppercase py-3 rounded-xl transition-all cursor-pointer"
                >
                  Alternar Bloqueo de Fecha
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
              <h3 className="font-heading font-black text-lg text-white uppercase">Fechas Bloqueadas Activas</h3>
              {blockedDates.length === 0 ? (
                <p className="text-xs text-zinc-400">No hay fechas bloqueadas actualmente.</p>
              ) : (
                <div className="space-y-2">
                  {blockedDates.map((b, idx) => (
                    <div key={idx} className="bg-black/60 border border-zinc-800 rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <span className="font-black text-white text-xs block">{b.date}</span>
                        <span className="text-[11px] text-zinc-400">{b.reason}</span>
                      </div>
                      <button
                        onClick={() => toggleBlockDate(b.date, b.reason, b.branchId || 'all')}
                        className="px-2.5 py-1 rounded-lg bg-zinc-800 text-xs font-bold text-red-400 hover:bg-zinc-700 cursor-pointer"
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

        {/* ========================================================================= */}
        {/* TAB 4: CARGA MANUAL DE RESERVA                                            */}
        {/* ========================================================================= */}
        {activeTab === 'nueva' && (
          <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Plus className="w-5 h-5 text-[#A3BA13]" />
              <h2 className="font-heading font-black text-lg text-white uppercase">Carga Manual de Festejo</h2>
            </div>

            <form onSubmit={handleCreateManual} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 uppercase">Sucursal</label>
                <select
                  disabled={isFranquista}
                  value={manualBranchId}
                  onChange={(e) => setManualBranchId(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-white"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 uppercase">Fecha</label>
                  <input
                    type="date"
                    required
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 uppercase">Turno</label>
                  <select
                    value={manualSlot}
                    onChange={(e) => setManualSlot(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-white"
                  >
                    {TIME_SLOTS.map((s) => (
                      <option key={s.id} value={s.id}>{s.title} ({s.timeRange})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 uppercase">Nombre Adulto *</label>
                  <input
                    type="text"
                    required
                    value={manualParent}
                    onChange={(e) => setManualParent(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 uppercase">Celular WhatsApp</label>
                  <input
                    type="tel"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 uppercase">Cumpleañer@ *</label>
                  <input
                    type="text"
                    required
                    value={manualChild}
                    onChange={(e) => setManualChild(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 uppercase">Edad</label>
                  <input
                    type="number"
                    value={manualAge}
                    onChange={(e) => setManualAge(Number(e.target.value))}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 uppercase">Notas internas</label>
                <textarea
                  rows={2}
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#A3BA13] text-black font-black text-xs uppercase py-3.5 rounded-xl transition-all cursor-pointer"
              >
                Guardar Reserva Manual
              </button>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5 (SUPERADMIN): GESTIÓN DE SUCURSALES / FRANQUICIAS                    */}
        {/* ========================================================================= */}
        {isSuperAdmin && activeTab === 'sucursales' && (
          <div className="space-y-6">
            
            <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <div>
                <h2 className="font-heading font-black text-lg text-white uppercase flex items-center gap-2">
                  <Store className="w-5 h-5 text-[#ED3078]" /> Franquicias & Sucursales Activas
                </h2>
                <p className="text-xs text-zinc-400">Escala el negocio añadiendo nuevas sucursales y franquistas</p>
              </div>

              <button
                onClick={() => setIsAddingBranch(!isAddingBranch)}
                className="px-3.5 py-2 rounded-xl bg-[#ED3078] text-white font-black text-xs uppercase flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Nueva Sucursal
              </button>
            </div>

            {/* New Branch Form Drawer */}
            {isAddingBranch && (
              <form onSubmit={handleAddBranchSubmit} className="bg-zinc-900 border-2 border-[#ED3078] rounded-3xl p-6 space-y-4 animate-in fade-in duration-200">
                <h3 className="font-heading font-black text-base text-white uppercase">Alta de Nueva Sucursal</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-300 uppercase">Nombre de Sucursal *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: El Galpón Calle 20"
                      value={newBranchName}
                      onChange={(e) => setNewBranchName(e.target.value)}
                      className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-300 uppercase">Dirección *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Calle 20 Nº 1450"
                      value={newBranchAddress}
                      onChange={(e) => setNewBranchAddress(e.target.value)}
                      className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-300 uppercase">Teléfono de Contacto</label>
                    <input
                      type="text"
                      placeholder="221 555-4321"
                      value={newBranchPhone}
                      onChange={(e) => setNewBranchPhone(e.target.value)}
                      className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-300 uppercase">WhatsApp para Derivación (Directo)</label>
                    <input
                      type="text"
                      placeholder="5492215554321"
                      value={newBranchWhatsapp}
                      onChange={(e) => setNewBranchWhatsapp(e.target.value)}
                      className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingBranch(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold uppercase"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#ED3078] text-white text-xs font-black uppercase"
                  >
                    Guardar y Habilitar Sucursal
                  </button>
                </div>
              </form>
            )}

            {/* Branches List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {branches.map((b) => {
                const branchResCount = reservations.filter(r => r.branchId === b.id).length;
                return (
                  <div key={b.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-[#1EB8BF]" />
                        <h4 className="font-heading font-black text-base text-white uppercase">{b.name}</h4>
                      </div>
                      <button
                        onClick={() => handleToggleBranchActive(b.id, b.isActive)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase cursor-pointer ${
                          b.isActive ? 'bg-[#A3BA13] text-black' : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {b.isActive ? 'Activa' : 'Pausada'}
                      </button>
                    </div>

                    <p className="text-xs text-zinc-300">{b.address}, {b.city}</p>
                    <p className="text-xs text-zinc-400">WhatsApp: {b.whatsappNumber} • Tel: {b.phone}</p>
                    
                    <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-400">
                      <span>Reservas históricas: <strong className="text-white">{branchResCount}</strong></span>
                      <span className="text-[11px] text-zinc-500 font-mono">ID: {b.id}</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6 (SUPERADMIN): GESTIÓN DE USUARIOS Y ROLES                           */}
        {/* ========================================================================= */}
        {isSuperAdmin && activeTab === 'usuarios' && (
          <div className="space-y-6">
            
            <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <div>
                <h2 className="font-heading font-black text-lg text-white uppercase flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#F2C700]" /> Gestión de Usuarios y Roles (4 Niveles)
                </h2>
                <p className="text-xs text-zinc-400">Alta y asignación de permisos para Admins y Franquistas</p>
              </div>

              <button
                onClick={() => setIsAddingUser(!isAddingUser)}
                className="px-3.5 py-2 rounded-xl bg-[#F2C700] text-black font-black text-xs uppercase flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Nuevo Usuario
              </button>
            </div>

            {/* New User Form Drawer */}
            {isAddingUser && (
              <form onSubmit={handleAddUserSubmit} className="bg-zinc-900 border-2 border-[#F2C700] rounded-3xl p-6 space-y-4 animate-in fade-in duration-200">
                <h3 className="font-heading font-black text-base text-white uppercase">Alta de Usuario con Rol</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-300 uppercase">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Laura Benítez"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-300 uppercase">Nombre de Usuario (Login) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: franquicia20"
                      value={newUserUsername}
                      onChange={(e) => setNewUserUsername(e.target.value)}
                      className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-300 uppercase">Rol Asignado *</label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                      className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="franquista">Franquista (Gestor de Sucursal)</option>
                      <option value="admin">Admin (Dueño del Negocio)</option>
                      <option value="superadmin">SuperAdmin (Desarrollador)</option>
                    </select>
                  </div>

                  {newUserRole === 'franquista' && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-300 uppercase">Sucursal Asignada *</label>
                      <select
                        value={newUserBranchId}
                        onChange={(e) => setNewUserBranchId(e.target.value)}
                        className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="">Seleccionar Sucursal</option>
                        {branches.map((b) => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingUser(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold uppercase"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#F2C700] text-black text-xs font-black uppercase"
                  >
                    Dar de Alta Usuario
                  </button>
                </div>
              </form>
            )}

            {/* Users List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {appUsers.map((u) => (
                <div key={u.uid} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-black text-base text-white">{u.displayName}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      u.role === 'superadmin' 
                        ? 'bg-[#ED3078] text-white' 
                        : u.role === 'admin' 
                        ? 'bg-[#F2C700] text-black' 
                        : 'bg-[#1EB8BF] text-black'
                    }`}>
                      {u.role}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400">Usuario: <strong className="text-zinc-200">{u.username}</strong> • Email: {u.email}</p>
                  {u.assignedBranchName && (
                    <p className="text-xs text-[#1EB8BF] font-bold">Sucursal Asignada: {u.assignedBranchName}</p>
                  )}
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
