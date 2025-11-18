"use client";

import type React from "react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return <div className="mx-auto max-w-screen-lg p-6">{children}</div>;
}

export default AppLayout;
