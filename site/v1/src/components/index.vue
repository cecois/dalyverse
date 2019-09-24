<template>
<div id="vue-root" class="">
  <vue-headful :title="page.title" description="People, Places, Events & Things in the Andy Dalyverse" />
  <div class="columns" style="padding-top:2em;">
    
    <div class="column has-text-grey-light">
      <div class="title">Index:</div>
    </div>

  </div>
  <div class="columns dv-vertical-columns has-text-left" style="padding-left:1em;">
    <div class="column " style="padding-top:2em;">
      <div class="level" style="margin-bottom:2em;">
        <div class="level-item"></div>
        <div class="level-item">
        
        <input class="input is-small" type="text" placeholder="" v-model="livefilter">
          
        </div>
        <div class="level-item"></div>
      </div nb="/.level">

      <div class="table-container">
        <!-- TILES PER LETTER? -->
        <table v-if="graph" class="table dv-index-table is-striped is-fullwidth">
          <tbody>
            <tr v-for="N in graph.nodes">
              <th>{{N.alpha}}</th>
              <td v-for="e in N.entities" class="dv-index-entities" v-if="(!livefilter || e.label.toLowerCase().indexOf(livefilter)>=0)"><span v-if="e" @click.stop="setActive(e.id)" class="dv-trigger-active">{{e.label}}</span>
              </td>
              <!-- <td>v-vor=e in N.entities</td> -->
            </tr>
          </tbody>
        </table>
      </div nb="/.table-container">

<div class="is-overlay" v-if="active.key" id="dv-index-graph">
        <!-- Main container -->
        <nav class="level" style="margin-top:1em;">
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
          
          <p style="padding-left:1em;" class="dv-title is-size-3">{{active.item.label}}</p>
          <!-- <p class="is-size-7 dv-title-sub">({{this.$MOMENT(active.item.start).format('YYYY.MMM.DD')}}) <a v-if="(active.item && active.item.geo.length>0)" class="" v-on:click="zoomToNext">
            <b-icon icon="magnify-plus-outline" size="is-small"></b-icon>
          </a></p> -->
          <p style="margin-top:2em;">
            <div class="has-text-grey dv-graph-copy" style="padding:0 4em;font-weight:400;" v-for="articleitem in active.item.article">
              {{articleitem}}
            </div>
          </p>
        </div nb="/.column">
      </div nb="/.columns">
        <div class="columns">
          
          <div class="column">
            participants et al
            <!-- <div style="margin-top:4em;" v-if="active.key">
              <p class="is-size-4 dv-title-sub">Participants:</p>
              <p v-for="prsn in active.graph.participants">{{prsn.name}}</p>
            </div> -->
          </div>
          
        </div nb="/.columns">
      </simplebar>
      </div nb="/#dv-index-graph">

    </div note="/.column">
  </div>
</div>
<!-- ./#vue-root -->
</template>

<script>
import * as d3 from 'd3';
import simplebar from 'simplebar-vue';

