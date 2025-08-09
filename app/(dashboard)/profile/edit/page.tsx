"use client";

import React, { useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, set } from "date-fns";
import { CalendarIcon, Loader } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { arSA } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Center } from "@/types";
import { useRouter } from "next/navigation";
import { NATIONAL_ID_REGEX, PHONE_REGEX } from "@/lib/validaton/validation";
import { handleFormError } from "@/lib/error-handler";
import { toast } from "sonner";
import { parseLibyanDate } from "@/lib/helpers";
import { queryClient } from "@/lib/client";

const formSchema = z.object({
  file_number: z.string().min(1, "هذا الحقل مطلوب"),
  national_id: z.string().regex(NATIONAL_ID_REGEX, {
    message: "الرقم الوطني غير صالح",
  }),
  family_issue_number: z.string().optional(),
  name: z.string().min(1, "هذا الحقل مطلوب"),
  phone: z.string().regex(PHONE_REGEX, {
    message: "رقم الهاتف غير صالح",
  }),
  email: z.email("البريد الإلكتروني غير صالح").optional(),
  gender: z.string().optional(),
  dob: z.date().optional(),
  blood_group: z.string().optional(),
  image: z.string().optional(),
  center_id: z.string().min(1, "هذا الحقل مطلوب").optional(),
});

const page = () => {
  const { user, update, loadUser, uploadImage } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const { data: centers, isLoading } = useQuery({
    queryKey: ["centers"],
    queryFn: async () => {
      const res = await api.get("/centers/get");
      return res.data as Center[];
    },
  });

  const loadingState = isLoading || loading;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file_number: "",
      national_id: "",
      family_issue_number: "",
      name: "",
      phone: "",
      email: "",
      gender: "",
      dob: undefined,
      blood_group: "",
      image: "",
      center_id: "",
    },
  });

  useEffect(() => {
    if (user) {
      setLoading(true);
      console.log(user);
      form.reset({
        file_number: user.file_number || "",
        national_id: user.national_id || "",
        family_issue_number: user.family_issue_number || "",
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
        gender: user.gender || "",
        dob: user.dob
          ? typeof user.dob === "string"
            ? parseLibyanDate(user.dob)
            : user.dob
          : undefined,
        blood_group: user.blood_group || "",
        image: user.image || "",
        center_id: user.center_id?.toString() || "",
      });
      setLoading(false);
    }
  }, [user]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      await update({
        ...values,
        dob: values.dob ? format(values.dob, "yyyy-MM-dd") : undefined,
      });
      toast.success("تم تحديث الملف الشخصي بنجاح");
      router.push("/");
    } catch (error) {
      handleFormError(error, form);
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
      queryClient.invalidateQueries();
      await loadUser();
    }
  }
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4 bg-background p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold">الإعدادات</h2>
      <div className="flex flex-col gap-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-full">
                <FormField
                  control={form.control}
                  name="image"
                  render={() => (
                    <FormItem>
                      <FormLabel>الصورة الشخصية</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              await uploadImage(file);
                              toast.success("تم تحميل الصورة بنجاح");
                            } catch (err) {
                              toast.error("فشل تحميل الصورة");
                              console.error(err);
                            }
                          }}
                          disabled={loadingState}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-full">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={loadingState} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="national_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الرقم الوطني</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loadingState} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="family_issue_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم قيد العائلة</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loadingState} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الهاتف</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loadingState} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={loadingState} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الجنس</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      key={field.value}
                      disabled={loadingState}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="يرجى اختيار الجنس" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem key="male" value="male">
                          ذكر
                        </SelectItem>
                        <SelectItem key="female" value="female">
                          أنثى
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>تاريخ الميلاد</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={loadingState}
                            type="button"
                            variant={"outline"}
                            className={cn(
                              "w-full pr-3 text-riight font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? typeof field.value === "string"
                                ? field.value
                                : format(field.value, "dd/MM/yyyy", {
                                    locale: arSA,
                                  })
                              : "يرجى اختيار تاريخ الميلاد"}
                            <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0" align="center">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="blood_group"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>فصيلة الدم</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      key={field.value}
                      disabled={loadingState}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="يرجى اختيار فصيلة الدم" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem key="A+" value="A+">
                          A+
                        </SelectItem>
                        <SelectItem key="A-" value="A-">
                          A-
                        </SelectItem>
                        <SelectItem key="B+" value="B+">
                          B+
                        </SelectItem>
                        <SelectItem key="B-" value="B-">
                          B-
                        </SelectItem>
                        <SelectItem key="AB+" value="AB+">
                          AB+
                        </SelectItem>
                        <SelectItem key="AB-" value="AB-">
                          AB-
                        </SelectItem>
                        <SelectItem key="O+" value="O+">
                          O+
                        </SelectItem>
                        <SelectItem key="O-" value="O-">
                          O-
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                      disabled={loadingState}
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
            </div>
            <div className="flex items-center mt-5 gap-3">
              <Button type="submit" className="w-32" disabled={loadingState}>
                {loadingState ? <Loader className="animate-spin" /> : "حفظ"}
              </Button>
              <Button
                type="button"
                className="w-32"
                variant="outline"
                onClick={() => router.back()}
              >
                رجوع
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default page;
