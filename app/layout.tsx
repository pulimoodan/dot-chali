"use client";
import "./globals.css";
import type { Metadata } from "next";
import "@shopify/polaris/build/esm/styles.css";
import enTranslations from "@shopify/polaris/locales/en.json";
import { AppProvider, Frame } from "@shopify/polaris";
import UserContextProvider from "@/components/providers/UserContextProvider";
import UIContextProvider from "@/components/providers/UIContextProvider";

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
          <Frame>
            <UserContextProvider>
              <UIContextProvider>{children}</UIContextProvider>
            </UserContextProvider>
          </Frame>
        </AppProvider>
      </body>
    </html>
  );
}
