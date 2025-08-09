"use client";

import { Button } from "@/components/ui/button";
import { Prescription } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Edit,
  MoreHorizontal,
  Printer,
  View,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

export const columns: ColumnDef<Prescription>[] = [
  {
    accessorKey: "id",
    header: "رقم الوصفة",
  },
  {
    accessorKey: "doctor.name",
    header: "الطبيب",
  },
  {
    accessorKey: "date",
    header: "تاريخ الوصفة",
    cell: ({ row }) => {
      return format(new Date(row.original.date), "dd/MM/yyyy");
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
                router.push(`/prescriptions/${record.id}`);
              }}
            >
              <View className="mr-2 h-4 w-4" />
              <span>عرض</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
