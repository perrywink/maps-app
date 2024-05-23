import prisma from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: { placeId: string } }
) {
  const placeId = params.placeId
  const place = await prisma.place.findUnique({
    where: {
      googlePlaceId: placeId
    },
    select: {
      id: true
    }
  })

  if (!place) {
    return Response.json({ error: 'No place found' }, { status: 422 })
  }

  const averageRating = await prisma.review.aggregate({
    where: {
      placeId: place.id,
    },
    _avg: {
      rating: true,
    },
  });

  return Response.json({placeRating: averageRating});
}