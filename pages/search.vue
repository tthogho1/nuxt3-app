<template>
<div id="app">
<Header title="search" />
<div class="loading" v-if="loading"><img src="/images/loading.gif" alt=""/></div>   
<div class="container-fluid my-2">
    <div class="row">
        <div class="col-12 text-decoration-underline fs-1 mb-3">Search Web Cameras.</div> 
        <div class="col-12 col-md-4 mb-3">
            <div class="btn-group w-100" role="group" aria-label="Basic radio toggle button group">
                <input type="radio" class="btn-check" id="radio1" name="selectOption" v-model="selectedOption" value="country" autocomplete="off">
                <label class="btn btn-outline-dark" for="radio1">Country</label>
    
                <input type="radio" class="btn-check" id="radio2" name="selectOption" v-model="selectedOption" value="word" autocomplete="off">
                <label class="btn btn-outline-dark" for="radio2">Text</label>
            </div>
        </div>
    </div>
    <div v-if="selectedOption === 'country'" class="row my-2">
        <div class="col-7">
            <div class="custom-select">
                <input class="fs-5" type="text" list="selectCode" placeholder="Select Country" v-model="countryCd"/>
                <datalist id="selectCode">
                    <option v-for="countryData in masterdata.countries" :key="countryData.country_code" :value="countryData.country"></option>
                </datalist>
            </div>
        </div>
        <div class="col-1">
            <search-button @search-clicked="searChByCountry()"/>
        </div>
    </div>
    <div v-if="selectedOption === 'word'">
        <div class="row my-2" >
            <div class="col-9 col-sm-8">
                <input class="fs-5" type="text" placeholder="Enter text for image search" v-model="searchText" style="width:100%"/>
            </div>
            <div class="col-1">
                <search-button @search-clicked="searChByText()"/>
            </div>
        </div>
        <div class="d-flex align-items-center  my-2" >
            <div class="fw-bold">image count</div>
            <div class="col-1 ms-2">
                <input  type="number" class="text-center" v-model="imageCount" :min="1" :max="99" style="margin-left:1%;width:100%"/>
            </div>
        </div>
    </div>    
    <div class="row my-2 " style="width:100%;margin-left:2%">
        <button type="button" id="prev" class="col-1 link-button" v-on:click="prevWebCamList()" disabled><i class="bi bi-chevron-double-left"></i></button>
        <button type="button" id="next" class="col-1 link-button" v-on:click="nextWebCamList()" disabled><i class="bi bi-chevron-double-right"></i></button>
        <label class="col-6"></label>
        <!--div class="col-1">count: {{searchCount}} </div -->
    </div>
    <div class="container-fluid px-0">
        <div class="col-10 row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
                <div v-for="webcam in webCams" :key="webcam.webcamid">
                    <!-- div>{{webcam.webcamid  }}</div -->
                    <div><img :src="config.public.imageServer + webcam.webcamid + imageExtension" /></div>
                    <div><button  class="link-button" @click="gotoMap(webcam.location.latitude,webcam.location.longitude)">{{ webcam.title }}</button></div>
                </div>
                <div v-for="searchedData in searchedDataArray" :key="searchedData.id">
                    <!-- div>{{searchedData.id}}</div -->
                    <div><img :src="config.public.imageServer + searchedData.id + imageExtension" /></div>
                    <div><button  class="link-button" @click="gotoMap(searchedData.location.latitude,searchedData.location.longitude)">{{ searchedData.description }}</button></div>
                </div>
        </div>
    </div>
</div>
<Footer/>
</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import * as Realm from "realm-web";
import { useMasterDataStore } from "../store/masterData";
import { useTokenDataStore } from "../store/accessToken";
import type { webCamObj,webCamMetadata } from "../type/webCam";
import { webCamQuery } from "../type/webCam";
import { NavigationFailureType, useRouter } from 'vue-router'

//import type { metalWebCamObj } from "../type/searchedData";
import type {countryData} from "../type/country"

const imageExtension = ".jpg";
const searchText = ref("")
const searchedDataArray = ref<Array<webCamMetadata>>([]);

const selectedOption = ref('country');

const  countryCd = ref('')
const imageCount = ref(5);

const webCams = ref<Array<webCamObj>>([]);    
const firstId = ref("");
const lastId = ref("") ;
const searchCount = ref(0);
const searchStartId = ref("");

const router = useRouter();
const maxSearchCount = 100;

const loading = ref(false);


const config = useRuntimeConfig();
const masterdata = useMasterDataStore();

if (masterdata.countries.length === 0 ){

    const countries = await getCountryData(config.public.supabaseUrl,config.public.supabaseKey);
    // console.log("get country data " + countries);
    masterdata.countries = countries;
}

