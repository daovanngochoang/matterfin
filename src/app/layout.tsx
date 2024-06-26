import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { auth, ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import HeaderBar from "@/components/HeaderBar";
import { ThemeProvider } from "@/components/theme-provider"
import SyncOrganization from "@/components/SyncOrganiation";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MatterFin",
  description: "Smart B2B payment proccesssing solution. ",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {

  const { sessionClaims } = auth()

  return (
    <ClerkProvider>
      <html lang='en' suppressHydrationWarning>
        <body className={inter.className} suppressHydrationWarning={true}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main>
              <div className="min-h-screen">
                <ClerkLoaded>
                  <SyncOrganization memberships={sessionClaims?.memberships!} />
                  <HeaderBar />
                  <div className="w-full h-auto">
                    <div>{children}</div>
                  </div>
                </ClerkLoaded>
                <ClerkLoading>
                  <div className="flex w-screen h-screen justify-center items-center">
                    <div className="flex gap-2">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait ...
                    </div>

                  </div>
                </ClerkLoading>
              </div>
            </main>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );

}
