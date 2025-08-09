"use client";

import { api } from "@/lib/api";
import { Appointment } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight,
  Building,
  CalendarDays,
  Check,
  CircleAlert,
  Hash,
  Hourglass,
  Loader,
  LucideIcon,
  Stethoscope,
} from "lucide-react";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { getStatusColor, getStatusLabel } from "@/lib/helpers";

const AppointmentPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["appointment", id],
    queryFn: async () => {
      const res = await api.get(`/appointments/${id}`);
      return res.data as Appointment;
    },
  });

  const CenterMap = dynamic(() => import("@/components/center-map"), {
    ssr: false,
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between bg-background p-5 rounded-lg shadow border">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.back()}
            variant={"outline"}
            size={"icon"}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          {isLoading ? (
            <Skeleton className="w-32 h-6" />
          ) : (
            <h1 className="text-xl font-bold">{`موعد رقم #${id}`}</h1>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-5 bg-background rounded-lg border shadow space-y-4">
          <h2 className="text-lg font-semibold">بيانات الموعد</h2>
          <div className="flex flex-col gap-2 divide-y">
            <Row
              title="رقم الموعد"
              Icon={Hash}
              value={data?.id}
              isLoading={isLoading}
            />
            <Row
              title="التاريخ"
              Icon={CalendarDays}
              value={data?.date}
              isLoading={isLoading}
            />
            <Row
              title="الساعة"
              Icon={Hourglass}
              value={data?.time}
              isLoading={isLoading}
            />
            <Row
              title="المركز"
              Icon={Building}
              value={data?.center?.name}
              isLoading={isLoading}
            />
            <Row
              title="الطبيب"
              Icon={Stethoscope}
              value={data?.doctor?.name}
              isLoading={isLoading}
            />
            <Row
              title="آخر تحديث"
              Icon={Check}
              value={format(
                data?.updated_at ?? new Date(),
                "yyyy-MM-dd h:mm a",
                {
                  locale: arSA,
                }
              )}
              isLoading={isLoading}
            />
            <Row
              title="حالة الموعد"
              Icon={CircleAlert}
              value={
                <div
                  className={cn(
                    "rounded w-full flex items-center justify-center",
                    getStatusColor(data?.status)
                  )}
                >
                  {getStatusLabel(data?.status)}
                </div>
              }
              isLoading={isLoading}
            />
          </div>
        </div>
        <div className="p-5 bg-background rounded-lg border shadow space-y-4 flex flex-col">
          <h2 className="text-lg font-semibold">عنوان المركز</h2>
          <div className="w-full h-78 md:h-full overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : data?.center &&
              data?.center?.latitude &&
              data?.center?.longitude ? (
              <div className="flex flex-col w-full h-full gap-2">
                <h3 className="text-muted-foreground text-sm">
                  {data.center.address}
                </h3>
                <CenterMap
                  latitude={+data.center.latitude}
                  longitude={+data.center.longitude}
                />
              </div>
            ) : (
              <p className="text-muted-foreground text-sm p-4">
                لا تتوفر إحداثيات للمركز
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;

function Row({
  title,
  value,
  Icon,
  isLoading,
}: {
  title: string;
  value: string | number | React.ReactNode;
  Icon: LucideIcon;
  isLoading: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-1.5">
        <Icon className="w-4 h-4 text-muted-foreground" />
        {isLoading ? (
          <Skeleton className="w-24 h-6" />
        ) : (
          <span className="text-sm font-medium">{title}</span>
        )}
      </div>
      <div>
        <span className="text-md font-semibold w-28 flex justify-end">
          {isLoading ? <Skeleton className="w-28 h-6" /> : value}
        </span>
      </div>
    </div>
  );
}
