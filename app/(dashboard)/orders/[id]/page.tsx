"use client";

import { api } from "@/lib/api";
import { Appointment, Center, Order, Product } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { queryClient } from "@/lib/client";

const formSchema = z.object({
  center_id: z.string().min(1, "يرجى اختيار المركز"),
  appointment_id: z.string().optional(),
});

const OrdersPage = () => {
  const { id } = useParams();
  const editMode = id !== "new";

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState<
    { product_id: string; quantity: number }[]
  >([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      center_id: "",
      appointment_id: "",
    },
  });

  const { data: order, isLoading: orderLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await api.get(`/orders/${id}`);
      return res.data as Order;
    },
    enabled: editMode,
  });

  const { data: centers = [], isLoading: centersLoading } = useQuery({
    queryKey: ["centers"],
    queryFn: async () => {
      const res = await api.get("/centers");
      return res.data as Center[];
    },
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const res = await api.get("/appt-id");
      return res.data as Appointment[];
    },
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/products");
      return res.data as Product[];
    },
  });

  useEffect(() => {
    if (editMode && order) {
      form.reset({
        center_id: order.center_id.toString(),
        appointment_id: order.appointment_id?.toString() || "",
      });
      setItems(
        order.items?.map((item) => ({
          product_id: item.product_id.toString(),
          quantity: item.quantity,
        })) || []
      );
    }
  }, [editMode, order]);

  const isLoading = centersLoading || (editMode && orderLoading);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!items.length) {
      toast.error("يرجى إضافة عنصر واحد على الأقل");
      return;
    }

    try {
      setIsSubmitting(true);
      await (editMode
        ? api.put(`/orders/${id}`, {
            ...values,
            appointment_id: values.appointment_id || null,
            items,
          })
        : api.post("/orders", {
            ...values,
            appointment_id: values.appointment_id || null,
            items,
          }));
      toast.success(editMode ? "تم تحديث الطلب بنجاح" : "تم إنشاء الطلب بنجاح");
      form.reset();
      setItems([]);
      router.push("/orders");
    } catch (error: any) {
      toast.error(error.response.data.error || "حدث خطأ أثناء حفظ الطلب");
    } finally {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      setIsSubmitting(false);
    }
  };

  const productMap = useMemo(() => {
    return products.reduce((acc, product) => {
      acc[product.id] = product.name;
      return acc;
    }, {} as Record<string, string>);
  }, [products]);

  const isDirty = order?.status !== "pending" && editMode && !isLoading;
  if (isDirty) {
    return (
      <div className="w-full p-5 rounded-lg shadow border bg-background">
        <h1>لا يمكن تعديل الطلب</h1>
        <p className="text-muted-foreground text-sm">
          الطلبات الملغية أو المكتملة لا يمكن تعديلها
        </p>
        <Button
          variant="secondary"
          className="mt-4"
          onClick={() => router.back()}
        >
          العودة
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between bg-background p-5 rounded-lg shadow border">
        <div className="flex items-center gap-2">
          <Button onClick={() => router.back()} variant="outline" size="icon">
            <ArrowRight className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold">
            {editMode ? "تعديل الطلب" : "إنشاء طلب"}
          </h1>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-background p-5 rounded-lg shadow border">
            <FormField
              control={form.control}
              name="center_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المركز</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                    key={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="يرجى اختيار المركز" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {centers.map((center) => (
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

            <FormField
              control={form.control}
              name="appointment_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الموعد (اختياري)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                    key={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر موعدًا" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {appointments.map((appt) => (
                        <SelectItem key={appt.id} value={appt.id.toString()}>
                          {`#${appt.id} - ${appt.date} - ${appt.time}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-background p-5 rounded-lg shadow border">
            <div className="col-span-3 space-y-2">
              <FormLabel>المنتج</FormLabel>
              <Select
                onValueChange={setSelectedProductId}
                value={selectedProductId}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المنتج" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <FormLabel>الكمية</FormLabel>
              <Input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                disabled={isLoading}
              />
            </div>

            <div className="flex items-end mb-0 md:mb-2">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={isLoading}
                onClick={() => {
                  if (!selectedProductId) {
                    toast.error("يرجى اختيار منتج");
                    return;
                  }

                  if (!quantity || quantity <= 0) {
                    toast.error("الكمية غير صالحة");
                    return;
                  }

                  setItems((prevItems) => {
                    const existingIndex = prevItems.findIndex(
                      (item) => item.product_id === selectedProductId
                    );

                    if (existingIndex !== -1) {
                      const updatedItems = [...prevItems];
                      updatedItems[existingIndex] = {
                        ...updatedItems[existingIndex],
                        quantity:
                          updatedItems[existingIndex].quantity + quantity,
                      };
                      return updatedItems;
                    }

                    return [
                      ...prevItems,
                      {
                        product_id: selectedProductId,
                        quantity,
                      },
                    ];
                  });

                  setSelectedProductId("");
                  setQuantity(1); // reset quantity after adding
                }}
              >
                <PlusCircle className="mr-1 h-4 w-4" />
                إضافة
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto bg-background p-5 rounded-lg shadow border">
            <Table>
              <TableHeader>
                <TableRow className="border divide-x">
                  <TableHead className="text-center">#</TableHead>
                  <TableHead className="text-center">المنتج</TableHead>
                  <TableHead className="text-center">الكمية</TableHead>
                  <TableHead className="text-center">إجراء</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="border divide-y">
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center flex items-center"
                    >
                      <Skeleton className="h-8 w-12" />
                    </TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      لا توجد عناصر مضافة
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item, index) => (
                    <TableRow key={index} className="divide-x">
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="text-center">
                        {productMap[item.product_id]}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              setItems((prevItems) =>
                                prevItems.map((item, i) =>
                                  i === index && item.quantity > 1
                                    ? { ...item, quantity: item.quantity - 1 }
                                    : item
                                )
                              )
                            }
                          >
                            −
                          </Button>
                          <span className="min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              setItems((prevItems) =>
                                prevItems.map((item, i) =>
                                  i === index
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item
                                )
                              )
                            }
                          >
                            +
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            setItems((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
                        >
                          حذف
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <Button type="submit" className="w-32" disabled={isSubmitting}>
            {isSubmitting ? "جاري الحفظ..." : "حفظ"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default OrdersPage;
