import type { Metadata } from "next";
import Nav from "@/modules/layout/templates/nav";

export const metadata: Metadata = {
  title: {
    default: "SR Laserworks",
    template: "%s | SR Laserworks",
  },
  description: "Custom laser works and services crafting precision designs",
};

export default async function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      
      <main className="flex-grow">
        {children}
      </main>
      
    </div>
  );
}