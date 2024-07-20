<template>
<Header  />
<div class="loading" v-if="loading"><img src="/images/loading.gif" alt=""/></div>    
<div class="container-fluid">
    <div class="row">
        <div class="col-2 col-md-1  d-flex justify-content-center align-items-center">
            <input type="checkbox" id="check1" v-model="checkCountry">
        </div>
        <div class="col-2 col-md-1">
            <label for="check1">Country</label>
        </div>
        <div class="col-2 col-md-1  d-flex justify-content-center align-items-center">
            <input type="checkbox" id="check2" v-model="checkWord">
        </div>
        <div class="col-2 col-md-1">
            <label for="check2">Word</label>
        </div>
    </div>
    <div v-if="checkCountry" class="row" style="margin-top:2%">
        <div class="col-2 fw-bold"><label class="form-label" for="selectCode">Select Country</label></div>
        <div class="col-7">
            <input type="text" list="selectCode" placeholder="Select Country" style="width:60%" v-model="countryCd"/>
            <datalist id="selectCode">
                <option v-for="countryData in masterdata.countries" :key="countryData.country_code" :value="countryData.country"></option>
            </datalist>
        </div>
        <div class="col-2">
            <button type="button" class="" v-on:click="searChByCountry()">Search </button>
        </div>
    </div>
    <div v-if="checkWord">
        <div class="row" style="margin-top:1%">
            <div class="col-2 fw-bold">Search by Word</div>
            <div class="col-7 col-sm-8">
                <input  type="text" v-model="searchText" style="width:100%"/>
            </div>
            <div class="col-2">
                <button type="button"  v-on:click="searChByText()">Search</button>
            </div>
        </div>
        <div class="row" style="margin-top:1%">
            <div class="col-2"></div>
            <div class="col-6 d-flex justify-content-end fw-bold">get image count</div>
            <div class="col-2 d-flex justify-content-end">
                <input  type="number" class="text-center" v-model="imageCount" :min="1" :max="99" style="margin-left:1%;width:100%"/>
            </div>
        </div>
    </div>    
    <div class="row" style="width:100%;margin-top:2%;margin-left:2%">
        <button type="button" id="prev" class="col-1 link-button" v-on:click="prevWebCamList()" disabled>Prev</button>
        <button type="button" id="next" class="col-1 link-button" v-on:click="nextWebCamList()" disabled>Next</button>
        <label class="col-6"></label>
        <div class="col-1">count: {{searchCount}} </div>
    </div>
</div>
<div class="container text-center">
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
        <div class="col" v-for="webcam in webCams" :key="webcam.webcamid">
            <!-- div>{{webcam.webcamid  }}</div -->
            <div><img :src="config.public.imageServer + webcam.webcamid + imageExtension" /></div>
            <div><button  class="link-button" @click="gotoMap(webcam.location.latitude,webcam.location.longitude)">{{ webcam.title }}</button></div>
        </div>
        <div class="row" v-for="searchedData in searchedDataArray" :key="searchedData.id">
            <!-- div>{{searchedData.id}}</div -->
            <div><img :src="config.public.imageServer + searchedData.id + imageExtension" /></div>
            <div><button  class="link-button" @click="gotoMap(searchedData.location.latitude,searchedData.location.longitude)">{{ searchedData.description }}</button></div>
        </div> 
    </div>
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

const checkCountry = ref(true);
const checkWord = ref(false);


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
.link-button {

    background: none;
    border: none;
    color: blue;
    text-decoration: none;
    cursor: pointer;
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
</style>
