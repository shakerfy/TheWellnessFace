export interface StaffAvailabilityInterval {
  from: string;
  to: string;
}

export interface StaffDayAvailability {
  day: string;
  intervals: StaffAvailabilityInterval[];
}

export interface StaffMember {
  id: string;
  name: string;
  specialty: string;
  specialties?: string[];
  certifications: string[];
  photo: string;
  certificationImages?: string[];
  role?: string;
  branchId?: string;
  status?: "linked" | "pending";
  availability?: StaffDayAvailability[];
  linkingCode?: string | null;
}

export interface ConfigStaffSectionProps {
  staffList: any[];
  setStaffList: React.Dispatch<React.SetStateAction<any[]>>;
}

export interface StaffFormData {
  name: string;
  specialties: string[];
  specialtyText: string;
  certificationsText: string;
  role: string;
  branchId: string;
  avatarUrl: string | null;
  diplomas: string[];
  availability: StaffDayAvailability[];
}
