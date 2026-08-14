export type ReservationStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface Reservation {
  id: string;
  createdAt: string;
  date: string; // YYYY-MM-DD
  slotId: string;
  slotTime: string; // e.g. "15:00 a 17:30 hs"
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  childName: string;
  childAge: number;
  estimatedKids: number;
  status: ReservationStatus;
  depositPaid: boolean;
  depositAmount: number;
  notes?: string;
  additionalPackage: 'base_20' | 'adicional_21_28' | 'adicional_29_35';
  adultsFoodInfo?: string;
}

export interface TimeSlot {
  id: string;
  title: string;
  timeRange: string;
  description: string;
}

export interface BlockedDate {
  date: string; // YYYY-MM-DD
  reason: string;
}

export interface FaqItem {
  id: string;
  numberTag: string;
  question: string;
  answer: string;
  category: 'cumpleanos' | 'talleres' | 'por_un_dia';
  highlight?: string;
}

export interface WorkshopProgram {
  id: string;
  title: string;
  subtitle: string;
  ageRange: string;
  schedule: string;
  description: string;
  highlights: string[];
  color: 'cyan' | 'pink' | 'yellow' | 'lime';
  iconName: string;
}

export interface AttractionItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  staffSupervised: boolean;
}

export interface ReviewItem {
  id: string;
  author: string;
  event: string;
  comment: string;
  rating: number;
}
