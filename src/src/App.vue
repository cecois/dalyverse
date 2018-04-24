<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

window.map = new L.Map('map', {
  zoomControl: false,
  center: [51.505, -0.09],
  attributionControl: false,
  zoom: 2
});


var baseLayer = new L.TileLayer("https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png")

map.addLayer(baseLayer);


export default {
  name: 'app'
}
</script>

<style>
#map {
  width:100%;
  height:80%;
  position:relative;
  top:20%;
}
#app {
  height:20%;
  top:0;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height:33%;
}
</style>
