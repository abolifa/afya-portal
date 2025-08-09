"use client";

import { Schedule } from "@/types";
import { cn } from "@/lib/utils";
import { getUpcomingScheduleDates } from "@/lib/helpers";

export default function CenterDateSelector({
  schedules,
  selectedDate,
  onDateSelect,
}: {
  schedules: Schedule[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
}) {
  const dates = getUpcomingScheduleDates(schedules);

  if (dates.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">لا توجد تواريخ متاحة</p>
    );
  }

  return (
    <div className="space-y-2 overflow-x-auto">
      <p className="text-sm text-muted-foreground">اختر التاريخ المتاح</p>
      <div className="flex gap-2 p-2 rounded border bg-muted overflow-x-auto">
        {dates.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => onDateSelect(key)}
            className={cn(
              "px-4 py-2 rounded border text-sm cursor-pointer",
              selectedDate === key
                ? "bg-primary text-white"
                : "bg-background hover:border-primary"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
