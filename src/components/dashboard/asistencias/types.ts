export interface AttendanceHistoryItem {
  id: string;
  name: string;
  date: string;
  time: string;
  method: string;
  status: string;
  distance: string;
  class: string;
}

export interface RecentCheckinItem {
  name: string;
  time: string;
  method: string;
  alert?: string | null;
  alertColor?: string;
  photo: string;
}

import type { BlackoutDayItem } from "../clases";

export interface AsistenciasTabProps {
  blackoutDays: BlackoutDayItem[];
  membersList?: any[];
  classesList?: any[];
  setClassesList?: React.Dispatch<React.SetStateAction<any[]>>;
  currentUser?: any;
}
