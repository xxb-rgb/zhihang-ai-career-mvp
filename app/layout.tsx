import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "智航AI生涯规划助手",
  description: "面向高校学生的 AI 职业发展初始导航工具",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}