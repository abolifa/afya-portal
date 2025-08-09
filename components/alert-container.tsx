"use client";

import { Alert } from "@/types";
import {
  Bell,
  CalendarDays,
  CheckCheck,
  ClipboardCheck,
  FileText,
  Trash2,
} from "lucide-react";
import React, { JSX } from "react";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { Button } from "./ui/button";

const AlertContainer = ({ alert }: { alert: Alert }) => {
  const { markAsRead, deleteAlert } = useAuth();

  function getAlertIcon(type: Alert["type"]): JSX.Element {
    switch (type) {
      case "appointment":
        return <CalendarDays className="w-4 h-4" />;
      case "order":
        return <ClipboardCheck className="w-4 h-4" />;
      case "prescription":
        return <FileText className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  }

  return (
    <div
      className={cn(
        "w-full rounded-lg border px-4 py-3 shadow-sm",
        alert.is_read ? "bg-muted" : "bg-primary/10 border-primary text-primary"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-2 items-start">
          <div className="mt-1">{getAlertIcon(alert.type)}</div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-snug">{alert.message}</p>
            <p
              className={cn(
                "text-xs",
                alert.is_read ? "text-muted-foreground" : "text-primary/80"
              )}
            >
              {format(new Date(alert.created_at), "dd MMM yyyy - hh:mm a", {
                locale: arSA,
              })}
            </p>
          </div>
        </div>

        <div className="flex gap-1 items-start">
          {!alert.is_read && (
            <Button
              size="icon"
              variant="ghost"
              className="hover:text-green-600"
              onClick={() => markAsRead(alert.id)}
            >
              <CheckCheck className="w-4 h-4" />
            </Button>
          )}

          <Button
            size="icon"
            variant="ghost"
            className="hover:text-destructive"
            onClick={() => deleteAlert(alert.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlertContainer;
