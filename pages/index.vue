<template>
    <GoogleMap  ref="mapRef" api-key="AIzaSyAYemHqW9xU48b7KhMXauA6P0fDFTWyly0" style="width: 100%; height: 500px" :center="center" :zoom="15">
      <Marker :options="markerOptions" />
      <MarkerCluster>
        <Marker v-for="(location, i) in locations" :options="{ position: location }" :key="i">
            <InfoWindow>
                <div>{{ location.lat }}</div>
            </InfoWindow>
        </Marker>
      </MarkerCluster>
    </GoogleMap>
  </template>
    
<script setup lang="ts">
import { GoogleMap, InfoWindow, Marker ,MarkerCluster} from "vue3-google-map";
import { ref } from "vue";

const mapRef = ref(null);
const center = ref({ lat: 0, lng: 0 }); // first position
const markerOptions = ref({ position: center});

onMounted(() => {
    getAuthenticate();
});

//
var authToken = '';
const getAuthenticate = function () {

	fetch('https://realm.mongodb.com/api/client/v2.0/app/webcamql-mxkqo/auth/providers/api-key/login', {
  		method: 'POST',
  		headers: {
    		'Content-Type': 'application/json'
  		},
  		body: JSON.stringify({
    		"key": "SOqT9ObM9NcCFi6BVSkAHPsOxxxbV6QqOGxFMzs9XrpWlCP3c2cqGIkysTKz4x3N"
 		})
	})
	.then(response => response.json())
	.then(data =>{
		authToken = data.access_token; 
		// console.log(`authToken: ${authToken}`);
	}).catch(error => console.error(error));
};


const webCams = ref( [{}]);
const getWebCamList = function(map:any){
    const latlngBound = map.getBounds();
    const latlngNE = latlngBound.getNorthEast();
    const latlngSW = latlngBound.getSouthWest();    
    
    const latitude_gte = latlngSW.lat();
    const latitude_lt = latlngNE.lat();
    const longitude_gte = latlngSW.lng();
    const longitude_lt = latlngNE.lng();

    const token = 'Bearer ' + authToken ;

	const queryMsg = `query {
  		webcams(query:{location:{longitude_lt:${longitude_lt},
                        longitude_gte:${longitude_gte},
                        latitude_lt:${latitude_lt},
                        latitude_gte:${latitude_gte}}}
    	,limit:5
    	,sortBy:ID_ASC) {
			id
			status
			title
    		location{
     		 	latitude
      			longitude
    		}
  		}
	}`;
 
	fetch('https://realm.mongodb.com/api/client/v2.0/app/webcamql-mxkqo/graphql', {
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
        webCams.value = data.data.webcams;
		console.log(data);
	})
	.catch(error => console.error(error));

};

//
// getLocation is called when the map is ready
//
const getLocation = function(map:any,center:any,markerOptions:any){
    const markerIcon = {
        url:'/images/man.png',
        scaledSize: new mapRef.value.api.Size(30, 30)
    }
    navigator.geolocation.getCurrentPosition(
            // success callback
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                console.log(`Latitude: ${lat}, Longitude: ${lng}`);
                map.panTo({ lat, lng });
                center.value = { lat: lat, lng: lng };
                markerOptions.value = { position: center, icon: markerIcon };
                //locations.value = [{ lat: lat, lng: lng }];
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
        setTimeout(function(){getWebCamList(map)},1000);
    });
})
</script>