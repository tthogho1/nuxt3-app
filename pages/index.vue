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
            <div class="col-2" v-for="metalImage in recommends" :key="metalImage.id">
                <img :src="metalImage.imageUrl" />
                <div><button  class="link-button"  v-on:click="goToThere(metalImage.metadata.latitude,metalImage.metadata.longitude)">{{ metalImage.metadata.title }}</button></div>
                <div>country: {{ metalImage.metadata.country }}</div>
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
import { webCamObj,webCamQuery,metalImageObj } from "../type/webCam"

import { useTokenDataStore } from "../store/accessToken";

const config = useRuntimeConfig();

const mapRef = ref(null);
const center = ref({ lat: 0, lng: 0 }); // first position
const markerOptions = ref({ position: center})

const route = useRoute();
const tokenStore = useTokenDataStore();

const webCams = ref<Array<webCamObj>>([]);    
const recommends = ref<Array<metalImageObj>>([]);

const goToThere = function(latitude:number,longitude:number){
    center.value = { lat: latitude, lng: longitude };
}

const openvideo = async function(webcamlink:string,imagelink:string) {
    
    window.open(webcamlink, '_blank');

    const url = config.public.METAL_SEARCHE_URL;
    const response = await fetch('api/getSimilarImages', {
        method: 'POST',
        body: JSON.stringify({
            imageUrl: imagelink,
        }),
    });

    const data = await response.json();
    recommends.value = data.data;
}

const getWebCams = async function(token:string,queryMsg:string): Promise<Array<webCamObj>>{
    const response = await fetch('api/getWebCams', {
        method: 'POST',
        body: JSON.stringify({
            query: queryMsg
        })
    });

    const data = await response.json();

    return Array.from(data.data.webcams);   
}


const getWebCamList = async function(map:any){
    const latlngBound = map.getBounds();
    const latlngNE = latlngBound.getNorthEast();
    const latlngSW = latlngBound.getSouthWest();    
    
    const latitude_gte = latlngSW.lat(), latitude_lt = latlngNE.lat(), longitude_gte = latlngSW.lng(), longitude_lt = latlngNE.lng();
    const token = 'Bearer ' + tokenStore.accessToken ;
    // console.log("token : " + token);
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
    try{
        webCams.value = await getWebCamsByApi(queryMsg);
    }catch(e){
        //alert('get request Error');
        console.log(e);
    }   
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