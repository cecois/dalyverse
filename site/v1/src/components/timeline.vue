<template>
<div id="vue-root" class="">
    <div class="container">

  <vue-headful
            :title="page.title"
        description="Events Timeline and Graph from the Andy Dalyverse"
        />
<div id="console">
<div class="columns is-size-7">
<div class="column"><code v-if="console">{{console.msg}}</code></div>
</div>

  <!-- <span v-bind:class="{ throbber: console.throb }" class="icon">
          <i :class="console.clazz" class="mdi"></i>
        </span>
<hr/> -->
<div class="columns is-size-7">
<div class="column" v-if="active.key">active.key:<code>{{active.key}}</code></div>
<div class="column" v-if="filterz.time.beginz">filterz.time.beginz:<code>{{filterz.time.beginz}}</code></div>
<div class="column" v-if="filterz.time.endz">filterz.time.endz:<code>{{filterz.time.endz}}</code></div>
<!-- <div class="column" v-if="timelinetimes">events found:<code>{{timelinetimes.length}}</code></div> -->
<div class="column" v-if="active.item">active.item.content:<code>{{active.item.content}}</code></div>
<!-- <div class="column" v-if="active.item">active.item.article:<code>{{active.item.article}}</code></div> -->
<div class="column" v-if="active.item">active.item.start:<code>{{active.item.start}}</code></div>
<!-- <div class="column" v-if="active.graph">active.graph.participants:<code>{{active.graph.participants}}</code></div> -->
</div></div>

<div id="slider"/>
<div id="line"/>
    </div><!-- /.container -->
</div><!-- ./#vue-root -->
</template>

<script>

