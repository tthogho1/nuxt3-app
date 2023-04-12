f<template>
    <GoogleMap  ref="mapRef" api-key="AIzaSyAYemHqW9xU48b7KhMXauA6P0fDFTWyly0" style="width: 100%; height: 500px" :center="center" :zoom="15">
      <Marker :options="{ position: center }" />
    </GoogleMap>
  </template>
  
  
<script setup lang="ts">
import { GoogleMap, Marker } from "vue3-google-map";
import { ref, onMounted } from "vue";

const mapRef = ref(null);
let center = { lat: 0, lng: 0 };
onMounted(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            // success callback
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                console.log(`Latitude: ${lat}, Longitude: ${lng}`);
                mapRef.value.map.panTo({ lat, lng });
                center = { lat, lng };    
            },
            // error callback
            function(error) {
                console.error(`Error getting location: ${error.message}`);
            }
        );
    }
});

// const center = { lat: 40.689247, lng: -74.044502 };
</script>