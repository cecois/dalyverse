<template>
<div id="vue-root" class="">
  <vue-topprogress ref="topProgress"></vue-topprogress>
  <vue-headful :title="page.title" description="People, Places, Events & Things in the Andy Dalyverse" />
  
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
          <p style="margin-top:2em;" class="dv-graph-copy">
            <div class="has-text-grey dv-graph-item" v-for="articleitem in active.item.article">
              {{articleitem}}
            </div>
          </p>
        </div nb="/.column">
      </div nb="/.columns">
        <div class="columns">
          
          <div class="column" v-if="active.graph">
            <div class="dv-index-graph-item" style="margin-top:4em;" v-for="ent in active.graph">
              <h5 class="is-size-4">{{ent.bucketLabel}}</h5>
              <li v-for="bucket in ent.buckets">
              <!-- {{bucket.edge.name}} -->
              <span v-if="bucket.edge._id.indexOf('people')==0" @click.stop="setActive(bucket.edge._id)" class="dv-trigger-active">{{bucket.edge.name}}</span>
              <span v-else>{{bucket.edge.name}}</span>
            </li>
              <!-- <p>{{ent.edge.name}}</p> -->
            </div>
          </div>
          
        </div nb="/.columns">
      </simplebar>
      </div nb="/#dv-index-graph">

  <div class="columns" style="padding-top:2em;">
    
    <div class="column has-text-grey-light">
      <div class="column has-text-grey-light">
      The Andy Daly universe is a dangerous place, populated by an inordinate number of known or suspected murderers:
    <p class="is-size-7">(bolded == known murder [otherwise suspected or implied])</p>
    </div>
    </div>

  </div>

      <div class="columns" style="margin-bottom:2em;">
        <div class="column is-3"></div>
        <div class="column is-6">
        
        <input class="input is-small" type="text" placeholder="" v-model="livefilter">
          
        </div>
        <div class="column is-3"></div>
      </div nb="/.columns">

<div class="columns dv-vertical-columns has-text-left" style="padding-left:1em;">
    <div class="column is-5" style="padding-top:2em;padding-left:1em;">
      <div v-if="!active.onside"><h4 class="is-size-4 has-text-weight-bold" style="margin-bottom:2em;">Played by Daly</h4>
            <dl v-if="(!livefilter || n.label.toLowerCase().indexOf(livefilter)>=0)" class="dv-dl" v-for="n in graph.true" style="margin-bottom:2em;">
              <div v-if="n.has_murdered" @click="setActive(n._id,'R')" class='level-item-left'>
                <h5 :class="[n.has_murdered.code==1?'has-text-weight-bold':'','is-size-5','dv-trigger-active']">{{n.label}}</h5>
              </div>
              <div v-if="n.has_murdered" style="" class="has-text-grey-lighter">
              <!-- {{n.has_murdered.explain}} -->
              <ul>
                <li class="dv-murder-explain" v-for="explanation in n.has_murdered.explain">
                  {{explanation}}
                </li>
              </ul>
            </div>
            </dl>
          </div nb="/v-if.onside">

      <div v-if="active.onside=='R'">

            </div nb="/v-if.onside">
    </div note="/.column">
    <div class="column is-2"></div>
    <div class="column is-5" style="padding-top:2em;padding-right:1em;">
      <div v-if="!active.onside"><h4 class="is-size-4 has-text-weight-bold" style="margin-bottom:2em;">Not Played by Daly</h4>
            <dl v-if="(!livefilter || n.label.toLowerCase().indexOf(livefilter)>=0)" class="dv-dl" v-for="n in graph.false" style="margin-bottom:2em;">
              <div v-if="n.has_murdered" @click="setActive(n._id,'L')" class='level-item-left'>
                <h5 :class="[n.has_murdered.code==1?'has-text-weight-bold':'','is-size-5','dv-trigger-active']">{{n.label}}</h5>
              </div>
              <div v-if="n.has_murdered" style="" class="has-text-grey-lighter">
              <!-- {{n.has_murdered.explain}} -->
              <ul>
                <li class="dv-murder-explain" v-for="explanation in n.has_murdered.explain">
                  {{explanation}}
                </li>
              </ul>
            </div>
            </dl>

          </div nb="/v-if.onside">
    </div note="/.column">
  </div>