export default {
  name: 'Timeline',
  data () {
    return {
      geom: null,
      map_feature_group: new L.featureGroup().addTo(map),
      slidertime:{min:null,max:null},
      filterz: {
        time: {
          beginz: process.env.FILTER_TIME_BEGIN,
          endz: process.env.FILTER_TIME_END
        },
        space: { bbox: null}
      },
      active: {key: null, item: this.nullItem(), graph: {participants: null, locations: null}},
      timelinetimes: [],
page:{title:"Andy Dalyverse Events"},
  console: {
    msg: '',
    clazz: null,
    throb: false
  }
  }//return
  },//data
  beforeCreate () {



  },//beforeCreate
  created () {

this.console={msg:"loading...",throb:true,clazz:"mdi-clock"}
this.filterz.time.beginz=(this.$route.params.tstart)?this.$route.params.tstart:this.filterz.time.beginz;
this.filterz.time.endz=(this.$route.params.tend)?this.$route.params.tend:this.filterz.time.endz;
this.active.key=(this.$route.params.activeid)?this.$route.params.activeid:null;

this.initData();

  },//created
  mounted: function () {

    console.log((process.env.VERBOSITY=='DEBUG')?"mounted":null);
this.console={msg:"mounted",throb:false,clazz:""}
// this.setPageTitle();
// this.setTimes()

  }, //mounted
  methods: {

    setPageTitle: function () {

this.page.title = (this.active.item.content)?"Dalyverse Events: "+this.active.item.content:"Dalyverse Events "+this.filterz.time.beginz+" - "+this.filterz.time.endz;

    }, //setPageTitle
    initData: function () {

      console.log((process.env.VERBOSITY=='DEBUG')?"initData()...":null);

      this.console.msg="initing data..."
      this.fetchTimeMinMax();
      this.fetchEvents();

// now with some data in place we can default some app elements:
      

    }, //initData

    initSlider: function () {

      console.log((process.env.VERBOSITY=='DEBUG')?"initSlider()...":null)
      var slider = document.getElementById('slider');

      var effer = (v)=>{return this.$MOMENT(v).format('YYYY.MMM.DD');}

      this.slider = this.$NOUISLIDER.create(slider, {
        start: [this.$MOMENT(this.filterz.time.beginz, "YYYYMMDD").valueOf(), this.$MOMENT(this.filterz.time.endz, "YYYYMMDD").valueOf()],
        connect: true,
        pips: {
            mode: 'range',
            density: 3
        },
        tooltips: [{to: effer, from:Number}, {to: effer, from:Number}],
        range: {
            'min': this.$MOMENT('1970-09-03').subtract(2,'years').valueOf(),
            'max': this.$MOMENT(this.slidertime.max).add(2,'years').valueOf()
        }
        })



        /* ----------------------- WIRE/REWIRE ---------- */

        this.slider.on('change', (values,handle)=>{

          this.filterz.time.beginz=this.$MOMENT(values[0],'x').format('YYYY-MM-DD');
          this.filterz.time.endz=this.$MOMENT(values[1],'x').format('YYYY-MM-DD');

          this.fetchEvents()
          this.routize();

        });


    }, //initslider
    fetchTimeMinMax: function () {

      console.log((process.env.VERBOSITY=='DEBUG')?"fetchTimeMinMax()...":null)

      axios.post('http://'+process.env.ARANGOIP+':8529/_api/cursor',{
        query:"for ev in events filter ev.timestamp.start != null COLLECT AGGREGATE mintime = MIN(ev.timestamp.start),maxtime = MAX(ev.timestamp.start) return { minstart:mintime,maxstart:maxtime }"
      })
        .then(response => {
          this.slidertime={min:response.data.result[0].minstart,max:response.data.result[0].maxstart}
        })//axios.then
        .catch(e => {
          console.error(e)
        })//axios.catch

    }, //timeminmax
    initTimeline: function () {

      console.log((process.env.VERBOSITY=='DEBUG')?"initTimeline()...":null)

           const el = this.$el.querySelector('#line')
           // create the Timeline
           var titems = this.timelinetimes;
           this.timeline = new vis.Timeline(el, titems, {});

            var that = this; // that old magic

          // now we wire up click-selection
           this.timeline.on('select',function (properties){

// properties.event.preventDefault();
//         properties.event.stopPropagation();
// console.log("properties in select:")
// console.log(properties);

// console.info((process.env.VERBOSITY=='DEBUG')?"timeline.on.select":null)


// console.log("that.active.key",that.active.key)
// console.log("properties.items[0]",properties.items[0])


if(properties.items.length<1){

console.info((process.env.VERBOSITY=='DEBUG')?"no items - a click off an item? SET KEY TO NULL.":null)

   that.$nextTick(function() {
                                    that.active.key=null;
                                  });

} else 
if(properties.items[0]==that.active.key){
console.info((process.env.VERBOSITY=='DEBUG')?"this item already the active key - DESELECT AND SET ACTIVE KEY TO NULL.":null)

// properties.event.preventDefault();
//                                   this.setSelection([]);

                                  this.setSelection([],{duration: 300, easingFunction: 'easeOutQuart'})
                                     that.$nextTick(function() {
                                    that.active.key=null;
                                  });

            //                       // that.setActiveItem();
} else {
// properties.event.preventDefault();
console.info((process.env.VERBOSITY=='DEBUG')?"key doesn't match selected item (and items.length>0), setting...":null)
that.active.key=properties.items[0]
                    // this.setSelection(properties.items[0]);
}//else matches active.key

// this.setSelection(that.active.key)

          })//.on

    }, //inittimeline
    fetchEvents: function () {

      console.log((process.env.VERBOSITY=='DEBUG')?"fetchEvents()...":null)

    let q = "for e in edges filter e.type==\"hasParticipant\" OR e.type==\"occurredAt\" for ev in events filter e._from==ev._id AND e.type==\"hasParticipant\" LET tstart = HAS(ev.timestamp, \"start\")==true ? DATE_FORMAT(ev.timestamp.start, \"%yyyy-%mm-%dd\") : DATE_FORMAT(ev.timestamp, \"%yyyy-%mm-%dd\") LET tend = HAS(ev.timestamp, \"end\")==true ? DATE_FORMAT(ev.timestamp.endz, \"%yyyy-%mm-%dd\") : null LET geo=( for g in edges filter g._from==ev._id AND g.type==\"occurredAt\" for pl in places filter g._to==pl._id return distinct pl ) filter (DATE_TIMESTAMP(tstart)>=DATE_TIMESTAMP('"+this.filterz.time.beginz+"') && DATE_TIMESTAMP(tstart)<=DATE_TIMESTAMP('"+this.filterz.time.endz+"')) return distinct { id:ev._key, content:ev.name, article:ev.article, start:tstart, end:tend,geo:geo}"

      axios.post('http://'+process.env.ARANGOIP+':8529/_api/cursor',{
        query:q
      })
        .then(response => {
            this.timelinetimes = response.data.result;
          // JSON response.datas are automatically parsed.
        })//axios.then
        .catch(e => {
          console.error(e)
        })//axios.catch

    }, //fetchEvents
    setTimeline: function () {

      console.log((process.env.VERBOSITY=='DEBUG')?"setTimeline()...":null)

      this.timeline.setItems(this.timelinetimes);
      this.timeline.fit({ duration: 400, easingFunction: 'linear'});

    }, //settimeline
    map: function () {

      console.log((process.env.VERBOSITY=='DEBUG')?"map()...":null)

      if(this.geom.length<1){
        this.console.msg="no geometries within range"
      } else {

 var stile = {
      radius: 18,
      fillColor: 'green',
      color: "#000",
      weight: 1,
      opacity: .8,
      fillOpacity: 1,
    }

  this.map_feature_group.clearLayers()

L.geoJSON(this.geom, {
    style: stile,
    pointToLayer: function(feature, latlng) {

              return L.circleMarker(latlng, stile);
            }
}).bindPopup(function(layer){

    return '<div><h5 class="is-size-5">'+layer.feature.properties.name+'</h5><div class="has-text-muted"></div></div>'

}).on('popupopen',function(feature){
    // get eventkey (e.g. '_:lronhubbardsspectaclesarefound', set Vue.active.key)
    // let ev_key = that.geoKeyGen(layer.feature.geometry.type,layer.feature.properties.cartodb_id)
  // that.active.key=ev_key.id
})
.on("popupclose", function(p) {

                    // p.target.setStyle()
                }) //.on
.addTo(this.map_feature_group);

map.fitBounds(this.map_feature_group.getBounds())

    console.log((process.env.VERBOSITY=='DEBUG')?this.geom.length+" items mapped":null)
  } //else

    }, //map
    fetchGeo: function () {

      console.log((process.env.VERBOSITY=='DEBUG')?"fetchGeo()...":null);

let geoms = this.$_.map(
  this.$_.reject(this.timelinetimes,(t)=>{return t.geo.length<1})
  ,(g)=>{
    return {
      eid:g.id,
      geokey:g.geo[0].geo_key.type+":"+g.geo[0].geo_key.id,
      geoname:g.geo[0].name,
      geoarticle:g.geo[0].article
    }
  })

if(geoms.length>0){

this.console.msg="fetching associated geometries...";

var u = (process.env.MODE !== 'T')?"http://milleria.org:3030/geoms/cbb?q="+this.$_.pluck(geoms,'geokey').join(','):'http://localhost:8000/dalyverse-geoms-T.json'


  axios.get(u)
    .then(response => {
      this.console.msg=null;
        this.geom = response.data
    })//axios.then
    .catch(e => {
      this.console.msg=null;
      console.error(e)
    })//axios.catch
  } else {
    // if there are no geoms to fetch, don't bother with the call, just zero out the map
    this.map_feature_group.clearLayers();
  }

    }, //fetchGeo
    brokerTimeline: function () {

      if(!this.timeline){
        console.log((process.env.VERBOSITY=='DEBUG')?"no timeline - you're the timeline (initting timeline)...":null)
this.initTimeline();
      } //if.this.timeline
      else {
        this.setTimeline();
      }

    }, //brokerTimeline
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

    }, //launderGeo
    nullItem: function (){

      console.log((process.env.VERBOSITY=='DEBUG')?"nulling item...":null)
return {
  "id":null,
  "content":null,
  "article":null,
  "start":null,
  "end":null,
  "geo":[]
}
    }, //nullItem
    setItem: function() {

      console.log((process.env.VERBOSITY=='DEBUG')?"setItem()...":null)

// is it still a viable key?
// if(this.active.key !== null && this.active.item.id!==this.active.key){

    // yes? set the active item based on the active key found in events
    let ai = this.$_.findWhere(this.timelinetimes, {id:this.active.key});
    
      console.log((process.env.VERBOSITY=='DEBUG')?ai:null)
this.active.item=(ai)?ai:this.nullItem();

    // }  else {
    //     // no key? null it out
    //     console.log((process.env.VERBOSITY=='DEBUG')?"no active.key, nulling item...":null)
    //     this.active.item = this.nullItem()
    //   }
    // if(this.active.item.id!==this.active.key){
    //     ?this.$_.findWhere(this.timelinetimes, {id:this.active.key}):this.active.item;
    //   }

    // also throw that to timeline (if it's null nothing will be selected or selected will deselect)
    // if(this.timeline){
    // this.timeline.setSelection(this.active.key);
    // also set (or clear) any associated graphs
    // this.setActiveGraph()
  }, //setitem
      setGraph: function () {

console.log((process.env.VERBOSITY=='DEBUG')?"setGraph()...":null)

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
        console.log((process.env.VERBOSITY=='DEBUG')?"no active.key, nulling graph...":null)
        this.active.graph = {event:null, participants:null, locations:null}
      }

    }, //setgraph
    setMap: function () {

      console.log((process.env.VERBOSITY=='DEBUG')?"setMap()...":null)

// if we have an active.key
    if(this.active.key !== null){
      // take the active keys (id and geo)
      let keyg = (this.active.item.geo.length>0)?{id:this.active.item.geo[0].geo_key.id,type:this.launderGeoType(this.active.item.geo[0].geo_key.type)}:null;
      console.log("keyg",keyg)
} else {
        // no key? null it out
        console.log((process.env.VERBOSITY=='DEBUG')?"no active.key, resetting features...":null)

      }


      // set the active.item (key shopped to arango graph)
      // shop (key) to timeline, activate found entry
      // shop (geo) to map (group layer), activate found entry (openpopup)
      // if the key isn't already in the route (e.g. fresh click), add it (if it's there already we coming in from a url)


    }, //propagateActive
    routize: function(){

      console.log((process.env.VERBOSITY=='DEBUG')?"routize()...":null)

    this.$router.push({ params:{
      tstart:this.filterz.time.beginz,
      tend:this.filterz.time.endz,
      activeid:this.active.key
    }})//rejplace

  } //routize
  }, //methods
  computed: {}, //computed
  watch: {
        // 'active.item.geo': function() {
        //   // this.routize();
        //   // this.setItem();
        //   // this.setGraph();
        //   this.propagateActive();
        //   // this.setPageTitle();
        // },
        'active.key': function() {
      console.log((process.env.VERBOSITY=='DEBUG')?"WATCH ACTIVE.KEY...":null)
          this.setItem();
          // this.setGraph();
          // this.setMap();
          // this.setPageTitle();
          this.routize();
        },
    slidertime: function() {

      console.log((process.env.VERBOSITY=='DEBUG')?"watch slidertime...":null)
        // this should only happen once, btw
          this.initSlider();
        }, //watch.slidertime
    timelinetimes: function() {

      console.log((process.env.VERBOSITY=='DEBUG')?"watch timelinetimes...":null)
          this.brokerTimeline();
          this.fetchGeo();
        }, //watch.timelinetimes
    geom: function () {

      console.log((process.env.VERBOSITY=='DEBUG')?"watch geom...":null)
      this.map();
    } //geom
  } //watch
} //export.timeline
</script>