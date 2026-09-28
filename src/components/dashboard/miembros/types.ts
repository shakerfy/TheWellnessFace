export interface MemberPayment {
  id: string;
  date: string;
  amount: number;
  method: string;
  duration: string;
}

export interface MemberItem {
  name: string;
  phone: string;
  email?: string;
  dni?: string;
  dob?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  medicalInsurance?: string;
  affiliateNumber?: string;
  hasApto?: string;
  aptoExp?: string;
  plan?: string;
  paymentMethod?: string;
  status: string;
  end: string;
  color?: string;
  photo?: string;
  medicalNotes?: string;
  aptoDocUrl?: string;
  isAutoRenew?: boolean;
  notes?: string;
  payments?: MemberPayment[];
}

export interface MemberHistory {
  attended: {
    className: string;
    day: string;
    time: string;
    staffId: string;
    rating?: { stars: number; comment?: string };
  }[];
  enrolled: { className: string; day: string; time: string }[];
  attendanceRate: number | null;
  lastClass?: { className: string; day: string; time: string; staffId: string };
  isChurnRisk: boolean;
}

export interface MiembrosTabProps {
  classesList?: any[];
  membersList: MemberItem[];
  setMembersList: React.Dispatch<React.SetStateAction<MemberItem[]>>;
  membershipsList?: any[];
  setCashTransactions?: React.Dispatch<React.SetStateAction<any[]>>;
  currentUser?: any;
}
