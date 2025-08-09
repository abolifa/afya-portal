"use client";
import { Schedule } from "@/types";
import { format, parseISO, differenceInMinutes } from "date-fns";
import { arSA } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { generateTimeSlots } from "@/lib/helpers";

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function CenterTimeSelector({
  schedules,
  selectedDate,
  onTimeSelect,
  selectedTime,
}: {
  schedules: Schedule[];
  selectedDate: string;
  onTimeSelect: (val: string) => void;
  selectedTime: string;
}) {
  if (!selectedDate) return null;

  const parsedDate = parseISO(selectedDate);
  const dayName = weekdays[parsedDate.getDay()].toLowerCase();
  const daySchedule = schedules.find((s) => s.day.toLowerCase() === dayName);

  if (!daySchedule) {
    return (
      <p className="text-sm text-muted-foreground">
        لا يوجد مواعيد في هذا اليوم
      </p>
    );
  }

  const timeSlots = generateTimeSlots(
    daySchedule.start_time,
    daySchedule.end_time
  );

  // Normalize selected time for fuzzy matching
  const selectedDateTime = selectedTime
    ? parseISO(`${selectedDate}T${selectedTime}`)
    : null;

  // Find closest match (±15 min tolerance)
  const getIsSelected = (slot: string) => {
    if (!selectedDateTime) return false;
    const slotDate = parseISO(`${selectedDate}T${slot}`);
    const diff = Math.abs(differenceInMinutes(selectedDateTime, slotDate));
    return diff < 15;
  };

  return (
    <div className="space-y-2 overflow-x-auto">
      <p className="text-sm text-muted-foreground">
        اختر وقتاً من: {daySchedule.start_time} إلى {daySchedule.end_time}
      </p>
      <div className="flex gap-2 p-2 rounded border bg-muted overflow-x-auto">
        {timeSlots.map((time) => (
          <button
            key={time}
            type="button"
            className={cn(
              "px-4 py-2 rounded border text-sm whitespace-nowrap",
              getIsSelected(time)
                ? "bg-primary text-white"
                : "bg-background hover:border-primary"
            )}
            onClick={() => onTimeSelect(time)}
          >
            {format(parseISO(`${selectedDate}T${time}`), "hh:mm a", {
              locale: arSA,
            })}
          </button>
        ))}
      </div>
    </div>
  );
}
