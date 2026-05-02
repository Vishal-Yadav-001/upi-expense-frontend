import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ApolloWrapper } from "@/components/providers/ApolloWrapper";
import { Header } from "@/components/layout/Header";
import { PrivacyProvider } from "@/context/PrivacyContext";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "UPI Sense | Smart Expense RAG",
    template: "%s | UPI Sense",
  },
  description: "Analyze your UPI expenses with Gemini-powered RAG",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
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
