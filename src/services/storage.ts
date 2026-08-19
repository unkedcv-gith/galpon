import { Reservation, BlockedDate, Branch, AppUser, Inquiry, UserRole } from '../types';
import { 
  INITIAL_RESERVATIONS, 
  INITIAL_BLOCKED_DATES, 
  INITIAL_BRANCHES, 
  INITIAL_USERS,
  INITIAL_INQUIRIES 
} from '../data/initialData';
import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';

const RESERVATIONS_KEY = 'up_galpon_reservations_v2';
const BLOCKED_DATES_KEY = 'up_galpon_blocked_dates_v2';
const BRANCHES_KEY = 'up_galpon_branches_v2';
const USERS_KEY = 'up_galpon_users_v2';
const INQUIRIES_KEY = 'up_galpon_inquiries_v2';
const AUTH_USER_KEY = 'up_galpon_auth_user_v2';

// Helper to remove any undefined fields before Firestore operations
const sanitizeForFirestore = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

// -------------------------------------------------------------
// BRANCHES (SUCURSALES) MANAGEMENT
// -------------------------------------------------------------
export const getBranches = (): Branch[] => {
  try {
    const data = localStorage.getItem(BRANCHES_KEY);
    if (!data) {
      localStorage.setItem(BRANCHES_KEY, JSON.stringify(INITIAL_BRANCHES));
      return INITIAL_BRANCHES;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_BRANCHES;
  }
};

export const saveBranches = (branches: Branch[]): void => {
  localStorage.setItem(BRANCHES_KEY, JSON.stringify(branches));
};

export const addBranch = async (branchData: Omit<Branch, 'id' | 'createdAt'>): Promise<Branch> => {
  const current = getBranches();
  const branchId = `branch_${Date.now().toString(36)}`;
  const newBranch: Branch = {
    ...branchData,
    id: branchId,
    createdAt: new Date().toISOString(),
  };
  const updated = [...current, newBranch];
  saveBranches(updated);

  // Sync to Firestore in background without blocking UI
  try {
    const branchRef = doc(db, 'branches', branchId);
    setDoc(branchRef, sanitizeForFirestore(newBranch)).catch((e) => console.warn('Firestore branch sync:', e));
  } catch (err) {
    console.warn('Firestore branch sync error:', err);
  }

  return newBranch;
};

export const updateBranch = async (id: string, branchData: Partial<Branch>): Promise<Branch[]> => {
  const current = getBranches();
  const updated = current.map((b) => (b.id === id ? { ...b, ...branchData } : b));
  saveBranches(updated);

  try {
    const branchRef = doc(db, 'branches', id);
    updateDoc(branchRef, sanitizeForFirestore(branchData)).catch((e) => console.warn('Firestore update:', e));
  } catch (err) {
    console.warn('Firestore branch update error:', err);
  }

  return updated;
};

export const deleteBranch = async (id: string): Promise<Branch[]> => {
  const current = getBranches();
  const updated = current.filter((b) => b.id !== id);
  saveBranches(updated);

  try {
    const branchRef = doc(db, 'branches', id);
    deleteDoc(branchRef).catch((e) => console.warn('Firestore delete:', e));
  } catch (err) {
    console.warn('Firestore branch delete error:', err);
  }

  return updated;
};

// -------------------------------------------------------------
// USERS (ROLES & ASIGNACIONES) MANAGEMENT
// -------------------------------------------------------------
export const getAppUsers = (): AppUser[] => {
  try {
    const data = localStorage.getItem(USERS_KEY);
    if (!data) {
      localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_USERS;
  }
};

export const saveAppUsers = (users: AppUser[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const addAppUser = async (userData: Omit<AppUser, 'uid' | 'createdAt'>): Promise<AppUser> => {
  const current = getAppUsers();
  const uid = `usr_${Date.now().toString(36)}`;
  const newUser: AppUser = {
    ...userData,
    uid,
    createdAt: new Date().toISOString(),
  };
  const updated = [...current, newUser];
  saveAppUsers(updated);

  try {
    const userRef = doc(db, 'users', uid);
    setDoc(userRef, sanitizeForFirestore(newUser)).catch((e) => console.warn('Firestore user sync:', e));
  } catch (err) {
    console.warn('Firestore user sync error:', err);
  }

  return newUser;
};

export const updateAppUser = async (uid: string, userData: Partial<AppUser>): Promise<AppUser[]> => {
  const current = getAppUsers();
  const updated = current.map((u) => (u.uid === uid ? { ...u, ...userData } : u));
  saveAppUsers(updated);

  try {
    const userRef = doc(db, 'users', uid);
    updateDoc(userRef, sanitizeForFirestore(userData)).catch((e) => console.warn('Firestore user update:', e));
  } catch (err) {
    console.warn('Firestore user update error:', err);
  }

  return updated;
};

export const deleteAppUser = async (uid: string): Promise<AppUser[]> => {
  const current = getAppUsers();
  const updated = current.filter((u) => u.uid !== uid);
  saveAppUsers(updated);

  try {
    const userRef = doc(db, 'users', uid);
    deleteDoc(userRef).catch((e) => console.warn('Firestore user delete:', e));
  } catch (err) {
    console.warn('Firestore user delete error:', err);
  }

  return updated;
};

// -------------------------------------------------------------
// AUTHENTICATION & CURRENT SESSION WITH ROLES
// -------------------------------------------------------------
export const getCurrentUser = (): AppUser | null => {
  try {
    const data = localStorage.getItem(AUTH_USER_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const setCurrentUser = (user: AppUser | null): void => {
  if (user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_USER_KEY);
  }
};

export const isAdminAuthenticated = (): boolean => {
  const user = getCurrentUser();
  return !!user && (user.role === 'superadmin' || user.role === 'admin' || user.role === 'franquista');
};

export const logoutUser = (): void => {
  localStorage.removeItem(AUTH_USER_KEY);
};

// -------------------------------------------------------------
// RESERVATIONS (RESERVAS) MANAGEMENT
// -------------------------------------------------------------
export const getReservations = (filterBranchId?: string): Reservation[] => {
  try {
    const data = localStorage.getItem(RESERVATIONS_KEY);
    let list: Reservation[] = INITIAL_RESERVATIONS;
    if (data) {
      list = JSON.parse(data);
    } else {
      localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(INITIAL_RESERVATIONS));
    }
    if (filterBranchId && filterBranchId !== 'all') {
      return list.filter((r) => r.branchId === filterBranchId);
    }
    return list;
  } catch {
    return INITIAL_RESERVATIONS;
  }
};

export const saveReservations = (reservations: Reservation[]): void => {
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
};

export const addReservation = async (
  reservation: Omit<Reservation, 'id' | 'createdAt' | 'status' | 'depositPaid' | 'depositAmount' | 'monthKey'>
): Promise<Reservation> => {
  const current = getReservations();
  const id = `res_${Date.now().toString(36)}`;
  const monthKey = reservation.date.substring(0, 7); // YYYY-MM

  const newReservation: Reservation = {
    ...reservation,
    id,
    monthKey,
    createdAt: new Date().toISOString(),
    status: 'pending',
    depositPaid: false,
    depositAmount: 0,
  };
  const updated = [newReservation, ...current];
  saveReservations(updated);

  // Sync to Firestore asynchronously in background (never blocks UI)
  try {
    const resRef = doc(db, 'bookings', id);
    const sanitized = sanitizeForFirestore(newReservation);
    setDoc(resRef, sanitized).catch((err) => {
      console.warn('Firestore booking background sync notice:', err);
    });
  } catch (err) {
    console.warn('Firestore booking sync notice:', err);
  }

  return newReservation;
};

export const updateReservationStatus = async (
  id: string,
  status: Reservation['status'],
  depositPaid?: boolean,
  depositAmount?: number
): Promise<Reservation[]> => {
  const current = getReservations();
  let updatedItem: Reservation | null = null;

  const updated = current.map((r) => {
    if (r.id === id) {
      updatedItem = {
        ...r,
        status,
        depositPaid: depositPaid !== undefined ? depositPaid : r.depositPaid,
        depositAmount: depositAmount !== undefined ? depositAmount : (status === 'approved' ? 50000 : r.depositAmount),
      };
      return updatedItem;
    }
    return r;
  });
  saveReservations(updated);

  if (updatedItem) {
    try {
      const resRef = doc(db, 'bookings', id);
      const updates = sanitizeForFirestore({
        status,
        depositPaid: (updatedItem as Reservation).depositPaid,
        depositAmount: (updatedItem as Reservation).depositAmount,
      });
      updateDoc(resRef, updates).catch((e) => console.warn('Firestore update:', e));
    } catch (err) {
      console.warn('Firestore booking update notice:', err);
    }
  }

  return updated;
};

export const deleteReservation = async (id: string): Promise<Reservation[]> => {
  const current = getReservations();
  const updated = current.filter((r) => r.id !== id);
  saveReservations(updated);

  try {
    const resRef = doc(db, 'bookings', id);
    deleteDoc(resRef).catch((e) => console.warn('Firestore delete:', e));
  } catch (err) {
    console.warn('Firestore booking delete notice:', err);
  }

  return updated;
};

// -------------------------------------------------------------
// INQUIRIES (CONSULTAS / MENSAJES) MANAGEMENT
// -------------------------------------------------------------
export const getInquiries = (filterBranchId?: string): Inquiry[] => {
  try {
    const data = localStorage.getItem(INQUIRIES_KEY);
    let list: Inquiry[] = INITIAL_INQUIRIES;
    if (data) {
      list = JSON.parse(data);
    } else {
      localStorage.setItem(INQUIRIES_KEY, JSON.stringify(INITIAL_INQUIRIES));
    }
    if (filterBranchId && filterBranchId !== 'all') {
      return list.filter((i) => i.branchId === filterBranchId);
    }
    return list;
  } catch {
    return INITIAL_INQUIRIES;
  }
};

export const saveInquiries = (inquiries: Inquiry[]): void => {
  localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
};

export const addInquiry = async (
  inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'status'>
): Promise<Inquiry> => {
  const current = getInquiries();
  const id = `inq_${Date.now().toString(36)}`;
  const newInquiry: Inquiry = {
    ...inquiryData,
    id,
    status: 'new',
    createdAt: new Date().toISOString(),
  };
  const updated = [newInquiry, ...current];
  saveInquiries(updated);

  try {
    const inqRef = doc(db, 'inquiries', id);
    setDoc(inqRef, sanitizeForFirestore(newInquiry)).catch((e) => console.warn('Firestore inquiry sync:', e));
  } catch (err) {
    console.warn('Firestore inquiry sync notice:', err);
  }

  return newInquiry;
};

export const updateInquiryStatus = async (id: string, status: Inquiry['status']): Promise<Inquiry[]> => {
  const current = getInquiries();
  const updated = current.map((i) => (i.id === id ? { ...i, status } : i));
  saveInquiries(updated);

  try {
    const inqRef = doc(db, 'inquiries', id);
    updateDoc(inqRef, { status }).catch((e) => console.warn('Firestore inquiry update:', e));
  } catch (err) {
    console.warn('Firestore inquiry update notice:', err);
  }

  return updated;
};

// -------------------------------------------------------------
// BLOCKED DATES (BLOQUEO DE FECHAS) MANAGEMENT
// -------------------------------------------------------------
export const getBlockedDates = (branchId?: string): BlockedDate[] => {
  try {
    const data = localStorage.getItem(BLOCKED_DATES_KEY);
    let list: BlockedDate[] = INITIAL_BLOCKED_DATES;
    if (data) {
      list = JSON.parse(data);
    } else {
      localStorage.setItem(BLOCKED_DATES_KEY, JSON.stringify(INITIAL_BLOCKED_DATES));
    }
    if (branchId && branchId !== 'all') {
      return list.filter((b) => !b.branchId || b.branchId === branchId || b.branchId === 'all');
    }
    return list;
  } catch {
    return INITIAL_BLOCKED_DATES;
  }
};

export const toggleBlockDate = (
  date: string, 
  reason: string = 'Fecha no disponible',
  branchId: string = 'all'
): BlockedDate[] => {
  const current = getBlockedDates();
  const exists = current.some((b) => b.date === date && (!b.branchId || b.branchId === branchId));
  let updated: BlockedDate[];
  if (exists) {
    updated = current.filter((b) => !(b.date === date && (!b.branchId || b.branchId === branchId)));
  } else {
    updated = [...current, { date, reason, branchId }];
  }
  localStorage.setItem(BLOCKED_DATES_KEY, JSON.stringify(updated));
  return updated;
};

// -------------------------------------------------------------
// FIRESTORE INITIAL SYNC HELPER (Loads remote data if online)
// -------------------------------------------------------------
export const syncWithRemoteFirestore = async (): Promise<void> => {
  try {
    const branchesSnapshot = await getDocs(collection(db, 'branches'));
    if (!branchesSnapshot.empty) {
      const remoteBranches: Branch[] = [];
      branchesSnapshot.forEach((d) => remoteBranches.push(d.data() as Branch));
      if (remoteBranches.length > 0) saveBranches(remoteBranches);
    }

    const bookingsSnapshot = await getDocs(collection(db, 'bookings'));
    if (!bookingsSnapshot.empty) {
      const remoteBookings: Reservation[] = [];
      bookingsSnapshot.forEach((d) => remoteBookings.push(d.data() as Reservation));
      if (remoteBookings.length > 0) saveReservations(remoteBookings);
    }
  } catch (e) {
    console.log('Running with local high-speed storage & sync ready');
  }
};
