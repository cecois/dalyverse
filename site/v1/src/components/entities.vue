<template>
<div id="vue-root" class="container is-fixed-top">
  <vue-headful :title="page.title" description="People, Places, & Things in the Andy Dalyverse" />
<!-- #.navbar </nav> -->

<!-- <div class="" id="container-main"> -->
  <!-- -------------------------------------------------------------- SLIDER -->

<section class="hero is-primary is-medium is-fullheight">
  <!-- Hero head: will stick at the top -->
  <div class="hero-head">
    <!-- <nav class="navbar">
      <div class="container">
        <div class="navbar-brand">
          <a class="navbar-item">
            <img src="https://bulma.io/images/bulma-type-white.png" alt="Logo">
          </a>
          <span class="navbar-burger burger" data-target="navbarMenuHeroA">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </div>
        <div id="navbarMenuHeroA" class="navbar-menu">
          <div class="navbar-end">
            
          </div>
        </div>
      </div>
    </nav> -->
  </div>

  <!-- Hero content: will be in the middle -->
  <div class="hero-body">
      <div id="network">
  <svg></svg>
    </div>
  </div>

  <!-- Hero footer: will stick at the bottom -->
  <div class="hero-foot">
    <!-- <nav class="tabs">
      <div class="container">
        -->

<div v-if="state === 'filled'" id="console" class="has-text-weight-bold">

<div class="tile is-ancestor">
  <div class="tile is-4 is-vertical is-parent">
    <div class="tile is-child box">
      <div class="columns">
        <div class="column">
        </div>
        <div class="column">
    </div>
      </div>
    </div>

  </div>
  <div class="tile is-parent">
    <div class="tile is-child box">
      <p class="title is-size-7" v-if="active.key">ACTIVE</p>
{{active.key}}
{{active.item.article}}
    </div>
  </div>
</div>

</div note="/console">

      </div>
   <!-- </nav> 
  </div>
   -->
</section>

<!-- <div id="network">
  <svg></svg>
</div>
</div> 
-->
<!-- ************************************************************************************ /#CONTAINER-MAIN -->

</div><!-- ./#vue-root -->
</template>

<script>
  import * as d3 from 'd3';

