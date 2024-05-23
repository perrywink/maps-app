"use client"
import { PlaceCarousel } from "./place-image-carousel";
import { usePlaceSelected } from "../place-provider";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { PencilLine, Squirrel, Telescope } from "lucide-react";
import { StarRating } from "@/components/star-rating/star-rating";
import useSWR from "swr";
import useSWRInfinite from 'swr/infinite'
import fetcher from "@/lib/swr";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { PlaceSelected } from "@/types/map-helpers";

interface ReviewDataRes {
  id: number;
  rating: number;
  comments: string | null;
  steps: number | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  placeId: string;
  user: {
    name: string | null;
    image: string | null;
  }
};

// for infinite review load
const getKey = (pageIndex: any, previousPageData: string | any[], selectedPlace: PlaceSelected | null, pageSize: number) => {
  if (!selectedPlace) return null
  if (previousPageData && !previousPageData.length) return null // reached the end
  return `/api/reviews/${selectedPlace.place_id}?page=${pageIndex}&limit=${pageSize}`
}

export function InfoSheet() {
  const { selectedPlace } = usePlaceSelected();

  const { data: ratingData, isLoading: ratingDataLoading, error: ratingDataError } = useSWR(
    selectedPlace ? `/api/place-rating/${selectedPlace.place_id}` : null,
    fetcher,
    { shouldRetryOnError: false }
  )

  if (!selectedPlace) {
    return (
      <Alert>
        <Telescope className="h-4 w-4" />
        <AlertTitle>Start exploring accessible spaces around you!</AlertTitle>
        <AlertDescription>
          Start typing above to discover restaurants, parks, and so much more.
        </AlertDescription>
      </Alert>
    )
  }

  const renderRating = () => {
    if (ratingDataLoading) {
      return <Skeleton className="h-4 w-[250px]" />
    }

    const rating = ratingData?.placeRating?._avg?.rating
    if (ratingDataError?.status == 422 || !rating) {
      return <ReviewEmpty />
    }

    return <StarRating rating={rating} />
  }

  return (
    <section className="w-full">
      <PlaceCarousel photos={selectedPlace?.photos} />
      <div className="mx-2 mt-6">
        <h1 className="text-2xl font-bold tracking-tight">
          {selectedPlace.name}
        </h1>
        <h2 className="text-sm text-muted-foreground tracking-tight">
          {selectedPlace.formatted_address}
        </h2>
        <div className="my-2">
          {renderRating()}
        </div>
        <div className="[&>svg~*]:ml-7 mt-2">
          <Button className="gap-2" asChild>
            <Link href={`add-review/${selectedPlace?.place_id}?` + new URLSearchParams({
              name: selectedPlace?.name!,
              lat: selectedPlace?.geometry.location.lat.toString(),
              lng: selectedPlace?.geometry.location.lng.toString(),
            })}>
              <PencilLine className="h-3 w-3" />
              Add Review
            </Link>
          </Button>
        </div>
        <ReviewList />
      </div>
    </section>
  )
}

function ReviewList() {
  const { selectedPlace } = usePlaceSelected();
  const PAGE_SIZE = 3

  const { data: reviewData, size, setSize, isLoading } = useSWRInfinite(
    (pageIndex: any, previousPageData: string | any[]) => getKey(pageIndex, previousPageData, selectedPlace, PAGE_SIZE),
    fetcher,
    {shouldRetryOnError: false}
  )

  const isLoadingMore = isLoading || (size > 0 && reviewData && typeof reviewData[size - 1] === "undefined");
  const isEmpty = reviewData?.[0]?.length === 0 || !reviewData?.[0]?.length;
  // latest fetch is empty or is smaller in len
  const isReachingEnd = isEmpty || (reviewData && reviewData[reviewData.length - 1]?.length < PAGE_SIZE);

  return (
    <div className="mt-4 flex flex-col gap-y-4">
      {reviewData?.map((reviews) => {
        return (reviews as ReviewDataRes[]).map(review => (
          <div 
            key={review.id} 
            className="flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent cursor-pointer"
          >
            <p className="text-muted-foreground text-xs">{review.user.name}</p>
            <p className="line-clamp-4">
              {review.comments}
            </p>
            <div className="flex items-center gap-2">
              <StarRating rating={review.rating} />
              <span className="text-xs text-muted-foreground">{`${review.rating}/5`}</span>
            </div>
          </div>
        ))
      })}
      <Button
        variant="link"
        onClick={() => setSize(size + 1)}
        disabled={isLoadingMore || isReachingEnd}
      >
        {isLoadingMore
          ? "Loading..."
          : isReachingEnd
            ? "No More Reviews."
            : "Load More"}
      </Button>
    </div>
  )
}

function ReviewEmpty() {
  return (
    <Alert>
      <Squirrel className="w-5 h-5" />
      <AlertTitle>Nothing to see here... yet.</AlertTitle>
      <AlertDescription>
        Be the first to leave a review!
      </AlertDescription>
    </Alert>
  )
}
