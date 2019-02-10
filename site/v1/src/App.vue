<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view/>
    <!-- <link rel="stylesheet" href="//cdn.materialdesignicons.com/2.0.46/css/materialdesignicons.min.css"> -->
  </div>
</template>

<script>

window.map = new L.Map('map', {
  zoomControl: false,
  center: [41.12410774245512, -41.6872787475586],
  attributionControl: false,
  zoom: 3
})

const blu = (process.env.MODE === 'T') ? 'http://localhost:8000/2x.png' : 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png'
const baseLayer = new L.TileLayer(blu)

map.addLayer(baseLayer)

export default {
  name: 'App'
}
</script>

<style>
  @import './assets/style.css';
</style>
