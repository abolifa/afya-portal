"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStatusColor, getStatusLabel } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { Order } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { Edit, MoreHorizontal, View } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function ActionCell({ record }: { record: Order }) {
  const router = useRouter();

  const isDirty = record.status !== "pending";
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
            router.push(`/orders/${record.id}/view`);
          }}
        >
          <View className="mr-2 h-4 w-4" />
          <span>عرض</span>
        </DropdownMenuItem>

        {!isDirty && (
          <DropdownMenuItem
            onClick={() => {
              router.push(`/orders/${record.id}`);
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            <span>تعديل</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "رقم الطلب",
  },
  {
    accessorKey: "center.name",
    header: "المركز",
  },
  {
    accessorKey: "appointment_id",
    header: "رقم الموعد",
    cell: ({ row }) => {
      const appointment = row.original.appointment_id;
      return appointment ? appointment : "-";
    },
  },
  {
    id: "items_count",
    header: "عدد العناصر",
    cell: ({ row }) => {
      const items = row.original.items;
      return items ? items.length : 0;
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
    cell: ({ row }) => <ActionCell record={row.original} />,
  },
];
