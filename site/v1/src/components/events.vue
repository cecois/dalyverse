<template>
<div class="dv-app">
  <vue-topprogress ref="topProgress"></vue-topprogress>
  <div id="map" style="width: 100%;height: 100%;position: fixed;top: 0;right: 0;bottom: 0;left: 0;z-index: 0;"></div>
  <div id="vue-root" class="container is-fixed-top">
    <vue-headful :title="page.title" description="Events Timeline and Graph from the Andy Dalyverse" />
    <!-- ************************************************************************************ #CONSOLE -->
    <div class="has-text-weight-bold">
      
      <!-- <a class="" v-on:click="zoomToFullExtent">
        <b-icon icon="arrow-expand-all" size="is-small"></b-icon>
      </a> -->
      <div class="columns">
        <div class="column is-full">
          <!-- <p style="padding-top:1em;" class="title is-size-2 has-text-white">{{this.$MOMENT(times.line.begin).format('YYYY.MMM.Mo')}} to {{this.$MOMENT(times.line.end).format('YYYY.MMM.Mo')}}</p> -->
          <!-- <p v-if="times.future.begin" class="is-size-7">next: {{times.future.begin}} - {{times.future.end}}</p> -->
          <!-- <p class="is-size-7">{{(events.length)}} (of {{events_total}} total)</p> -->
        </div>
        
      </div nb="/.columns">
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
      <div class="column is-2 is-size-7">{{(events.length)}}</div> -->
      <!-- <div class="column" v-if="active.item">{{active.item.article}}</div> -->
      <!-- <div class="column" v-if="active.graph.locations">active.graph.locations:<code>{{active.graph.locations.length}}</code></div> -->
      <!-- <div class="column" v-if="active.graph.participants">active.graph.participants:<code>{{active.graph.participants}}</code></div> -->
      
      <!-- <div v-if="seens" class="column">
        <p class="title is-size-7">SEENS</p>
        <p class="is-size-7">{{(seens.length)}}</p>
      </div>
    </div> -->
    
    <!-- ************************************************************************************ /#CONSOLE -->
    <!-- #.navbar </nav> -->
    <div :class="(!state)?'is-hidden':''" id="container-main">
      
      
      <!-- -------------------------------------------------------------- SLIDER -->
      <div style="margin-top:12vh;" id="slider"></div>
      <!-- -------------------------------------------------------------- TIMELINE -->
      <div id="timeline"></div>
      <div class="is-overlay" v-if="active.key" id="dv-timeline-graph">
        <!-- Main container -->
        <nav class="level">
          <!-- Left side -->
          <div class="level-left">
            <div class="level-item">
              
            </div>
            
          </div>
          <!-- Right side -->
          <div class="level-right">
            <a @click="active.key=null" class="delete" style="margin-top: 7vh;right: 2vw;position:relative;"></a>
          </div>
        </nav>
        <simplebar id="dv-graph-copy-wrapper">
        <div class="columns"><div class="column is-12">
          
          <p style="" class="dv-title is-size-3">{{active.item.content}}</p>
          <p class="is-size-7 dv-title-sub">({{this.$MOMENT(active.item.start).format('YYYY.MMM.DD')}}) <a v-tooltip.right-start="'zoom map to this location'" v-if="(active.item && active.item.geo.length>0)" class="" v-on:click="zoomToNext">
            <b-icon icon="magnify-plus-outline" size="is-small"></b-icon>
          </a></p>
          <p style="margin-top:2em;">
            <div class="has-text-grey dv-graph-copy" style="padding:0 4em;font-weight:400;" v-for="articleitem in active.item.article">
              {{articleitem}}
            </div>
          </p>
        </div nb="/.column">
      </div nb="/.columns">
        <div class="columns">
          
          <div class="column">
            <div style="margin-top:4em;" v-if="active.key">
              <p class="is-size-4 dv-title-sub">Participants:</p>
              <p v-for="prsn in active.graph.participants">{{prsn.name}}</p>
            </div>
          </div>
          
        </div nb="/.columns">
      </simplebar>
      </div nb="/#dv-timeline-graph">
      <!-- ************************************************************************************ /#CONTAINER-MAIN -->
    </div nb="/#container-main">
    <!-- ./#vue-root -->
  </div nb="/if-state">
