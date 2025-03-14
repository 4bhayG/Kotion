import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ConvexClientProvider } from "@/components/convex-provider";
import { ModalProvider } from "@/components/Provider/modal-provider";
import { EdgeStoreProvider } from "@/lib/edgestore";


import {Toaster} from "sonner";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kotion",
  description: "The connected Workspace where better, faster work happens.",
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConvexClientProvider>
        <EdgeStoreProvider>
        <ThemeProvider
        attribute={"class"}
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange        
        >
         
          <Toaster position="bottom-center"/>
          <ModalProvider/>
        {children}
        </ThemeProvider>
        </EdgeStoreProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
