<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view/>
    <!-- <link rel="stylesheet" href="//cdn.materialdesignicons.com/2.0.46/css/materialdesignicons.min.css"> -->
  </div>
</template>

<script>

window.MAP = new L.Map('map', {
  zoomControl: false,
  center: [41.12410774245512, -41.6872787475586],
  attributionControl: false,
  zoom: 3
})

// const blu = (process.env.MODE === 'T') ? 'http://localhost:8000/2x.png' : 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png'

let blu=null;
switch (process.env.MODE) {
  case 'L':
    blu ='http://mapproxy.libgeo2.llan.ll.mit.edu/wmts/l_mapbox_amazonia_grey/webmercator/{z}/{x}/{y}.png'
    break;
  case '33':
  blu = 'https://cartocdn_a.global.ssl.fastly.net/base-flatblue/{z}/{x}/{y}.png'
  // blu ='https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png'
  break;
  default:
  blu ='http://localhost:8000/2x.png'
    break;
}

const baseLayer = new L.TileLayer(blu)

MAP.addLayer(baseLayer)

export default {
  name: 'App'
}
</script>

<style>
  @import './assets/style.css';
</style>
