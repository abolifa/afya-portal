// Navbar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import { Bell, LogOut, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/context/auth-context";
import GlobalAlertDrawer from "./GlobalAlertDrawer";

const links = [
  { name: "الرئيسية", href: "/" },
  { name: "المواعيد", href: "/appointments" },
  { name: "الطلبات", href: "/orders" },
  { name: "الوصفات الطبية", href: "/prescriptions" },
  { name: "الملف الشخصي", href: "/profile" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { notifications, alerts, logout } = useAuth();

  const toggleMobileMenu = () => setMobileOpen((prev) => !prev);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="w-full border-b bg-background">
      <nav className="mx-auto px-6 xl:px-32 h-20 sticky top-0 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={150}
            height={150}
            className="h-10 w-auto object-contain"
            priority
            unoptimized
          />
        </Link>

        <ul className="hidden md:flex gap-6 items-center">
          {links.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className={`text-sm transition-colors ${
                  isActive(link.href)
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <Button
            variant={"outline"}
            size={"icon"}
            className="relative flex items-center justify-center p-2"
            onClick={() => setDrawerOpen(true)}
          >
            <Bell className="w-5 h-5" />
            {notifications &&
              alerts &&
              (() => {
                const unreadAlerts = alerts.filter((a) => !a.is_read);
                const total = notifications.length + unreadAlerts.length;
                if (total === 0) return null;

                return (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-[10px] text-white">
                    {total > 99 ? "99+" : total}
                  </span>
                );
              })()}
          </Button>

          <ModeToggle />

          <Button onClick={() => logout()} variant={"outline"} size={"icon"}>
            <LogOut />
          </Button>

          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-muted-foreground hover:text-primary transition-colors"
            aria-label="Open mobile menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t px-6 pt-4 pb-6 bg-background shadow-md">
          <ul className="flex flex-col gap-4">
            {links.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`block text-sm ${
                    isActive(link.href)
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <GlobalAlertDrawer
        notifications={notifications}
        open={drawerOpen}
        setOpen={setDrawerOpen}
        alerts={alerts}
      />
    </header>
  );
};

export default Navbar;