<!--   <div class="columns dv-vertical-columns has-text-left">
    <div class="column is-12" style="padding-top:2em;">
      <div class="columns" style="margin-bottom:2em;">
        <div class="column is-3"></div>
        <div class="column is-6">
        
        <input class="input is-small" type="text" placeholder="" v-model="livefilter">
          
        </div>
        <div class="column is-3"></div>
      </div nb="/.columns"> -->

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
          <p style="margin-top:2em;" class="dv-graph-copy">
            <div class="has-text-grey dv-graph-item" v-for="articleitem in active.item.article">
              {{articleitem}}
            </div>
          </p>
        </div nb="/.column">
      </div nb="/.columns">
        <div class="columns">
          
          <div class="column" v-if="active.graph">
            <div class="dv-index-graph-item" style="margin-top:4em;" v-for="ent in active.graph">
              <h5 class="is-size-4">{{ent.bucketLabel}}</h5>
              <li v-for="bucket in ent.buckets">
              <!-- {{bucket.edge.name}} -->
              <span v-if="bucket.edge._id.indexOf('people')==0" @click.stop="setActive(bucket.edge._id)" class="dv-trigger-active">{{bucket.edge.name}}</span>
              <span v-else>{{bucket.edge.name}}</span>
            </li>
              <!-- <p>{{ent.edge.name}}</p> -->
            </div>
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
// import * as d3 from 'd3';
import simplebar from 'simplebar-vue';
  import 'simplebar/dist/simplebar.min.css';

