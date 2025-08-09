"use client";

import { useQuery } from "@tanstack/react-query";
import HomeState from "../../components/widgets/HomeState";
import LatestAppointments from "../../components/widgets/LatestAppointments";
import UserDetails from "../../components/widgets/UserDetails";
import { api } from "@/lib/api";
import { HomeData } from "@/types";

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["home"],
    queryFn: async () => {
      const res = await api.get("/home");
      return res.data as HomeData;
    },
  });

  return (
    <div className="flex flex-col gap-3">
      <HomeState
        appointments={data?.appointments_count}
        orders={data?.orders_count}
        prescriptions={data?.prescriptions_count}
        error={error ?? undefined}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <UserDetails />
        <LatestAppointments
          appointments={data?.appointments}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
