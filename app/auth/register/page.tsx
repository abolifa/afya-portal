"use client";

import Image from "next/image";
import React, { useState } from "react";
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
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { NATIONAL_ID_REGEX, PHONE_REGEX } from "@/lib/validaton/validation";
import { api } from "@/lib/api";
import { handleFormError } from "@/lib/error-handler";

const formSchema = z
  .object({
    national_id: z
      .string()
      .regex(NATIONAL_ID_REGEX, { message: "الرقم الوطني غير صالح" }),
    name: z.string().min(1, "الاسم مطلوب"),
    phone: z.string().regex(PHONE_REGEX, { message: "رقم الهاتف غير صالح" }),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    password_confirmation: z.string().min(6, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "كلمة المرور وتأكيد كلمة المرور غير متطابقين",
  });

const Register = () => {
  const { register } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      national_id: "",
      name: "",
      phone: "",
      password: "",
      password_confirmation: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      await register(values);
      toast.success("تم إنشاء الحساب بنجاح");
      form.reset();
      router.push("/profile");
    } catch (error: any) {
      handleFormError(error, form);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-card border rounded-xl shadow p-6 space-y-6">
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo"
            width={60}
            height={60}
            className="object-contain"
            priority
          />
          <h2 className="text-base font-semibold text-muted-foreground">
            إنشاء حساب جديد
          </h2>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* National ID */}
            <FormField
              control={form.control}
              name="national_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">الرقم الوطني</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={loading}
                      onBlur={async (e) => {
                        field.onBlur(); // Keep form validation intact
                        const nationalId = e.target.value;

                        if (!nationalId || nationalId.length !== 12) return;

                        try {
                          const response = await api.post(
                            "/check-national-id",
                            {
                              national_id: nationalId,
                            }
                          );

                          if (response.data.exists) {
                            form.setError("national_id", {
                              type: "manual",
                              message: "الرقم الوطني مسجل مسبقًا",
                            });
                          } else {
                            // Clear previous error if valid
                            form.clearErrors("national_id");
                          }
                        } catch (err) {
                          console.error("Error checking national ID", err);
                          form.setError("national_id", {
                            type: "server",
                            message: "حدث خطأ أثناء التحقق من الرقم الوطني",
                          });
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">الاسم</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">رقم الهاتف</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">كلمة المرور</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">تأكيد كلمة المرور</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              size="sm"
            >
              {loading ? (
                <Loader className="animate-spin w-4 h-4" />
              ) : (
                "تسجيل الحساب"
              )}
            </Button>

            {/* Extra Links */}
            <div className="text-center text-xs text-muted-foreground space-y-1">
              <Link
                href="/forgot-password"
                className="hover:underline text-blue-500"
              >
                هل نسيت كلمة المرور؟
              </Link>
              <div>
                لديك حساب؟{" "}
                <Link
                  href="/auth/login"
                  className="text-blue-500 hover:underline"
                >
                  تسجيل الدخول
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Register;
