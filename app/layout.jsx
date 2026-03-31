import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "EcoScan Lens - Smart Waste Classification",
  description:
    "Upload a photo of any item and get instant waste classification, recyclability guidance, decomposition insights, and reuse ideas powered by AI vision.",
  keywords: [
    "waste classification",
    "recycling",
    "sustainability",
    "EcoScan Lens",
    "AI",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