</div nb="/#vue-root">
</div nb="/#dv-app">
</template>

<script>

import simplebar from 'simplebar-vue';
  import 'simplebar/dist/simplebar.min.css';

export default {
  name: "Timeline",
  components: {
    simplebar
  },
  data () {
    return {
      // url_arango: "http://" + process.env.ARANGOIP + ":" + process.env.ARANGOPORT + process.env.ARANGOCURSOR,
      // url_arango: "http://localhost:8000",
      MAP: null,
      page: {
        title: "Andy Dalyverse Events"
      },
      loadings:[
      {mod:"init",isLoading:false},
      {mod:"item",isLoading:false},
      {mod:"subgraph",isLoading:false}
      ],
      state: true,
      fittable: true,
      geoms: [],
      seens: [],
      zooms: {
        previous: [],
        next: null
      },
      styles: {
        previous: null,
        default: {
          radius: 6,
          fillColor: 'rgba(292,219,56,.6)',
          color: "yellow",
          weight: 1,
          opacity: 0.8,
          fillOpacity: 0.8
        },
        active: {
          radius: 12,
          fillColor: '#0DDA19',
          color: "white",
          weight: 1,
          opacity: 0.8,
          fillOpacity: 0.6
        },
        clicked: {
          radius: 12,
          fillColor: 'rgba(292,219,56,.2)',
          color: "white",
          weight: 5,
          opacity: 1,
          fillOpacity: 0.9
        },
        seen: {
          radius: 6,
          fillColor: "white",
          color: "aqua",
          weight: 1,
          opacity: 0.8,
          fillOpacity: 0.8
        }
      },
      times: {
        line: {
          begin: process.env.LINE_TIME_BEGIN,
          end: process.env.LINE_TIME_END
        },
        future: {
          begin: null,
          end: null
        },
        slider: {
          range: {
            begin: process.env.SLIDER_RANGE_BEGIN,
            end: process.env.SLIDER_RANGE_END
          },
          handles: {
            begin: this.$MOMENT(process.env.SLIDER_RANGE_BEGIN)
              .add(1, "year")
              .format("YYYY-MM-Mo"),
            end: this.$MOMENT(process.env.SLIDER_RANGE_BEGIN)
              .subtract(1, "year")
              .format("YYYY-MM-Mo")
          }
        }
      },
      active: {
        key: null,
        item: this.nullItem(),
        graph: this.nullGraph()
      },
      events: [],
      events_total: 0,
      console: {
        msg: "",
        clazz: null,
        throb: false
      },
      l_json: L.geoJSON(this.geoms, {
          pointToLayer: (feature, latlng) => {
            return L.circleMarker(latlng);
          },
          style: feature => {
            // reduce potentially huge thing into just important bits
            let feature_reduced = {
              properties: { cartodb_id: feature.properties.cartodb_id },
              geometry: { type: feature.geometry.type }
            };

            return this.getGeoStyle(feature_reduced);
          }, //style
          onEachFeature: (feature, layer) => {} //onEach
        })
        // .addTo(this.MAP)

        .on("click", parent => {
          
          // reduce potentially huge thing into just important bits
          let FR = {
            properties: {
              cartodb_id: parent.layer.feature.properties.cartodb_id
            },
            geometry: { type: parent.layer.feature.geometry.type }
          };
          this.doPopupStuff(parent, "click");

          let tgkey = this.geoKeyGen(FR);

          this.styles.previous = this.getStyle(parent.layer.options);
          parent.layer.setStyle(this.getGeoStyle("clicked"));

          // now do we have an event with that key?
          let neweventkeyob = this.$_.find(
            this.$_.reject(this.events, ev => {
              return ev.geo.length < 1;
            }),
            ev => {
              return (
                ev.geo[0].geo_key.id == tgkey.id &&
                ev.geo[0].geo_key.type == tgkey.type
              );
            }
          );

          let neweventkey = neweventkeyob ? neweventkeyob.id : null;

          if (neweventkey) {
            this.active.key = neweventkey;
          }
        })
        .on("popupopen", parent => {

        })
        .on("popupclose", event => {

          // parent.layer.setStyle(this.styles.previous)
          event.layer.setStyle(this.getGeoStyle("seen"));

          // reduce potentially huge thing into just important bits
          let feature_reduced = {
            properties: {
              cartodb_id: event.layer.feature.properties.cartodb_id
            },
            geometry: { type: event.layer.feature.geometry.type }
          };

          let tgkey = this.geoKeyGen(feature_reduced);
          this.seens.push(this.geoKeyStringGen(tgkey));

          this.styles.previous = null;
        })
        // .addTo(this.MAP)
    }; // return
  }, // data
  beforeCreate () {}, // beforeCreate
  created () {
    
    this.$once('hook:fitArrest', function () {
      this.fittable = false;
      this.fetchTotalEvents();
    })


    this.console = {
      msg: "loading...",
      throb: true,
      clazz: "mdi-clock"
    };
    if (this.$route.params.tstart) {
      this.times.line.begin = this.$route.params.tstart;
      // this.times.slider.handles.begin = this.$route.params.tstart;
    }
    if (this.$route.params.tend) {
      this.times.line.end = this.$route.params.tend;
      // this.times.slider.handles.end = this.$route.params.tend;
    }
    if (this.$route.params.activeid) {
      this.active.key = this.$route.params.activeid;
    }
    // this.times.slider.end=(this.$route.params.tend)?this.$route.params.tend:this.filterz.time.endz;
    // this.active.key=(this.$route.params.activeid)?this.$route.params.activeid:null;
    // this.initData();
    window.addEventListener("keydown", this.onKey);
    
  }, // created
  mounted: function () {

    // if(process.env.MODE=='T'){
    //     let sAxios = document.createElement('script')
    //     sAxios.setAttribute('src','http://localhost:8000/axios.min.js')
    //     document.head.appendChild(sAxios)

    //     let sLeaflet = document.createElement('script')
    //     sLeaflet.setAttribute('src','http://localhost:8000/leaflet.js')
    //     document.head.appendChild(sLeaflet)

    //     let sVis = document.createElement('script')
    //     sVis.setAttribute('src','http://localhost:8000/vis.min.js')
    //     document.head.appendChild(sVis)

    //     let cLeaflet = document.createElement('link')
    //     cLeaflet.setAttribute('rel','stylesheet')
    //     cLeaflet.setAttribute('src','http://localhost:8000/leaflet.css')
    //     document.head.appendChild(cLeaflet)

    //     let cVis = document.createElement('link')
    //     cVis.setAttribute('rel','stylesheet')
    //     cVis.setAttribute('src','http://localhost:8000/vis.min.css')
    //     document.head.appendChild(cVis)

    //     let cVisTimeline = document.createElement('link')
    //     cVisTimeline.setAttribute('rel','stylesheet')
    //     cVisTimeline.setAttribute('src','http://localhost:8000/vis-timeline-graph2d.min.css')
    //     document.head.appendChild(cVisTimeline)

        
    //     let cMaterial = document.createElement('link')
    //     cMaterial.setAttribute('rel','stylesheet')
    //     cMaterial.setAttribute('src','http://localhost:8000/css/materialdesignicons.min.css')
    //     document.head.appendChild(cMaterial)

    //   } else {

    //             let sAxios = document.createElement('script')
    //     sAxios.setAttribute('src','http://unpkg.com/axios/dist/axios.min.js')
    //     document.head.appendChild(sAxios)

    //     // let sLeaflet = document.createElement('script')
    //     // sLeaflet.setAttribute('src','https://unpkg.com/leaflet@1.4.0/dist/leaflet.js')
    //     // document.head.appendChild(sLeaflet)

    //     let sVis = document.createElement('script')
    //     sVis.setAttribute('src','https://cdnjs.cloudflare.com/ajax/libs/vis/4.17.0/vis.min.js')
    //     document.head.appendChild(sVis)

    //     let cLeaflet = document.createElement('link')
    //     cLeaflet.setAttribute('rel','stylesheet')
    //     cLeaflet.setAttribute('src','https://unpkg.com/leaflet@1.4.0/dist/leaflet.css')
    //     document.head.appendChild(cLeaflet)

    //     let cVis = document.createElement('link')
    //     cVis.setAttribute('rel','stylesheet')
    //     cVis.setAttribute('src','https://cdnjs.cloudflare.com/ajax/libs/vis/4.17.0/vis.min.css')
    //     document.head.appendChild(cVis)

    //     let cVisTimeline = document.createElement('link')
    //     cVisTimeline.setAttribute('rel','stylesheet')
    //     cVisTimeline.setAttribute('src','https://visjs.github.io/vis-timeline/dist/vis-timeline-graph2d.min.css')
    //     document.head.appendChild(cVisTimeline)

    //     let cMaterial = document.createElement('link')
    //     cMaterial.setAttribute('rel','stylesheet')
    //     cMaterial.setAttribute('src','href="//cdn.materialdesignicons.com/2.0.46/css/materialdesignicons.min.css')
    //     document.head.appendChild(cMaterial)

    //   }

this.$nextTick(() => this.initBaseMap()
  // .setSlider().fetchEvents()
  )
    // this.initBaseMap();
    this.setSlider();
    this.fetchEvents();
  }, //mounted
  methods: {
    initBaseMap: function () {

      let blu = null
      switch (process.env.MODE) {
        case 'T':
          blu = 'http://localhost:8000/2x.png'
          break
        case '33':
          // blu = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'
          // blu = 'https://cartocdn_d.global.ssl.fastly.net/base-midnight/{z}/{x}/{y}.png'
          blu = 'https://cartocdn_a.global.ssl.fastly.net/base-eco/{z}/{x}/{y}.png'
          break
        default:
          blu = 'http://localhost:8000/2x.png'
          break
      }

      if (this.MAP == null) {
        this.MAP=new L.Map('map', {
          zoomControl: false,
          center: [41.12410774245512, -41.6872787475586],
          attributionControl: false,
          zoom: 3
        })
      }

      const baseLayer = new L.TileLayer(blu)
      this.MAP.addLayer(baseLayer)
      this.MAP.addLayer(this.l_json)

    }, //initBaseMap
    fetchTotalEvents: function () {

      let q = 'RETURN LENGTH(events)'

      if(process.env.MODE=="T"){

  axios
        .get('http://localhost:8000/dv-timeline.json')
        .then(response => {
          this.events_total = response.data.result[0];
        }) //axios.then
        .catch(e => {
          console.error(e);
        }); //axios.catch
      } else {

      axios
          .post("http://" + process.env.ARANGOIP + ":" + process.env.ARANGOPORT + process.env.ARANGOCURSOR, {
          query: q
        },
        {
  auth: {
    username: process.env.ARANGOUSER,
    password: process.env.ARANGOPSSW
  }
}
        )
          .then(response => {
          this.events_total = response.data.result[0];
        }) //axios.then
        .catch(e => {
          console.error(e);
        }); //axios.catch
}
    }, //getotalevents
    getStyle: function (o) {
      return {
        radius: o.radius,
        fillColor: o.fillColor,
        color: o.color,
        weight: o.weight,
        opacity: o.opacity,
        fillOpacity: o.fillOpacity,
        name: o.name
      };
    }, //getstyle
    zeroOut: function () {

      this.l_json.clearLayers();
      (this.timeline) ? this.timeline.setSelection(): null;

    }, // zeroOut
    zoomToNext: function () {

      // grab target key (it'll be the ol {id:<id>,type:<type>})
      let zoomto = this.zooms.next ? this.zooms.next : null;
      console.log("zoomto", zoomto.id);

      // find map object
      let mo = this.$_.find(this.l_json.getLayers(), L => {
        console.log('L.feature.properties.cartodb_id',L.feature.properties.cartodb_id);
        return (
          L.feature.properties.cartodb_id == zoomto.id &&
          this.launderGeoType(L.feature.geometry.type) == zoomto.type
        );
      });

      if (zoomto.type === "point") {
        this.MAP.setView(mo.getLatLng(), 12, {
          animate: true
        });
      } else {
        
        this.MAP.fitBounds(mo.getBounds());
      }
    }, //zoomtonext
    zoomToFullExtent: function () {
      this.MAP.fitBounds(this.l_json.getBounds());
    }, //zoomToFullExtent
    doPopupStuff: function (p, e) {

      let copy =
        process.env.VERBOSITY === "DEBUG" ? '<h2 class="has-text-info is-size-2">' +
        p.layer.feature.properties.cartodb_id +
        "</h2>" +
        '<div class="has-text-grey-lighter is-size-5">' +
        p.layer.feature.properties.name +
        "</div>" : '<div><h5 class="is-size-5">real h5</h5>real subhead</div>';

      let po = L.popup()
        .setLatLng(
          p.layer.feature.geometry.type == "Point" ? p.layer.getLatLng() : p.layer.getCenter()
        )
        .setContent(copy);

      // if it's a click event we popup no questions asked
      if (e) {
        po.openOn(this.MAP);
      } else {
        if ((p.layer.properties.cartodb_id = 999)) {
          po.openOn(this.MAP);
        }
        // get this one's key
        // otherwise we might be calling this ex post facto cuzza incoming active.key, so...
        // does it match active?
        // yes popup
      }
    }, //doPopupStuff
    onKey: function (e) {
      
      switch (e.keyCode) {
        case 18:
          this.state = !this.state;
          break;
        case e.keyCode == 999:
          break;
        default:
          this.state = this.state;
          break;
      }
    }, //onkey
    setPageTitle: function () {
      let sub = null;

      switch (true) {
        case typeof this.active.item == "undefined":
          sub = this.times.line.begin + " - " + this.times.line.end;
          break;
        case this.active.item.content == null:
          sub = this.times.line.begin + " - " + this.times.line.end;
          break;
        default:
          sub = this.active.item.content;
          break;
      }

      this.page.title = "Dalyverse Events: " + sub;
    }, //setPageTitle
    nullGraph: function () {

      return {
        participants: null,
        locations: null
      };
    }, //nullGraph
    nullItem: function () {
      return {
        id: null,
        content: null,
        article: null,
        start: null,
        end: null,
        geo: [],
        bounds: null
      };
    }, //nullItem
    setTimeline: function () {

      if (!this.timeline) {
        const el = this.$el.querySelector("#timeline");
        // create the Timeline

        this.timeline = new vis.Timeline(el, this.events, {
          zoomable: true,
          moveable: true,
          template: (item, element, data) => {
            return item.geo.length > 0 ? '<h1 class="dv-time-item has-text-weight-bold" style="font-size:.9em;">' +
              item.content +
              '&nbsp;<span class="mdi mdi-map-marker-circle dv-time-item-w-geo"></span></h1>' : '<h1 class="dv-time-item has-text-weight-bold" style="font-size:.9em;">' +
              item.content +
              "</h1>";
          }
        }); // new vis
        this.timeline.on("rangechange", properties => {
          this.times.future = {
            begin: this.$MOMENT(properties.start).format("YYYY-MMM-Mo"),
            end: this.$MOMENT(properties.end).format("YYYY-MMM-Mo")
          };
        });
        this.timeline.on("rangechanged", properties => {
          
          if (properties.byUser == true) {

            this.times.future = { begin: null, end: null };
            this.times.line = {
              begin: this.$MOMENT(properties.start).format("YYYY-MM-Mo"),
              end: this.$MOMENT(properties.end).format("YYYY-MM-Mo")
            };
          }

          // and one more thing - if we have an active key but it's not in view we deactivatee
          if (this.active.key && !this.$_.contains(this.timeline.getVisibleItems(), this.active.key)) {
            this.active.key = null;
            this.console.msg = "the selected event slid out of view, was deactivated"
          }
        }); // rangechanged

        // now we wire up click-selection
        this.timeline.on("click", properties => {
          
            switch (true) {
              case properties.what == "background":
                
                this.active.key = null;
                break;
              case properties.what == "item" && properties.item == this.active.key:
                this.active.key = null;
                break;
              default:
                this.active.key = properties.item;
                break;
            }
          }) //.on
      } //if.timeline
      else {
        this.timeline.setItems(this.events);
        this.timeline.setSelection(this.active.key);

        this.timeline.fit();
      } //else.timeline
    }, //settimeline
    setSlider: function () {

      if (!this.slider) {
        // no slider - you're the slider
        
        var slider = document.getElementById("slider");

        const effer = v => {
          return this.$MOMENT(v).format("YYYY.MMM.Mo");
        };

        this.slider = this.$NOUISLIDER.create(slider, {
          start: [
            this.$MOMENT(
              process.env.LINE_TIME_BEGIN,
              "YYYY-MM-Mo"
            ).valueOf(),
            this.$MOMENT(
              process.env.LINE_TIME_END,
              "YYYY-MM-Mo").valueOf()
          ],
          connect: true,
          behaviour: 'drag',
          pips: null,
          tooltips: [{ to: effer, from: Number }, { to: effer, from: Number }],
          range: {
            min: parseInt(
              this.$MOMENT(this.times.slider.range.begin)
              .valueOf()
            ),
            max: parseInt(
              this.$MOMENT(this.times.slider.range.end)
              .valueOf()
            )
          }
        });
        /* ----------------------- WIRE/REWIRE ---------- */

        this.slider.on("change", (values, handle) => {
          // this.filterz.time.beginz = this.$MOMENT(values[0], "x").format(
          //   "YYYY-MM-DD"
          // );
          // this.filterz.time.endz = this.$MOMENT(values[1], "x").format("YYYY-MM-DD");
          let to = {
            begin: this.$MOMENT(values[0], "x").format("YYYY-MM-DD"),
            end: this.$MOMENT(values[1], "x").format("YYYY-MM-DD")
          };
          this.times.line = to;
          this.times.slider.handles = to;
          // this.fetchEvents();
          // this.routize();
        });
      } //if.slider
      else {
        this.slider.set([
          this.$MOMENT(
            this.times.line.begin,
            "YYYY-MM-DD"
          ).valueOf(),
          this.$MOMENT(
            this.times.line.end,
            "YYYY-MM-DD").valueOf()
        ])
      }

      // }
    }, //setSlider
    fetchEvents: function () {
      
      let q =
        'for e in edges filter e.type=="hasParticipant" OR e.type=="occurredAt" for ev in events filter e._from==ev._id AND e.type=="hasParticipant" LET tstart = HAS(ev.timestamp, "start")==true ? DATE_FORMAT(ev.timestamp.start, "%yyyy-%mm-%dd") : DATE_FORMAT(ev.timestamp, "%yyyy-%mm-%dd") LET tend = HAS(ev.timestamp, "end")==true ? DATE_FORMAT(ev.timestamp.endz, "%yyyy-%mm-%dd") : null LET geo=( for g in edges filter g._from==ev._id AND g.type=="occurredAt" for pl in places filter g._to==pl._id return distinct pl ) filter (DATE_TIMESTAMP(tstart)>=DATE_TIMESTAMP(\'' +
        this.times.line.begin +
        "') && DATE_TIMESTAMP(tstart)<=DATE_TIMESTAMP('" +
        this.times.line.end +
        "')) return distinct { id:ev._key, content:ev.name, article:ev.article, start:tstart, end:tend,geo:geo}";

// if(this.url_arango=="http://localhost:8000"){
  if(process.env.MODE=="T"){
axios
        .get("http://localhost:8000/dv-timeline.json")
        .then(response => {
          this.events = response.data.result;
          this.$nextTick(function () {
            // events in place, item can be set therefrom...
            this.setItem();
          });
        }) //axios.then
        .catch(e => {
          console.error(e);
        }); //axios.catch
} else {
      axios
          .post("http://" + process.env.ARANGOIP + ":" + process.env.ARANGOPORT + process.env.ARANGOCURSOR, {
          query: q
        },
        {
  auth: {
    username: process.env.ARANGOUSER,
    password: process.env.ARANGOPSSW
  }
}
        )
          .then(response => {
          this.events = response.data.result;
          this.$nextTick(function () {
            // events in place, item can be set therefrom...
            this.setItem();
          });
        }) //axios.then
        .catch(e => {
          console.error(e);
        }); //axios.catch
      }//if.else
    }, //fetchEvents
    fetchGeometries: function () {
      
      let eventswgeoms = this.$_.reject(this.events, t => {
        return t.geo.length < 1;
      });

      let eventgeoms = this.$_.map(eventswgeoms, g => {
        return {
          eid: g.id,
          milleriakey: g.geo[0].geo_key.type + ":" + g.geo[0].geo_key.id,
          geoname: g.geo[0].name,
          geoarticle: g.geo[0].article
        };
      });
// this.$_.pluck(eventgeoms, "milleriakey")
console.log("this.$_.pluck(eventgeoms, \"milleriakey\")", this.$_.pluck(eventgeoms, "milleriakey"));
      if (eventgeoms.length > 0) {
        var u =
          process.env.MODE == "33" ? process.env.API_ROOT+"/geoms/cbb?q=" +
          this.$_.pluck(eventgeoms, "milleriakey").join(",") : "http://localhost:8000/dalyverse-geoms-T.json";

        axios
          .get(u)
          .then(response => {
            this.geoms = response.data;
          }) //axios.then
          .catch(e => {
            this.console.msg = null;
            console.error(e);
          }); //axios.catch
      }
    }, //fetchGeometries
    setItem: function () {
      
      this.active.item =
        this.active.key !== null ? this.$_.findWhere(this.events, {
          id: this.active.key
        }) : this.nullItem();

      if (this.active.item) {
        this.zooms.next =
          this.active.item.geo.length > 0 ? this.active.item.geo[0].geo_key : null;
      }
    }, //setitem
    launderGeoType: function (f) {
      let t = null;
      switch (f.toLowerCase()) {
        case "multipolygon":
          t = "poly";
          break;
        case "polygon":
          t = "poly";
          break;
        case "multilinestring":
          t = "line";
          break;
        case "linestring":
          t = "line";
          break;
        case "point":
          t = "point";
          break;
        default:
          // code block
      }
      return t;
    }, //launderGeoType
    geoKeyGen: function (F) {
      let o = F ? {
        id: F.properties.cartodb_id,
        type: this.launderGeoType(F.geometry.type)
      } : {
        id: null,
        type: null
      };
      return o;
    }, //geoKeyGen
    geoKeyStringGen: function (F) {
      let o = null;
      // two differnet versions possible - prelaundered and straight frm the geom
      if (F.properties) {
        o =
          F.properties.cartodb_id + ":" + this.launderGeoType(F.geometry.type);
      } else {
        o = F.id + ":" + F.type;
      }
      return o;
    }, //geoKeyStringGen
    getGeoStyle: function (f) {

      let tgkey = typeof f == "object" ? this.geoKeyGen(f) : f;

      let styl = null;
      switch (true) {
        case typeof f == "string":
          styl = this.styles[f];
          break;
        case typeof this.active == "undefined":
          styl = this.styles.default;
          break;
        case this.active.key == null:
          styl = this.styles.default;
          break;
        case typeof this.active.item.geo == "undefined":
          styl = this.styles.default;
          break;
        case this.active.item.geo.length < 1:
          styl = this.styles.default;
          break;
        case this.$_.contains(this.seens, this.geoKeyStringGen(tgkey)):
          styl = this.styles.seen;
          break;
        case tgkey.id == this.active.item.geo[0].geo_key.id &&
        tgkey.type == this.active.item.geo[0].geo_key.type:
          styl = this.styles.active;
          break;
        default:
          styl = this.styles.default;
          break;
      }

      return styl;
    }, //getgeostyle
    setMap: function () {
      
      this.l_json.clearLayers();

      this.l_json.clearLayers();
        this.l_json.addData(this.geoms);
      
    } //setMap
    ,setGraph: function () {

this.$_.findWhere(this.loadings,{"mod":"subgraph"}).isLoading=true

      
      // if we have an active.key
      if (this.active.key !== null) {

        if(process.env.MODE=="T"){
axios.get("http://localhost:8000/dv-timeline-graph.json")
.then(response => {
                    this.active.graph = response.data.result[0];
                  }) //axios.then
                  .catch(e => {
                    console.error(e);
                  }); //axios.catch
        } else {

          let q = 'LET event = (for vertices, edges, paths in OUTBOUND "events/' +
                      this.active.key +
                      '" edges return distinct { name: FIRST(paths.vertices).name, evid: FIRST(paths.edges)._from }) LET people = ( for v,e,p in 1..1 OUTBOUND "events/' +
                      this.active.key +
                      "\" edges filter e.type=='hasParticipant' RETURN {name:v.name,key:v._id} ) LET places = ( for v,e,p in 1..1 OUTBOUND \"events/" +
                      this.active.key +
                      "\" edges filter e.type=='occurredAt' RETURN {name:v.name,key:v._id} ) return { event:event, participants:people, locations:places }"
                axios.post("http://" + process.env.ARANGOIP + ":" + process.env.ARANGOPORT + process.env.ARANGOCURSOR, {
          query: q
        },
        {
  auth: {
    username: process.env.ARANGOUSER,
    password: process.env.ARANGOPSSW
  }
}
        )
          .then(response => {
                    this.active.graph = response.data.result[0];

this.$_.findWhere(this.loadings,{"mod":"subgraph"}).isLoading=false

                  }) //axios.then
                  .catch(e => {
                    console.error(e);
                  }); //axios.catch
                }//ifmodet
      } //if key
      else {
        // no key? null it out
        this.$_.findWhere(this.loadings,{"mod":"subgraph"}).isLoading=false
        this.active.graph = this.nullGraph();
      }
    }, //setgraph
    setRoute: function () {

        this.$router.push({
          params: {
            tstart: this.times.line.begin,
            tend: this.times.line.end,
            activeid: this.active.key
          }
        }); //rejplace
      } //setRoute
  }, //methods
  computed: {}, //computed
  watch: {
    "loadings": {
      handler: function (vnew, vold) {

        // this.$refs.topProgress.done();
        this.$_.contains(this.$_.pluck(vnew,'isLoading'),true)?this.$refs.topProgress.start():this.$refs.topProgress.done();
      }//handler
      ,
     deep: true
    },
    item: {
      handler: function (vnew, vold) {
        
      }
    }, //item
    geoms: {
      handler: function (vnew, vold) {
        
        this.setMap();
      }
    }, //item
    events: {
      handler: function (vnew, vold) {
        this.zeroOut();
        // this.setSlider();
        this.setTimeline();
        if(this.MAP){this.fetchGeometries();}
      }
    }, //events
    "times.line": {
      handler: function (vnew, vold) {
        
        this.fetchEvents();
        this.setRoute();
        this.setPageTitle();
      },
      deep: true
    }, //times.line
    "active.key": {
      handler: function (vnew, vold) {
        this.setRoute();
        this.setItem();
        this.setGraph();
        this.setTimeline();
        if(this.MAP){this.setMap();}
        this.setPageTitle();
      }
    }
  } //watch
}; //export.timeline
</script>
