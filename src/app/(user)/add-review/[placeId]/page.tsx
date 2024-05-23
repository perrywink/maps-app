import { Separator } from "@/components/ui/separator";
import { AddReviewForm } from "./add-review-form";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { LoadError } from "@/components/load-error";
import { RequestAuth } from "@/components/request-auth";

type Props = {
  params: {
    placeId: string
  },
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function AddReview({ params, searchParams }: Props) {
  const session = await getServerSession(authOptions);

  if (!searchParams['name'] || !searchParams['lat'] || !searchParams['lng']) {
    return <LoadError />
  }

  if (!session) {
    return <RequestAuth />
  }

  const upsertPlace = {
    name: searchParams['name'] as string,
    lat: parseFloat(searchParams['lat'] as string),
    lng: parseFloat(searchParams['lng'] as string),
  }

  let place = await prisma.place.upsert({
    where: {
      googlePlaceId: params.placeId
    },
    update: {},
    create: {
      googlePlaceId: params.placeId,
      ...upsertPlace
    }
  })

  return (
    <main className="flex flex-1">
      <div className="container pt-8 max-w-lg space-y-6">
        <div>
          <h3 className="text-lg font-medium">{`Reviewing ${searchParams.name}`}</h3>
          <p className="text-sm text-muted-foreground">
            What do you have to say about this place?
          </p>
        </div>
        <Separator />
        <AddReviewForm placeId={place.id} user={session.user} />
      </div>
    </main>
  )
}