export default {
  name: "Entities",
  data() {
    return {
      chartvalues:[99, 71, 78, 25, 36, 92],
      page: {
        title: "Andy Dalyverse Entities Graph"
      },
      state: "filled",
      fittable: true,
      nodes: new vis.DataSet([
        {id: 1, label: 'N1'},
        {id: 2, label: 'N2'},
        {id: 3, label: 'N3'},
        {id: 4, label: 'N4'},
        {id: 5, label: 'N5'}
    ]),
      edges: new vis.DataSet([
        {from: 1, to: 3},
        {from: 1, to: 2},
        {from: 2, to: 4},
        {from: 2, to: 5}
    ]),
      seens: [],
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
      active: {
        key: null,
        item: {article:null},
        graph: null
      },
      entities_total: 0,
      console: {
        msg: "",
        clazz: null,
        throb: false
      },
      miserables: {}
    }; // return
  }, // data
  beforeCreate() {}, // beforeCreate
  created() {
    console.info(
      process.env.VERBOSITY === "DEBUG"
        ? "begin CREATED, processing incoming vars"
        : null
    );

      this.$once('hook:once', function () {
    this.fittable = false;
    this.fetchTotalEntities();
  })

    this.console = {
      msg: "loading...",
      throb: true,
      clazz: "mdi-clock"
    };

    if (this.$route.params.activeid) {
      this.active.key = this.$route.params.activeid;
    }

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
    // this.setSlider();
    this.fetchEntities();
    // this.d3ForceDirect();
  }, //mounted
  methods: {
    getClass: function (which,one) {

//which == node|edge
//one == 'worksAt'|'hasFriend'|etc
let clas = null;

      switch (true) {
        case (one == 'daly'):
          clas = 'node node-pi'
          break;
        case (which == 'node' && one !== 'daly'):
          clas = 'node node-pu'
          break;
      case (which == 'edge' && one == 'worksAt'):
          clas = 'edge edge-wa'
          break;
        default:
          clas = 'node-edge-default'
          break;
      }

return clas

    }, // getclass
    d3ForceDirect: function () {

var parentDiv = document.getElementById("network");

var svg = d3.select("svg"),
width = parseInt(window.getComputedStyle(parentDiv).width.replace("px","")),
      height = parseInt(window.getComputedStyle(parentDiv).height.replace("px",""))
    // width = +svg.attr("width"),
    // height = +svg.attr("height");

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().distance(10).strength(0.5))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

  let fakenodes = [
  {id:"people/_:daltonwilcox",_id:"people/_:daltonwilcox","label":"Dalton Wilcox",article:"Dalton Wilcox is the Poet Laureate of the West"},{id:"people/_:vampire",_id:"people/_:vampire","label":"Random Vampire",article:"Random Vampire is a random vampire vanquished by Dalton Wilcox"},{id:"people/_:mummy",_id:"people/_:mummy","label":"Random Mummy",article:"Random Mummy is a random mummy vanquished by Dalton Wilcox"}]

  let fakeedges = [
{source:'people/_:daltonwilcox',target:'people/_:vampire'},
{source:'people/_:daltonwilcox',target:'people/_:mummy'}
  ]

  var nodes = this.nodes,
      nodeById = d3.map(nodes, function(d) { return d.id; }),
      links = this.edges,
      bilinks = [];

  links.forEach(function(link) {
    var s = link.source = nodeById.get(link.source),
        t = link.target = nodeById.get(link.target),
        i = {}; // intermediate node
    nodes.push(i);
    links.push({source: s, target: i}, {source: i, target: t});
    bilinks.push([s, i, t]);
  });

  var link = svg.selectAll(".link")
    .data(bilinks)
    .enter().append("path")
      .attr("class", "edge");

  var node = svg.selectAll(".node")
    .data(nodes.filter(function(d) { return d.id; }))
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 5)
      .attr("fill", function(d) { return color(d.group); })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", (o)=>{this.active.key=o._id}));

  node.append("title")
      .text(function(d) { return d.id; });

  simulation
      .nodes(nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(links);

  function ticked() {
    link.attr("d", positionLink);
    node.attr("transform", positionNode);
  }

function positionLink(d) {
  return "M" + d[0].x + "," + d[0].y
       + "S" + d[1].x + "," + d[1].y
       + " " + d[2].x + "," + d[2].y;
}

function positionNode(d) {
  return "translate(" + d.x + "," + d.y + ")";
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x, d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x, d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null, d.fy = null;
}


    }, // setd3force
    setD3HelloWorld: function () {}, // end of setD3HelloWorld()
    setChartLine: function () {}, //setchart
    setNetworkVisJS: function () {}, //setNetwork
    fetchTotalEntities: function () {

          console.info(
      process.env.VERBOSITY === "DEBUG"
        ? "getTotalEntities()..."
        : null
    );

               let q = 'let plcs = (for l in places return {_id:l._id,id:l._id,label:l.name,article:l.article})\
let ppls = (for p in people return {_id:p._id,id:p._id,label:p.name,article:p.article})\
let tngs = (for t in things return {_id:t._id,id:t._id,label:t.name,article:t.article})\
let evnts = (for ev in events return {_id:ev._id,id:ev._id,label:ev.name,article:ev.article})\
let pplsplcs = (flatten(append(ppls,plcs)))\
let tngsevts = (flatten(append(tngs,evnts)))\
let entities = (RETURN flatten(append(pplsplcs,tngsevts)))\
return count(entities[0])'

      axios
        .post("http://" + process.env.ARANGOIP + ":8529/_api/cursor", {
          query: q
        })
        .then(response => {
          console.info(
            process.env.VERBOSITY === "DEBUG"
              ? "setting entities_total w/ axios response..."
              : null
          );
          this.entities_total = response.data.result[0];
        }) //axios.then
        .catch(e => {
          console.error(e);
        }); //axios.catch

    }, //getotalevents
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
          sub = this.active.key;
          break;
        default:
          sub = this.active.item.content;
          break;
      }

      this.page.title = "Dalyverse Events Graph: " + sub;
    }, //setPageTitle
    setItem: function(q){

this.active.item=this.$_.find(this.nodes,(no)=>{
  return no._id==q
})

    },
    nullItem: function() {
      console.info(
        process.env.VERBOSITY === "DEBUG" ? "returning null item..." : null
      );
      return {
_key:null,
_rev:null,
name:null,
has_murdered:null,
article:null
      };
    }, //nullItem
        nullGraph: function() {
      console.info(
        process.env.VERBOSITY === "DEBUG" ? "returning null graph..." : null
      );
      return {
        participants: null,
        locations: null
      };
    }, //nullGraph
    DUMP: function (thing) {

console.info(
        (process.env.VERBOSITY === "DEBUG" && (thing)) ? thing : null
      );

if(process.env.VERBOSITY === 'DEBUG'){
      console.log("DUMP:thing",thing)}

    }, //dump
    fetchEntities: function() {
      console.info(
        process.env.VERBOSITY === "DEBUG" ? "fetchEntities()..." : null
      );

      let q =
        'let plcs = (for l in places return {_id:l._id,id:l._id,label:l.name,article:l.article})\
let ppls = (for p in people return {_id:p._id,id:p._id,label:p.name,article:p.article})\
let tngs = (for t in things return {_id:t._id,id:t._id,label:t.name,article:t.article})\
let evnts = (for ev in events return {_id:ev._id,id:ev._id,label:ev.name,article:ev.article})\
let pplsplcs = (flatten(append(ppls,plcs)))\
let tngsevts = (flatten(append(tngs,evnts)))\
let entities = (RETURN flatten(append(pplsplcs,tngsevts)))\
let edgees = (\
for ent in entities[0] \
FOR v, e, p IN 1..1 ANY ent edges \
RETURN {typ:e.type,source:e._from,target:e._to,id:e._id})\
return {entitiez:unique(entities),edgez:unique(edgees)}'

      axios
        .post("http://" + process.env.ARANGOIP + ":8529/_api/cursor", {
          query: q
        })
        .then(response => {
          console.info(
            process.env.VERBOSITY === "DEBUG"
              ? "setting entities w/ axios response..."
              : null
          );

          // let deeznodes = this.$_.map(response.data.result[0].entitiez[0],(n)=>{return {id:n.id,label:n.label,article:n.article}})
          let deeznodes = response.data.result[0].entitiez[0]

          this.nodes = deeznodes
          this.edges = response.data.result[0].edgez

        }) //axios.then
        .catch(e => {
          console.error(e);
        }); //axios.catch
    }, //fetchEntities
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
              'for p in people return p'
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
          activeid: this.active.key
        }
      }); //rejplace
    } //setRoute
  }, //methods
  computed: {}, //computed
  watch: {
    'active.key': {handler:function(vnew){this.setItem(vnew)}} //active
    ,nodes: {
      handler: function(vnew, vold) {
        console.info(
          process.env.VERBOSITY === "DEBUG"
            ? "WATCH:nodes:old/new:" + vold.length + "/" + vnew.length
            : null
        );
        // this.setNetwork();
        // this.setChart()
        // this.d3ForceDirect()
      }
    } //nodes
  } //watch
}; //export.timeline

