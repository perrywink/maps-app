import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MobileNav } from "./mobile-nav"
import MainNav from "./main-nav"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Button } from "../ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { AvatarProfile } from "./profile-avatar";

export interface NavLink{
  label: string
  url: string
}

const navLinks: NavLink[] = [
  {
    label: 'About',
    url: '/about'
  },
  {
    label: 'Contact',
    url: '/contact'
  }
]

export async function Navbar() {
  const data = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 px-8 items-center justify-between">
        <MainNav navLinks={navLinks}/>
        <MobileNav navLinks={navLinks}/>
        <div className="flex gap-2">
          <ModeToggle />
          {data ? ( 
            <AvatarProfile />
          ) : (
            <Button className="flex gap-2" asChild>
              <Link href="/auth">
                <LogIn className="w-3 h-3"/>
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

