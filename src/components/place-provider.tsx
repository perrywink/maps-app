'use client'

import { TriangleAlert } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { Dispatch, PropsWithChildren, SetStateAction, createContext, useContext, useState } from "react";
import { PlaceSelected } from "@/types/map-helpers";
 
const PlaceSelectedContext = createContext<{
  selectedPlace: PlaceSelected | null;
  setSelectedPlace: Dispatch<SetStateAction<PlaceSelected | null>>;
}> ({
  selectedPlace: null,
  setSelectedPlace: () => null
})

export function PlaceProvider({ children }: PropsWithChildren<{}>) {

  const [selectedPlace, setSelectedPlace] = useState<PlaceSelected | null>(null);

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
    <PlaceSelectedContext.Provider value={{selectedPlace, setSelectedPlace}}>
      {children}
    </PlaceSelectedContext.Provider>
  )
}

export const usePlaceSelected = () => {
  return useContext(PlaceSelectedContext);
};