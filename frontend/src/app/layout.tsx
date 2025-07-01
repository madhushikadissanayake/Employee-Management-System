import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "../context/authContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Employee Management System",
  description: "Manage your workforce efficiently",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
