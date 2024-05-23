"use client"
import { useEffect, useState } from 'react';
import { Combobox } from '@headlessui/react'
import { useMap } from '@vis.gl/react-google-maps';
import useDebounce from '@/hooks/useDebounce';
import { Search, X } from 'lucide-react';
import useSWR from 'swr'
import fetcher from "@/lib/swr";
import { usePlaceSelected } from '../place-provider';

interface Props { }

function retrieveMapCenterAsParam(map: google.maps.Map | null) {
  if (!map) {
    return null
  }
  return `${map.getCenter()?.lat()},${map.getCenter()?.lng()}`
}

// I cannot use a simple null because it will force the search to change from uncontrolled to controlled, throwing an error
const defaultAutocompletePrediction: google.maps.places.AutocompletePrediction = {
  description: '',
  matched_substrings: [],
  place_id: '',
  structured_formatting: {
    main_text: '',
    main_text_matched_substrings: [],
    secondary_text: ''
  },
  terms: [],
  types: []
}

export function SearchBar({ }: Props) {
  const [input, setInput] = useState<string>("")
  const [selectedPrediction, setSelectedPrediction] = useState<google.maps.places.AutocompletePrediction>(defaultAutocompletePrediction)
  const { setSelectedPlace } = usePlaceSelected();

  const debouncedInput = useDebounce(input, 300); // Debounce
  const map = useMap();

  const mapCenterParam = retrieveMapCenterAsParam(map)
  const shouldFetchPredictions = (debouncedInput.length > 0) && mapCenterParam
  const {
    data: autocompleteData,
    isLoading: isAutocompleteLoading,
  } = useSWR(
    shouldFetchPredictions ? "/api/autocomplete?" + new URLSearchParams({
      input: debouncedInput,
      location: mapCenterParam
    }) : null,
    fetcher
  )
  const predictions = autocompleteData?.data?.predictions as google.maps.places.AutocompletePrediction[]

  const {
    data: placesData,
    isLoading: isPlacesLoading,
    mutate: refetchPlaces
  } = useSWR(
    (selectedPrediction?.place_id) ? "/api/gmaps-places?" + new URLSearchParams({
      placeId: selectedPrediction?.place_id!,
      fields: ['place_id', 'name', 'geometry/location', 'formatted_address', 'photos'].join(',')
    }) : null,
    fetcher
  )

  const onSelect = (value: google.maps.places.AutocompletePrediction) => {
    setSelectedPrediction(value)
    refetchPlaces()
    console.log(selectedPrediction)
  }

  const handleClearSearch = () => {
    setSelectedPlace(null)
    setSelectedPrediction(defaultAutocompletePrediction)
    setInput("")
  }

  useEffect(() => {
    if (placesData) setSelectedPlace(placesData.data.result)
  }, [selectedPrediction, isPlacesLoading])

  return (
    <Combobox value={selectedPrediction} onChange={onSelect}>
      <div className="relative w-full bg-background cursor-default">
        <Combobox.Input
          onChange={(event) => setInput(event?.target.value)}
          className="flex h-10 w-full rounded-md border border-input px-3 pr-12 py-2 text-sm focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          placeholder='Search for a place...'
          displayValue={(p: google.maps.places.AutocompletePrediction) => p?.description}
        />
        {selectedPrediction !== defaultAutocompletePrediction ? (
          <Combobox.Button 
            className="absolute inset-y-0 right-0 flex items-center pr-6"
            onClick={handleClearSearch}
          >
            <X
              className="w-4 h-4 text-muted-foreground"
              aria-hidden="true"
            />
          </Combobox.Button>
        ) : (
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-6">
            <Search
              className="w-4 h-4 text-muted-foreground"
              aria-hidden="true"
            />
          </Combobox.Button>
        )}
      </div>
      <Combobox.Options className="z-20 absolute py-1 mt-1 overflow-auto text-base bg-background rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
        {predictions?.map((prediction) => (
          <Combobox.Option key={prediction.place_id} value={prediction} className={({ active }) =>
            `cursor-default select-none relative py-2 pl-10 pr-4 ${active && 'bg-secondary'} max-w-md`
          }>
            {prediction.description}
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  )
}
