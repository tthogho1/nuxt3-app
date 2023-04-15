<template>
    <GoogleMap  ref="mapRef" api-key="AIzaSyAYemHqW9xU48b7KhMXauA6P0fDFTWyly0" style="width: 100%; height: 500px" :center="center" :zoom="15">
      <Marker :options="{ position: center }" />
    </GoogleMap>
  </template>
    
<script setup lang="ts">
import { GoogleMap, Marker } from "vue3-google-map";
import { ref } from "vue";

const mapRef = ref(null);
const center = ref({ lat: 0, lng: 0 }); // first position
const getLocation = function(map:any,center:any){
    navigator.geolocation.getCurrentPosition(
            // success callback
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                console.log(`Latitude: ${lat}, Longitude: ${lng}`);
                map.panTo({ lat, lng });
                center.value = { lat: lat, lng: lng };
            },
            // error callback
            function(error) {
                console.error(`Error getting location: ${error.message}`);
            }
    );
} 

watch(() => mapRef.value?.ready, (ready) => {
    if (!ready) return;
    const map = mapRef.value.map;
    getLocation(map,center);
})
</script>