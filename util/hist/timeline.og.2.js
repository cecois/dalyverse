/* eslint-disable */
<template>
<div id="vue-root" class="">
  <vue-headful :title="page.title" description="Events Timeline and Graph from the Andy Dalyverse" />

    <div class="container">
    <div class="section" style="padding-top:0;margin-top:0;">
<!-- -------------------------------------------------------------- SLIDER -->
<div id="slider"/>
<!-- -------------------------------------------------------------- TIMELINE -->
<div id="line"/>

</div><!-- /.section -->


<!-- -------------------------------------------------------------- CONSOLE -->
    <div class="section" style="padding-top:0;margin-top:0;">
<div id="console">
<div class="columns is-size-5">
<div class="column"><code v-if="console">{{console.msg}}</code></div>
</div>


  <!-- <span v-bind:class="{ throbber: console.throb }" class="icon">
          <i :class="console.clazz" class="mdi"></i>
        </span>
<hr/> -->
<div class="columns is-size-7">
<div class="column" v-if="active.key">active.key:<code>{{active.key}}</code></div>
<!-- <div class="column" v-if="filterz.time.beginz">filterz.time.beginz:<code>{{filterz.time.beginz}}</code></div>
<div class="column" v-if="filterz.time.endz">filterz.time.endz:<code>{{filterz.time.endz}}</code></div> -->
<div class="column" v-if="timelinetimes">events found:<code>{{timelinetimes.length}}</code></div>

<div class="column" v-if="active.item">active.item.start:<code>{{active.item.start}}</code></div>

<!-- <div class="column" v-if="active.graph">active.graph.participants:<code>{{active.graph.participants}}</code></div> -->
</div>

<div class="columns is-size-7">
<div class="column" v-if="active.item">{{active.item.content}}</div>
  <div class="column" v-if="active.item">{{active.item.article}}</div>
</div>

<div class="columns is-size-7">
<div class="column" v-if="active.graph.locations">active.graph.locations:<code>{{active.graph.locations.length}}</code></div>
<div class="column" v-if="active.graph.participants">active.graph.participants:<code>{{active.graph.participants}}</code></div>
</div>

</div><!-- #console -->
</div><!-- /.section -->

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

    console.log((process.env.VERBOSITY=='DEBUG')?"in CREATED, about to process incoming vars":null);

this.console={msg:"loading...",throb:true,clazz:"mdi-clock"}
this.filterz.time.beginz=(this.$route.params.tstart)?this.$route.params.tstart:this.filterz.time.beginz;
this.filterz.time.endz=(this.$route.params.tend)?this.$route.params.tend:this.filterz.time.endz;
this.active.key=(this.$route.params.activeid)?this.$route.params.activeid:null;