</script>

<style>
body{height:100%;overflow:auto;}
#network {
  /*position:relative;*/
  height: 100vh;
  width: 100%;
  /*min-height: calc(100vh - #{$navbar-height});*/
  /*height:auto;width:auto;*/
  background-color:rgba(55,244,244,.5);
  /*display: block;*/
  overflow:hidden;
}

#network > svg {
/*height:50vh;*/
background-color:rgba(88,232,88,.7);
height:80%;
width:100%;
  overflow:hidden;
}

.node {
  stroke: #fff;
  stroke-width: 1.5px;
}

.edge {
  fill: none;
  stroke: #bbb;
}
/*
*/
.node-edge-default{
  stroke: rgba(4,4,4,.4);
  fill:none;
  stroke-width: 2px;
}

.node-pu{
  stroke: #3f0081;
  stroke-width: 1.5px;
}

text{
    fill: #fff;
    stroke: transparent;
    font-size:.7em;
}

.node-pi{
  stroke: #e300db;
  stroke-width: 1.5px;
}

.edge-wa
  {
  fill: none;
  stroke: #bbb;
}

.edge-hf
  {
  fill: none;
  stroke: #aaa;
}

/* ---------------------------------- BULMA -- */
.hero.is-medium > .hero-body{
  padding:0px;
}

</style>