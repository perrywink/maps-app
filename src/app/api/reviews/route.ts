import prisma from "@/lib/db"

export async function POST(request: Request) {
  const { user, placeId, ...values } = await request.json()

  const findUser = await prisma.user.findUnique({
    where: {
      email: user.email
    },
    select: {
      id: true
    }
  })

  const review = await prisma.review.create({
    data: {
      ...values,
      userId: findUser?.id,
      placeId: placeId
    }
  })
  return Response.json({review: review});
}
