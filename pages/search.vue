<template>
<Header  />
<div class="loading" v-if="loading"><img src="/images/loading.gif" alt=""/></div>    
<div class="container-fluid">
    <div class="row" style="margin-top:2%">
        <div class="col-2 fw-bold"><label class="form-label" for="selectCode">Select Country</label></div>
        <div class="col-8">
            <input type="text" list="selectCode" placeholder="Select Country" style="width:60%" v-model="countryCd"/>
            <datalist id="selectCode">
                <option v-for="countryData in masterdata.countries" :key="countryData.country_code" :value="countryData.country"></option>
            </datalist>
        </div>
        <div class="col-2">
            <button type="button" class="" v-on:click="searChByCountry()">Search </button>
        </div>
    </div>
    <div class="row" style="margin-top:1%">
        <div class="col-2 fw-bold">Search by Word</div>
        <div class="col-8">
            <input  type="text" v-model="searchText" style="width:100%"/>
        </div>
        <div class="col-2">
            <button type="button"  v-on:click="searChByText()">Search</button>
        </div>
    </div>
    <div class="row" style="width:100%;margin-top:2%;margin-left:2%">
        <button type="button" id="prev" class="col-1 link-button" v-on:click="prevWebCamList()">Prev</button>
        <button type="button" id="next" class="col-1 link-button" v-on:click="nextWebCamList()">Next</button>
        <label class="col-6"></label>
        <div class="col-1">count: {{searchCount}} </div>
    </div>
    <div class="row" style="font-weight:bold;margin-left:2%">
        <div class="col-2 text-center" style="background:cornflowerblue;" >ID</div>
        <div class="col-3 text-center" style="background:cornflowerblue;">ThumbNail</div>
        <div class="col-5 text-center" style="background:cornflowerblue;">TiTle</div>
        <div class="col-2"> </div>
    </div>
    <div class="row" v-for="webcam in webCams" :key="webcam.id" style="width:80%;margin-left:2%">
        <div class="col-2">{{webcam.id  }}</div>
        <div class="col-3"><img :src="webcam.image.current.thumbnail" /></div>
        <div class="col-4" ><button  class="link-button" @click="gotoMap(webcam.location.latitude,webcam.location.longitude)">{{ webcam.title }}</button></div>
    </div> 
    <div class="row" v-for="searchedData in searchedDataArray" :key="searchedData.id" style="width:80%;margin-left:2%">
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
import { webCamObj,webCamQuery,metalImageObj } from "../type/webCam";
import { NavigationFailureType, useRouter } from 'vue-router'

//import type { metalWebCamObj } from "../type/searchedData";
import type {countryData} from "../type/country"

const searchText = ref("")
const searchedDataArray = ref<Array<metalImageObj>>([]);

const  countryCd = ref('')

const webCams = ref<Array<webCamObj>>([]);    
const firstId = ref("");
const lastId = ref("") ;
const searchCount = ref(0);
const searchStartId = ref("");

const router = useRouter();
const maxSearchCount = 100;

const loading = ref(false);

/*const loginApiKey = async function(apiKey : string) {
    const credentials = Realm.Credentials.apiKey(apiKey);
    const user = await app.logIn(credentials);
    
    return user;
}*/

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
        firstId.value = webCams.value[0].id;
        lastId.value = webCams.value.slice(-1)[0].id;

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
        searchCount.value = 0;
    }
    loading.value = false;

}

const searChByCountry = async function () {
    searchedDataArray.value =[];

    const queryMsg = `query {
        webcams(query:{status:"active",
                        id_gt:"0000000000",
                        location:{
                        country:"${countryCd.value}"}
                    }
        ,limit:${maxSearchCount}
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
                        country:"${countryCd.value}"}
                    }
        ,limit:${maxSearchCount}
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
                        country:"${countryCd.value}"}
                    }
        ,limit:${maxSearchCount}
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

    loading.value = true;
    try {
        const response = await 	fetch('api/searchWebCamByText', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: searchText.value
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
