import "@/styles/global.css";
import { ParentProvider } from "@/components/ParentProvider";
import Header from "@/components/Header"; // Import the Header component
import type { Metadata } from "next";
import SessionWrapper from "@/components/SessionWrapper";

export const metadata: Metadata = {
  title: "Metric Master - Home",
  description:
    "Metric Master is a web application that helps you track your progress on your goals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
    <ParentProvider>
      <html lang="en">
        <body>
          <Header />
          {children}
        </body>
      </html>
    </ParentProvider>
    </SessionWrapper>
  );
}