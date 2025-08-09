"use client";

import Link from "next/link";
import { Calendar, Clock, MoveLeft } from "lucide-react";
import { Appointment } from "@/types";
import {
  formatTimeToArabic,
  getStatusColor,
  getStatusLabel,
  getTimeLeft,
} from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { FaStethoscope } from "react-icons/fa";
import { CgSandClock } from "react-icons/cg";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";

const LatestAppointments = ({
  appointments,
  isLoading = false,
}: {
  appointments?: Appointment[];
  isLoading?: boolean;
}) => {
  const router = useRouter();

  return (
    <section className="w-full bg-card rounded-lg p-5 border shadow overflow-y-auto max-h-[500px]">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">أحدث المواعيد</h2>
        <Link
          href="/appointments"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors hover:underline hover:underline-offset-3"
        >
          <span>عرض الكل</span>
          <MoveLeft className="w-5 h-5" />
        </Link>
      </header>

      <div className="flex flex-col gap-2">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="px-3 py-2 rounded-lg border">
              <article className="flex items-center justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-32 h-6" />
                    <Skeleton className="w-20 h-6" />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <FaStethoscope className="w-3 h-3" />
                      <Skeleton className="w-24 h-4" />
                    </div>

                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <CgSandClock className="w-3 h-3" />
                      <Skeleton className="w-16 h-5" />
                    </div>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground space-y-2 text-right">
                  <div className="flex items-center gap-1">
                    <Skeleton className="w-20 h-5" />
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <Skeleton className="w-16 h-5" />
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
              </article>
            </div>
          ))
        ) : appointments?.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            لا توجد مواعيد حالياً.
          </div>
        ) : (
          appointments?.map((appointment) => (
            <div
              key={appointment.id}
              className="px-3 py-2 rounded-lg border hover:border-primary transition-colors cursor-pointer hover:bg-accent"
              onClick={() =>
                router.push(`/appointments/${appointment.id}/view`)
              }
            >
              <article className="flex items-center justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-md font-semibold">
                      {appointment?.center?.name}
                    </h3>
                    <span
                      className={cn(
                        "w-20 py-0.5 rounded-lg text-xs flex items-center justify-center",
                        getStatusColor(appointment.status)
                      )}
                    >
                      {getStatusLabel(appointment.status)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <FaStethoscope className="w-3 h-3" />
                      <span>{appointment?.doctor?.name ?? "غير محدد"}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <CgSandClock className="w-3 h-3" />
                      <span>
                        {getTimeLeft(appointment.date, appointment.time)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground space-y-2 text-left">
                  <div className="flex items-center justify-end gap-1">
                    <span>{appointment.date}</span>
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <span>{formatTimeToArabic(appointment?.time)}</span>
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
              </article>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default LatestAppointments;
