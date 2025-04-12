<template>
    <div class="container-fluid px-0 d-flex justify-content-center">
      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3 justify-content-center" style="max-width: 1200px;">
        <!-- Webcamsのリスト表示 -->
        <div class="col" v-for="webcam in webcams" :key="webcam.webcamid">
          <div class="card h-100">
            <div>
              <img class="card-img-top" :src="getImageUrl(webcam.webcamid)" alt="Webcam image" />
            </div>
            <div class="card-body">
              <button class="link-button" @click="gotoMap(webcam.location.latitude, webcam.location.longitude)">
                {{ webcam.title }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- 検索結果のリスト表示 -->
        <div class="col" v-for="searchedData in searchedDataArray" :key="searchedData.id">
          <div class="card h-100">
            <div>
              <img class="card-img-top" :src="getImageUrl(searchedData.id)" alt="Searched data image" />
            </div>
            <div class="card-body">  
              <button class="link-button" @click="gotoMap(searchedData.location.latitude, searchedData.location.longitude)">
                {{ searchedData.description }}
              </button>
            </div>
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

  .card {
  transition: transform 0.3s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}
  </style>