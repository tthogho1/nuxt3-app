<template>
    <div  class="container-fluid">
        <div class="header row">
            <div class="col-4 col-md-8" >
                <img src="/images/logo.svg" style="height:70px">
            </div>
            <div class="col-2 col-md-1">
                <nuxt-link to="/"  :class="{'disabled-link' : isLinkEnabledMap }" >map</nuxt-link>
            </div>
            <div class="col-2 col-md-1">
                <nuxt-link to="/search"  :class="{'disabled-link' : !isLinkEnabledMap }" >search</nuxt-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: String,
});
// get event
const title = ref('Nuxt Google Maps');
const isLinkEnabledMap = props.title === 'map' ? true : false;

// below code is not working
const head = () => {
    return {
        title: title.value,
        meta: [
            { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
        ]
    }
}
//}
</script>

<style>
.header{
    background-color:ghostwhite;
    color: black;
    display:flex;
    gap:1%;
    font-size: large;
    align-items: center;
}

.disabled-link {
    pointer-events: none;
    opacity: 0.5;
  }


</style>