async function doSearch(queryMsg:string){
    try {
        loading.value = true;

        //webCams.value = await getWebCams(token,queryMsg);
        webCams.value = await getWebCamsByApi(queryMsg);
        firstId.value = webCams.value[0].webcamid.toString();
        lastId.value = webCams.value.slice(-1)[0].webcamid.toString();

        searchCount.value = webCams.value.length;
        
        const next = document.getElementById("next") as HTMLButtonElement;
        const prev = document.getElementById("prev") as HTMLButtonElement ;
        if (webCams.value.length >= maxSearchCount ){
            next.disabled = false;
            next.style.textDecoration = "underline";
        }else{
            next.disabled = true;
            next.style.textDecoration = "none";
        }

        if (searchStartId.value == firstId.value){
            prev.disabled = true;
            prev.style.textDecoration = "none";
        }else{
            prev.disabled = false;
            prev.style.textDecoration = "underline"
        }

    } catch (error) {
        console.log(error);
        alert(error);
        searchCount.value = 0;
    }
    loading.value = false;

}

const searChByCountry = async function () {
    searchedDataArray.value =[];

    const queryMsg = `query {
        webcams(query:{status:"active",
                        webcamid_gt: 1000000000,
                        location:{
                        country:"${countryCd.value}"}
                    }
        ,limit:${maxSearchCount}
        ,sortBy:WEBCAMID_ASC)` + 
        webCamQuery +
	`}`;
    
    await doSearch(queryMsg);

    searchStartId.value = firstId.value;
    (document.getElementById("prev") as HTMLButtonElement).disabled= true;
    (document.getElementById("prev") as HTMLButtonElement).style.textDecoration = "none";
}

const nextWebCamList = async function(){
    const queryMsg = `query {
        webcams(query:{status:"active",
                        webcamid_gt:${lastId.value},
                        location:{
                        country:"${countryCd.value}"}
                    }
        ,limit:${maxSearchCount}
        ,sortBy:WEBCAMID_ASC)` + 
        webCamQuery +
	`}`;

    await doSearch(queryMsg);
}

const prevWebCamList = async function(){
    const queryMsg = `query {
        webcams(query:{status:"active",
                        webcamid_lt:${firstId.value},
                        location:{
                        country:"${countryCd.value}"}
                    }
        ,limit:${maxSearchCount}
        ,sortBy:WEBCAMID_ASC)` + 
        webCamQuery +
	`}`;

    await doSearch(queryMsg);
}

const gotoMap = function(latitude:number, longitude:number) {
    router.push({path:'/', query:{ lat:latitude , lng:longitude }});
}

const searChByText = async function() {
    webCams.value = [];

    if (imageCount.value < 1 || imageCount.value > 100){
        alert("image Count value must be between 1 and 100");
        return;
    }

    loading.value = true;
    try {
        const response = await 	fetch('api/searchWebCamByText', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                count: imageCount.value,
                query: searchText.value
            })
        })

        if ((response.status >= 400)) {
            //throw new Error('searCghByText error');
            alert("get request Error :" + response.status);
            return;
        }

        const res = await response.json();
        const data = JSON.parse(res.body);

        console.log(data);
        searchedDataArray.value = data;
        searchCount.value = data.length;
    }catch(e){
        alert("script Error on searCghByText");
        console.log(e);
    }finally{
        loading.value = false;
    }
}

</script>

<style scoped>
.custom-select {
    position: relative;
    width: 100%;
  }
  
  .custom-select::after {
    content: "\25BC";
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    pointer-events: none;
  }
  
  .custom-select input {
    appearance: none;
    -webkit-appearance: none;
    padding-right: 5px;
    width: 100%;
  }


.link-button {
    background: none;
    border: none;
    color: blue;
    text-decoration: none;
    cursor: pointer;
}
  
.link-button i {
    color: #007bff; /* Enabled color (e.g., blue) */
    font-size: 24px; /* Adjust size as needed */
}
  
.link-button:disabled i {
    color: #6c757d; /* Disabled color (e.g., gray) */
    opacity: 0.5; /* Optional: reduce opacity for disabled state */
}
  
.loading {
    z-index:100;
    width:100%;
    height:100%;
    position:absolute;
    top:0;left:0;
    background-color:rgba(255,255,255,0.8);
    text-align:center;
    align-items: center;
    display: flex;
    justify-content: center;
}

#app {
    display: grid;
    grid-template-rows: auto 1fr auto; /* Header, content, footer */
    min-height: 100vh; /* Full viewport height */
}
.main-content {
    flex: 1; /* This allows the main content to grow and fill the available space */
}

.custom-height {
    height: 30px; /* または必要な高さ */
}
</style>
