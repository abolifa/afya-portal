"use client";

import Image from "next/image";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FaPhoneSquare, FaLock } from "react-icons/fa";

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

const formSchema = z.object({
  phone: z.string().min(2).max(50),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

const Login = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      await login(values);
      toast.success("تم تسجيل الدخول بنجاح");
      router.push("/");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.message || "حدث خطأ أثناء تسجيل الدخول"
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-3/4 sm:w-2/3 md:w-1/2 lg:w-1/3 shadow bg-card border p-10 rounded-lg">
        <div className="flex flex-col items-center justify-center gap-2">
          <Image
            src={"/logo.png"}
            alt="Logo"
            width={120}
            height={120}
            className=" object-contain mb-2"
          />
          <h1 className="text-xl font-bold text-center">
            الهيئة الوطنية لأمراض الكلى
          </h1>
          <h2 className="text-lg font-semibold text-muted-foreground text-center">
            تسجيل الدخول
          </h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 mt-8"
          >
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="phone">
                    <FaPhoneSquare className="mr-2 w-5 h-5 text-muted-foreground" />
                    <span>رقم الهاتف</span>
                  </FormLabel>
                  <FormControl>
                    <Input id="phone" {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">
                    <FaLock className="mr-2 w-5 h-5 text-muted-foreground" />
                    <span>كلمة المرور</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="password"
                      {...field}
                      type="password"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Link
              href={"/forgot-password"}
              className="text-sm text-blue-500 hover:underline"
            >
              هل نسيت كلمة المرور؟
            </Link>
            <Button type="submit" className="mt-5" disabled={loading}>
              {loading ? <Loader className="animate-spin" /> : "تسجيل الدخول"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              ليس لديك حساب؟{" "}
              <Link
                href={"/auth/register"}
                className="text-blue-500 hover:underline"
              >
                إنشاء حساب جديد
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
