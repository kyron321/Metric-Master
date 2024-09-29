import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Metric Master - Home",
  description: "Metric Master is a web application that helps you track your progress on your goals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
