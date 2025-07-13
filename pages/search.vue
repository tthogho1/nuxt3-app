<template>
  <div id="app">
    <Header title="search" />
    <div class="loading" v-if="loading"><img src="/images/loading.gif" alt="" /></div>
    <div class="container-fluid my-2">
      <div class="row justify-content-center text-center">
        <div class="col-12 fs-3 mb-4">Search Web Cameras</div>
        <div class="col-12 col-md-4 mb-3">
          <div class="btn-group w-100" role="group" aria-label="Basic radio toggle button group">
            <input
              type="radio"
              class="btn-check"
              id="radio1"
              name="selectOption"
              v-model="selectedOption"
              value="country"
              autocomplete="off"
            />
            <label class="btn btn-outline-dark" for="radio1">Country</label>

            <input
              type="radio"
              class="btn-check"
              id="radio2"
              name="selectOption"
              v-model="selectedOption"
              value="word"
              autocomplete="off"
            />
            <label class="btn btn-outline-dark" for="radio2">Text</label>
          </div>
        </div>
      </div>
      <div v-if="selectedOption === 'country'" class="row justify-content-center text-center my-2">
        <div class="col-7">
          <div class="custom-select">
            <input
              class="fs-5"
              type="text"
              list="selectCode"
              placeholder="Select Country"
              v-model="countryCd"
              @change="searChByCountry()"
            />
            <datalist id="selectCode">
              <option
                v-for="countryData in masterdata.countries"
                :key="countryData.country_code"
                :value="countryData.country"
              ></option>
            </datalist>
          </div>
        </div>
      </div>
      <div v-if="selectedOption === 'word'">
        <div class="search-container">
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-12">
                <div class="search-wrapper d-flex align-items-center px-3 py-1">
                  <input
                    type="text"
                    v-model="searchText"
                    class="form-control border-0"
                    placeholder="Enter text for image search"
                  />
                  <button class="btn btn-search" type="button" @click="searChByText()">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      class="bi bi-search"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex align-items-center my-2">
          <div class="fw-bold">image count</div>
          <div class="col-1 ms-2">
            <input
              type="number"
              class="text-center"
              v-model="imageCount"
              :min="1"
              :max="99"
              style="margin-left: 1%; width: 100%"
            />
          </div>
        </div>
      </div>
      <div
        v-show="hasSearched && selectedOption === 'country'"
        class="row my-2 justify-content-center text-center"
        style="width: 100%; margin-left: 2%"
      >
        <button
          type="button"
          id="prev"
          class="col-1 link-button"
          v-on:click="prevWebCamList()"
          disabled
        >
          <i class="bi bi-chevron-double-left"></i>
        </button>
        <button
          type="button"
          id="next"
          class="col-1 link-button"
          v-on:click="nextWebCamList()"
          disabled
        >
          <i class="bi bi-chevron-double-right"></i>
        </button>
      </div>
      <WebcamGallery
        :webcams="webCams"
        :searchedDataArray="searchedDataArray"
        :imageExtension="imageExtension"
        @mapMove="handleMapMove"
      />
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import * as Realm from 'realm-web';
import { useMasterDataStore } from '../store/masterData';
import { useTokenDataStore } from '../store/accessToken';
import type { webCamObj, webCamMetadata, location } from '../type/webCam';
import { webCamQueryV2 } from '../type/webCam';
import { NavigationFailureType, useRouter } from 'vue-router';
import WebcamGallery from '@/components/WebcamGallery.vue';

//import type { metalWebCamObj } from "../type/searchedData";
import type { countryData } from '../type/country';

const imageExtension = '.jpg';
const searchText = ref('');
const searchedDataArray = ref<Array<webCamMetadata>>([]);

const selectedOption = ref('country');

const countryCd = ref('');
const imageCount = ref(5);

const webCams = ref<Array<webCamObj>>([]);
const firstId = ref('');
const lastId = ref('');
const searchCount = ref(0);
const searchStartId = ref('');
const hasSearched = ref(false);

const router = useRouter();
const maxSearchCount = 100;

const loading = ref(false);

const config = useRuntimeConfig();
const masterdata = useMasterDataStore();
// get toke from .env NUXT_MONGODB_KEY
const TOKEN = config.public.mongodbKey;

if (masterdata.countries.length === 0) {
  const countries = await getCountryByGQL(TOKEN);
  masterdata.countries = countries;
}

