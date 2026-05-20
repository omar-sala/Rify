'use client'

import { GoogleMap, Marker } from '@react-google-maps/api'

export default function MapTracker({
  driverPos,
  customerPos,
}: {
  driverPos: { lat: number; lng: number } | null
  customerPos: { lat: number; lng: number }
}) {
  return (
    <GoogleMap
      zoom={14}
      center={driverPos || customerPos}
      mapContainerStyle={{
        width: '100%',
        height: '300px',
        borderRadius: '20px',
      }}
    >
      {/* 🚚 المندوب */}
      {driverPos && (
        <Marker
          position={{
            lat: driverPos.lat,
            lng: driverPos.lng,
          }}
          label="🚚"
        />
      )}

      {/* المشتري */}
      {customerPos && (
        <Marker
          position={{
            lat: customerPos.lat,
            lng: customerPos.lng,
          }}
          label="🏠"
        />
      )}
    </GoogleMap>
  )
}
