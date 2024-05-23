"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { NavLink } from "./navbar"

interface Props {
  navLinks: NavLink[]
}

export default function MainNav({ navLinks }: Props) {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <nav className="flex items-center gap-4 text-sm lg:gap-6">
        <Link
          href="/"
          className="font-bold"
        >
          // Great Spaces
        </Link> 
        {
          navLinks.map((navLink, i) => (
            <Link
              key={i}
              href={navLink.url}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === navLink.url ? "text-foreground" : "text-foreground/60"
              )}
            >
              {navLink.label}
            </Link>
          ))
        }
      </nav>
    </div>
  )
}