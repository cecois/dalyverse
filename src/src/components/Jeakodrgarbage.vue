<template>
  <div class="">
<nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <span style="font-weight:800;font-size:1.3em;" class="navbar-item has-text-info">
     {{msg}}
    </span>
  </div>
</nav>

<nav class="navbar">
      <!-- <div class="field navbar-item">
  <div class="control has-icons-left has-icons-right">
    <input v-on:keyup.enter="jeakod" v-model="incoming" class="input is-large" type="text" placeholder="">
  </div>
</div> -->
<!-- /field -->

    <div class="field navbar-item is-expanded">
      <input class="input is-large" v-model="OBJ.properties.body" placeholder="body">
      <!-- <input class="input is-large" v-model="OBJ.properties.anno" placeholder="anno"> -->
        <span v-on:click="taketh" class="icon is-right has-text-info">
<i class="fas fa-3x fa-play-circle bt"></i>
    </span>
    </div>
    
<div v-model="OBJ" class="navbar-item is-expanded">
  <table class="table is-fullwidth">
    <tr><pre>{{OBJ.properties.body}}</pre></tr>
    <tr><pre>{{OBJ.geometry.coordinates}}</pre></tr>
  </table>
</div>

<div class="modal">
  <div class="modal-background"></div>
  <div class="modal-content">
<pre>{{result}}</pre>
  </div>
  <button class="modal-close is-large" aria-label="close"></button>
</div>

<!--
-->
</nav><!-- /columns -->


  </div>
</template>

<script>
export default {
  name: 'Jeakodrgarbage',
  created:function(){

if(typeof ExtantGroup == 'undefined'){
    var ExtantGroup = new L.featureGroup().addTo(map);
  } else {
  ExtantGroup.clearLayers()
}

if(typeof NewGroup == 'undefined'){
    var NewGroup = new L.featureGroup().addTo(map);
  } else {
  NewGroup.clearLayers()
}

  var self = this;
  
  $.get('http://localhost:8080/geoms/garbage?q=null',function(data){

L.geoJSON(data, {
    pointToLayer: function(feature, latlng) {

      var brown = "#672014"
      var blue = "#23a5a2"

  var stile = (feature.properties.class=='RT')?{
  radius:4,color:"white"
  ,fillColor:blue
  ,fillOpacity:.8
}:{
  radius:4,color:"#ae601f"
  ,fillColor:brown
  ,fillOpacity:.5
}
              return L.circleMarker(latlng, stile);
            }
}).bindPopup(function(layer){
  console.log(layer.feature)
    return "<h4 class='is-size-4'>"+layer.feature.properties.body+"</h4>"

}).on('popupopen',function(layer){
  // console.log(JSON.stringify(that.OBJ));

// self.OBJ.properties=layer.layer.feature.properties
// self.OBJ.geometry=layer.layer.feature.geometry

})
.addTo(ExtantGroup);
map.fitBounds(ExtantGroup.getBounds())
  })//.get

map.on('click',(e)=>{
  NewGroup.clearLayers()
var coords = [parseFloat(e.latlng.lng),parseFloat(e.latlng.lat)]
self.OBJ.geometry.coordinates=coords
// self.OBJ.properties.name="new name"
// self.OBJ.geometry=layer.layer.feature.geometry
L.circleMarker(L.latLng(coords[1], coords[0]), {color:'pink'})
.addTo(NewGroup)
})//on.click
    

  },
  data () {
    return {
      result:null,
      msg: 'This is jeakodr.GARBAGE',
      OBJ:{
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [0,0]
    },
    "properties": {
      "created_at": "2018-01-17T21:42:38Z",
      "updated_at": "2018-01-17T21:42:38Z",
    }
  },
      incoming:null,
      projects:[{nom:'GARBAGE',active:"is-active"}]
    }
  }
  ,methods: {
    taketh: function(){
      var el = $(event.target)
$(el).addClass("has-text-danger")
var self = this;

$.ajax({
  type: 'POST',
  url: 'http://localhost:8080/geocode/submit/garbage',
  data: self.OBJ,
  dataType: 'json',
  beforeSend: function(el){$('.bt').addClass("has-text-danger")},
success: function(data){

                  var paste=data
                self.result=paste

                $(".modal").addClass("is-active")
              }
            })
.fail((err,el)=>{
    
    $(el).removeClass("has-text-danger")
})
.done((unk,el)=>{
    $(el).removeClass("has-text-danger")
  })

    },
    STYLE: function(){
        return {color: "aqua"};
    }
    ,popu:function(event){this.pop="hello frm popu"}
    ,swap: function (event){
      this.projects=__.map(this.projects,(p)=>{if(p.nom==event.target.id){p.active="is-active"}else{p.active=null}return p})
    }
    ,jeakod: function(event){}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

nav{
  z-index:1;
}

.columns{
  z-index:2;
}

.bt:hover{  
cursor:pointer;
}

h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
a.is-active{font-weight:800;}
</style>
