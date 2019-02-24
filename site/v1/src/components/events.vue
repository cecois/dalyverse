<template>
<div id="vue-root" class="container is-fixed-top">
  <vue-headful :title="page.title" description="Events Timeline and Graph from the Andy Dalyverse" />
<!-- -------------------------------------------------------------- TIMELINE
<div id="line"/>
-->
<!-- <nav v-if="state === 'filled'" class="navbar is-fixed-top"> -->

<!-- <div id="console" class="columns is-size-7 has-text-weight-bold"> -->
<!-- ************************************************************************************ #CONSOLE -->
<div v-if="state === 'filled'" id="console" class="has-text-weight-bold">
<!-- <a class="button is-small" v-on:click="zoomToFullExtent">
    <span class="icon is-small">
      <i class="mdi mdi-github"></i>
    </span>
    <span>X</span>
  </a> -->
  <a href="http://localhost:8181/#/events"><b-icon icon="link" size="is-small"></b-icon></a>
  <a class="" v-on:click="zoomToFullExtent"><b-icon icon="arrow-expand-all" size="is-small"></b-icon></a>

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

<div class="tile is-ancestor">
  <div class="tile is-4 is-vertical is-parent">
    <div class="tile is-child box">
      <div class="columns">
        <div class="column"><p class="title is-size-7">EVENTS BT {{ times.line.begin }} - {{ times.line.end }}</p>
          <p v-if="times.future.begin" class="is-size-7">next: {{times.future.begin}} - {{times.future.end}}</p>
          <p class="is-size-7">{{(events.length)}} (of {{events_total}} total)</p>
          <p class="">
            <div style="font-size:.5em;" v-for="event in events">{{ event.id }}</div>
          </p>
        </div>
        <div v-if="geoms" class="column"><p class="title is-size-7">GEOMS</p>
          <p class="is-size-7">{{(geoms.length)}}</p>
          <p class="is-size-7">({{(l_json.getLayers().length)}}l)</p>
        </div>
        <div class="column">
      <p class="title is-size-7" v-if="active.key">GRPH</p>
      <p v-if="active.graph.participants">ppl:{{active.graph.participants.length}}</p>
    </div>
      </div><!-- /.columns -->
    </div><!-- /.tile -->

  </div>
  <div class="tile is-parent">
    <div class="tile is-child box">
      <p class="title is-size-7" v-if="active.key">ACTIVE</p>
      <p class="is-size-7">{{active.key}}</p>
      <p v-if="active.item" class=" is-size-7">{{active.item.content}} ({{this.$MOMENT(active.item.start).format('YYYY.MMM.DD')}})</p>
      <p v-if="active.item" class="" style="font-size:.5em;">{{active.item.article}}</p>
      <p v-if="(active.item && active.item.geo.length>0)"><a class="" v-on:click="zoomToNext"><b-icon icon="magnify-plus-outline" size="is-small"></b-icon></a></p>
              <div v-if="seens" class="column"><p class="title is-size-7">SEENS</p>
          <p class="is-size-7">{{(seens.length)}}</p>
        </div>
    </div>
  </div>
</div>

</div><!-- ************************************************************************************ /#CONSOLE -->
<!-- #.navbar </nav> -->

<div class="" id="container-main">
  <!-- -------------------------------------------------------------- SLIDER -->
<div id="slider"/>
</div><!-- ************************************************************************************ /#CONTAINER-MAIN -->

<div id="timeline"/>
</div><!-- ************************************************************************************ /#CONTAINER-MAIN -->

</div><!-- ./#vue-root -->
</template>

<script>

