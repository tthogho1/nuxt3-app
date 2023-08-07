import { ref } from "vue";
import { defineStore } from "pinia";
import { accessTokenObj } from "~/pages/def/webCam";

export const useTokenDataStore = defineStore("tokenStore",{
  state:() => {

    return { accessToken:"",getTime :""} as accessTokenObj;
  },
  actions: {
    setAccessToken(token:accessTokenObj) {
      this.accessToken = token.accessToken; 
      this.getTime = token.getTime;
    },
  },
});
