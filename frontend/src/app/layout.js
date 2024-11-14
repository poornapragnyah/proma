import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Proma",
  description: "Project Management App",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
      >        <Navbar />
        {children}
      </body>
    </html>
  );
}
