"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Calendar, LucideIcon, Package, Pill } from "lucide-react";
import Link from "next/link";
import React from "react";

const HomeState = ({
  appointments,
  orders,
  prescriptions,
  error,
  isLoading,
}: {
  appointments?: number;
  orders?: number;
  prescriptions?: number;
  error?: Error;
  isLoading?: boolean;
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      <Widget
        title="المواعيد"
        Icon={Calendar}
        value={appointments}
        color={"text-amber-400"}
        loading={isLoading}
        link="/appointments"
      />
      <Widget
        title="الطلبات"
        Icon={Package}
        value={orders}
        color={"text-primary"}
        loading={isLoading}
        link="/orders"
      />
      <Widget
        title="الوصفات"
        Icon={Pill}
        value={prescriptions}
        color={"text-indigo-400"}
        loading={isLoading}
        link="/prescriptions"
      />
    </div>
  );
};

export default HomeState;

function Widget({
  title,
  color,
  Icon,
  value,
  loading = false,
  link,
}: {
  title: string;
  color?: string;
  Icon: LucideIcon;
  value: number | undefined;
  loading?: boolean;
  link?: string;
}) {
  return (
    <Link
      href={link ?? "#"}
      className="w-full p-6 flex flex-col border shadow rounded-lg bg-card"
    >
      <div className="flex items-center gap-2">
        <Icon className={cn("w-6 h-6", color)} />
        {loading ? (
          <Skeleton className="h-7 w-24" />
        ) : (
          <span className="text-lg font-semibold">{title}</span>
        )}
      </div>
      <div className="mt-4 px-5">
        {loading ? (
          <Skeleton className="h-9 w-9" />
        ) : (
          <span className="text-3xl font-bold">{value ?? "-"}</span>
        )}
      </div>
    </Link>
  );
}