export default {
  name: "Timeline",
  data() {
    return {
      MAP: new L.Map('map', {
  zoomControl: false,
  center: [41.12410774245512, -41.6872787475586],
  attributionControl: false,
  zoom: 3
}),
      page: {
        title: "Andy Dalyverse Events"
      },
      state: "filled",
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
          fillColor: "#df04a3",
          color: "#fc00b5",
          weight: 1,
          opacity: 0.8,
          fillOpacity: 0.8
        },
        active: {
          radius: 12,
          fillColor: "#e3e10b",
          color: "#c9c70a",
          weight: 1,
          opacity: 0.8,
          fillOpacity: 0.6
        },
        clicked: {
          radius: 12,
          fillColor: "#e3e10b",
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
              .format("YYYY-MM-DD"),
            end: this.$MOMENT(process.env.SLIDER_RANGE_BEGIN)
              .subtract(1, "year")
              .format("YYYY-MM-DD")
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

        // .on("layeradd", parent => {
          // console.log(
          //   process.env.VERBOSITY == "DEBUG" ? "on.layeradd..." : null,
          //   parent
          // );

        // })
        .on("click", parent => {
          console.log(
            process.env.VERBOSITY == "DEBUG"
              ? "  -> on click, this obj:"
              : null,
            parent
          );

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
              console.log("ev in neweventkey _find 226", ev);
              console.log("tgkey in neweventkey _find 226", tgkey);
              return (
                ev.geo[0].geo_key.id == tgkey.id &&
                ev.geo[0].geo_key.type == tgkey.type
              );
            }
          );

          let neweventkey = neweventkeyob ? neweventkeyob.id : null;

          console.log(
            process.env.VERBOSITY == "DEBUG"
              ? "  -> on click, new event key:"
              : null,
            neweventkey
          );

          if (neweventkey) {
            this.active.key = neweventkey;
          }
        })
        .on("popupopen", parent => {
          console.log(
            process.env.VERBOSITY == "DEBUG"
              ? "  -> on popupopen, glowing:"
              : null,
            parent
          );
        })
        .on("popupclose", event => {
          console.log("POPUPCLOSE.event:", event);
          console.log(
            process.env.VERBOSITY == "DEBUG"
              ? "  -> on popupclose, sending to seen list:"
              : null,
            event
          );

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
  beforeCreate() {}, // beforeCreate
  created() {
    console.info(
      process.env.VERBOSITY === "DEBUG"
        ? "begin CREATED, processing incoming vars"
        : null
    );

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
    console.info(
      process.env.VERBOSITY === "DEBUG"
        ? "end CREATED, initial state set"
        : null
    );
  }, // created
  mounted: function() {
    console.info(
      process.env.VERBOSITY === "DEBUG"
        ? "MOUNTED! Bootstrapping events and initting vizes..."
        : null
    );
    this.initBaseMap();
    // this.setSlider();
    this.fetchEvents();
  }, //mounted
  methods: {
    initBaseMap: function () {

    console.info(
      process.env.VERBOSITY === "DEBUG"
        ? "initBaseMap()..."
        : null
    );

// this.MAP = new L.Map('map', {
// this.MAP = 

// console.log('this.map:',this.MAP)

let blu = null
switch (process.env.MODE) {
  case 'L':
    blu = 'http://mapproxy.libgeo2.llan.ll.mit.edu/wmts/l_mapbox_amazonia_grey/webmercator/{z}/{x}/{y}.png'
    break
  case '33':
    blu = 'https://cartocdn_a.global.ssl.fastly.net/base-flatblue/{z}/{x}/{y}.png'
  break
  default:
    blu = 'http://localhost:8000/2x.png'
  break
}

const baseLayer = new L.TileLayer(blu)
console.log("baselayer:",blu);
this.MAP.addLayer(baseLayer)
this.MAP.addLayer(this.l_json)
// this.l_json.addTo(this.MAP)

    }, //initBaseMap
    fetchTotalEvents: function () {

          console.info(
      process.env.VERBOSITY === "DEBUG"
        ? "getTotalEvents()..."
        : null
    );

               let q = 'RETURN LENGTH(events)'

      axios
        .post("http://" + process.env.ARANGOIP + ":8529/_api/cursor", {
          query: q
        })
        .then(response => {
          console.info(
            process.env.VERBOSITY === "DEBUG"
              ? "setting events_total w/ axios response..."
              : null
          );
          this.events_total = response.data.result[0];
        }) //axios.then
        .catch(e => {
          console.error(e);
        }); //axios.catch

    }, //getotalevents
    getStyle: function(o) {
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
(this.timeline)?this.timeline.setSelection():null;

    }, // zeroOut
    zoomToNext: function() {
      console.info(
        process.env.VERBOSITY === "DEBUG" ? "zoomToNext()..." : null
      );

      // grab target key (it'll be the ol {id:<id>,type:<type>})
      let zoomto = this.zooms.next ? this.zooms.next : null;

      // find map object
      let mo = this.$_.find(this.l_json.getLayers(), L => {
        return (
          L.feature.properties.cartodb_id === zoomto.id &&
          this.launderGeoType(L.feature.geometry.type) == zoomto.type
        );
      });

      if (zoomto.type === "point") {
        console.log(
          process.env.VERBOSITY == "DEBUG"
            ? "   -> zooming to type:" + zoomto.type
            : null
        );
        this.MAP.setView(mo.getLatLng(), 12, {
          animate: true
        });
      } else {
        console.log(
          process.env.VERBOSITY == "DEBUG"
            ? "   -> zooming to type:" + zoomto.type
            : null
        );
        this.MAP.fitBounds(mo.getBounds());
      }
    }, //zoomtonext
    zoomToFullExtent: function() {
      this.MAP.fitBounds(this.l_json.getBounds());
    }, //zoomToFullExtent
    doPopupStuff: function(p, e) {
      console.log(
        process.env.VERBOSITY == "DEBUG" ? "doPopupStuff()..." : null
      );

      let copy =
        process.env.VERBOSITY === "DEBUG"
          ? '<h2 class="has-text-info is-size-2">' +
            p.layer.feature.properties.cartodb_id +
            "</h2>" +
            '<div class="has-text-grey-lighter is-size-5">' +
            p.layer.feature.properties.name +
            "</div>"
          : '<div><h5 class="is-size-5">real h5</h5>real subhead</div>';

      let po = L.popup()
        .setLatLng(
          p.layer.feature.geometry.type == "Point"
            ? p.layer.getLatLng()
            : p.layer.getCenter()
        )
        .setContent(copy);

      // if it's a click event we popup no questions asked
      if (e) {
        console.log(
          process.env.VERBOSITY == "DEBUG"
            ? "  -> event so we just do wut we told"
            : null
        );
        po.openOn(this.MAP);
      } else {
        console.log(
          process.env.VERBOSITY == "DEBUG"
            ? "  -> not event so we check against active.key"
            : null
        );
        if ((p.layer.properties.cartodb_id = 999)) {
          po.openOn(this.MAP);
        }
        // get this one's key
        // otherwise we might be calling this ex post facto cuzza incoming active.key, so...
        // does it match active?
        // yes popup
      }
    }, //doPopupStuff
    onKey: function(e) {
      switch (true) {
        case e.keyCode == 18 && this.state == "empty":
          this.state = "filled";
          break;
        case e.keyCode == 18 && this.state !== "empty":
          this.state = "empty";
          break;
        default:
          this.state = this.state;
          break;
      }
    }, //onkey
    setPageTitle: function() {
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
    nullGraph: function() {
      console.info(
        process.env.VERBOSITY === "DEBUG" ? "returning null graph..." : null
      );
      return {
        participants: null,
        locations: null
      };
    }, //nullGraph
    nullItem: function() {
      console.info(
        process.env.VERBOSITY === "DEBUG" ? "returning null item..." : null
      );
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
    setTimeline: function() {
      console.log(process.env.VERBOSITY == "DEBUG" ? "setTimeline()..." : null);

      if (!this.timeline) {
        console.log(
          process.env.VERBOSITY == "DEBUG"
            ? " :no timeline - you're the timeline"
            : null
        );
        const el = this.$el.querySelector("#timeline");
        // create the Timeline

        this.timeline = new vis.Timeline(el, this.events, {
          zoomable: true,
          moveable: true,
          template: (item, element, data) => {
            return item.geo.length > 0
              ? '<h1 class="dv-time-item has-text-weight-bold" style="font-size:.9em;">' +
                  item.content +
                  '&nbsp;<span class="mdi mdi-map-marker-circle dv-time-item-w-geo"></span></h1>'
              : '<h1 class="dv-time-item has-text-weight-bold" style="font-size:.9em;">' +
                  item.content +
                  "</h1>";
          }
        }); // new vis
        this.timeline.on("rangechange", properties => {
          this.times.future = {
            begin: this.$MOMENT(properties.start).format("YYYY-MMM-DD"),
            end: this.$MOMENT(properties.end).format("YYYY-MMM-DD")
          };
        });
        this.timeline.on("rangechanged", properties => {
          console.log(
            process.env.VERBOSITY == "DEBUG" ? " :timeline:rangechanged..." : null
          );

if(properties.byUser==true){

          this.times.future = { begin: null, end: null };
          this.times.line = {
            begin: this.$MOMENT(properties.start).format("YYYY-MM-DD"),
            end: this.$MOMENT(properties.end).format("YYYY-MM-DD")
          };
        }

          // and one more thing - if we have an active key but it's not in view we deactivatee
          if(this.active.key && !this.$_.contains(this.timeline.getVisibleItems(),this.active.key)){
            this.active.key = null;
            this.console.msg = "the selected event slid out of view, was deactivated"
          }
        }); // rangechanged

        // now we wire up click-selection
        this.timeline.on("click", properties => {
          switch (true) {
            case properties.what == "background":
              console.info(
                process.env.VERBOSITY == "DEBUG"
                  ? " :timeline:click off any item - SET KEY TO NULL."
                  : null
              );
              // this.timeline.setSelection();
              this.active.key = null;
              break;
            case properties.what == "item" && properties.item == this.active.key:
              console.info(
                process.env.VERBOSITY == "DEBUG"
                  ? " :timeline:clicked item id is already the active key - INVERT (SET KEY TO NULL)."
                  : null
              );
              // this.timeline.setSelection();
              this.active.key = null;
              break;
            default:
              console.info(
                process.env.VERBOSITY == "DEBUG"
                  ? " :timeline:clicked item id doesn't match current active.id, setting active.id to " +
                      properties.item
                  : null
              );
              // this.timeline.setSelection(properties.item);
              this.active.key = properties.item;
              break;
          }
        }) //.on
      } //if.timeline
      else {
        console.info(
          process.env.VERBOSITY == "DEBUG"
            ? " timeline extant, doing other, setting selection to " +
                this.active.key
            : null
        );
        this.timeline.setItems(this.events);
        this.timeline.setSelection(this.active.key);

        console.log('this.timeline.range',this.timeline.range);
        this.timeline.fit();
      } //else.timeline
    }
    , //settimeline
    setSlider: function() {
      // {
      console.log(process.env.VERBOSITY == "DEBUG" ? "initSlider()..." : null);

      if (!this.slider) {
        // no slider - you're the slider
        console.log(
          process.env.VERBOSITY == "DEBUG"
            ? "no slider - you're the slider"
            : null
        );

        var slider = document.getElementById("slider");

        const effer = v => {
          return this.$MOMENT(v).format("YYYY.MMM.DD");
        };

        this.slider = this.$NOUISLIDER.create(slider, {
          start: [
            this.$MOMENT(
              process.env.LINE_TIME_BEGIN,
              "YYYY-MM-DD"
            ).valueOf(),
            this.$MOMENT(
              process.env.LINE_TIME_END,
               "YYYY-MM-DD").valueOf()
          ],
          connect: true,
          behaviour: 'drag',
          pips: {
            mode: 'range',
            density: 3
          },
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
        console.info(
        process.env.VERBOSITY === "DEBUG" ? "slider extant, auditing handles..." : null
      );
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
    fetchEvents: function() {
      console.info(
        process.env.VERBOSITY === "DEBUG" ? "fetchEvents()..." : null
      );

      let q =
        'for e in edges filter e.type=="hasParticipant" OR e.type=="occurredAt" for ev in events filter e._from==ev._id AND e.type=="hasParticipant" LET tstart = HAS(ev.timestamp, "start")==true ? DATE_FORMAT(ev.timestamp.start, "%yyyy-%mm-%dd") : DATE_FORMAT(ev.timestamp, "%yyyy-%mm-%dd") LET tend = HAS(ev.timestamp, "end")==true ? DATE_FORMAT(ev.timestamp.endz, "%yyyy-%mm-%dd") : null LET geo=( for g in edges filter g._from==ev._id AND g.type=="occurredAt" for pl in places filter g._to==pl._id return distinct pl ) filter (DATE_TIMESTAMP(tstart)>=DATE_TIMESTAMP(\'' +
        this.times.line.begin +
        "') && DATE_TIMESTAMP(tstart)<=DATE_TIMESTAMP('" +
        this.times.line.end +
        "')) return distinct { id:ev._key, content:ev.name, article:ev.article, start:tstart, end:tend,geo:geo}";

      axios
        .post("http://" + process.env.ARANGOIP + ":8529/_api/cursor", {
          query: q
        })
        .then(response => {
          console.info(
            process.env.VERBOSITY === "DEBUG"
              ? "setting events w/ axios response..."
              : null
          );
          this.events = response.data.result;
          this.$nextTick(function() {
            // events in place, item can be set therefrom...
            this.setItem();
          });
        }) //axios.then
        .catch(e => {
          console.error(e);
        }); //axios.catch
    }, //fetchEvents
    fetchGeometries: function() {
      console.info(
        process.env.VERBOSITY === "DEBUG" ? "fetchGeometries()..." : null
      );

      let eventswgeoms = this.$_.reject(this.events, t => {
        return t.geo.length < 1;
      });

      console.info(
        process.env.VERBOSITY === "DEBUG"
          ? "  -> found " + eventswgeoms.length + " georeferenced events"
          : null
      );

      let eventgeoms = this.$_.map(eventswgeoms, g => {
        return {
          eid: g.id,
          milleriakey: g.geo[0].geo_key.type + ":" + g.geo[0].geo_key.id,
          geoname: g.geo[0].name,
          geoarticle: g.geo[0].article
        };
      });

      if (eventgeoms.length > 0) {
        var u =
          process.env.MODE == "33"
            ? "http://milleria.org:3030/geoms/cbb?q=" +
              this.$_.pluck(eventgeoms, "milleriakey").join(",")
            : "http://localhost:8000/dalyverse-geoms-T.json";

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
    setItem: function() {
      console.log(process.env.VERBOSITY == "DEBUG" ? "setItem()..." : null);
      console.log(
        process.env.VERBOSITY == "DEBUG" && this.active.key == null
          ? "  -> active.key is " + this.active.key + " (NULL), nulling item..."
          : null
      );
      console.log(
        process.env.VERBOSITY == "DEBUG" && this.active.key !== null
          ? "  -> active.key is " +
              this.active.key +
              " setting real item from " +
              this.events.length +
              " events..."
          : null
      );

      this.active.item =
        this.active.key !== null
          ? this.$_.findWhere(this.events, {
              id: this.active.key
            })
          : this.nullItem();

if(this.active.item){
      this.zooms.next =
        this.active.item.geo.length > 0
          ? this.active.item.geo[0].geo_key
          : null;
        }
    }, //setitem
    launderGeoType: function(f) {
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
    geoKeyGen: function(F) {
      let o = F
        ? {
            id: F.properties.cartodb_id,
            type: this.launderGeoType(F.geometry.type)
          }
        : {
            id: null,
            type: null
          };
      return o;
    }, //geoKeyGen
    geoKeyStringGen: function(F) {
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
    getGeoStyle: function(f) {
      console.log(process.env.VERBOSITY == "DEBUG" ? "getGeoStyle..." : null);

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

      console.log(
        process.env.VERBOSITY == "DEBUG"
          ? "  --> resulting style:" + JSON.stringify(styl)
          : null
      );
      return styl;
    }, //getgeostyle
    setMap: function() {
      console.log(process.env.VERBOSITY == "DEBUG" ? "setMap()..." : null);
      console.log(
        process.env.VERBOSITY == "DEBUG" ? "  -> clearing current" : null
      );
      this.l_json.clearLayers();

      console.log(
        process.env.VERBOSITY == "DEBUG"
          ? "  -> active.key is " + this.active.key + " in setMap..."
          : null
      );

        console.log(
          process.env.VERBOSITY == "DEBUG"
            ? "  -> -> testing this.geoms for null"
            : null
        );

      if (this.geoms == null) {
        console.log(
          process.env.VERBOSITY == "DEBUG" && this.active.key == null
            ? "  -> but anyway, this.geoms is null"
            : null
        );
      } else {
        this.l_json.clearLayers();
        this.l_json.addData(this.geoms);
      } //if.geoms.null
    }, //setMap
    setGraph: function() {
      console.log(process.env.VERBOSITY == "DEBUG" ? "setGraph()..." : null);
      console.log(
        process.env.VERBOSITY == "DEBUG"
          ? "  -> active.key is " + this.active.key
          : null
      );

      // if we have an active.key
      if (this.active.key !== null) {
        axios
          .post("http://" + process.env.ARANGOIP + ":8529/_api/cursor", {
            query:
              'LET event = (for vertices, edges, paths in OUTBOUND "events/' +
              this.active.key +
              '" edges return distinct { name: FIRST(paths.vertices).name, evid: FIRST(paths.edges)._from }) LET people = ( for v,e,p in 1..1 OUTBOUND "events/' +
              this.active.key +
              "\" edges filter e.type=='hasParticipant' RETURN {name:v.name,key:v._id} ) LET places = ( for v,e,p in 1..1 OUTBOUND \"events/" +
              this.active.key +
              "\" edges filter e.type=='occurredAt' RETURN {name:v.name,key:v._id} ) return { event:event, participants:people, locations:places }"
          })
          .then(response => {
            this.active.graph = response.data.result[0];
          }) //axios.then
          .catch(e => {
            console.error(e);
          }); //axios.catch
      } //if key
      else {
        // no key? null it out
        console.log(
          process.env.VERBOSITY == "DEBUG"
            ? "no active.key, nulling graph..."
            : null
        );
        this.active.graph = this.nullGraph();
      }
    }, //setgraph
    setRoute: function() {
      console.info(process.env.VERBOSITY === "DEBUG" ? "setRoute()..." : null);

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
    item: {
      handler: function(vnew, vold) {
        console.info(
          process.env.VERBOSITY === "DEBUG"
            ? "WATCH:ITEM:old/new:" +
                JSON.stringify(vold) +
                "/" +
                JSON.stringify(vnew)
            : null
        );
      }
    }, //item
    geoms: {
      handler: function(vnew, vold) {
        console.info(
          process.env.VERBOSITY === "DEBUG"
            ? "WATCH:GEOMS:old/new:" + vold.length + "/" + vnew.length
            : null
        );
        this.setMap();
      }
    }, //item
    events: {
      handler: function(vnew, vold) {
        console.info(
          process.env.VERBOSITY === "DEBUG"
            ? "WATCH:events:old/new:" + vold.length + "/" + vnew.length
            : null
        );
        this.zeroOut();
        // this.setSlider();
        this.setTimeline();
        this.fetchGeometries();
      }
    }, //events
    "times.line": {
      handler: function(vnew, vold) {
        console.info(
          process.env.VERBOSITY === "DEBUG"
            ? "WATCH:times.line:old/new:" +
                JSON.stringify(vold) +
                "/" +
                JSON.stringify(vnew)
            : null
        );
        console.log("TIMES OB",JSON.stringify(this.times))
        this.fetchEvents();
        this.setRoute();
        this.setPageTitle();
      },
      deep: true
    }, //times.line
    "active.key": {
      handler: function(vnew, vold) {
        console.info(
          process.env.VERBOSITY === "DEBUG"
            ? "WATCH:ACTIVE.KEY:old/new:" + vold + "/" + vnew
            : null
        );
        this.setRoute();
        this.setItem();
        this.setGraph();
        this.setTimeline();
        this.setMap();
        this.setPageTitle();
      }
    }
  } //watch
}; //export.timeline

</script>