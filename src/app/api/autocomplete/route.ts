import { autocompleteSearchRadius } from "@/lib/map-helpers"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const input = searchParams.get('input')
  const location = searchParams.get('location')

  if (!input || !process.env.NEXT_PUBLIC_GMAPS_API_KEY){ 
    return Response.json({ error: 'Invalid params provided' }, { status: 422 })
  }

  const res = await fetch(
    'https://maps.googleapis.com/maps/api/place/autocomplete/json?' + new URLSearchParams({
      input: input!,
      key: process.env.NEXT_PUBLIC_GMAPS_API_KEY!,
      types: 'establishment',
      location: location!,
      radius: `${autocompleteSearchRadius}`
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      }
    })

  const data = await res.json()
  return Response.json({ data })
}