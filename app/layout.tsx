// app/layout.tsx (RootLayout)
import type { Metadata } from "next";
import "./globals.css";
import AppProvider from "@/providers/app-provider";
import { cn } from "@/lib/utils";
import { Zain } from "next/font/google";

const zain = Zain({
  display: "swap",
  subsets: ["arabic"],
  weight: ["200", "300", "400", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://portal.romuz.com.ly"),
  title: {
    default: "نظام عافية الصحي - الهيئة الوطنية لأمراض الكلى",
    template: "%s | نظام عافية الصحي",
  },
  description:
    "بوابة المريض للهيئة الوطنية لأمراض الكلى في ليبيا: حجز ومتابعة مواعيد جلسات الغسيل الكلوي، الطلبات، الوصفات الطبية، والملف الصحي.",
  applicationName: "Afya Patient Portal",
  generator: "Next.js",
  keywords: [
    "غسيل الكلى ليبيا",
    "الهيئة الوطنية لأمراض الكلى",
    "بوابة المريض",
    "مواعيد الغسيل",
    "مراكز الغسيل ليبيا",
    "نظام عافية الصحي",
  ],
  authors: [{ name: "الهيئة الوطنية لأمراض الكلى" }],
  alternates: {
    canonical: "https://portal.romuz.com.ly",
  },
  openGraph: {
    type: "website",
    url: "https://portal.romuz.com.ly",
    siteName: "نظام عافية الصحي",
    title: "بوابة المريض | الهيئة الوطنية لأمراض الكلى - ليبيا",
    description:
      "خدمة إلكترونية لفحص المواعيد والطلبات والوصفات لمراكز غسيل الكلى التابعة للهيئة الوطنية لأمراض الكلى في ليبيا.",
    locale: "ar_LY",
    images: ["/og-image.png"], // ضع صورة 1200x630 في /public
  },
  twitter: {
    card: "summary_large_image",
    title: "بوابة المريض | نظام عافية الصحي",
    description:
      "الدخول إلى حساب المريض لإدارة المواعيد وطلبات العلاج والغسيل الكلوي.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={cn("antialiased", zain.className)}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
