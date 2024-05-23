import { autocompleteSearchRadius } from "@/lib/map-helpers"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const placeId = searchParams.get('placeId')
  const fields = searchParams.get('fields')

  if (!placeId || !process.env.NEXT_PUBLIC_GMAPS_API_KEY){ 
    return Response.json({ error: 'Invalid params provided' }, { status: 422 })
  }

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?` + new URLSearchParams({
      place_id: placeId,
      fields: fields!,
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