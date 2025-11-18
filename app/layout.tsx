import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Scaaf.day - 감성 이메일 정리",
  description: "매일 당신의 이메일을 감성적으로 정리해드려요",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  )
}
