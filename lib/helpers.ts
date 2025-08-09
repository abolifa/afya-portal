import { Alert, Schedule } from "@/types";
import {
  format,
  isToday,
  isTomorrow,
  isThisWeek,
  isThisMonth,
  differenceInMinutes,
  addDays,
} from "date-fns";
import { ar, arSA } from "date-fns/locale";

export function getGenderLabel(gender?: string) {
  switch (gender) {
    case "male":
      return "ذكر";
    case "female":
      return "أنثى";
    default:
      return "غير محدد";
  }
}

export function getStatusLabel(status?: string | null): string {
  if (!status) return "غير محدد"; // For null, undefined, or empty
  const normalized = status.toLowerCase();
  return STATUS_LABELS[normalized] ?? "غير محدد";
}

export const STATUS_LABELS: Record<string, string> = {
  active: "نشط",
  inactive: "غير نشط",
  pending: "قيد الانتظار",
  cancelled: "ملغي",
  completed: "مكتمل",
  failed: "فشل",
  processing: "قيد المعالجة",
  draft: "مسودة",
  approved: "موافق عليه",
  rejected: "مرفوض",
  refunded: "مسترد",
  shipped: "تم الشحن",
  delivered: "تم التسليم",
  confirmed: "مؤكد",
};

export function getStatusColor(status?: string): string {
  if (!status) return "bg-gray-200";
  const normalized = status.toLowerCase();
  switch (normalized) {
    case "active":
      return "bg-green-200 text-green-600";
    case "pending":
      return "bg-amber-200 text-amber-600";
    case "cancelled":
      return "bg-red-200 text-red-600";
    case "confirmed":
      return "bg-green-200 text-green-600";
    case "completed":
      return "bg-gray-300 text-gray-500";
    case "failed":
      return "bg-orange-200 text-orange-600";
    default:
      return "bg-gray-200 text-gray-600";
  }
}

export function formatTimeToArabic(input: string): string {
  const date = new Date(`1970-01-01T${input}`);

  if (isNaN(date.getTime())) return "غير صالح";

  const formatter = new Intl.DateTimeFormat("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return formatter.format(date).replace("ص", "صباحاً").replace("م", "مساءً");
}

export function getTimeLeft(date: string, time: string): string {
  const now = new Date();
  const dateTimeString = `${date}T${normalizeTime(time)}`;
  const inputDate = new Date(dateTimeString);

  if (isNaN(inputDate.getTime())) return "غير صالح";

  if (isToday(inputDate)) {
    const diffInMinutes = differenceInMinutes(inputDate, now);

    if (diffInMinutes <= 0) return "الآن";

    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;

    let result = "بعد ";
    if (hours > 0)
      result += `${convertToArabicNumber(hours)} ${
        hours === 1 ? "ساعة" : "ساعات"
      }`;
    if (hours > 0 && minutes > 0) result += " و";
    if (minutes > 0) result += `${convertToArabicNumber(minutes)} دقيقة`;

    return result;
  }
  if (isTomorrow(inputDate)) return "غداً";
  if (isThisWeek(inputDate)) return "هذا الأسبوع";
  if (isThisMonth(inputDate)) return "هذا الشهر";
  return format(inputDate, "d MMMM yyyy", { locale: ar });
}
function normalizeTime(time: string): string {
  return time.split(":").length === 2 ? `${time}:00` : time;
}
function convertToArabicNumber(num: number): string {
  return num.toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);
}

export function generateTimeSlots(start: string, end: string): string[] {
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);

  const startDate = new Date(0, 0, 0, startH, startM);
  const endDate = new Date(0, 0, 0, endH, endM);

  const slots: string[] = [];

  while (startDate < endDate) {
    slots.push(startDate.toTimeString().slice(0, 5));
    startDate.setMinutes(startDate.getMinutes() + 30);
  }

  return slots;
}

export function getUpcomingScheduleDates(
  schedules: Schedule[],
  daysAhead = 14
) {
  const validDays = schedules.map((s) => s.day);

  const today = new Date();
  const result: { date: Date; label: string; key: string }[] = [];

  for (let i = 0; i < daysAhead; i++) {
    const date = addDays(today, i);
    const dayName = date
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();

    if (validDays.includes(dayName as Schedule["day"])) {
      result.push({
        date,
        label: format(date, "EEEE dd/MM/yyyy", { locale: arSA }),
        key: format(date, "yyyy-MM-dd"),
      });
    }
  }
  return result;
}

export function getUserImage(image?: string) {
  if (!image) return "/default-avatar.png";
  return `https://romuz.com.ly/storage/${image}`;
}

export function parseLibyanDate(input: string): Date | undefined {
  const parts = input.split("/");
  if (parts.length !== 3) return undefined;

  const [day, month, year] = parts.map(Number);
  const date = new Date(year, month - 1, day);
  return isNaN(date.getTime()) ? undefined : date;
}