async function doSearch(queryMsg: string) {
  try {
    loading.value = true;
    hasSearched.value = true; // 検索実行フラグを立てる

    // データ取得と基本値の設定
    //webCams.value = await getWebCamsByApi(queryMsg);
    webCams.value = await getWebCamsByApiV2(queryMsg);
    updateIdValues();
    searchCount.value = webCams.value.length;

    // ページネーションボタンの状態更新
    updatePaginationButtons();
  } catch (error) {
    console.log(error);
    alert(error);
    searchCount.value = 0;
  } finally {
    loading.value = false;
  }
}

// ID値の更新を処理する関数
function updateIdValues() {
  if (webCams.value.length > 0) {
    firstId.value = webCams.value[0].webcamid.toString();
    lastId.value = webCams.value[webCams.value.length - 1].webcamid.toString();
  }
}

// ページネーションボタンの状態を更新する関数
function updatePaginationButtons() {
  const next = document.getElementById('next') as HTMLButtonElement;
  const prev = document.getElementById('prev') as HTMLButtonElement;

  // 次へボタンの状態設定
  const hasMoreResults = webCams.value.length >= maxSearchCount;
  next.disabled = !hasMoreResults;
  next.style.textDecoration = hasMoreResults ? 'underline' : 'none';

  // 前へボタンの状態設定
  const isFirstPage = searchStartId.value === firstId.value;
  prev.disabled = isFirstPage;
  prev.style.textDecoration = isFirstPage ? 'none' : 'underline';
}

const searChByCountry = async function () {
  // webCams
  if (countryCd.value == '') {
    webCams.value = [];
    return;
  }

  searchedDataArray.value = [];

  const queryMsg =
    `query {
        webcam(
          order_by: {
            webcam: {
              webcamid: asc
            }
          }
          limit: ${maxSearchCount}
          where: {
            webcam: {
              status: { _eq: "active" }
              location: {
                country: { _eq: "${countryCd.value}" }
              }
              webcamid: { _gt: 1000000000 }
            }
          }
      )` +
    webCamQueryV2 +
    `}`;

  await doSearch(queryMsg);

  searchStartId.value = firstId.value;
  (document.getElementById('prev') as HTMLButtonElement).disabled = true;
  (document.getElementById('prev') as HTMLButtonElement).style.textDecoration = 'none';
};

const nextWebCamList = () => getWebCamList('next');
const prevWebCamList = () => getWebCamList('prev');

const getWebCamList = async function (direction = 'next') {
  const condition =
    direction === 'next' ? `webcamid:{_gt: ${lastId.value}}` : `webcamid:{_lt : ${firstId.value}}`;

  const queryMsg =
    `query {
        webcam(
          order_by: {
            webcam: {
              webcamid: asc
            }
          }
          limit: ${maxSearchCount}
          where: {
            webcam: {
              status: { _eq: "active" }
              location: {
                country: { _eq: "${countryCd.value}" }
              }
              ${condition}
            }
          }
      )` +
    webCamQueryV2 +
    `}`;

  await doSearch(queryMsg);
};

const handleMapMove = ({ latitude, longitude }: location) => {
  router.push({ path: '/', query: { lat: latitude, lng: longitude } });
};

const searChByText = async function () {
  webCams.value = [];

  if (imageCount.value < 1 || imageCount.value > 100) {
    alert('image Count value must be between 1 and 100');
    return;
  }

  loading.value = true;
  try {
    const response = await fetch('api/searchWebCamByText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        count: imageCount.value,
        query: searchText.value,
      }),
    });

    if (response.status >= 400) {
      //throw new Error('searCghByText error');
      alert('get request Error :' + response.status);
      return;
    }

    const res = await response.json();
    const data = JSON.parse(res.body);

    console.log(data);
    searchedDataArray.value = data;
    searchCount.value = data.length;
  } catch (e) {
    alert('script Error on searCghByText');
    console.log(e);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.custom-select {
  position: relative;
  width: 100%;
}

.custom-select::after {
  content: '\25BC';
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
  z-index: 100;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.8);
  text-align: center;
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

.search-container {
  background-color: #6c5ce7;
  padding: 10px 0;
}
.search-wrapper {
  background-color: white;
  border-radius: 25px;
}
.form-control {
  border: none;
  box-shadow: none;
  background: transparent;
}
.form-control:focus {
  box-shadow: none;
  border: none;
}
.btn-search {
  border: none;
  background: transparent;
}
</style>
