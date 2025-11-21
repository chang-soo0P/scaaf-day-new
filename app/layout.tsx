"use client";

import type React from "react";
import type { Metadata } from "next";
import "./globals.css";

// React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export const metadata: Metadata = {
  title: "Scaaf.day - Emotionally summarize your email every day",
  description: "Emotionally summarize your email every day",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 각 렌더링마다 새로운 QueryClient 생성 방지
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
