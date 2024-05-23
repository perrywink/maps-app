export interface PlaceSelected {
  place_id: string,
  formatted_address: string,
  geometry: {
    location: google.maps.LatLngLiteral
  },
  name: string,
  photos: {
    height: number,
    width: number,
    html_attributions: string[],
    photo_reference: string
  }[]
}