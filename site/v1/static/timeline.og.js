export default {
  name: 'Timeline',
  data () {
    return {
      rob: null,
      geom: null,
      map_feature_group: new L.featureGroup().addTo(map),
      filterz: {
        time: {
          beginz: process.env.FILTER_TIME_BEGIN,
          endz: process.env.FILTER_TIME_END
        },
        space: { bbox: null}
  },
      page: {title: null},
      active: {key: null, item: {id: null, article: null}, graph: {participants: null, locations: null}},
      timelinetimes: [],

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

if(this.filterz){
    this.filterz.time.beginz=(this.$route.params.tstart)?this.$route.params.tstart:this.filterz.time.beginz;
    console.log('this.filterz.time.beginz:',this.filterz.time.beginz)
  this.filterz.time.endz=(this.$route.params.tend)?this.$route.params.tend:this.filterz.time.endz;
  console.log('this.filterz.time.endz:',this.filterz.time.endz)
}
if(this.active){this.active.key=(typeof this.$route.params.activeid !== 'undefined')?this.$route.params.activeid:null;}

  },//created
  mounted: function () {

this.setPageTitle();
this.setTimes()

  }, //mounted
  methods: {
    setPageTitle: function () {
this.page.title = (this.filterz.time.beginz && this.filterz.time.endz)?"Dalyverse : Events : "+this.filterz.time.beginz+" - "+this.filterz.time.endz:"Dalyverse : Events";

    },
    liveTest: function (){

    // test of activeitem is legit (found within timelinetimes array)
    if(typeof this.$_.findWhere(this.timelinetimes, {id:this.active.key}) == 'undefined'){
    this.console={clazz:"mdi-alert-circle-outline has-text-danger is-size-1 has-text-weight-bold",msg:"event ("+this.active.key+") not found in current set - check temporal filterz",throb:false}
    } else {
      this.console={
        clazz:null
        ,msg:null
        ,throb:false
      }
    }

  },
  setActiveGraph: function () {
    // if we have an active.key
    if(this.active.key !== null){
    var q='LET event = (for vertices, edges, paths in OUTBOUND "events/'+this.active.key+'" edges return distinct { name: FIRST(paths.vertices).name, evid: FIRST(paths.edges)._from }) LET people = ( for v,e,p in 1..1 OUTBOUND "events/'+this.active.key+'" edges filter e.type==\'hasParticipant\' RETURN {name:v.name,key:v._id} ) LET places = ( for v,e,p in 1..1 OUTBOUND "events/'+this.active.    key+'" edges filter e.type==\'occurredAt\' RETURN {name:v.name,key:v._id} ) return { event:event, participants:people, locations:places }'

    console.info(q)

    if(typeof q == 'undefined'){this.console.msg="no graph query incoming, dying...";return}

    axios.post('http://'+process.env.ARANGOIP+':8529/_api/cursor',{
      query:q
    })
        .then(response => {
            this.active.graph = response.data.result[0];
          // JSON response.datas are automatically parsed.
    this.$nextTick(() => this.liveTest());

        })//axios.then
        .catch(e => {
          console.error(e)
        })//axios.catch
      }//if key
      else {
        // no key? null it out
        this.active.graph = {event:null, participants:null, locations:null}
      }
  },
  setActiveItem: function() {
    // set the active *item* based on the active key/trigger
    this.active.item=(this.active.key !== null)?this.$_.findWhere(this.timelinetimes, {id:this.active.key}):{id:null, article:null, start:null};
    // also throw that to timeline (if it's null nothing will be selected or selected will deselect)
    if(this.timeline){
    this.timeline.setSelection(this.active.key);
    // also set (or clear) any associated graphs
    this.setActiveGraph()
  }
    
    // also revisit map and update feature styling/state
    // this.setActiveMapFeature()

  },
  getNullItem: function(){
    return {key:null, item:null}
  },
  routize: function(){
    let rob = { params:{
  tstart:this.filterz.time.beginz,
  tend:this.filterz.time.endz,
  activeid:this.active.key
}}
this.rob=rob;
this.$router.push(rob)

  },
  setSlider:function(){

if(typeof this.slider == 'undefined'){
  // first ime here? let's make a slider to actually use
  console.log("no slider - you're the slider: [initting slider]")
var slider = document.getElementById('slider');

this.slider = this.$NOUISLIDER.create(slider, {
    start: [this.$MOMENT(this.filterz.time.beginz, "YYYYMMDD").valueOf(), this.$MOMENT(this.filterz.time.endz, "YYYYMMDD").valueOf()],
    connect: true,
    pips: {
        mode: 'range',
        density: 3
    },
    range: {
        'min': this.$MOMENT(this.filterz.time.beginz, "YYYYMMDD").subtract(5, 'years').valueOf()
        ,'max': this.$MOMENT(this.filterz.time.endz, "YYYYMMDD").add(5, 'years').valueOf()
    }
})

var that=this;
this.slider.on('update', function(values,handle){

  that.filterz.time.beginz=that.$MOMENT(values[0],'x').format('YYYY-MM-DD');
  that.filterz.time.endz=that.$MOMENT(values[1],'x').format('YYYY-MM-DD');
  // that.setTimes();
});

this.slider.on('change', function(values,handle){

  that.filterz.time.beginz=that.$MOMENT(values[0],'x').format('YYYY-MM-DD');
  that.filterz.time.endz=that.$MOMENT(values[1],'x').format('YYYY-MM-DD');
  that.routize()
  that.setTimes()
});

}//slider no exist

  },
  setActiveMapFeature(){

// get the keys for the active item
let target_event_geo_key = (this.active.item)?this.active.item.geo[0].geo_key:null;
console.log("in sAMF, target_event_geo_key",target_event_geo_key);

if(target_event_geo_key){
// shop it to the map layers - you want to find the feature that matches both the id and type
// first some that/this tomfoolery
var that = this;

if(that.map_feature_group.getLayers().length>0){
// get the layers of our map_feature_group
let layers = that.map_feature_group.getLayers()[0]._layers;

// now check which one matches the geokey of our activeitem
var mfg_layer_active = that.$_.find(layers,(l)=>{

if(that.geoTypeLaunder(l.feature.geometry.type)==that.geoTypeLaunder(target_event_geo_key.type) && l.feature.properties.cartodb_id==target_event_geo_key.id)
{
 console.log('l.feature.geometry.type:',that.geoTypeLaunder(l.feature.geometry.type))
 console.log('target_event_geo_key.type:',that.geoTypeLaunder(target_event_geo_key.type))

 console.log('l.feature.properties.cartodb_id:',l.feature.properties.cartodb_id);
 console.log('target_event_geo_key.id:',target_event_geo_key.id);
}

  let mfgf = (that.geoTypeLaunder(l.feature.geometry.type)==that.geoTypeLaunder(target_event_geo_key.type) && l.feature.properties.cartodb_id==target_event_geo_key.id)?l:null;
  console.log('mfgf:',mfgf)
  return mfgf;

});

// if we found it, set the style
if(mfg_layer_active){
  mfg_layer_active.setStyle(that.getGeoStyle('active'))
  .openPopup()
} else {
  that.console.msg='mfg_layer_active not found'
}
}
else {this.console.msg='no map layers found to traverse'}
}
else {this.console.msg='no target_event_geo_key found'}


  },
  geoTypeLaunder(type){

let t = null;
switch(type.toLowerCase()) {
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
  },
  geoKeyGen(type,id){

let t = this.geoTypeLaunder(type);

// return (t+':'+id).toLowerCase()
let key = {id:id,type:t}

let trigger_event = this.$_.find(this.timelinetimes,(ev)=>{
  return (ev.geo[0].geo_key.id==id && ev.geo[0].geo_key.type==t)
})

return (trigger_event)?trigger_event:null;

  },
  getGeoStyle: function(s){

  switch (s) {
    case 'active':
    return {
      radius: 18,
      fillColor: "#fecd0b",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 1,
    };
    break;
    case 'seen':
    return {
      radius: 6,
      fillColor: "#ffffff",
      color: "#1288b9",
      weight: 1,
      opacity: .6,
      fillOpacity: 1,
    };
    break;
    case 'linenew':
    return {
      fillColor: "rgba(126, 223, 216, 100)",
      color: "rgba(126, 223, 216, 100)",
      weight: 6,
      opacity: 1,
    };
    break;
    case 'lineactive':
    return {
      fillColor: "#fecd0b",
      color: "#fecd0b",
      weight: 8,
      opacity: 1,
    };
    break;
    case 'lineseen':
    return {
      fillColor: "#ffffff",
      color: "#ffffff",
      weight: 6,
      opacity: 1,
    };
    default:
    return {
      radius: 6,
      // fillColor: "rgba(6, 6, 6, 50)",
      fillColor: "rgb(255, 128, 0)",
      fillOpacity: .8,
      color: "#000",
      weight: 1,
      opacity: 1,
    };
    break;
}//switch

},
  map: function () {

if(typeof this.map_feature_group !== 'undefined')
    {
      var that = this;
      var stile = this.getGeoStyle();
  this.map_feature_group.clearLayers()
L.geoJSON(this.geom, {
    style: stile,
    pointToLayer: function(feature, latlng) {
              return L.circleMarker(latlng, stile);
            }
}).bindPopup(function(layer){

    return '<div><h5 class="is-size-5">'+layer.feature.properties.name+'</h5><div class="has-text-muted">'+ev_key.article+'['+ev_key.id+'])</div></div>'

}).on('popupopen',function(feature){
    // get eventkey (e.g. '_:lronhubbardsspectaclesarefound', set Vue.active.key)
    let ev_key = that.geoKeyGen(layer.feature.geometry.type,layer.feature.properties.cartodb_id)
  that.active.key=ev_key.id
})
.on("popupclose", function(p) {

                    p.target.setStyle()
                }) //.on
.addTo(this.map_feature_group);
map.fitBounds(this.map_feature_group.getBounds())
  // var style = this.STYLE();

    this.console.msg=this.geom.length+" items mapped"
  }
},
  getGeo: function () {

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

var u = "http://milleria.org:3030/geoms/cbb?q="+this.$_.pluck(geoms,'geokey').join(',')
this.console.msg="fetching and mapping associated geometries...";

  axios.get(u)
    .then(response => {
        this.geom = response.data

        // we watch activeitem to do this normally but that's when we have map data onsite already
        this.$nextTick(() => this.setActiveMapFeature());
      // JSON response.datas are automatically parsed.
    })//axios.then
    .catch(e => {
      console.error(e)
    })//axios.catch


  }
  ,setTimeline:function(){

      // old magic
      var that = this;

    if(typeof this.timeline == 'undefined'){
      //first time here?
       const el = this.$el.querySelector('#line')
       // create the Timeline
       var titems = new vis.DataSet(this.timelinetimes);
       this.timeline = new vis.Timeline(el, titems, {});

      // now we wire up click-selection
       this.timeline.on('select',function (properties){
        // if it's active alrady we deactivate
        if(properties.items[0]==that.active.key){
                that.active.key=null
                              this.setSelection(null);
                              // that.setActiveItem();
        } else {
                that.active.key=properties.items[0]
                this.setSelection(properties.items[0]);
          }//else itemselect matches active.key
          // that.setActiveItem();
      })//.on
       that.setActiveItem()
    }//timeline.create and wireup
    else {
      // timeline extant already
      that.timeline.setItems(that.timelinetimes)
          that.timeline.setSelection(that.active.key)

          this.console.msg="redrawing timeline..."
          that.timeline.redraw()
          that.timeline.fit({ duration: 200, easingFunction: 'linear'});
      // that.timeline.redraw();
    }

     },
  setTimes:function(){
console.log('running setTimes...')
  // axios.get('http://localhost:8000/events-fake.json')
  // NO LOCS:
  // let q = "for e in edges filter e.type==\"hasParticipant\" for ev in events filter e._from==ev._id LET tstart = HAS(ev.timestamp, \"start\")==true ? DATE_FORMAT(ev.timestamp.start, \"%yyyy-%mm-%dd\") : DATE_FORMAT(ev.timestamp, \"%yyyy-%mm-%dd\") LET tend = HAS(ev.timestamp, \"end\")==true ? DATE_FORMAT(ev.timestamp.endz, \"%yyyy-%mm-%dd\") : null filter (DATE_TIMESTAMP(tstart)>=DATE_TIMESTAMP('"+this.filterz.time.beginz+"') && DATE_TIMESTAMP(tstart)<=DATE_TIMESTAMP('"+this.filterz.time.endz+"')) return distinct { id:ev._key, content:ev.name, article:ev.article, start:tstart, end:tend}"
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

  }
}, //methods
  computed: {}, //computed
  watch: {
    'active.key': function () {
          this.routize()
          this.setActiveItem()
        },
    'active.item': function () {
          this.setActiveMapFeature()
        },
    timelinetimes: function() {
          this.setTimeline();
           this.setSlider();
           this.getGeo();
        },
    filterz: function() {
          this.routize()
        },
    geom: function() {
          this.map()
        }
  } //watch
} //export.timeline