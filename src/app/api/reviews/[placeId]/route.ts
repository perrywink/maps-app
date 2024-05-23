import prisma from "@/lib/db"

type GetReviewsPathParams = { 
  params: {
    placeId: string,
  }
}

export async function GET( request: Request, {params}: GetReviewsPathParams ) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page')
  const limit = searchParams.get('limit')

  if (!page || !limit){ 
    return Response.json({ error: 'Invalid params provided' }, { status: 422 })
  }

  const place = await prisma.place.findUnique({
    where: {
      googlePlaceId: params.placeId
    },
    select: {
      id: true
    }
  })

  if (!place) {
    return Response.json({ error: 'No place found' }, { status: 422 })
  }

  const data = await prisma.review.findMany({
    where: {
      placeId: place.id
    },
    skip: parseInt(page) * parseInt(limit),
    take: parseInt(limit),
    orderBy: {
      id: 'asc',
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    }
  })

  return Response.json(data);
}