this.initData();

  },//created
  mounted: function () {

    // console.log((process.env.VERBOSITY=='DEBUG')?"mounted":null);
// this.console={msg:"mounted",throb:false,clazz:""}
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

      var that = this;

      this.slider = this.$NOUISLIDER.create(slider, {
        start: [this.$MOMENT(this.filterz.time.beginz, "YYYY-MM-DD").valueOf(), this.$MOMENT(this.filterz.time.endz, "YYYY-MM-DD").valueOf()],
        // start: [, ],
        connect: true,
        pips: {
            mode: 'range',
            density: 3
        },
        tooltips: [{to: effer, from:Number}, {to: effer, from:Number}],
        range: {
            // 'min': parseInt(this.$MOMENT('1970-09-03').subtract(2,'years').format('YYYY')),
            // 'min': this.$MOMENT('1970-09-03').subtract(2,'years').valueOf(),
            'min': parseInt(this.$MOMENT('1970-09-03').subtract(2,'years').valueOf()),
            // 'max': parseInt(this.$MOMENT(this.slidertime.max).add(2,'years').format('YYYY'))
            // 'max': this.$MOMENT(this.slidertime.max).add(2,'years').valueOf()
            'max': parseInt(this.$MOMENT(this.slidertime.max).add(2,'years').valueOf())
        },
        // format: {
        //   to: function (value) {
        //     // console.log("DV: raw TO value",value)
        //     // console.log("DV: moment TO value",that.$MOMENT.unix(value).format('YYYY'))
        //               // return value;
        //               // return that.$MOMENT.unix(value).format('YYYY');
        //               return '';
        //           },
        //           from: function (value) {
        //             // console.log("DV: raw FROM value",value)
        //             // console.log("DV: moment FROM value",that.$MOMENT.unix(value).format('YYYY'))

        //               // return value;
        //               // return that.$MOMENT.unix(value).format('YYYY');
        //               return '';
        //           }
        // }
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
    flightCheck: function () {

      console.log((process.env.VERBOSITY=='DEBUG')?"this postcludes all inits (and pre- the map stuff)":null)
      console.log((process.env.VERBOSITY=='DEBUG')?"flightCheck()...":null)

      // check sliders match filterz
      // check timeline selected

      // if(this.active.key){
      console.log((process.env.VERBOSITY=='DEBUG')?"now we timeline.setSelection w/ "+this.active.key:null)

// there should be no actual difference between sending null straight but...
console.log('this.active.key',this.active.key)
if(this.active.key!==null){
  console.log("216.setting timeline w/",this.active.key)
this.timeline.setSelection(this.active.key)
} else {
  console.log("219.setting timeline w/ empty in following nextTick...")
  this.$nextTick(function(){
  console.log("222.and again?")
this.timeline.setSelection()
});
}
// this.setItem()

      // }

    }, //flightCheck
    initTimeline: function () {

      console.log((process.env.VERBOSITY=='DEBUG')?"initTimeline()...":null)

           const el = this.$el.querySelector('#line')
           // create the Timeline
           var titems = this.timelinetimes;
           this.timeline = new vis.Timeline(el, titems, {});

            var that = this; // that old magic


          // now we wire up click-selection
           this.timeline.on('click',function (properties){

// console.info('properties:',properties)
// console.info('properties.item:',properties.item)

                if(properties.what=='background'){

                console.info((process.env.VERBOSITY=='DEBUG')?"click off an item - SET KEY TO NULL.":null)

                                                    that.active.key=null;

                } else if(properties.what=="item" && properties.item==that.active.key){
                console.info((process.env.VERBOSITY=='DEBUG')?"clicked item id is already the active key - SET ACTIVE KEY TO NULL.":null)

                                                    that.active.key=null;
                                                    // also manually deselect
                                                    this.setSelection();
                } else {
                console.info((process.env.VERBOSITY=='DEBUG')?"clicked item id doesn't match current active.id, setting active.id to "+properties.item:null)
            that.active.key=properties.item
                }//else matches active.key

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
    featureStyle: function (f) {

        let ftyp = this.launderGeoType(f.geometry.type)
        let fid = f.properties.cartodb_id

        let stile = {
              radius: 10,
              fillColor: 'purple',
              color: "#000",
              weight: 1,
              opacity: .8,
              fillOpacity: 1,
              name:'default'
            }

        switch (true) {
          case (this.active.item.geo.length==0):
            stile = stile
            break;
          case (fid==this.active.item.geo[0].geo_key.id && ftyp==this.active.item.geo[0].geo_key.type):
            stile = {
              radius: 18,
              fillColor: 'yellow',
              color: "#000",
              weight: 1,
              opacity: .8,
              fillOpacity: 1,
              name:'active'
            }
            break;
          default:
            stile = stile
            break;
        }

        return stile;

    }, //featurestyle
    setMap: function () {

      console.log((process.env.VERBOSITY=='DEBUG')?"setMap()...":null)

      if(this.geom == null){
        this.console.msg="no geometries within range"
      } else {

  this.map_feature_group.clearLayers()

var that = this;
L.geoJSON(this.geom, {
    style: function(feature){
      // console.log("featureStyle res:",this.featureStyle(feature));
        return that.featureStyle(feature)
    },
    pointToLayer: (feature, latlng)=>{return L.circleMarker(latlng);},
    onEachFeature: function(feature,layer){
      // does this particular feature reconcile with current item?
      if(that.item){
            console.log('feature,item');
            console.log(feature,that.active);
                  console.log("352 in setmap.oneach:");
                  console.info(feature
              // ,(that.$_findWhere(that.item.geo[0].geo_key,{id: feature.properties.cartodb_id,type:that.launderGeoType(layer.feature.geometry.type)}))
              );
                }
          }
}).bindPopup(function(layer){

    return '<div><h5 class="is-size-5">'+layer.feature.properties.name+'</h5>'
    +that.launderGeoType(layer.feature.geometry.type)+':'+layer.feature.properties.cartodb_id+
    '</div>'

}).on('popupopen',(parent)=>{
    // console.info('feature.geometry.type',that.launderGeoType(feature.geometry.type))

    let tkey = this.findEventKeyByGeo({id:parent.propagatedFrom.feature.properties.cartodb_id,type:this.launderGeoType(parent.propagatedFrom.feature.geometry.type)});
    console.log("tkey:",tkey);
})
.on("popupclose", function(p) {

                    // p.target.setStyle()
                }) //.on
.addTo(this.map_feature_group);

map.fitBounds(this.map_feature_group.getBounds())

    // console.log((process.env.VERBOSITY=='DEBUG')?this.geom.length+" items mapped":null)
  } //else

    }, //map
    findEventKeyByGeo: function (geob) {
console.log("incoming geob",geob);

let geos = this.$_.reject(this.timelinetimes,(ti)=>{return (typeof ti.geo.length==0)});
console.log("geos.length",geos.length);

let event = this.$_.find(
  geos
  ,(ti)=>{
    console.log("ti in findEventKeyByGeo:",ti);
  return (ti.geo[0].geo_key.id==geob.id && ti.geo[0].geo_key.type==geob.type)
})

console.log("found event?",event);
return event;

    }, //findbygeo
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

    if(this.active.key!==null){
        this.active.item=this.$_.findWhere(this.timelinetimes, {id:this.active.key});
} else {
    this.active.item=this.nullItem();
  }

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
//     setMap: function () {

//       console.log((process.env.VERBOSITY=='DEBUG')?"setMap()...":null)

// // if we have an active.key
//     if(this.active.key !== null){
//       // take the active keys (id and geo)
//       let keyg = (this.active.item.geo.length>0)?{id:this.active.item.geo[0].geo_key.id,type:this.launderGeoType(this.active.item.geo[0].geo_key.type)}:null;
//       console.log("keyg",keyg)
// } else {
//         // no key? null it out
//         console.log((process.env.VERBOSITY=='DEBUG')?"no active.key, resetting features...":null)

//       }

//     }, //setMap
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
      console.log((process.env.VERBOSITY=='DEBUG')?"FIRING WATCH ACTIVE.KEY...":null)
          this.setItem();
          // this.setGraph();
          // this.setMap();
          // this.setPageTitle();
          this.routize();
        },
    slidertime: function() {

      console.log((process.env.VERBOSITY=='DEBUG')?"firing watch slidertime...":null)
        // this should only happen once, btw
          // this.initSlider();
        },
    'active.item.id': function() {

      console.log((process.env.VERBOSITY=='DEBUG')?"firing watch item.id...":null)
          // this.setGraph();
          // this.setMap();

//           this.$nextTick(function(){
// this.flightCheck();
// });

        }, //watch.item.id
    timelinetimes: function() {

      console.log((process.env.VERBOSITY=='DEBUG')?"firing watch timelinetimes...":null)
          // this.brokerTimeline();
          // this.fetchGeo();
        }, //watch.timelinetimes
    geom: function () {

      console.log((process.env.VERBOSITY=='DEBUG')?"firing watch geom...":null)
      // this.setMap();
    } //geom
  } //watch
} //export.timeline
</script>