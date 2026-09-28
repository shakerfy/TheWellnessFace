export interface Membership {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  duration: string;
  activeCount: number;
  includedServices: string[];
  tag?: string;
  passType?: string;
  creditsCount?: number | null;
  accessHoursType?: string;
  offPeakStart?: string | null;
  offPeakEnd?: string | null;
  includedActivities?: string[];
  registrationFee?: number | null;
  isMultisede?: boolean;
  freezeDays?: number | null;
  dailyClassLimit?: string | null;
  isFeatured?: boolean;
}

export interface Amenity {
  id: string;
  name: string;
  category: string;
  checked: boolean;
}

export interface MembresiasTabProps {
  membershipsList: Membership[];
  setMembershipsList: React.Dispatch<React.SetStateAction<Membership[]>>;
  amenities: Amenity[];
}

export interface MembershipFormData {
  name: string;
  price: string;
  originalPrice: string;
  periodicity: string;
  tag: string;
  passType: string;
  creditsCount: string;
  accessHoursType: string;
  offPeakStart: string;
  offPeakEnd: string;
  includedActivities: string[];
  selectedServices: string[];
  registrationFee: string;
  freezeDays: string;
  dailyClassLimit: string;
}
