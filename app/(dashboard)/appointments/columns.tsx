"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatTimeToArabic,
  getStatusColor,
  getStatusLabel,
  getTimeLeft,
} from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { Appointment } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { CalendarDays, Edit, MoreHorizontal, View } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isToday, parseISO } from "date-fns";

export const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "id",
    header: "رقم الموعد",
  },
  {
    accessorKey: "center.name",
    header: "المركز",
  },
  {
    accessorKey: "doctor.name",
    header: "الطبيب",
    cell: ({ row }) => {
      const doctor = row.original.doctor;
      return doctor ? doctor.name : "-";
    },
  },
  {
    accessorKey: "date",
    header: "التاريخ",
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      return date.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });
    },
  },
  {
    id: "since",
    header: "الموعد",
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center">
          <div
            className={cn(
              "px-4 py-0 w-32 text-sm rounded-md text-center",
              row.original.is_dirty
                ? "text-gray-400" // dirty = gray
                : isToday(parseISO(row.original.date))
                ? "text-amber-600" // today = amber
                : "text-green-600" // upcoming = green
            )}
          >
            {getTimeLeft(row.original.date, row.original.time)}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "time",
    header: "الوقت",
    cell: ({ row }) => {
      return formatTimeToArabic(row.original.time);
    },
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge className={cn("w-20", getStatusColor(status))}>
          {getStatusLabel(status)}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const record = row.original;
      const router = useRouter();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuLabel className="text-center font-bold">
              الإجراءات
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                router.push(`/appointments/${record.id}/view`);
              }}
            >
              <View className="mr-2 h-4 w-4" />
              <span>عرض</span>
            </DropdownMenuItem>

            {!record.is_dirty && (
              <>
                <DropdownMenuItem
                  onClick={() => {
                    router.push(`/appointments/${record.id}`);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  <span>تعديل</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    router.push(`/appointments/${record.id}`);
                  }}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  <span>جدولة</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
