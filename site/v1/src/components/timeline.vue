/* eslint-disable */
<template>
<div id="vue-root" class="">
  <vue-headful :title="page.title" description="Events Timeline and Graph from the Andy Dalyverse" />
<!-- -------------------------------------------------------------- SLIDER -->
<div id="slider"/>
<!-- -------------------------------------------------------------- TIMELINE -->
<div id="line"/>

<!-- -------------------------------------------------------------- CONSOLE -->
<nav class="navbar is-fixed-top">


<!-- ************************************************************************************ #CONSOLE -->
<!-- <div id="console" class="columns is-size-7 has-text-weight-bold"> -->
<div id="console" class=" is-size-7 has-text-weight-bold">

<!-- <div class="column"><span v-if="console">{{console.msg}}</span></div> -->

  <!-- <span v-bind:class="{ throbber: console.throb }" class="icon">
          <i :class="console.clazz" class="mdi"></i>
        </span>
<hr/> -->
<!-- <div class="column" v-if="active.key">active.key:<code>{{active.key}}</code></div> -->
<!-- <div class="column" v-if="filterz.time.beginz">filterz.time.beginz:<code>{{filterz.time.beginz}}</code></div> -->
<!-- <div class="column" v-if="filterz.time.endz">filterz.time.endz:<code>{{filterz.time.endz}}</code></div> -->
<!-- <div class="column" v-if="events">events found:<code>{{events.length}}</code></div> -->

<!-- <div class="column" v-if="active.item">active.item.start:<code>{{active.item.start}}</code></div> -->

<!-- <div class="column" v-if="active.graph">active.graph.participants:<code>{{active.graph.participants}}</code></div> -->

<!-- <div class="column is-4" v-if="active.key">KEY: {{active.key}}</div>
<div class="column is-3" v-if="active.item.content">TITL: {{active.item.content}}</div>
<div class="column is-3" v-if="active.item.article">ART: {{active.item.article}}</div>
<div class="column is-2 is-size-3">{{(events.length)}}</div> -->

  <!-- <div class="column" v-if="active.item">{{active.item.article}}</div> -->

<!-- <div class="column" v-if="active.graph.locations">active.graph.locations:<code>{{active.graph.locations.length}}</code></div> -->
<!-- <div class="column" v-if="active.graph.participants">active.graph.participants:<code>{{active.graph.participants}}</code></div> -->

<div class="tile is-ancestor">
  <div class="tile is-4 is-vertical is-parent">
    <div class="tile is-child box">
      
      <div class="columns">
        <div class="column"><p class="title">EVENTS</p>
          <p class="is-size-3">{{(events.length)}}</p>
        </div>
        <div v-if="geoms" class="column"><p class="title">GEOMS</p>
          <p class="is-size-3">{{(geoms.length)}}</p>
        </div>
      </div><!-- /.columns -->
    </div><!-- /.tile -->

    <div class="tile is-child box">
      <p class="title" v-if="active.key">GRPH</p>
      <p v-if="active.graph.locations">{{active.graph.locations.length}} locations</p>
      <p v-if="active.graph.participants">{{active.graph.participants.length}} participants</p>
    </div>
  </div>
  <div class="tile is-parent">
    <div class="tile is-child box">
      <p class="title" v-if="active.key">ACTIVE</p>
      <p>{{active.key}}</p>
      <p v-if="active.item.content">{{active.item.content}}</p>
      <p v-if="active.item.article">{{active.item.article}}</p>
    </div>
  </div>
</div>



</div><!-- ************************************************************************************ /#CONSOLE -->
</nav><!-- #.navbar -->
</div><!-- ./#vue-root -->
</template>

<script>

