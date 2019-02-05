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
  center: [51.505, -0.09],
  attributionControl: false,
  zoom: 2
});

let blu = (process.env.MODE=='T')?"http://localhost:8000/2x.png":"https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png";
var baseLayer = new L.TileLayer(blu)

map.addLayer(baseLayer);

export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color:rgba(255,255,255,.5);
}
</style>
