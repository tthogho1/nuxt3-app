<template>
  <Header title="map" />
  <div class="container-fluid">
    <div class="row my-2">
      <div class="col-md-8">
        <input
          type="text"
          placeholder="Please enter the location you want to move to"
          v-model="address"
          style="width: 100%"
        />
      </div>
      <div class="col-md-2">
        <search-button @search-clicked="moveToThere()" />
      </div>
    </div>
    <div class="row my-2">
      <div :class="['col-md-10', { 'col-md-12': recommends.length === 0 }]">
        <GoogleMap
          id="gmap"
          ref="mapRef"
          :api-key="config.public.googleMapsApiKey"
          style="height: 80vh"
          :center="center"
          :zoom="15"
        >
          <Marker :options="markerOptions" />
          <MarkerCluster>
            <Marker
              v-for="(webCam, i) in webCams"
              :options="{
                position: { lat: webCam.location.latitude, lng: webCam.location.longitude },
                icon: cameraIcon,
              }"
              :key="i"
            >
              <InfoWindow>
                <div>
                  <button
                    class="link-button"
                    v-on:click="openvideo(webCam.player.day, webCam.webcamid.toString())"
                  >
                    {{ webCam.title }}
                  </button>
                </div>
                <div>
                  <img
                    :src="config.public.imageServer + webCam.webcamid.toString() + imageExtension"
                  />
                </div>
              </InfoWindow>
            </Marker>
          </MarkerCluster>
        </GoogleMap>
      </div>
      <div v-if="recommends.length > 0" class="col-md-2">
        <div>
          <span style="font-weight: bold">RECOMMENDS</span>
        </div>
        <div style="margin-top: 3%">
          <div class="recommend_div" v-for="webCam in recommends" :key="webCam.id">
            <img :src="webCam.urls.small" />
            <div>
              <button
                class="link-button"
                v-on:click="goToThere(webCam.location.latitude, webCam.location.longitude)"
              >
                {{ webCam.description }}
              </button>
            </div>
            <div style="margin-bottom: 3%">country: {{ webCam.location.country }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <NuxtPage /> -->
  <Footer />
</template>

<style>
#gmap {
  pointer-events: auto;
}
</style>

<script setup lang="ts">
import { GoogleMap, InfoWindow, Marker, MarkerCluster } from 'vue3-google-map';
import { ref } from 'vue';
import type { webCamObj, webCamMetadata } from '../type/webCam';
import { webCamQuery, webCamQueryV2 } from '../type/webCam';

import { useTokenDataStore } from '../store/accessToken';

const config = useRuntimeConfig();
const imageExtension = '.jpg';

const mapRef = ref<{ api: any; map: any; ready?: boolean } | null>(null);
const center = ref({ lat: 0, lng: 0 }); // first position
const markerOptions = ref({ position: center });
const address = ref('');

const route = useRoute();
const tokenStore = useTokenDataStore();

const webCams = ref<Array<webCamObj>>([]);
const recommends = ref<Array<webCamMetadata>>([]);

const cameraIcon = {
  url: '/images/webcam.png',
};

const moveToThere = async function () {
  if (!mapRef.value) {
    alert('map api is not ready');
    return;
  }
  const geocoder = new mapRef.value.api.Geocoder();
  geocoder.geocode({ address: address.value }, (results: any, status: string) => {
    if (status === 'OK') {
      const lat = results[0].geometry.location.lat();
      const lng = results[0].geometry.location.lng();
      center.value = { lat: lat, lng: lng };
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
};

const goToThere = function (latitude: number, longitude: number) {
  center.value = { lat: latitude, lng: longitude };
};

const openvideo = async function (webcamlink: string, imagelink: string) {
  window.open(webcamlink, '_blank');

  // const url = config.public.METAL_SEARCHE_URL;
  const url = config.metalSeacheUrl;
  const imageCount = 5;

  const response = await fetch('api/getSimilarImages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      count: imageCount,
      imageUrl: imagelink,
    }),
  });

  const data = await response.json();
  recommends.value = data;
};

const getWebCams = async function (token: string, queryMsg: string): Promise<Array<webCamObj>> {
  const response = await fetch('api/getWebCams', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: queryMsg,
    }),
  });

  const data = await response.json();

  return Array.from(data.data.webcams);
};

const getWebCamList = async function (map: any) {
  const latlngBound = map.getBounds();
  const latlngNE = latlngBound.getNorthEast();
  const latlngSW = latlngBound.getSouthWest();

  const latitude_gte = latlngSW.lat(),
    latitude_lt = latlngNE.lat(),
    longitude_gte = latlngSW.lng(),
    longitude_lt = latlngNE.lng();
  const token = 'Bearer ' + tokenStore.accessToken;
  // console.log("token : " + token);
  const maxSearchCount = 200;
  const queryMsg =
    `query {
        webcams(query:{status:"active",location:{
                        longitude_lt:${longitude_lt},
                        longitude_gte:${longitude_gte},
                        latitude_lt:${latitude_lt},
                        latitude_gte:${latitude_gte}}}
        ,limit:${maxSearchCount}
        ,sortBy: WEBCAMID_ASC)` +
    webCamQuery +
    `}`;

  const queryMsgV2 =
    `query {
        webcam(where: {webcam: {status: {_eq: "active"}
        , location: {latitude: {_gte: ${latitude_gte}, _lt:${latitude_lt}}
        , longitude: {_gte: ${longitude_gte}, _lt: ${longitude_lt}}}}}
        , limit: ${maxSearchCount}, order_by: {webcam: {webcamid: asc}})` +
    webCamQueryV2 +
    `}`;

  const gmap = document.getElementById('gmap');
  if (gmap != null && gmap != undefined) {
    gmap.style.pointerEvents = 'none';
  }
  try {
    //webCams.value = await getWebCamsByApi(queryMsg);
    webCams.value = await getWebCamsByApiV2(queryMsgV2);
  } catch (e) {
    //alert('get request Error');
    console.log(e);
  }
  if (gmap != null && gmap != undefined) {
    gmap.style.pointerEvents = 'auto';
  }
};
//
// getLocation is called when the map is ready
//
const moveCurrentLocation = function (map: any, center: any, markerOptions: any) {
  if (mapRef.value == null) {
    return;
  }
  const markerIcon = {
    url: '/images/man.png',
    scaledSize: new mapRef.value.api.Size(30, 30),
  };
  navigator.geolocation.getCurrentPosition(
    // success callback
    function (position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      map.panTo({ lat, lng });
      center.value = { lat: lat, lng: lng };
      markerOptions.value = { position: center, icon: markerIcon };
    },
    // error callback
    function (error) {
      console.error(`Error getting location: ${error.message}`);
    }
  );
};

watch(
  () => mapRef.value?.ready,
  ready => {
    if (!ready) return;

    if (mapRef.value == null) {
      return;
    }
    const map = mapRef.value.map;
    if (route.query.lat === undefined || route.query.lng === undefined) {
      moveCurrentLocation(map, center, markerOptions);
    } else {
      center.value = { lat: Number(route.query.lat), lng: Number(route.query.lng) };
    }

    map.addListener('idle', (e: any) => {
      getWebCamList(map);
    });
  }
);
</script>
<style>
.link-button {
  background: none;
  border: none;
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}

@media screen and (max-width: 767px) {
  .recommend_div {
    display: inline-block;
  }
}
</style>
