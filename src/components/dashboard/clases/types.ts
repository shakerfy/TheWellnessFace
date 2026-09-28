export interface GymClassItem {
  id: string;
  name: string;
  staffId: string;
  time: string;
  capacity: number;
  booked: number;
  enrolledSpots: { [spotIndex: number]: string };
  salaId?: string;
  day: number;
  creditsCost?: number;
  layout?: boolean[];
  attendance?: { [spotIndex: number]: "presente" | "ausente" | "pendiente" };
  waitlist?: string[];
  releasedSpots?: { [spotIndex: number]: { originalStudent: string; creditsCost: number } };
  status?: "activa" | "cancelada";
  requiresSpotSelection?: boolean;
  weekOffset?: number;
  coach?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  specialty: string;
  certifications?: string[];
  photo?: string;
  specialties?: string[];
  availability?: Array<{
    day: string;
    intervals?: Array<{ from: string; to: string }>;
  }>;
}

export interface SalaItem {
  id: string;
  name: string;
  capacity?: number;
  description?: string;
}

export interface BlackoutDayItem {
  id: string;
  date: string;
  reason: string;
}

export interface ClasesTabProps {
  classesList: GymClassItem[];
  setClassesList: React.Dispatch<React.SetStateAction<GymClassItem[]>>;
  staffList: StaffMember[];
  canManageClasses: boolean;
  blackoutDays: BlackoutDayItem[];
  salasList: SalaItem[];
  cancellationPolicyHours: number;
  currentUser?: any;
  membersList?: any[];
}

export interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void;
}

export interface PromptDialogState {
  isOpen: boolean;
  title: string;
  description: string;
  placeholder?: string;
  defaultValue?: string;
  confirmText?: string;
  variant?: "default" | "destructive";
  onConfirm: (val: string) => void;
}

export interface CancelSpotDialogState {
  isOpen: boolean;
  c: GymClassItem;
  index: number;
  studentName: string;
  displayNameForConfirm: string;
  hasWaitlist: boolean;
  nextStudent?: string;
}