export default {
  name: "Murderers",
  components: {
    simplebar
  },
  data () {
    return {
      graph: null,
      livefilter:null,
      page: {
        title: "Andy Dalyverse - Murderers"
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
      loadings:[
      {mod:"init",isLoading:false},
      {mod:"item",isLoading:false},
      {mod:"subgraph",isLoading:false}
      ],
      entities_total: { v: 0, loading: true },
      console: {
        msgs: [],
        clazz: null,
        throb: false
      },relationMap: [{"rel":"miscellaneous","source":"Miscellaneous Connections","target":"Miscellaneous Connections","ver":"miscellaneous"},{"rel":"hasFriend","source":"Friendships Claimed","target":"Friendship Claimed By","ver":"has friend"},{"rel":"isFormerMemberOf","source":"Memberships","target":"Former Members","ver":"is former member of"},{"rel":"isMemberOf","source":"Memberships","target":"Current Members","ver":"is member of"},{"rel":"caresFor","source":"Professional Partnerships - Charges","target":"Caretakers","ver":"cares for"},{"rel":"isCaredForBy","source":"Caretakers","target":"Professional Partnerships - Charges","ver":"is cared for by"},{"rel":"isClientOf","source":"Professional Partnerships - Agencies","target":"Professional Partnerships - Clients","ver":"is client of"},{"rel":"wasClientOf","source":"Former Professional Partnerships - Agencies","target":"Former Professional Partnerships - Clients","ver":"was client of"},{"rel":"hasParticipant","source":"Event Participants","target":"Events Participated In","ver":"has participant"},{"rel":"participatedIn","source":"Events Participated In","target":"Event Participants","ver":"participated in"},{"rel":"isPetOf","source":"Pets","target":"Owners","ver":"is pet of"},{"rel":"isChildOf","source":"Familial Relations - Parents","target":"Familial Relations - Children","ver":"is child of"},{"rel":"isPossibleChildOf","source":"Familial Relations - Possible Parents","target":"Familial Relations - Possible Children","ver":"is possible child of"},{"rel":"isSiblingOf","source":"Familial Relations - Sibling","target":"Familial Relations - Sibling","ver":"is sibling of"},{"rel":"islocateAt","source":"Locations","target":"Locations - Sites Of","ver":"is located at"},{"rel":"livesAt","source":"Home Locations, Current & Former","target":"Home Of","ver":"lives at"},{"rel":"isSpouseOf","source":"Current Spouses","target":"Current Spouses","ver":"is spouse of"},{"rel":"wasSpouseOf","source":"Former Spouses","target":"Former Spouses","ver":"was spouse of"},{"rel":"hasWorkedAt","source":"Former Employing Agencies","target":"Former Employees","ver":"has worked at"},{"rel":"hasWorkedFor","source":"Former Employers","target":"Former Personal Employees","ver":"has worked for"},{"rel":"worksAt","source":"Current Employers","target":"Current Employees","ver":"works at"},{"rel":"worksFor","source":"Professional Relationship - Current Employers","target":"Professional Relationship - Current Employees","ver":"works for"},{"rel":"occurredAt","source":"Event Location","target":"Events Here","ver":"occurred at"},{"rel":"seeAlso","source":"See Also","target":"See Also","ver":"see also"}]
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

      this.fetchMurderers()

  }, //mounted
  methods: {
        setItem: function () {

          this.$_.findWhere(this.loadings,{"mod":"item"}).isLoading=true

          // if(this.graph && this.active.key){
      console.log(process.env.VERBOSITY == "DEBUG" ? "setItem()..." : null);
      console.log(
        process.env.VERBOSITY == "DEBUG" && this.active.key == null ? "  -> active.key is " + this.active.key + " (NULL), nulling item..." : null
      );

              let ai = this.$_.findWhere(this.$_.union(this.graph.true,this.graph.false ), { id: this.active.key })

        this.active.item = {
          key: (!ai) ? null : ai.id,
          label: (!ai) ? null : ai.label,
          article: (!ai) ? null : ai.article,
          graph: null
        }

        this.$_.findWhere(this.loadings,{"mod":"item"}).isLoading=false
        window.scrollTo(0, 0);

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
    subGraph () {
      /*
      the raw graph is going to be so many hasWorkedAt|hasParticipatedIn|occuredAt relations etc.
      the problem is the vector between the source and target: e.g. if an edge connecting to Radio City sports a hasWorkedAt then we know Radio City is the target and we'll display the source under 'current & former employees' or whatever. Other relations sport more ambiguous direction (e.g. hasFriend). For viz, this all needs to be sorted out into situationally-sensitive categories (and their headings).

      So we first figure out what the typ (source|target) of the node core is (person,place,thing,event) so we know whether to grab the "source" or "target" heading out of this.relationMap.

      Then we'll group all relations by typ and sort them into buckets with that chosen heading, viz those.
      */

      // get the edges that have a typ (by filtering) and bucket em with a concat of the edgetype and which of the node ends (' id) matches active.key

      console.log(process.env.VERBOSITY == "DEBUG" ? "subGraph()..." : null);
      console.log(
        process.env.VERBOSITY == "DEBUG" ? "  -> active.key is " + this.active.key : null
      );

      // if we have an active.key
      if (this.active.key) {

this.$_.findWhere(this.loadings,{"mod":"subgraph"}).isLoading=true

        if(process.env.MODE=="T"){
axios.get("http://localhost:8000/full-graph-fake.json")
.then(response => {
  console.log(response.data.result[0])
                    this.active.graph = response.data.result[0];
                  }) //axios.then
                  .catch(e => {
                    console.error(e);
                  }); //axios.catch
        } else {
          // let q = "FOR v,e IN 1..1 OUTBOUND '"+this.active.key+"' edges RETURN {edge:v,type:e.type}"
          let q = "let ppl = (FOR v,e IN 1..1 OUTBOUND '"+this.active.key+"' edges RETURN {edge:v,type:e.type}) RETURN unique(ppl)"

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

            // console.log("RESP:",response.data.result);

//       let buckets =
//         this.$_.groupBy(
//           this.$_.map(this.$_.filter(response.data.result, (g) => {
//             return this.$_.has(g, 'type')
//           }), (lg) => {
//             let lgo = lg
//             let primary = (lg.source.id == this.active.key) ? 'source' : 'target'
//             lgo.edge_primary = lg.typ + '_for_' + primary
//             return lgo
//           }), 'edge_primary')

// console.log('BU:',JSON.stringify(buckets))
// console.log(response.data.result)
let buckets = this.$_.groupBy(response.data.result[0],'type');

            // console.log("RESP.buckets:",buckets);
// this.active.graph=response.data.result[0]
this.active.graph=this.$_.map(buckets,(B)=>{
// console.log("test uniq.pluck:",)
console.log("map.b:",B)
  return {
    bucketType:this.$_.uniq(this.$_.pluck(B,'type'))[0],
    bucketLabel:this.$_.findWhere(this.relationMap,{rel: this.$_.uniq(this.$_.pluck(B,'type'))[0]})?this.$_.findWhere(this.relationMap,{rel: this.$_.uniq(this.$_.pluck(B,'type'))[0]}).source:'Unlabeled'
    ,buckets:B
  }
})
      // this.active.graph = this.$_.map(buckets, (Rs) => {

      //   // get bucket type - same for all, take first, bust it open for edgetype
      //   // get bucket type - same for all, take first, bust it open for primary (driving) node
      //   // shop btyp to relationMap for situational labels (we choose which later)
      //   let btyp = this.$_.first(Rs).edge_primary.split('_for_')[0],
      //     bprm = this.$_.first(Rs).edge_primary.split('_for_')[1],
      //     brel = this.$_.findWhere(this.relationMap, { rel: btyp });

      //   // gather up all the entries of this bucket        
      //   let entries = this.$_.map(Rs, (t) => {
      //       let datanode = (t.source.id == this.active.key) ? t.target : t.source;
      //       return datanode
      //     }) //map

      //   let o = {
      //     bucket_raw: btyp,
      //     bucket_label: (bprm == 'source') ? brel.source : brel.target,
      //     nodes: entries
      //   }

      //   return o

      // })//map
      
}) //axios.then
                  .catch(e => {
                    console.error(e);
                  })
                  .finally(e => {
                    this.$_.findWhere(this.loadings,{"mod":"subgraph"}).isLoading=false
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

      // this.active.graph=graf

    } //subgraph
    ,setRoute: function () {
        console.info(process.env.VERBOSITY === "DEBUG" ? "setRoute()..." : null);

// console.log("in setroute, key:",this.active.key)

        this.$router.push({
          params: {
            activeKey: this.active.key
          }
        }); //rejplace
      } //setRoute
    ,setActive (nak,side) {
      let nik = (nak)?nak:null;
      console.log('setting active w :nak:', nik);
      let nakk = (nik) ? nik : this.active.key

      if (nakk) {
        let nakkf = (nakk.indexOf('%') >= 0) ? decodeURIComponent(nakk) : nakk

        console.info(
          process.env.VERBOSITY === "DEBUG" ? "activating w _id:" + nakkf : null
        );

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
    fetchMurderers: function () {
        console.info(
          process.env.VERBOSITY === "DEBUG" ? "fetchEntities()..." : null
        );

this.$_.findWhere(this.loadings,{"mod":"init"}).isLoading=true

if(process.env.MODE=="T"){

axios.get('http://localhost:8000/dv-index.json')
.then(response => {
            console.info(
              process.env.VERBOSITY === "DEBUG" ? "setting entities w/ axios response..." : null
            );

            // this.graph = {
            //   nodes: response.data.result
            // }
            this.graph = this.$_.groupBy(response.data.result,'daly');
// this.graph={
//   nodes:this.$_.map(
//     this.$_.uniq(
//     this.$_.map(response.data.result,(r)=>{
//       return r.nami?r.nami[0]:r.label[0]
//     }))
//     .sort(),(m)=>{return {
//       alpha:m
//       ,entities:
//       this.$_.filter(response.data.result,(r)=>{return r.nami?r.nami[0]==m:r.label[0]==m})
//     }})
// }

          }) //axios.then
          .catch(e => {
            console.error(e);
          }); //axios.catch

} else {
        let q =
          'for p in people filter p.has_murdered.code >=0 return {daly:p.daly,_id:p._id,id:p._id,label:p.name,nami:p.nami,has_murdered:p.has_murdered,article:p.article}'


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

// console.log('response.data.result:')
// console.log(response.data.result)
// this.graph={nodes:response.data.result};
this.graph = this.$_.groupBy(response.data.result,'daly');
// this.graph={
//   nodes:this.$_.map(
//     this.$_.uniq(
//     this.$_.map(response.data.result,(r)=>{
//       return r.nami?r.nami[0]:r.label[0]
//     }))
//     .sort(),(m)=>{return {
//       alpha:m
//       ,entities:
//       this.$_.filter(response.data.result,(r)=>{return r.nami?r.nami[0].toLowerCase()==m.toLowerCase():r.label[0].toLowerCase()==m.toLowerCase()})
//     }})
// }

          }) //axios.then
          .catch(e => {
            console.error(e);
          }).finally(e => {
            this.$_.findWhere(this.loadings,{"mod":"init"}).isLoading=false;
          }); //axios.catch
      } //fetchEntities
}//ifmodet
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
        "active.key": {
      handler: function (vnew, vold) {
        console.info(
          process.env.VERBOSITY === "DEBUG" ? "WATCH:ACTIVE.KEY:old/new:" + vold + "/" + vnew : null
        );
        // if(this.graph){
        // this.setRoute();
        this.setItem();
        this.subGraph();
        // }//if graph
        // this.subGraph();
        // this.setGraph();
        // this.active.graph = this.setGraph();
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
