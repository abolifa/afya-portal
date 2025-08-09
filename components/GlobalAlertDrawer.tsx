"use client";

import { Alert, Notification } from "@/types";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Bell, Calendar, CheckCheck } from "lucide-react";
import AlertContainer from "./alert-container";
import { useAuth } from "@/context/auth-context";

export default function GlobalAlertDrawer({
  notifications,
  alerts,
  open,
  setOpen,
}: {
  notifications?: Notification[];
  alerts?: Alert[];
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  const hasData = (notifications?.length || 0) + (alerts?.length || 0) > 0;

  const { markAllAsRead } = useAuth();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="left"
        className="[&>button[data-state=close]]:hidden py-8 overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>التنبيهات</span>
            <Button
              variant={"outline"}
              size="icon"
              onClick={() => markAllAsRead()}
              disabled={!hasData}
            >
              <CheckCheck className="w-4 h-4" />
            </Button>
          </SheetTitle>
          <SheetDescription>
            {hasData ? (
              <>
                لديك {(notifications?.length || 0) + (alerts?.length || 0)}{" "}
                {(notifications?.length || 0) + (alerts?.length || 0) === 1
                  ? "تنبيه"
                  : "تنبيهات"}
              </>
            ) : (
              "لا توجد تنبيهات حالياً"
            )}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 mt-4">
          {notifications && notifications.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-muted-foreground text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                مواعيد قادمة
              </h3>

              {notifications.map((notification) => (
                <div
                  key={`notif-${notification.id}`}
                  className="rounded-lg bg-muted p-4 border text-sm"
                >
                  <p>
                    في <span className="font-medium">{notification.time}</span>{" "}
                    يوم <span className="font-medium">{notification.date}</span>
                  </p>
                  <p className="text-muted-foreground">
                    ({notification.human_time})
                  </p>
                </div>
              ))}
            </section>
          )}

          {/* ----------------- Alerts Section ----------------- */}
          {alerts && alerts.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-muted-foreground text-sm flex items-center gap-2">
                <Bell className="w-4 h-4" />
                تنبيهات النظام
              </h3>

              {alerts.map((alert) => (
                <AlertContainer key={alert.id} alert={alert} />
              ))}
            </section>
          )}
        </div>

        <SheetFooter className="mt-6">
          <SheetClose asChild>
            <Button variant="outline">إغلاق</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
