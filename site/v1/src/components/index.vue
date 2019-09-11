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
      
      <div class="table-container">
        <!-- TILES PER LETTER? -->
        <table v-if="graph" class="table dv-index-table is-striped is-fullwidth">
          <tbody>
            <tr v-for="N in graph.nodes">
              <th>{{N.alpha}}</th>
              <td v-for="e in N.entities" class="dv-index-entities"><span v-if="e">{{e.label}}</span></td>
              <!-- <td>v-vor=e in N.entities</td> -->
            </tr>
          </tbody>
        </table>
      </div nb="/.table-container">
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
    // if (process.env.MODE == "T") {
      // this.fakeFetchEntities('small')

    // } else {
      this.fetchIndex()

    // }

    // if (this.$route.params
    //   .activeid) {
    //   console.log("key incoming -- " + decodeURIComponent(this.$route.params.activeid) + " -- activating...");
    //   this.active.key = decodeURIComponent(this.$route.params.activeid);
    //   console.log("setting acxtive w/ route param/this.active.key:", this.active.key);
    // }
// this.doPieChart()
  }, //mounted
  methods: {
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
      return r.label[0]
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
    // 'active': { handler: function (vnew) { this.setActive(vnew) } } //active // ,
    query: {
      handler: function (vnew, vold) {


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
