<template>
<div id="vue-root" class="">
  <vue-topprogress ref="topProgress"></vue-topprogress>
  <vue-headful :title="page.title" description="People, Places, Events & Things in the Andy Dalyverse" />
  <div class="columns" style="padding-top:2em;">
    
    <div class="column has-text-grey-light">
      <div class="title">Observations, Humorous and Otherwise</div>
      <!-- <div class="has-text-grey is-size-7">(bolded == played by Daly)</div> -->
    </div>

  </div>
  <div class="columns dv-vertical-columns has-text-left">
    <div class="column is-12" style="padding-top:2em;">
      <div class="columns" style="margin-bottom:2em;">
        <div class="column is-12">
        
        <input class="input is-large" type="text" placeholder="" v-model="livefilter">
          
        </div NB=".column.is-12">
      </div  NB=".columns">

      <div class="table-container">
        <!-- TILES PER LETTER? -->
        <table class="table dv-index-table is-striped">
          <tbody>
            <tr v-for="P in observations" v-if="(!livefilter || P.toLowerCase().indexOf(livefilter.toLowerCase())>=0)">
              <!-- <th>{{P.title}}</th> -->
              <td>
                <span class="">{{P}}</span>
              </td>
              <!-- <td>v-vor=e in N.entities</td> -->
            </tr>
          </tbody>
        </table>
      </div nb="/.table-container">
    </div note="/.column is-12">
  </div>
</div>
<!-- ./#vue-root -->
</template>

<script>
// import * as d3 from 'd3';
import simplebar from 'simplebar-vue';
  import 'simplebar/dist/simplebar.min.css';

export default {
  name: "Poetry",
  components: {
    simplebar
  },
  data () {
    return {
      active:null,
      observations: [
"It's more comfortable to ride a horse with a saddle than without."
,"What about a donkey?"
,"If you need to (or if you want to) you can fuck a can of beans."
      ],
      livefilter:null,
      page: {
        title: "Andy Dalyverse - Observations, Humorous and Otherwise"
      },
      meta: { graph: { loading: false } },
      loadings:[
      {mod:"init",isLoading:false},
      {mod:"item",isLoading:false},
      {mod:"subgraph",isLoading:false}
      ],
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

  }, // created
  mounted: function () {
    console.info(
      process.env.VERBOSITY === "DEBUG" ? "running in mode:" + process.env.MODE : null
    );

  }, //mounted
  methods: {
    setRoute: function () {
        console.info(process.env.VERBOSITY === "DEBUG" ? "setRoute()..." : null);

        this.$router.push({
          params: {
            activeKey: this.active.key
          }
        });
      } //setRoute
    ,setActive: function (p) {

if(p){
  this.active=this.$_.findWhere(this.poetry.poems,{_id:p})
} else {
  this.active=null;
}

      } //setActive
    ,setPageTitle: function () {
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
    } //setPageTitle
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
  } //watch
}; //export.timeline
</script>

<style scoped=true>
/* ---------------------------------- BULMA -- */

.hero.is-medium > .hero-body {
  padding: 0px;
}
</style>
