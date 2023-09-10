<template>
    <Header class="header" />
    <GoogleMap id="gmap" ref="mapRef" :api-key="config.public.GOOGLE_MAPS_API_KEY" style="width: 100%; height: 500px" :center="center" :zoom="15">
        <Marker :options="markerOptions" />
        <MarkerCluster>
        <Marker v-for="(webCam, i) in webCams" :options="{ position: {lat:webCam.location.latitude,lng:webCam.location.longitude} }" :key="i">
            <InfoWindow>
                <div><button  class="link-button"  v-on:click="openvideo(webCam.player.day.link,webCam.image.current.thumbnail)">{{ webCam.title }}</button></div>
                <div><img :src="webCam.image.current.thumbnail" /></div>
            </InfoWindow>
        </Marker>
        </MarkerCluster>
    </GoogleMap>
    <div>
        Recommendation：
    </div>
    <div style="margin-top:3%" class="container">
        <div class="row">
            <div class="col-2" v-for="webcam in recommends" :key="webcam.id">
                <img :src="webcam.image.current.thumbnail" />
                <div><button  class="link-button"  v-on:click="goToThere(webcam)">{{ webcam.title }}</button></div>
                <div>country: {{ webcam.location.country }}</div>
            </div> 
        </div>  
    </div>
    <div class="m-5">
    <!-- <NuxtPage /> -->
</div>
</template>

<style>
#gmap {
    pointer-events: auto; 
}
.header{
    width: 100%;
    height: 30px;
    z-index: 1;
}
</style>

<script setup lang="ts">
import { GoogleMap, InfoWindow, Marker ,MarkerCluster} from "vue3-google-map";
import { ref } from "vue";
import { webCamObj,webCamQuery } from "./def/webCam"

import { useTokenDataStore } from "../store/accessToken";
import { getAuthenticate } from "../composables/getAccessToken" ;
import { getWebCams } from "../composables/getWebCams";

const config = useRuntimeConfig();
const spWorker = new Worker('./js/searchPictureWorker.js');

spWorker.addEventListener('message', (e) => {
    console.log(' receive from Worker: ', e.data);
    recommends.value = Array.from(e.data.data.webcams);
}, false);

const mapRef = ref(null);
const center = ref({ lat: 0, lng: 0 }); // first position
const markerOptions = ref({ position: center})

const route = useRoute();
const tokenStore = useTokenDataStore();


async function  getAccessTokenOfMongoAtlas(){
    const token  = await getAuthenticate();
    tokenStore.setAccessToken(token);
}

onMounted(() => {
    getAccessTokenOfMongoAtlas();
    setInterval(getAccessTokenOfMongoAtlas,
        config.public.MONGODB_ATLAS_TOKEN_INTERVAL);
});

const webCams = ref<Array<webCamObj>>([]);    
const recommends = ref<Array<webCamObj>>([]);

const convertImageToBase64 = function(imageUrl:string):void {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (ctx != null){
            ctx.drawImage(img, 0, 0);
        }
        const dataURL = canvas.toDataURL('image/jpeg');
        const sendData ={
            base64String:dataURL,
            token : tokenStore.accessToken 
        }
        //alert("tokenStore" + tokenStore.accessToken);
        spWorker.postMessage(sendData);
    };
    
    img.src = imageUrl;
} 

const goToThere = function(webCam:webCamObj){
    center.value = { lat: webCam.location.latitude, lng: webCam.location.longitude };
}

const openvideo = function(webcamlink:string,imagelink:string) {
    const url = webcamlink;
    window.open(url, '_blank');
    convertImageToBase64(imagelink);
}

const getWebCamList = async function(map:any){
    const latlngBound = map.getBounds();
    const latlngNE = latlngBound.getNorthEast();
    const latlngSW = latlngBound.getSouthWest();    
    
    const latitude_gte = latlngSW.lat(), latitude_lt = latlngNE.lat(), longitude_gte = latlngSW.lng(), longitude_lt = latlngNE.lng();
    const token = 'Bearer ' + tokenStore.accessToken ;
    console.log("token : " + token);
	const queryMsg = `query {
        webcams(query:{status:"active",location:{
                        longitude_lt:${longitude_lt},
                        longitude_gte:${longitude_gte},
                        latitude_lt:${latitude_lt},
                        latitude_gte:${latitude_gte}}}
        ,limit:200
        ,sortBy:ID_ASC)` 
        + webCamQuery +        
	`}`;

    const gmap  = document.getElementById("gmap");
    if (gmap != null && gmap != undefined){
            gmap.style.pointerEvents ="none";
    }
    webCams.value = await getWebCams(token,queryMsg);
    if (gmap != null && gmap != undefined){
        gmap.style.pointerEvents = "auto";
    }
};
//
// getLocation is called when the map is ready
//
const moveCurrentLocation = function(map:any,center:any, markerOptions:any){
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
                console.error(`Error getting location: ${error.message}`);
            }
    );
} 

watch(() => mapRef.value?.ready, (ready) => {
    if (!ready) return;

    if (mapRef.value == null){  
        return;
    }
    const map = mapRef.value.map;
    if (route.query.lat === undefined 
        || route.query.lng === undefined){
        moveCurrentLocation(map,center,markerOptions);
    }else{
        center.value = { lat: Number(route.query.lat), lng: Number(route.query.lng) };
    }

    map.addListener("idle", (e:any) => {
        getWebCamList(map);
    });
})
</script>
<style>
.link-button {
    background: none;
    border: none;
    color: blue;
    text-decoration: underline;
    cursor: pointer;
}
</style>