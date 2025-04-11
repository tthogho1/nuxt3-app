<template>
    <div class="container-fluid px-0">
      <div class="col-10 row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
        <!-- Webcamsのリスト表示 -->
        <div v-for="webcam in webcams" :key="webcam.webcamid">
          <div>
            <img :src="getImageUrl(webcam.webcamid)" alt="Webcam image" />
          </div>
          <div>
            <button class="link-button" @click="gotoMap(webcam.location.latitude, webcam.location.longitude)">
              {{ webcam.title }}
            </button>
          </div>
        </div>
        
        <!-- 検索結果のリスト表示 -->
        <div v-for="searchedData in searchedDataArray" :key="searchedData.id">
          <div>
            <img :src="getImageUrl(searchedData.id)" alt="Searched data image" />
          </div>
          <div>
            <button class="link-button" @click="gotoMap(searchedData.location.latitude, searchedData.location.longitude)">
              {{ searchedData.description }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useRuntimeConfig } from 'nuxt/app'; // Nuxtを使用している場合
  
  // プロパティの定義
  const props = defineProps({
    webcams: {
      type: Array,
      default: () => []
    },
    searchedDataArray: {
      type: Array,
      default: () => []
    },
    imageExtension: {
      type: String,
      default: '.jpg'
    }
  });
  
  // 設定の取得
  const config = useRuntimeConfig();
  
  // 画像URLの生成関数
  const getImageUrl = (id) => {
    return config.public.imageServer + id + props.imageExtension;
  };
  
  // マップ移動関数
  const gotoMap = (latitude, longitude) => {
    // マップ移動の実装
    // 必要に応じて emit を使用して親コンポーネントにイベントを通知
    emit('mapMove', { latitude, longitude });
  };
  
  // イベントの定義
  const emit = defineEmits(['mapMove']);
  </script>
  
  <style scoped>
  .link-button {
    background: none;
    border: none;
    color: blue;
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
    font: inherit;
  }
  </style>