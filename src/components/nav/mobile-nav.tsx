"use client"

import * as React from "react"
import Link, { LinkProps } from "next/link"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { NavLink } from "./navbar"

interface Props {
  navLinks: NavLink[]
}

export function MobileNav({navLinks}: Props) {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="pr-0">
        <div className="flex flex-col space-y-3">
          <MobileLink
            href="/"
            className="flex items-center mb-4"
            onOpenChange={setOpen}
          >
            <span className="font-bold">{"// Great Spaces"}</span>
          </MobileLink>
          {
            navLinks.map((navLink, i) => (
              <MobileLink
                href={navLink.url}
                className="flex items-center"
                onOpenChange={setOpen}
                key={i}
              >
                {navLink.label}
              </MobileLink>
            ))
          }
        </div>
      </SheetContent>
    </Sheet>
  )
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString())
        onOpenChange?.(false)
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  )
}