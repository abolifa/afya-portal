"use client";

import { api } from "@/lib/api";
import { Prescription, PrescriptionItem } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight,
  CalendarDays,
  Hash,
  Printer,
  Stethoscope,
  StickyNote,
  Pill,
} from "lucide-react";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import React from "react";
import { cn } from "@/lib/utils";

const frequencyLabel: Record<PrescriptionItem["frequency"], string> = {
  daily: "يوميًا",
  weekly: "أسبوعيًا",
  monthly: "شهريًا",
};

function formatDate(d?: string) {
  if (!d) return "—";
  try {
    return format(new Date(d), "dd/MM/yyyy", { locale: arSA });
  } catch {
    return d;
  }
}

function scheduleText(item: PrescriptionItem) {
  const freq = frequencyLabel[item.frequency];
  const every =
    item.frequency === "daily"
      ? item.interval === 1
        ? ""
        : `كل ${item.interval} أيام`
      : item.frequency === "weekly"
      ? item.interval === 1
        ? ""
        : `كل ${item.interval} أسابيع`
      : item.interval === 1
      ? ""
      : `كل ${item.interval} أشهر`;

  const times =
    item.times_per_interval > 1
      ? `${item.times_per_interval} مرات`
      : `${item.times_per_interval} مرة`;

  // Examples:
  // "يوميًا • 2 مرات"  or  "أسبوعيًا • كل 2 أسابيع • 1 مرة"
  return [freq, every].filter(Boolean).join(" • ") + ` • ${times}`;
}

export default function PrescriptionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["prescription", id],
    queryFn: async () => {
      const res = await api.get(`/prescriptions/${id}`);
      return res.data as Prescription;
    },
  });

  const isEmpty =
    !isLoading && !!data && (!data.items || data.items.length === 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-background p-4 md:p-5 rounded-lg shadow border">
        <div className="flex items-center gap-2">
          <Button onClick={() => router.back()} variant="outline" size="icon">
            <ArrowRight className="h-4 w-4" />
          </Button>
          {isLoading ? (
            <Skeleton className="w-40 h-6" />
          ) : (
            <h1 className="text-xl md:text-2xl font-bold">
              {`الوصفة رقم #${data?.id ?? id}`}
            </h1>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="hidden md:inline-flex"
          >
            <Printer className="h-4 w-4 ms-1" />
            طباعة
          </Button>
          <Button variant="outline" onClick={() => refetch()}>
            تحديث
          </Button>
        </div>
      </div>

      {/* Top details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="بيانات الموعد/الوصفة">
          <DetailsRow
            icon={Hash}
            label="رقم الوصفة"
            value={isLoading ? <Skeleton className="h-5 w-24" /> : data?.id}
          />
          <DetailsRow
            icon={CalendarDays}
            label="تاريخ الوصفة"
            value={
              isLoading ? (
                <Skeleton className="h-5 w-28" />
              ) : (
                formatDate(data?.date)
              )
            }
          />
          <DetailsRow
            icon={Stethoscope}
            label="الطبيب"
            value={
              isLoading ? (
                <Skeleton className="h-5 w-40" />
              ) : (
                data?.doctor?.name ?? "—"
              )
            }
          />
          <DetailsRow
            icon={CalendarDays}
            label="آخر تحديث"
            value={
              isLoading ? (
                <Skeleton className="h-5 w-40" />
              ) : (
                format(new Date(data!.updated_at), "yyyy-MM-dd h:mm a", {
                  locale: arSA,
                })
              )
            }
          />
        </Card>

        <Card title="ملاحظات الطبيب">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="h-4 w-2/5" />
            </div>
          ) : data?.notes ? (
            <p className="leading-7 text-justify">{data.notes}</p>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <StickyNote className="h-4 w-4" />
              لا توجد ملاحظات.
            </div>
          )}
        </Card>
      </div>

      {/* Items list */}
      <Card
        title={`الأدوية (${isLoading ? "…" : data?.items?.length ?? 0})`}
        bodyClass="p-0"
      >
        {isLoading ? (
          <div className="p-4 space-y-3">
            <ItemSkeleton />
            <ItemSkeleton />
            <ItemSkeleton />
          </div>
        ) : isError ? (
          <div className="p-4 text-sm text-destructive">
            حدث خطأ أثناء جلب الوصفة. حاول مجددًا.
          </div>
        ) : isEmpty ? (
          <div className="p-6 text-sm text-muted-foreground">
            لا توجد أدوية في هذه الوصفة.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-right">
                  <Th>الدواء</Th>
                  <Th>الجرعة</Th>
                  <Th>الجدول</Th>
                  <Th>تاريخ البدء</Th>
                  <Th>تاريخ الانتهاء</Th>
                </tr>
              </thead>
              <tbody>
                {data!.items!.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b last:border-b-0 hover:bg-muted/30"
                  >
                    <Td>
                      <div className="flex items-center gap-2">
                        <Pill className="h-4 w-4 opacity-70" />
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {item.product?.name ??
                              `دواء رقم ${item.product_id}`}
                          </span>
                        </div>
                      </div>
                    </Td>
                    <Td className="font-semibold">
                      {Number(item.dose_amount).toFixed(0)} {item.dose_unit}
                    </Td>
                    <Td className="whitespace-pre-line">
                      {scheduleText(item)}
                    </Td>
                    <Td>{formatDate(item.start_date)}</Td>
                    <Td>{formatDate(item.end_date)}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Patient guidance */}
      {!isLoading && !isError && !isEmpty && (
        <div className="text-xs md:text-sm text-muted-foreground leading-6 bg-background p-3 rounded-md border">
          * اتبع الجرعات المذكورة بدقة. إذا نسيت جرعة، خذها عندما تتذكر ما لم
          يكن قد اقترب موعد الجرعة التالية. في هذه الحالة، تجاوز الجرعة الفائتة
          ولا تضاعف الجرعات. في حال ظهور أعراض غير معتادة، تواصل مع طبيبك.
        </div>
      )}
    </div>
  );
}

/* ------- Helpers ------- */

function Card({
  title,
  children,
  bodyClass,
}: {
  title: string;
  children: React.ReactNode;
  bodyClass?: string;
}) {
  return (
    <div className="bg-background rounded-lg border shadow">
      <div className="px-4 py-3 border-b">
        <h2 className="text-base md:text-lg font-semibold">{title}</h2>
      </div>
      <div className={cn("p-4", bodyClass)}>{children}</div>
    </div>
  );
}

function DetailsRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="py-2 px-3 text-xs md:text-sm font-semibold text-foreground/80">
      {children}
    </th>
  );
}
function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={cn("py-3 px-3 align-top", className)}>{children}</td>;
}

function ItemSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-full" />
    </div>
  );
}
