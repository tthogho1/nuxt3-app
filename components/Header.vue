<template>
    <div  class="container-fluid">
        <div class="header row">
            <div class="col-12 d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                  <div>
                    <img src="/images/logo.png" style="height:35px">
                  </div>
                </div>
                <div class="d-flex">
                  <div>
                    <img src="/images/world.png" style="height:25px">
                  </div>
                  <div class="ms-1">
                    <nuxt-link to="/" :class="['hover-underline', {'disabled-link': isLinkEnabledMap}]">View Map</nuxt-link>
                  </div>
                  <div class="ms-1">
                    <img src="/images/sdesign_00182.png" style="height:30px">
                  </div>
                  <div class="ms-1">
                    <nuxt-link to="/search" :class="['hover-underline', {'disabled-link': !isLinkEnabledMap}]">Advanced Search</nuxt-link>
                  </div>
                </div>
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

.hover-underline {
    text-decoration: none;
    position: relative;
    font-size:smaller;
}

.hover-underline::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    bottom: 0;
    left: 0;
    background-color: currentColor;
    transform: scaleX(0);
    transition: transform 0.3s ease-in-out;
}

.hover-underline:hover::after {
    transform: scaleX(1);
}

.disabled-link {
    pointer-events: none;
    opacity: 0.3;
  }


</style>