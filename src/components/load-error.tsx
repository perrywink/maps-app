import Link from "next/link";
import { Button } from "./ui/button";

export function LoadError() {
  return (
    <main className="flex flex-1 flex-col justify-center items-center" >
      You're not supposed to be here...
      <Link href="/">
        <Button variant="link">Go back</Button>
      </Link>
    </main>
  )
}