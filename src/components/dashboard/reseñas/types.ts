export interface Review {
  id: string;
  date: string;
  studentName: string;
  studentPhoto: string;
  rating: number;
  className: string;
  coachName: string;
  comment: string;
  featured: boolean;
  reply: string;
  reported?: boolean;
  reportReason?: string;
  verificationType?: "app_payment" | "attendance" | "normal";
}

export interface GymFacilityReview {
  id: string;
  date: string;
  studentName: string;
  studentPhoto: string;
  ratingCleanliness: number;
  ratingEquipment: number;
  ratingStaff: number;
  ratingPrice: number;
  overallRating: number;
  comment: string;
  reply: string;
  reported?: boolean;
  reportReason?: string;
}

export interface PrivateFeedbackItem {
  id: string;
  date: string;
  studentName: string;
  studentPhoto: string;
  category: "Instalaciones" | "Clases & Horarios" | "Climatización" | "Atención / Staff";
  message: string;
  status: "Pendiente" | "Atendido";
  adminNotes?: string;
}

export interface ReseñasTabProps {
  membersList?: any[];
}
