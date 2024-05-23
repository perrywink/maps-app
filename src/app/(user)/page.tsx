"use client"
import { GoogleMap } from "@/components/map/google-map";
import { SearchBar } from "@/components/search/search-bar";
import { APIProvider } from "@vis.gl/react-google-maps";
import { Scroll, TriangleAlert } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { PlaceProvider } from "@/components/place-provider";
import { InfoSheet } from "@/components/info-sheet/info-sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  if (!process.env.NEXT_PUBLIC_GMAPS_API_KEY) {
    return (
      <Alert variant="destructive">
        <TriangleAlert className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Maps cannot be loaded. Maybe check your connection or cookie permissions?
        </AlertDescription>
      </Alert>
    )
  }

  return (
    // have to set the height programatically like this due to scroll.
    // 3.5 rem is specified in Navbar as h-14
    <main className="flex min-h-[calc(100vh-3.5rem)] max-h-[calc(100vh-3.5rem)]">
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GMAPS_API_KEY}>
        <PlaceProvider>
          <section className="z-10 hidden md:block md:max-w-[30%] overflow-y-auto px-4">
            <div className="my-2">
              <SearchBar/>
            </div>
            <div className="my-4">
              <InfoSheet/>
            </div>
          </section>
          <GoogleMap />
        </PlaceProvider>
      </APIProvider>
    </main>
  );
}
