"use client";

import { api } from "@/lib/api";
import { Order } from "@/types";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Pagination } from "@/components/pagination";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ErrorComponent from "@/components/error-component";
import LoadingTable from "@/components/loading-table";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";

interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const OrdersTable = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, error, isError } = useQuery<
    PaginatedResponse<Order>,
    Error
  >({
    queryKey: ["orders", page],
    queryFn: async () => {
      const res = await api.get(`/orders?page=${page}`);
      return res.data;
    },
  });

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">الطلبات</h1>
            <p className="text-sm text-muted-foreground">
              إدارة الطلبات الخاصة بك هنا.
            </p>
          </div>
          <Link href="/orders/new" className={buttonVariants()}>
            <PlusCircle />
            إضافة طلب
          </Link>
        </div>
        {isLoading ? (
          <LoadingTable />
        ) : isError ? (
          <ErrorComponent error={error} />
        ) : (
          <>
            <div className="bg-background">
              <DataTable
                columns={columns}
                data={data ? data.data : []}
                emptyState="لا توجد مواعيد"
              />
            </div>
            <Pagination
              page={data!.current_page}
              totalPages={data!.last_page}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersTable;
