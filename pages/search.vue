<template>
<Header class="header" />    
<div class="container-fluid">
    <div class="row">
        <div class="col-2"><label for="selectCode">Country Code</label></div>
        <div class="col-6">
        <select id="selectCode" v-model="countryCd">
            <option v-for="countryData in masterdata.countries" :key="countryData.country_code" :value="countryData.country_code">
                {{ countryData.country }}
            </option>
        </select>
        </div>
        <div class="col-3">
        <button type="button" class="btn btn-primary" v-on:click="searChByCountry()">Search </button>
        </div>
        <div class="col-1">
        </div>
    </div>
    <div class="row" style="width:80%;">
        <input class="col-9" type="text" v-model="searchText">
        <div class="col-1"></div>
        <button type="button" id="next" class="col-2" v-on:click="searChByText()">search</button>
    </div>
    <div class="row" style="width:80%;">
        <button type="button" id="prev" class="col-1 link-button" v-on:click="prevWebCamList()">Prev</button>
        <button type="button" id="next" class="col-1 link-button" v-on:click="nextWebCamList()">Next</button>
        <label class="col-6"></label>
        <div class="col-1">{{searchCount}} 件</div>
    </div>
    <div class="row" style="width:80%">
        <div class="card col-2 text-center bg-secondary">ID</div>
        <div class="card col-3 text-center bg-secondary">ThumbNail</div>
        <div class="card col-4 text-center bg-secondary">TiTle</div>
    </div>
    <div class="row" v-for="webcam in webCams" :key="webcam.id" style="width:80%">
        <div class="col-2">{{webcam.id  }}</div>
        <div class="col-3"><img :src="webcam.image.current.thumbnail" /></div>
        <div class="col-4" ><button  class="link-button" @click="gotoMap(webcam.location.latitude,webcam.location.longitude)">{{ webcam.title }}</button></div>
    </div> 
    <div class="row" v-for="searchedData in searchedDataArray" :key="searchedData.id" style="width:80%">
        <div class="col-2">{{searchedData.id}}</div>
        <div class="col-3"><img :src="searchedData.metadata.imgUrl" /></div>
        <div class="col-4" ><button  class="link-button" @click="gotoMap(searchedData.metadata.latitude,searchedData.metadata.longitude)">{{ searchedData.metadata.title }}</button></div>
    </div>  
</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import * as Realm from "realm-web";
import { useMasterDataStore } from "../store/masterData";
import { useTokenDataStore } from "../store/accessToken";
import { webCamObj,webCamQuery } from "./def/webCam";
import { NavigationFailureType, useRouter } from 'vue-router'
import { getWebCams } from "../composables/getWebCams";
import type { searchedObj } from "./def/searchedData";
import { serialize } from "mongodb";
import {getCountryData} from "../composables/getCountryData";
import type {countryData} from "../pages/def/country"

const searchText = ref("")
const searchedDataArray = ref<Array<searchedObj>>([]);

const tokenStore = useTokenDataStore();
const token = 'Bearer ' + tokenStore.accessToken;

const  countryCd = ref('')

const app = new Realm.App({ id: "webcamql-qrkjj"});

const webCams = ref<Array<webCamObj>>([]);    
const firstId = ref("");
const lastId = ref("") ;
const searchCount = ref(0);
const searchStartId = ref("");

const router = useRouter();

/*const loginApiKey = async function(apiKey : string) {
    const credentials = Realm.Credentials.apiKey(apiKey);
    const user = await app.logIn(credentials);
    
    return user;
}*/

const masterdata = useMasterDataStore();
if (masterdata.countries.length === 0 ){

    //const user = await loginApiKey("zltDLjGDHqJHzQ0tSHA3XSZJUTnV5TxBmjW2PopKInszFsDxqSAEubmtq5tRRLgm");
    //const countyCodes = await user.functions.getCountryCode();

    const countries = await getCountryData();
    console.log("get country data " + countries);
    masterdata.countries = countries;
}

async function doSearch(queryMsg:string){
    try {

        webCams.value = await getWebCams(token,queryMsg);
        firstId.value = webCams.value[0].id;
        lastId.value = webCams.value.slice(-1)[0].id;

        searchCount.value = webCams.value.length;
        
        const next = document.getElementById("next") as HTMLButtonElement;
        const prev = document.getElementById("prev") as HTMLButtonElement ;
        if (webCams.value.length >= 200 ){
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
        searchCount.value = 0;
    }

}

const searChByCountry = async function () {
    searchedDataArray.value =[];

    const queryMsg = `query {
        webcams(query:{status:"active",
                        id_gt:"0000000000",
                        location:{
                        country_code:"${countryCd.value}"}
                    }
        ,limit:200
        ,sortBy:ID_ASC)` + 
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
                        id_gt:"${lastId.value}",
                        location:{
                        country_code:"${countryCd.value}"}
                    }
        ,limit:200
        ,sortBy:ID_ASC)` + 
        webCamQuery +
	`}`;

    doSearch(queryMsg);
}

const prevWebCamList = async function(){
    const queryMsg = `query {
        webcams(query:{status:"active",
                        id_lt:"${firstId.value}",
                        location:{
                        country_code:"${countryCd.value}"}
                    }
        ,limit:200
        ,sortBy:ID_ASC)` + 
        webCamQuery +
	`}`;

    doSearch(queryMsg);
}

const gotoMap = function(latitude:number, longitude:number) {
    router.push({path:'/', query:{ lat:latitude , lng:longitude }});
}

const searChByText = async function() {
    webCams.value = [];

    const response = await 	fetch('https://eitj2rd7kzy2rkcf7ciws5moy40jezcu.lambda-url.ap-northeast-1.on.aws/', {
        method: 'POST',
        headers: {
			'Authorization': token  ,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: searchText.value
        })
	})

    if ((response.status >= 400)) {
        throw new Error('searCghByText error');
    }

    const data = await response.json();
    searchedDataArray.value = data.data;
    searchCount.value = data.data.length;
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
</style>
