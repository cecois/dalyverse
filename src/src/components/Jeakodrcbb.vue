<template>
  <div class="">
<nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <span class="navbar-item" v-for="project in projects"><a :id="project.nom" v-on:click="swap" :class="project.active">
        {{ msg }}
      </a></span>
  </div>
</nav>

<nav class="navbar">
      <div class="field navbar-item">
  <div class="control has-icons-left has-icons-right">
    <input v-on:keyup.enter="jeakod" v-model="incoming" class="input is-large" type="text" placeholder="">
  </div>
</div><!-- /field -->

    <div class="field navbar-item">
      <input class="input is-large" v-model="OBJ.properties.name" placeholder="name">
      <input class="input is-large" v-model="OBJ.properties.anno" placeholder="anno">
        <span v-on:click="taketh" class="icon is-right has-text-primary">
<i class="fas fa-3x fa-play-circle bt"></i>
    </span>
    </div>
    
<div v-model="OBJ" class="navbar-item">
  <table class="table is-fullwidth">
    <tr><pre>{{OBJ.properties.name}}</pre></tr>
    <tr><pre>{{OBJ.properties.anno}}</pre></tr>
  </table>
</div>

<div class="modal">
  <div class="modal-background"></div>
  <div class="modal-content">
<pre>{{result}}</pre>
  </div>
  <button class="modal-close is-large" aria-label="close" v-on:click="$emit('close')"></button>
</div>

<!--
-->
</nav><!-- /columns -->


  </div>
</template>

<script>
export default {
  name: 'Jeakodrcbb',
  created: function () {var mess ="jeakodr.cbb";this.msg=mess.toUpperCase()},
  data () {
    return {
      result:null,
      msg: 'This is JEAKODR',
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
      projects:[{nom:'CBB',active:"is-active"}]
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
