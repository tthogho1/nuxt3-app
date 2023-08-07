<template>
    <GoogleMap id="gmap" ref="mapRef" api-key="AIzaSyAYemHqW9xU48b7KhMXauA6P0fDFTWyly0" style="width: 100%; height: 500px" :center="center" :zoom="15">
        <Marker :options="markerOptions" />
        <MarkerCluster>
        <Marker v-for="(webCam, i) in webCams" :options="{ position: {lat:webCam.location.latitude,lng:webCam.location.longitude} }" :key="i">
            <InfoWindow>
                <div><a v-bind:href="webCam.player.day.link" target="_blank">{{ webCam.title }}</a></div>
                <div><img :src="webCam.image.current.thumbnail" /></div>
            </InfoWindow>
        </Marker>
        </MarkerCluster>
    </GoogleMap>
</template>

<style>
#gmap {
    pointer-events: auto; 
}
</style>

<script setup lang="ts">
import { GoogleMap, InfoWindow, Marker ,MarkerCluster} from "vue3-google-map";
import { ref } from "vue";
import { webCamObj , Bound } from "./def/webCam"


//const myWorker = new Worker(new URL('./worker.js', import.meta.url));

const setGoogleMapPointer = function(gmap:HTMLElement|null,status : string){
    if (gmap != null && gmap != undefined){
            gmap.style.pointerEvents =status;
    }
}

myWorker.addEventListener('message', (e) => {
    console.log('Workerから受け取ったデータは: ', e.data);
}, false);

myWorker.postMessage('Hello, world');

console.log("Message posted to worker");

const mapRef = ref(null);
const center = ref({ lat: 0, lng: 0 }); // first position
const markerOptions = ref({ position: center})

const webCams = ref<Array<webCamObj>>([]);    
const authToken = ref('');

const getWebCamList = function(map:any){
    const latlngBound = map.getBounds();
    const latlngNE = latlngBound.getNorthEast();
    const latlngSW = latlngBound.getSouthWest();    
    
    const bound : Bound ={
        latitude_gte : latlngSW.lat(),
        latitude_lt : latlngNE.lat(),
        longitude_gte : latlngSW.lng(),
        longitude_lt : latlngNE.lng()
    };
    setGoogleMapPointer(document.getElementById("gmap"),"none");
	fetch('https://d1x1ikt4r7hg2z.cloudfront.net/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bound)
	})
	.then(response => response.json())
	.then(data =>{
        webCams.value = Array.from(data);
        setGoogleMapPointer(document.getElementById("gmap"),"auto");
	})
	.catch(error =>{ 
        console.log(error);
        setGoogleMapPointer(document.getElementById("gmap"),"auto");
    });
};
//
// getLocation is called when the map is ready
//
const getLocation = function(map:any,center:any,markerOptions:any){
    const markerIcon = {
        url:'./images/man.png',
        scaledSize: new mapRef.value.api.Size(30, 30)
    }
    navigator.geolocation.getCurrentPosition(
            // success callback
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                map.panTo({ lat, lng });
                center.value = { lat: lat, lng: lng };
                markerOptions.value = { position: center, icon: markerIcon };
            },
            // error callback
            function(error) {
                console.log(`Error getting location: ${error.message}`);
            }
    );
} 
watch(() => mapRef.value?.ready, (ready) => {
    if (!ready) return;
    const map = mapRef.value.map;
    getLocation(map,center,markerOptions);
    map.addListener("idle", (e:any) => {
        getWebCamList(map);
    });
})
</script>