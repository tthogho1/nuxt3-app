import { defineStore } from "pinia";
import { countryData } from "~/pages/def/country";

export const useMasterDataStore = defineStore("masterdata",{
  state:() => {
    return { countries: [] as countryData[]}
  },
});
