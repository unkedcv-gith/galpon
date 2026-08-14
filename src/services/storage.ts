import { Reservation, BlockedDate } from '../types';
import { INITIAL_RESERVATIONS, INITIAL_BLOCKED_DATES } from '../data/initialData';

const RESERVATIONS_KEY = 'up_galpon_reservations_v1';
const BLOCKED_DATES_KEY = 'up_galpon_blocked_dates_v1';
const ADMIN_AUTH_KEY = 'up_galpon_admin_auth_v1';

export const getReservations = (): Reservation[] => {
  try {
    const data = localStorage.getItem(RESERVATIONS_KEY);
    if (!data) {
      localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(INITIAL_RESERVATIONS));
      return INITIAL_RESERVATIONS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_RESERVATIONS;
  }
};

export const saveReservations = (reservations: Reservation[]): void => {
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
};

export const addReservation = (reservation: Omit<Reservation, 'id' | 'createdAt' | 'status' | 'depositPaid' | 'depositAmount'>): Reservation => {
  const current = getReservations();
  const newReservation: Reservation = {
    ...reservation,
    id: `res_${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    status: 'pending',
    depositPaid: false,
    depositAmount: 0,
  };
  const updated = [newReservation, ...current];
  saveReservations(updated);
  return newReservation;
};

export const updateReservationStatus = (
  id: string,
  status: Reservation['status'],
  depositPaid?: boolean,
  depositAmount?: number
): Reservation[] => {
  const current = getReservations();
  const updated = current.map((r) => {
    if (r.id === id) {
      return {
        ...r,
        status,
        depositPaid: depositPaid !== undefined ? depositPaid : r.depositPaid,
        depositAmount: depositAmount !== undefined ? depositAmount : (status === 'approved' ? 50000 : r.depositAmount),
      };
    }
    return r;
  });
  saveReservations(updated);
  return updated;
};

export const deleteReservation = (id: string): Reservation[] => {
  const current = getReservations();
  const updated = current.filter((r) => r.id !== id);
  saveReservations(updated);
  return updated;
};

export const getBlockedDates = (): BlockedDate[] => {
  try {
    const data = localStorage.getItem(BLOCKED_DATES_KEY);
    if (!data) {
      localStorage.setItem(BLOCKED_DATES_KEY, JSON.stringify(INITIAL_BLOCKED_DATES));
      return INITIAL_BLOCKED_DATES;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_BLOCKED_DATES;
  }
};

export const toggleBlockDate = (date: string, reason: string = 'Fecha no disponible'): BlockedDate[] => {
  const current = getBlockedDates();
  const exists = current.some((b) => b.date === date);
  let updated: BlockedDate[];
  if (exists) {
    updated = current.filter((b) => b.date !== date);
  } else {
    updated = [...current, { date, reason }];
  }
  localStorage.setItem(BLOCKED_DATES_KEY, JSON.stringify(updated));
  return updated;
};

export const isAdminAuthenticated = (): boolean => {
  return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
};

export const setAdminAuthenticated = (auth: boolean): void => {
  if (auth) {
    localStorage.setItem(ADMIN_AUTH_KEY, 'true');
  } else {
    localStorage.removeItem(ADMIN_AUTH_KEY);
  }
};
