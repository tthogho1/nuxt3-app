<template>
    <div  class="container-fluid">
    <div class="header row">
        <div class="col-8" >
            <img src="/images/logo.svg" style="height:70px">
        </div>
            <div class="col-1">
        <nuxt-link to="/">map</nuxt-link>
        </div>
        <div class="col-1">
            <nuxt-link to="/search">search</nuxt-link>
        </div>
    </div>
    </div>
</template>

<style>
.header{
    background-color:ghostwhite;
    color: black;
    display:flex;
    gap:1%;
    font-size: large;
    align-items: center;
}
</style>