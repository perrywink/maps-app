"use client"
import { redirect } from "next/navigation";
import { toast } from "sonner";

export function RequestAuth() {
  toast("You are not logged in! Please login before continuing.")
  redirect("/auth")
  return <></>
}