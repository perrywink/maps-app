export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const photoRef = searchParams.get('photoRef')

  if (!photoRef || !process.env.NEXT_PUBLIC_GMAPS_API_KEY){ 
    return Response.json({ error: 'Invalid params provided' }, { status: 422 })
  }

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/photo?` + new URLSearchParams({
      photo_reference: photoRef,
      maxwidth: "500",
      key: process.env.NEXT_PUBLIC_GMAPS_API_KEY!
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      }
    })

  const data = await res.json()
  return Response.json({ data })
}