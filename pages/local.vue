<template>
    <GoogleMap id="gmap" ref="mapRef" api-key="AIzaSyAYemHqW9xU48b7KhMXauA6P0fDFTWyly0" style="width: 100%; height: 500px" :center="center" :zoom="15">
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
</template>

<style>
#gmap {
    pointer-events: auto; 
}
</style>

<script setup lang="ts">
import { GoogleMap, InfoWindow, Marker ,MarkerCluster} from "vue3-google-map";
import { ref } from "vue";
import { webCamObj,Bound } from "./def/webCam"
import * as tf from '@tensorflow/tfjs';

const spWorker = new Worker('/searchPictureWorker.js');

spWorker.addEventListener('message', (e) => {
  console.log('Workerから受け取ったデータは: ', e.data);
}, false);

const mapRef = ref(null);
const center = ref({ lat: 0, lng: 0 }); // first position
const markerOptions = ref({ position: center})

onMounted(() => {
    getAuthenticate();
});

const webCams = ref<Array<webCamObj>>([]);    
const authToken = ref('');
const getAuthenticate = function () {
	fetch('https://realm.mongodb.com/api/client/v2.0/app/webcamql-qrkjj/auth/providers/api-key/login', {
  		method: 'POST',
  		headers: {
    		'Content-Type': 'application/json'
  		},
  		body: JSON.stringify({
    		"key": "zltDLjGDHqJHzQ0tSHA3XSZJUTnV5TxBmjW2PopKInszFsDxqSAEubmtq5tRRLgm"
 		})
	})
	.then(response => response.json())
	.then(data =>{
		authToken.value = data.access_token; 
	}).catch(error => console.error(error));
};


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
    spWorker.postMessage(dataURL);
  };

  img.src = imageUrl;
} 


const openvideo = function(webcamlink:string,imagelink:string) {
    const url = webcamlink;
    window.open(url, '_blank');
    convertImageToBase64(imagelink);
}

const getWebCamList = function(map:any){
    const latlngBound = map.getBounds();
    const latlngNE = latlngBound.getNorthEast();
    const latlngSW = latlngBound.getSouthWest();    
    
    const latitude_gte = latlngSW.lat(), latitude_lt = latlngNE.lat(), longitude_gte = latlngSW.lng(), longitude_lt = latlngNE.lng();
    const token = 'Bearer ' + authToken.value ;
	const queryMsg = `query {
  		webcams(query:{status:"active",location:{
                        longitude_lt:${longitude_lt},
                        longitude_gte:${longitude_gte},
                        latitude_lt:${latitude_lt},
                        latitude_gte:${latitude_gte}}}
    	,limit:200
    	,sortBy:ID_ASC) {
			id
			title
    		location{
     		 	latitude
      			longitude
    		}
            player{
               day{
                 available
                 link
              }
           }
           image{
                current{
                    thumbnail
                }    
           }
  		}
	}`;

    const gmap  = document.getElementById("gmap");
    if (gmap != null && gmap != undefined){
            gmap.style.pointerEvents ="none";
    }
	fetch('https://realm.mongodb.com/api/client/v2.0/app/webcamql-qrkjj/graphql', {
  		method: 'POST',
  		headers: {
			'Authorization': token  ,
    		'Content-Type': 'application/json'
  		},
  		body: JSON.stringify({
      		query: queryMsg
  		})
	})
	.then(response => response.json())
	.then(data =>{
        webCams.value = Array.from(data.data.webcams);
        const gmap  = document.getElementById("gmap");
        if (gmap != null && gmap != undefined){
            gmap.style.pointerEvents = "auto";
        }
	})
	.catch(error => console.error(error.message));
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
                console.error(`Error getting location: ${error.message}`);
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
<style>
  .link-button {
    background: none;
    border: none;
    color: blue;
    text-decoration: underline;
    cursor: pointer;
  }
</style>