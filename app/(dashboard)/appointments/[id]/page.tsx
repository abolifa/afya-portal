"use client";

import { api } from "@/lib/api";
import { Appointment, Center } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CenterDateSelector from "@/components/center-date-selector";
import CenterTimeSelector from "@/components/center-time-selector";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { queryClient } from "@/lib/client";
import { useAuth } from "@/context/auth-context";

// 👇 Schema
const formSchema = z.object({
  center_id: z.string().min(1, "يرجى اختيار المركز"),
  doctor_id: z.string().optional(),
  date: z.string().min(1, "يرجى اختيار التاريخ"),
  time: z.string().min(1, "يرجى اختيار الوقت"),
  notes: z.string().optional(),
});

// 👇 Skeleton Loader
function Loader() {
  return (
    <div className="w-full flex flex-col gap-5 bg-background p-5 rounded-lg shadow border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-full h-7" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-full h-7" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="w-16 h-4" />
        <Skeleton className="w-32 h-4" />
        <div className="flex items-center gap-2 p-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-16" />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="w-16 h-4" />
        <Skeleton className="w-32 h-4" />
        <div className="flex items-center gap-2 p-3">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-14" />
          ))}
        </div>
      </div>
    </div>
  );
}

const AppointmentPage = () => {
  const { id } = useParams();
  const editMode = id !== "new";
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      center_id: user?.center_id?.toString() || "",
      doctor_id: "",
      date: "",
      time: "",
      notes: "",
    },
  });

  const { data: appointment, isLoading: appointmentLoading } = useQuery({
    queryKey: ["appointment", id],
    queryFn: async () => {
      const res = await api.get(`/appointments/${id}`);
      return res.data as Appointment;
    },
    enabled: editMode,
  });

  const { data: centers, isLoading: centersLoading } = useQuery({
    queryKey: ["centers"],
    queryFn: async () => {
      const res = await api.get("/centers");
      return res.data as Center[];
    },
  });

  useEffect(() => {
    if (editMode && appointment) {
      form.reset({
        center_id: appointment.center_id.toString(),
        doctor_id: appointment.doctor_id?.toString() || "",
        date: appointment.date,
        time: appointment.time,
        notes: appointment.notes || "",
      });
    }
  }, [editMode, appointment, form]);

  const isPageLoading = centersLoading || (editMode && appointmentLoading);

  const selectedCenterId = form.watch("center_id");
  const selectedDate = form.watch("date");

  const selectedCenter = useMemo(() => {
    return centers?.find((center) => center.id.toString() === selectedCenterId);
  }, [centers, selectedCenterId]);

  const doctors = selectedCenter?.doctors ?? [];

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const payload = {
      ...values,
      date: format(new Date(values.date), "yyyy-MM-dd"),
      time: values.time.length === 5 ? values.time + ":00" : values.time,
    };
    console.log("Submitting form with values:", payload);
    try {
      setIsSubmitting(true);
      if (editMode) {
        await api.put(`/appointments/${id}`, payload);
        toast.success("تم تحديث الموعد بنجاح");
      } else {
        await api.post("/appointments", payload);
        toast.success("تم إنشاء الموعد بنجاح");
        form.reset();
      }
      router.push("/appointments");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("حدث خطأ أثناء حفظ الموعد");
    } finally {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between bg-background p-5 rounded-lg shadow border">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.back()}
            variant={"outline"}
            size={"icon"}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold">
            {editMode ? "تعديل الموعد" : "إنشاء موعد"}
          </h1>
        </div>
        {editMode && (
          <Button variant="destructive" size="sm">
            حذف الموعد
          </Button>
        )}
      </div>

      {/* Main */}
      {isPageLoading ? (
        <Loader />
      ) : appointment?.is_dirty ? (
        <div className="w-full p-5 rounded-lg shadow border bg-background">
          <h1>لا يمكن تعديل الموعد</h1>
          <p className="text-muted-foreground text-sm">
            المواعيد الملغية أو المكتملة أو المنتهية الصلاحية لا يمكن تعديلها
          </p>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => router.back()}
          >
            العودة
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="p-5 bg-background rounded-lg shadow border grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Center */}
              <FormField
                control={form.control}
                name="center_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المركز</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      key={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="يرجى اختيار المركز" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {centers?.map((center) => (
                          <SelectItem
                            key={center.id}
                            value={center.id.toString()}
                          >
                            {center.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Doctor */}
              <FormField
                control={form.control}
                name="doctor_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الطبيب</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      key={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="يرجى اختيار الطبيب" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {doctors.map((doctor) => (
                          <SelectItem
                            key={doctor.id}
                            value={doctor.id.toString()}
                          >
                            {doctor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date + Time */}
              <div className="col-span-full space-y-5">
                {/* Date */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>التاريخ</FormLabel>
                      <CenterDateSelector
                        schedules={selectedCenter?.schedules ?? []}
                        selectedDate={field.value}
                        onDateSelect={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Time */}
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الوقت</FormLabel>
                      <CenterTimeSelector
                        schedules={selectedCenter?.schedules ?? []}
                        selectedDate={selectedDate}
                        selectedTime={field.value}
                        onTimeSelect={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Submit */}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "جاري الحفظ..." : "حفظ"}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default AppointmentPage;
