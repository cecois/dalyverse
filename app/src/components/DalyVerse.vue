<template>
  <div class="">
    <!-- <mdi-emoticon-devil-icon  /> Dalyverse -->
<nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <span class="navbar-item" v-for="nav in navs"><a :id="nav.nom" v-on:click="swap" :class="nav.active">
        {{ nav.nom }}
      </a></span>
  </div>
</nav>

<div class="columns daly-content-columns">

<div class="column">timeline-controlled-column</div>


  </div>
  <!-- ./columns -->

<div class="columns daly-timeline-columns">

<div class="column text-is-centered is-size-4">control-timeline-column</div>

  </div>
  <!-- ./columns -->


  </div>
  <!-- /root -->
</template>

<script>
export default {
  name: 'DalyVerse',
  created: function () {var mess ="dalyverse";this.msg=mess.toUpperCase()},
  data () {
    return {
      result:null,
      msg: 'This is dalyverse',
      OBJ:{
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [0,0]
    },
    "properties": {
      "name": null,
      "anno": null,
      "confidence": null,
      "scnotes": "nominatim via milleria geocoder",
      "created_at": "2018-01-17T21:42:38Z",
      "updated_at": "2018-01-17T21:42:38Z",
      "cartodb_id": null
    }
  },
      incoming:null,
      navs:[
      {nom:'Home',active:"is-active"}
      ,{nom:'About',active:null}
      ]
    }
  }
  ,methods: {
    taketh: function(){
      var el = $(event.target)
$(el).addClass("has-text-danger")
var self = this;

$.ajax({
  type: 'POST',
  url: 'http://localhost:8080/geocode/submit/cbb',
  data: self.OBJ,
  dataType: 'json',
  beforeSend: function(el){$('.bt').addClass("has-text-danger")},
success: function(data){
var pat = null;
        switch (data.response[0].geometry.type.toLowerCase()) {
          case 'point':
          pat='point'
          break;
          case 'polygon':
          pat='poly'
          break;
          case 'multipolygon':
          pat='poly'
          break;
          case 'linestring':
          pat='line'
          break;
          case 'multilinestring':
          pat='line'
          break;
          default:
              pat=null
              break;
            }

                  var paste="\"location_type\": \""+pat+"\",\"location_id\": \""+data.response[0].properties.cartodb_id+"\","
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
        return {color: "pink"};
    }
    ,popu:function(event){this.pop="hello frm popu"}
    ,swap: function (event){
      // `this` inside methods points to the Vue instance
      this.projects=__.map(this.projects,(p)=>{if(p.nom==event.target.id){p.active="is-active"}else{p.active=null}return p})
      // console.log(this.$data.projects)
      // `event` is the native DOM event
      // if (event) {
      //   alert(event.target.tagName)
      // }
    }
    ,jeakod: function(event){

  $(event.target.parentElement).addClass("is-loading")

  if(typeof JkGroup == 'undefined'){
    var JkGroup = new L.featureGroup().addTo(map);
  } else {
  JkGroup.clearLayers()
}
  var style = this.STYLE();
  
  var self = this;
  $.get('http://localhost:8080/geocode/'+this.incoming,function(data){

$(event.target.parentElement).removeClass("is-loading")

L.geoJSON(data, {
    style: style
}).bindPopup(function(layer){
    return "<div>name: "+layer.feature.properties.name+"</div>"

}).on('popupopen',function(layer){
  console.log("layer:");
  console.log(layer);

self.OBJ.properties=layer.layer.feature.properties
self.OBJ.geometry=layer.layer.feature.geometry

})
.addTo(JkGroup);
map.fitBounds(JkGroup.getBounds())
  })//.get

//   var D = $.getJSON('http://localhost:8080/geocode/'+this.incoming,function(json) {
//     return json
//         });



    }
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
