"use client";
import "./globals.css";
import type { Metadata } from "next";
import "@shopify/polaris/build/esm/styles.css";
import enTranslations from "@shopify/polaris/locales/en.json";
import { AppProvider } from "@shopify/polaris";
import { useEffect } from "react";
import UserContextProvider from "@/components/providers/UserContextProvider";

export const metadata: Metadata = {
  title: "The Chali App",
  description: "A platform to crack up jokes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider i18n={enTranslations}>
          <UserContextProvider>{children}</UserContextProvider>
        </AppProvider>
      </body>
    </html>
  );
}
