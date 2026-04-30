import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ApolloWrapper } from "@/components/providers/ApolloWrapper";
import { Header } from "@/components/layout/Header";
import { PrivacyProvider } from "@/context/PrivacyContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UPI Sense | Smart Expense RAG",
  description: "Analyze your UPI expenses with Gemini-powered RAG",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <PrivacyProvider>
          <ApolloWrapper>
            <div className="flex flex-col h-screen">
              <Header />
              <main className="flex-1 overflow-hidden">
                {children}
              </main>
            </div>
          </ApolloWrapper>
        </PrivacyProvider>
      </body>
    </html>
  );
}
