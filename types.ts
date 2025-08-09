export type Center = {
  id: number;
  name: string;
  phone: string;
  alt_phone?: string;
  address?: string;
  street?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  doctors?: Doctor[];
  schedules?: Schedule[];
};

export type Schedule = {
  id: number;
  center_id: number;
  day:
    | "saturday"
    | "sunday"
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday";
  start_time: string;
  end_time: string;
  is_active: boolean;
};

export type Doctor = {
  id: number;
  name: string;
  phone: string;
};

export type User = {
  id: number;
  file_number: string;
  national_id: string;
  family_issue_number?: string;
  name: string;
  phone: string;
  email?: string;
  gender?: "male" | "female";
  dob?: string;
  blood_group?: string;
  image?: string;
  verified: boolean;
  center_id?: number;
  center?: Center;
  device_id?: number;
  created_at?: string;
  updated_at?: string;
};

export type Appointment = {
  id: number;
  center_id: number;
  center?: Center;
  patient_id: number;
  patient?: User;
  doctor_id?: number;
  doctor?: User;
  device_id?: number;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  intended: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  is_dirty?: boolean;
};

export type Product = {
  id: number;
  type: "medicine" | "equipment" | "service" | "other";
  name: string;
  image?: string;
  expiry_date?: string;
  description?: string;
  usage?: string;
  alert_threshold?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

export type Order = {
  id: number;
  center_id: number;
  center?: Center;
  patient_id?: number;
  appointment_id?: number;
  status: "pending" | "confirmed" | "cancelled";
  created_at?: string;
  updated_at?: string;
  items?: OrderItem[];
};

export type OrderItem = {
  id: number;
  order_id: number;
  order?: Order;
  product_id: number;
  product?: Product;
  quantity: number;
};

export type Prescription = {
  id: number;
  patient_id: number;
  doctor_id?: number;
  appointment_id?: number;
  doctor?: Doctor;
  date: string;
  notes?: string;
  items?: PrescriptionItem[];
  created_at: string;
  updated_at: string;
};

export type PrescriptionItem = {
  id: number;
  prescription_id: number;
  product_id: number;
  frequency: "daily" | "weekly" | "monthly";
  interval: number;
  times_per_interval: number;
  dose_amount: string;
  dose_unit: string;
  start_date: string;
  end_date: string;
  product?: Product;
};

export type HomeData = {
  appointments_count: number;
  orders_count: number;
  prescriptions_count: number;
  appointments?: Appointment[];
  orders?: Order[];
  prescriptions?: Prescription[];
};

export type Notification = {
  id: number;
  date?: string;
  time?: string;
  human_time?: string;
  in_hours?: number;
};

export type Alert = {
  id: number;
  patient_id: number;
  type: "appointment" | "order" | "prescription";
  type_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
};
