"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/auth-context";
import { getUserImage } from "@/lib/helpers";
import {
  CalendarDays,
  Droplet,
  Edit,
  Fingerprint,
  Mail,
  MoveRight,
  Phone,
  ShieldCheck,
  User2,
  Venus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const page = () => {
  const { user } = useAuth();
  const router = useRouter();
  const infoItem = (
    icon: React.ReactNode,
    label: string,
    value?: string | null
  ) => (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
      <div className="text-primary">{icon}</div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-medium">{value || "—"}</span>
      </div>
    </div>
  );
  return (
    <div className="relative max-w-3xl mx-auto bg-background rounded-2xl shadow-xl border p-8 space-y-6">
      <div className="absolute top-10 left-10">
        <Link
          href={"/profile/edit"}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <Edit />
          تعديل
        </Link>
      </div>
      <div className="absolute top-10 right-10">
        <Button variant={"outline"} onClick={() => router.back()} size={"sm"}>
          <MoveRight />
          رجوع
        </Button>
      </div>
      <div className="flex flex-col items-center gap-3 text-center">
        <Avatar className="w-28 h-28 shadow-md">
          <AvatarImage src={getUserImage(user?.image)} />
          <AvatarFallback className="text-xl">
            {user?.name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold">{user?.name}</h1>
        <p className="text-sm text-muted-foreground">
          رقم الملف: <span className="font-semibold">{user?.file_number}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {infoItem(
          <User2 className="w-4 h-4" />,
          "الرقم الوطني",
          user?.national_id
        )}
        {infoItem(
          <Fingerprint className="w-4 h-4" />,
          "رقم القيد العائلي",
          user?.family_issue_number
        )}
        {infoItem(<Phone className="w-4 h-4" />, "رقم الهاتف", user?.phone)}
        {infoItem(
          <Mail className="w-4 h-4" />,
          "البريد الإلكتروني",
          user?.email
        )}
        {infoItem(
          <Venus className="w-4 h-4" />,
          "الجنس",
          user?.gender === "male"
            ? "ذكر"
            : user?.gender === "female"
            ? "أنثى"
            : null
        )}
        {infoItem(
          <CalendarDays className="w-4 h-4" />,
          "تاريخ الميلاد",
          user?.dob
        )}
        {infoItem(
          <Droplet className="w-4 h-4" />,
          "فصيلة الدم",
          user?.blood_group
        )}
        {infoItem(
          <ShieldCheck
            className={cn(
              "w-4 h-4",
              user?.verified ? "text-success" : "text-destructive"
            )}
          />,
          "الحالة",
          user?.verified ? "مستوفي البيانات" : "غير مستوفي البيانات"
        )}
      </div>
    </div>
  );
};

export default page;