export default {
  name: 'Timeline',
  data () {
    return {
      page: { title: 'Andy Dalyverse Events' },
      geoms: [],
      map_feature_group: new L.featureGroup().addTo(map)
    //   .on('layeradd',(levent)=>{
    //       console.log('layer added:',levent);
    // if(this.active.key !== null){
    //   console.info((process.env.VERBOSITY === 'DEBUG') ? 'active key so we gotta restyle' : null);
    // } //if.active.key
            
    //     })
      ,
      times: {
        slider: { begin: process.env.SLIDER_TIME_BEGIN, end: process.env.SLIDER_TIME_END },
        line: { begin: process.env.LINE_TIME_BEGIN, end: process.env.LINE_TIME_END }
      },
      active: { key: null, item: this.nullItem(), graph: this.nullGraph() },
      events: [],
      console: {msg: '', clazz: null, throb: false}
    }// return
  }, // data
  beforeCreate () {}, // beforeCreate
  created () {
    console.info((process.env.VERBOSITY === 'DEBUG') ? 'begin CREATED, processing incoming vars' : null);

    this.console = { msg : 'loading...', throb : true, clazz : 'mdi-clock' }
    if(this.$route.params.tstart){this.times.line.begin = this.$route.params.tstart;}
    if(this.$route.params.tend){this.times.line.end = this.$route.params.tend;}
    if(this.$route.params.activeid){this.active.key = this.$route.params.activeid;}
    // this.times.slider.end=(this.$route.params.tend)?this.$route.params.tend:this.filterz.time.endz;
    // this.active.key=(this.$route.params.activeid)?this.$route.params.activeid:null;
    // this.initData();
    console.info((process.env.VERBOSITY === 'DEBUG') ? 'end CREATED, initial state set' : null);
  }, // created
  mounted: function () {

    console.info((process.env.VERBOSITY === 'DEBUG') ? "MOUNTED! Bootstrapping events..." : null);
    this.fetchEvents()

  }, //mounted
  methods: {

    setPageTitle: function () {this.page.title = (this.active.item.content)?'Dalyverse Events: '+this.active.item.content : 'Dalyverse Events '+this.times.line.begin+" - "+this.times.line.end;}, //setPageTitle
    nullGraph: function () {console.info((process.env.VERBOSITY === 'DEBUG') ? 'returning null graph...' : null);return {participants: null, locations: null};}, //nullGraph
    nullItem: function () {console.info((process.env.VERBOSITY === 'DEBUG') ? 'returning null item...' : null);return {"id" : null,"content" : null,"article" : null,"start" : null,"end" : null,"geo":[],"bounds":null}}, //nullItem
    fetchEvents: function () {

      console.info((process.env.VERBOSITY === 'DEBUG') ? 'fetchEvents()...' : null)

    let q = "for e in edges filter e.type==\"hasParticipant\" OR e.type==\"occurredAt\" for ev in events filter e._from==ev._id AND e.type==\"hasParticipant\" LET tstart = HAS(ev.timestamp, \"start\")==true ? DATE_FORMAT(ev.timestamp.start, \"%yyyy-%mm-%dd\") : DATE_FORMAT(ev.timestamp, \"%yyyy-%mm-%dd\") LET tend = HAS(ev.timestamp, \"end\")==true ? DATE_FORMAT(ev.timestamp.endz, \"%yyyy-%mm-%dd\") : null LET geo=( for g in edges filter g._from==ev._id AND g.type==\"occurredAt\" for pl in places filter g._to==pl._id return distinct pl ) filter (DATE_TIMESTAMP(tstart)>=DATE_TIMESTAMP('"+this.times.line.begin+"') && DATE_TIMESTAMP(tstart)<=DATE_TIMESTAMP('"+this.times.line.end+"')) return distinct { id:ev._key, content:ev.name, article:ev.article, start:tstart, end:tend,geo:geo}"

      axios.post('http://'+process.env.ARANGOIP+':8529/_api/cursor',{
        query:q
      })
        .then(response => {
            console.info((process.env.VERBOSITY === 'DEBUG') ? 'setting events w/ axios response...' : null)
            this.events = response.data.result;
              this.$nextTick(function(){
                // events in place, item can be set therefrom...
                this.setItem();
              });
        })//axios.then
        .catch(e => {
          console.error(e)
        })//axios.catch

    }, //fetchEvents
    fetchGeometries: function () {

    console.info((process.env.VERBOSITY === 'DEBUG') ? 'fetchGeometries()...' : null)

    let eventswgeoms = this.$_.reject(this.events,(t)=>{return t.geo.length<1})
        
    console.info((process.env.VERBOSITY === 'DEBUG') ? '  -> found '+eventswgeoms.length+' georeferenced events' : null)

    let eventgeoms = this.$_.map(
      eventswgeoms
      ,(g)=>{
        return {
          eid:g.id,
          milleriakey:g.geo[0].geo_key.type+":"+g.geo[0].geo_key.id,
          geoname:g.geo[0].name,
          geoarticle:g.geo[0].article
        }
      })

      if(eventgeoms.length>0){

      var u = (process.env.MODE !== 'T')?"http://milleria.org:3030/geoms/cbb?q="+this.$_.pluck(eventgeoms,'milleriakey').join(','):'http://localhost:8000/dalyverse-geoms-T.json'

        axios.get(u)
          .then(response => {
            console.log("response",response);
              this.geoms = response.data
          })//axios.then
          .catch(e => {
            this.console.msg=null;
            console.error(e)
          })//axios.catch
        } else {
          // if there are no geoms to fetch, don't bother with the call, just zero out the map
          this.map_feature_group.clearLayers();
        }

    }, //fetchGeometries
    setItem: function () {

      console.log((process.env.VERBOSITY=='DEBUG') ? 'setItem()...' : null)
      console.log(((process.env.VERBOSITY=='DEBUG') && this.active.key == null) ? '  -> active.key is '+this.active.key+' (NULL), nulling item...' : null)
      console.log(((process.env.VERBOSITY=='DEBUG') && this.active.key !== null) ? '  -> active.key is '+this.active.key+' setting real item from '+this.events.length+' events...' : null)

        this.active.item = (this.active.key !== null) ? this.$_.findWhere( this.events, { id : this.active.key }) : this.nullItem();

    }, //setitem
    map_FeatureStyle: function (f) {

      console.info('in m_fs we have this to work with:',f)

return {radius: 10,fillColor: 'brown',color: "#000",weight: 1,opacity: .8,fillOpacity: 1,name:'default'}

    },
    launderGeoType: function (f) {

      let t = null;
      switch(f.toLowerCase()) {
        case 'multipolygon':
          t='poly'
          break;
        case 'polygon':
          t='poly'
          break;
        case 'multilinestring':
          t='line'
          break;
        case 'linestring':
          t='line'
          break;
        case 'point':
          t='point'
          break;
        default:
          // code block
      }
      return t
    }, //launderGeoType
    launderGeoKey: function (F) {

return {id:F.properties.cartodb_id,type:this.launderGeoType(F.geometry.type)}

    }, //launderGeoKey
    setMap: function () {

      console.log((process.env.VERBOSITY=='DEBUG') ? 'setMap()...' : null)
      console.log(((process.env.VERBOSITY=='DEBUG') && this.active.key == null) ? '  -> active.key is '+this.active.key+' all styles default...' : null)

      if(this.geoms == null){
        console.log(((process.env.VERBOSITY=='DEBUG') && this.active.key == null) ? '  -> but anyway, this.geoms is null' : null)
      } else {

        this.map_feature_group.clearLayers()

        // var that = this;
        L.geoJSON(this.geoms, {
            pointToLayer: (feature, latlng)=>{return L.circleMarker(latlng);},
            style: (feature)=>{ 
              let tgkey = this.launderGeoKey(feature)
              if(this.active.item.geo.length>0 && tgkey.id == this.active.item.geo[0].geo_key.id && tgkey.type == this.active.item.geo[0].geo_key.type){
              return {radius: 10,fillColor: 'gold',color: "#000",weight: 1,opacity: .8,fillOpacity: 1,name:'default'} 
                          } else {
                                        return {radius: 10,fillColor: 'orange',color: "#000",weight: 1,opacity: .8,fillOpacity: 1,name:'default'} 
                                      }
            }, //style
            onEachFeature: (feature,layer)=>{
              // does this particular feature reconcile with current item?
              let tgkey = this.launderGeoKey(feature)
              if(this.active.item.geo.length>0 && tgkey.id == this.active.item.geo[0].geo_key.id && tgkey.type == this.active.item.geo[0].geo_key.type){
                  // var keyBounds = layer.getBounds();
                  if(feature.geometry.type.toLowerCase()=='point'){
                    this.active.item.zoom={type:'point',coords:layer.getLatLng()}
                  } else {
                  this.active.item.bounds={type:'poly',coords:layer.getBounds()}
                  }
                  }
                } //onEach
        })
        .bindPopup((layer)=>{

            return '<div><h5 class="is-size-5">'+layer.feature.properties.name+'</h5>'+layer.feature.geometry.type+':'+layer.feature.properties.cartodb_id+
            '</div>'

        })
        .on('popupopen',(parent)=>{
          console.log((process.env.VERBOSITY=='DEBUG') ? '  -> on pop, this feature:' : null,parent.layer.feature)
          let tgkey = this.launderGeoKey(parent.layer.feature)

if(tgkey.id !== this.active.item.geo[0].geo_key.id && tgkey.type !== this.active.item.geo[0].geo_key.type){
  // clicked thing isn't the active, gotta set that now
  let tevent = this.$._.findWhere(this.events,{geo[0].geo_key.id:tgkey.id,geo[0].geo_key.type:tgkey.type})
console.log("tevent",tevent);
}

        })
        // .on("popupclose", function(p) {
        //                     // p.target.setStyle()
        //                 }) //.on
        .addTo(this.map_feature_group)
  if(this.active.item.zoom.type=='point'){
        console.log(((process.env.VERBOSITY=='DEBUG') && this.active.key == null) ? '   -> zooming to point' : null)
    map.setView(this.active.item.zoom.coords,11,{animate:true})
  } else {
        console.log(((process.env.VERBOSITY=='DEBUG') && this.active.key == null) ? '   -> zooming to active item extent' : null)
          map.fitBounds( (this.active.item.bounds) ? this.active.item.bounds : this.map_feature_group.getBounds() )
        }

          } //else

    }, //setMap
    setGraph: function () {

      console.log((process.env.VERBOSITY=='DEBUG') ? 'setGraph()...' : null)
      console.log((process.env.VERBOSITY=='DEBUG') ? '  -> active.key is '+this.active.key : null)

      // if we have an active.key
    if(this.active.key !== null){

    axios.post('http://'+process.env.ARANGOIP+':8529/_api/cursor',{
      query:'LET event = (for vertices, edges, paths in OUTBOUND "events/'+this.active.key+'" edges return distinct { name: FIRST(paths.vertices).name, evid: FIRST(paths.edges)._from }) LET people = ( for v,e,p in 1..1 OUTBOUND "events/'+this.active.key+'" edges filter e.type==\'hasParticipant\' RETURN {name:v.name,key:v._id} ) LET places = ( for v,e,p in 1..1 OUTBOUND "events/'+this.active.    key+'" edges filter e.type==\'occurredAt\' RETURN {name:v.name,key:v._id} ) return { event:event, participants:people, locations:places }'
    })
        .then(response => {
            this.active.graph = response.data.result[0];
        })//axios.then
        .catch(e => {
          console.error(e)
        })//axios.catch
      }//if key
      else {
        // no key? null it out
        console.log((process.env.VERBOSITY == 'DEBUG') ? 'no active.key, nulling graph...' : null)
        this.active.graph = this.nullGraph()
      }

        // this.active.graph = (this.active.key !== null) ? this.$_.findWhere( this.events, { id : this.active.key }) : this.nullItem();

  }, //setitem
    setRoute: function(){

      console.info((process.env.VERBOSITY === 'DEBUG') ? "setRoute()..." : null)

    this.$router.push({ params:{ 
      tstart:this.times.line.begin,
      tend:this.times.line.end,
      activeid:this.active.key
    }})//rejplace

  } //setRoute
  }, //methods
  computed: {}, //computed
  watch: {
    'item': {
        handler: function (vnew, vold) {
            console.info((process.env.VERBOSITY === 'DEBUG') ? 'WATCH:ITEM:old/new:'+JSON.stringify(vold)+'/'+JSON.stringify(vnew) : null)
          }
    }, //item
    'geoms': {
        handler: function (vnew, vold) {
            console.info((process.env.VERBOSITY === 'DEBUG') ? 'WATCH:GEOMS:old/new:'+vold.length+'/'+vnew.length : null)
            this.setMap()
          }
    }, //item
    'events': {
        handler: function (vnew, vold) {
            console.info((process.env.VERBOSITY === 'DEBUG') ? 'WATCH:events:old/new:'+vold.length+'/'+vnew.length : null)
            this.fetchGeometries()
        }
    }, //events
    'times.line': {
        handler: function (vnew, vold) {
            console.info((process.env.VERBOSITY === 'DEBUG') ? 'WATCH:times.line:old/new:'+JSON.stringify(vold)+'/'+JSON.stringify(vnew) : null)
        this.fetchEvents()
        this.setRoute()
        this.setPageTitle();
        },
        deep: true
    }, //times.line
    'active.key': {
        handler: function (vnew, vold) {
          console.info((process.env.VERBOSITY === 'DEBUG') ? 'WATCH:ACTIVE.KEY:old/new:'+vold+'/'+vnew : null)
          this.setItem()
          this.setGraph()
          this.setRoute()
          this.setPageTitle();
        }
    }
  } //watch
} //export.timeline
</script>