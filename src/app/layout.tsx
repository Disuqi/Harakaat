import type { Metadata } from "next";
import "./globals.css";
import { GlobalContextProvider } from "@/hooks/global-context-provider";

export const metadata: Metadata = {
    title: "حركات",
    description: "A simple Arabic diacritics tool",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <GlobalContextProvider>
                <body className="text-text-100 dark:text-dark-text-100 bg-bg-100 dark:bg-dark-bg-100 min-h-screen">
                    {children}
                </body>
            </GlobalContextProvider>
        </html>
    );
}
