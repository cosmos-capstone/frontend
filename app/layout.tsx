import type { Metadata } from "next";
import localFont from "next/font/local";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        
      >
        {children}
        {children}
      </body>
    </html>
  );
}