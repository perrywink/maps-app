"use client"

import { Carousel, CarouselItem, CarouselContent } from "@/components/ui/carousel";
import { Card, CardContent } from "../ui/card";
import { PlaceSelected } from "@/types/map-helpers";
import Image from "next/image";

interface PlaceCarouselProps {
  photos: PlaceSelected["photos"] | undefined
}

export function PlaceCarousel({photos}: PlaceCarouselProps) {
  if (!photos) return <></>
  return (
    <Carousel>
      <CarouselContent>
        {photos.map((item) => (
          <CarouselImageItem photoRef={item.photo_reference} key={item.photo_reference}/>
        ))}
      </CarouselContent>
    </Carousel>
  )
}

interface CarouselImageProps {
  photoRef: string
}

function CarouselImageItem({photoRef}: CarouselImageProps) {
  const photoURL = `https://maps.googleapis.com/maps/api/place/photo?` + new URLSearchParams({
    photo_reference: photoRef,
    maxwidth: "500",
    key: process.env.NEXT_PUBLIC_GMAPS_API_KEY!
  })

  return (
    <CarouselItem className="basis-[60%]">
      <div className="p-1">
        <Card>
          <CardContent className="relative aspect-square items-center justify-center">
            <Image src={photoURL} alt={""} fill className="object-cover rounded-md" sizes="500px"/>
          </CardContent>
        </Card>
      </div>
    </CarouselItem>
  )
}