"use client"
import { Map, Marker, useMap } from '@vis.gl/react-google-maps';
import { useMapStyles } from './map-styles';
import { useEffect } from 'react';
import { defaultMapPosition } from '@/lib/map-helpers';
import { usePlaceSelected } from '../place-provider';

interface Props {}

export function GoogleMap() {
  const map = useMap();
  const {selectedPlace} = usePlaceSelected();

  useEffect(() => {
    if (!selectedPlace) return;
    const newMapPos: google.maps.LatLngLiteral = {
      lat: selectedPlace.geometry.location.lat,
      lng: selectedPlace.geometry.location.lng,
    } 
    
    map?.moveCamera({center: newMapPos, zoom: 15})
  }, [selectedPlace])

  return (
    <Map 
      defaultCenter={defaultMapPosition} 
      defaultZoom={13} 
      styles={useMapStyles()} 
      className='w-full' 
      disableDefaultUI
    >
      {
        selectedPlace && (
          <Marker position={{
            lat: selectedPlace.geometry?.location?.lat,
            lng: selectedPlace.geometry?.location?.lng,
          }}/>
        )
      }
    </Map>
  );
}
