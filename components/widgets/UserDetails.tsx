"use client";

import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-context";
import {
  FaCalendarDay,
  FaClinicMedical,
  FaEnvelope,
  FaMobile,
  FaNotesMedical,
  FaPassport,
  FaUser,
} from "react-icons/fa";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import { IconType } from "react-icons/lib";
import { IoMdMale } from "react-icons/io";
import { FaDroplet } from "react-icons/fa6";
import { Skeleton } from "@/components/ui/skeleton";
import { getGenderLabel } from "@/lib/helpers";

const UserDetails = () => {
  const { user } = useAuth();
  return (
    <div className="w-full bg-card rounded-lg p-5 border shadow flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">البيانات الشخصية</h2>
        <Link
          href="/profile/edit"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary 
          transition-colors hover:underline hover:underline-offset-3"
        >
          <span>تعديل</span>
          <MoveLeft className="w-5 h-5" />
        </Link>
      </div>
      {/* Content */}
      <div className="flex flex-col gap-2.5">
        <Row label="الاسم" value={user?.name} Icon={FaUser} />
        <Separator />
        <Row
          label="رقم الملف"
          value={user?.file_number}
          Icon={FaNotesMedical}
        />
        <Separator />
        <Row label="الرقم الوطني" value={user?.national_id} Icon={FaPassport} />
        <Separator />
        <Row label="رقم الهاتف" value={user?.phone} Icon={FaMobile} />
        <Separator />
        <Row label="المركز" value={user?.center?.name} Icon={FaClinicMedical} />
        <Separator />
        <Row label="البريد الإلكتروني" value={user?.email} Icon={FaEnvelope} />
        <Separator />
        <Row
          label="الجنس"
          value={getGenderLabel(user?.gender)}
          Icon={IoMdMale}
        />
        <Separator />
        <Row label="تاريخ الميلاد" value={user?.dob} Icon={FaCalendarDay} />
        <Separator />
        <Row label="فصيلة الدم" value={user?.blood_group} Icon={FaDroplet} />
      </div>
    </div>
  );
};

export default UserDetails;

function Row({
  label,
  value,
  Icon,
}: {
  label: string;
  value: any;
  Icon: IconType;
}) {
  const { loading } = useAuth();
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </div>
      {loading ? (
        <Skeleton className="h-5 w-32" />
      ) : value ? (
        <span className="font-semibold text-sm">{value}</span>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      )}
    </div>
  );
}
