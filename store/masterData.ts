import { ref } from "vue";
import { defineStore } from "pinia";

export const useMasterDataStore = defineStore("masterdata",{
  state:() => {
    return { coutrycodes: [] as string[]}
  },
});
