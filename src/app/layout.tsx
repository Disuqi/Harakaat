import type { Metadata } from "next";
import "./globals.css";

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
            <body className="text-text-100 dark:text-dark-text-100 bg-bg-100 dark:bg-dark-bg-100 min-h-screen">{children}</body>
        </html>
    );
}
