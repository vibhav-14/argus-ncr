import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARGUS-NCR | Delhi NCR Intelligence Platform",
  description: "ARGUS-class intelligence analysis platform for Delhi National Capital Region",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/ouroboros.svg" type="image/svg+xml" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