export default {
  name: "Index",
  components: {
    simplebar
  },
  data () {
    return {
      graph: null,
      livefilter:null,
      page: {
        title: "Andy Dalyverse - Alpha Index"
      },
      meta: { graph: { loading: false } },
      state: "filled",
      fittable: true,
      query: null,
      active: {
        key: null,
        item: { article: null },
        graph: null
      },
      entities_total: { v: 0, loading: true },
      console: {
        msgs: [],
        clazz: null,
        throb: false
      }
    }
  }, // data
  beforeCreate () {}, // beforeCreate
  created () {


    console.info(
      process.env.VERBOSITY === "DEBUG" ? "begin CREATED, processing incoming vars" : null
    );


    this.d3 = d3;

  }, // created
  mounted: function () {
    console.info(
      process.env.VERBOSITY === "DEBUG" ? "running in mode:" + process.env.MODE : null
    );
    
// if(process.env.MODE=='T'){
//         let sAxios = document.createElement('script')
//         sAxios.setAttribute('src','http://localhost:8000/axios.min.js')
//         document.head.appendChild(sAxios)

//         let sLeaflet = document.createElement('script')
//         sLeaflet.setAttribute('src','http://localhost:8000/leaflet.js')
//         document.head.appendChild(sLeaflet)

//         let sVis = document.createElement('script')
//         sVis.setAttribute('src','http://localhost:8000/vis.min.js')
//         document.head.appendChild(sVis)

//         let cLeaflet = document.createElement('link')
//         cLeaflet.setAttribute('rel','stylesheet')
//         cLeaflet.setAttribute('src','http://localhost:8000/leaflet.css')
//         document.head.appendChild(cLeaflet)

//         let cVis = document.createElement('link')
//         cVis.setAttribute('rel','stylesheet')
//         cVis.setAttribute('src','http://localhost:8000/vis.min.css')
//         document.head.appendChild(cVis)

//         let cVisTimeline = document.createElement('link')
//         cVisTimeline.setAttribute('rel','stylesheet')
//         cVisTimeline.setAttribute('src','http://localhost:8000/vis-timeline-graph2d.min.css')
//         document.head.appendChild(cVisTimeline)

        
//         let cMaterial = document.createElement('link')
//         cMaterial.setAttribute('rel','stylesheet')
//         cMaterial.setAttribute('src','http://localhost:8000/css/materialdesignicons.min.css')
//         document.head.appendChild(cMaterial)

//       } else {

//                 let sAxios = document.createElement('script')
//         sAxios.setAttribute('src','http://unpkg.com/axios/dist/axios.min.js')
//         document.head.appendChild(sAxios)

//         let sLeaflet = document.createElement('script')
//         sLeaflet.setAttribute('src','https://unpkg.com/leaflet@1.4.0/dist/leaflet.js')
//         document.head.appendChild(sLeaflet)

//         let sVis = document.createElement('script')
//         sVis.setAttribute('src','https://cdnjs.cloudflare.com/ajax/libs/vis/4.17.0/vis.min.js')
//         document.head.appendChild(sVis)

//         let cLeaflet = document.createElement('link')
//         cLeaflet.setAttribute('rel','stylesheet')
//         cLeaflet.setAttribute('src','https://unpkg.com/leaflet@1.4.0/dist/leaflet.css')
//         document.head.appendChild(cLeaflet)

//         let cVis = document.createElement('link')
//         cVis.setAttribute('rel','stylesheet')
//         cVis.setAttribute('src','https://cdnjs.cloudflare.com/ajax/libs/vis/4.17.0/vis.min.css')
//         document.head.appendChild(cVis)

//         let cVisTimeline = document.createElement('link')
//         cVisTimeline.setAttribute('rel','stylesheet')
//         cVisTimeline.setAttribute('src','https://visjs.github.io/vis-timeline/dist/vis-timeline-graph2d.min.css')
//         document.head.appendChild(cVisTimeline)

//         let cMaterial = document.createElement('link')
//         cMaterial.setAttribute('rel','stylesheet')
//         cMaterial.setAttribute('src','href="//cdn.materialdesignicons.com/2.0.46/css/materialdesignicons.min.css')
//         document.head.appendChild(cMaterial)

//       }

      this.fetchIndex()
      // this.$nextTick(() => this.fetchIndex())

// this.doPieChart()
  }, //mounted
  methods: {
        setItem: function () {
      console.log(process.env.VERBOSITY == "DEBUG" ? "setItem()..." : null);
      console.log(
        process.env.VERBOSITY == "DEBUG" && this.active.key == null ? "  -> active.key is " + this.active.key + " (NULL), nulling item..." : null
      );

      // this.active.item =
      //   this.active.key !== null ? this.$_.findWhere(this.events, {
      //     id: this.active.key
      //   }) : this.nullItem();

              let ai = this.$_.findWhere(this.$_.flatten(this.$_.pluck(this.graph.nodes,'entities')), { id: this.active.key })

console.log("AI:",ai);

        this.active.item = {
          key: (!ai) ? null : ai.id,
          label: (!ai) ? null : ai.label,
          article: (!ai) ? null : ai.article,
          graph: null
        }

    }, //setitem
    nullGraph: function () {
      console.info(
        process.env.VERBOSITY === "DEBUG" ? "returning null graph..." : null
      );
      this.active.key = null
      this.active.graph = null
      this.active.article = null
        // return {
        //   participants: null,
        //   locations: null
        // };
    }, //nullGraph
    setGraph: function () {
      console.log(process.env.VERBOSITY == "DEBUG" ? "setGraph()..." : null);
      console.log(
        process.env.VERBOSITY == "DEBUG" ? "  -> active.key is " + this.active.key : null
      );

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
                  }) //axios.then
                  .catch(e => {
                    console.error(e);
                  }); //axios.catch
                }//ifmodet
      } //if key
      else {
        // no key? null it out
        console.log(
          process.env.VERBOSITY == "DEBUG" ? "no active.key, nulling graph..." : null
        );
        this.active.graph = this.nullGraph();
      }
    }, //setgraph
    setActive (nak) {
      let nik = (nak)?nak:null;
      console.log('setting active w :nak:', nik);
      let nakk = (nik) ? nik : this.active.key

      if (nakk) {
        let nakkf = (nakk.indexOf('%') >= 0) ? decodeURIComponent(nakk) : nakk

        console.info(
          process.env.VERBOSITY === "DEBUG" ? "activating w _id:" + nakkf : null
        );


//         let ai = this.$_.findWhere(this.$_.flatten(this.$_.pluck(this.graph.nodes,'entities')), { id: nakkf })

// console.log("AI:",ai);

//         this.active.item = {
//           key: (!ai) ? null : ai.id,
//           label: (!ai) ? null : ai.label,
//           article: (!ai) ? null : ai.article,
//           graph: null
//         }
        this.active.key=nakk

      } //if nakk

    },
    setPageTitle: function () {
      let sub = null;

      switch (true) {
        case typeof this.active.item == "undefined":
          sub = this.active.key;
          break;
        default:
          sub = this.active.item.content;
          break;
      }

      this.page.title = "Dalyverse Entities Graph: " + sub;
    }, //setPageTitle
    fetchIndex: function () {
        console.info(
          process.env.VERBOSITY === "DEBUG" ? "fetchEntities()..." : null
        );


if(process.env.MODE=="T"){

axios.get('http://localhost:8000/dv-index.json')
.then(response => {
            console.info(
              process.env.VERBOSITY === "DEBUG" ? "setting entities w/ axios response..." : null
            );

            // this.graph = {
            //   nodes: response.data.result
            // }
this.graph={
  nodes:this.$_.map(
    this.$_.uniq(
    this.$_.map(response.data.result,(r)=>{
      return r.nami?r.nami[0]:r.label[0]
    }))
    .sort(),(m)=>{return {
      alpha:m
      ,entities:
      this.$_.filter(response.data.result,(r)=>{return r.nami?r.nami[0]==m:r.label[0]==m})
    }})
}

          }) //axios.then
          .catch(e => {
            console.error(e);
          }); //axios.catch

} else {
        let q =
          'for p in people return {daly:p.daly,_id:p._id,id:p._id,label:p.name,nami:p.nami,has_murdered:p.has_murdered,article:p.article}'


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
            console.info(
              process.env.VERBOSITY === "DEBUG" ? "setting entities w/ axios response..." : null
            );

            // let deeznodes = response.data.result[0].entitiez[0]
            this.entities_total.loading = false
            this.entities_total.v = response.data.result.length
            this.console.msgs.push({ msg: response.data.result.length + ' entities loaded', severity: 'normal' })

console.log('response.data.result:')
console.log(response.data.result)

this.graph={
  nodes:this.$_.map(
    this.$_.uniq(
    this.$_.map(response.data.result,(r)=>{
      return r.nami?r.nami[0]:r.label[0]
    }))
    .sort(),(m)=>{return {
      alpha:m
      ,entities:
      this.$_.filter(response.data.result,(r)=>{return r.nami?r.nami[0].toLowerCase()==m.toLowerCase():r.label[0].toLowerCase()==m.toLowerCase()})
    }})
}

          }) //axios.then
          .catch(e => {
            console.error(e);
          }); //axios.catch
      } //fetchEntities
}//ifmodet
  }, //methods
  computed: {}, //computed

  watch: {
        "active.key": {
      handler: function (vnew, vold) {
        console.info(
          process.env.VERBOSITY === "DEBUG" ? "WATCH:ACTIVE.KEY:old/new:" + vold + "/" + vnew : null
        );
        // this.setRoute();
        this.setItem();
        this.setGraph();
        // this.setTimeline();
        // if(this.MAP){this.setMap();}
        // this.setPageTitle();
      }
    }
  } //watch
}; //export.timeline
</script>

<style scoped=true>
/* ---------------------------------- BULMA -- */

.hero.is-medium > .hero-body {
  padding: 0px;
}
</style>
