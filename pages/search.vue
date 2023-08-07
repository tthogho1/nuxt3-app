<template>
<Header class="header" />    
<div class="container-fluid">
    <div class="row">
        <div class="col-2"><label for="selectCode">Country Code</label></div>
        <div class="col-2">
        <select id="selectCode" v-model="countryCd">
            <option v-for="code in masterdata.coutrycodes" :key="code" :value="code">
                {{ code }}
            </option>
        </select>
        </div>
        <div class="col-2">            
        </div>
        <div class="col-3">
        <button type="button" class="btn btn-primary" v-on:click="searChByCountry()">Search </button>
        </div>
        <div class="col-3">
        </div>
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
        <div class="col-4" ><button  class="link-button" @click="gotoMap(webcam)">{{ webcam.title }}</button></div>
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
import { NonMaxSuppressionV3 } from "@tensorflow/tfjs";

const tokenStore = useTokenDataStore();
const token = 'Bearer ' + tokenStore.accessToken;

// console.log("token?:" + tokenStore.accessToken);

const  countryCd = ref('')

const app = new Realm.App({ id: "webcamql-qrkjj"});

const webCams = ref<Array<webCamObj>>([]);    
const firstId = ref("");
const lastId = ref("") ;
const searchCount = ref(0);
const searchStartId = ref("");


const router = useRouter();

const loginApiKey = async function(apiKey : string) {
    const credentials = Realm.Credentials.apiKey(apiKey);
    const user = await app.logIn(credentials);
    
    return user;
}

const masterdata = useMasterDataStore();
if (masterdata.coutrycodes.length === 0 ){
    const user = await loginApiKey("zltDLjGDHqJHzQ0tSHA3XSZJUTnV5TxBmjW2PopKInszFsDxqSAEubmtq5tRRLgm");
    const countyCodes = await user.functions.getCountryCode();

    console.log("get country code " + countyCodes.length);
    masterdata.coutrycodes = countyCodes;
}

async function doSearch(queryMsg:string){
    try {

        webCams.value = await getWebCams(token,queryMsg);
        firstId.value = webCams.value[0].id;
        lastId.value = webCams.value.slice(-1)[0].id;

        searchCount.value = webCams.value.length;
        const next = document.getElementById("next");
        const prev = document.getElementById("prev");
        if (!next || !prev){
            throw new Error("html error");
            
        }
        if (webCams.value.length >= 200 ){
            next.setAttribute("disabled", "false");
            next.style.textDecoration = "underline";
        }else{
            next.setAttribute("disabled", "true");
            next.style.textDecoration = "none";
        }

        if (searchStartId.value == firstId.value){
            prev.setAttribute("disabled", "true");
            prev.style.textDecoration = "none";
        }else{
            prev.setAttribute("disabled", "false");
            prev.style.textDecoration = "underline"
        }

    } catch (error) {
        searchCount.value = 0;
    }

}

const searChByCountry = async function () {

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
    document.getElementById("prev").disabled= true;
    document.getElementById("prev").style.textDecoration = "none";

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

const gotoMap = function(webcam:webCamObj) {
    router.push({path:'/', query:{ lat:webcam.location.latitude , lng:webcam.location.longitude }});
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
