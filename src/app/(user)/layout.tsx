import { Navbar } from "@/components/nav/navbar";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Navbar />
      {children}
    </div>
  )
}
