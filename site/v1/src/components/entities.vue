<template>
<div id="vue-root" class="container is-fixed-top">
  <vue-headful :title="page.title" description="People of the Andy Dalyverse" />
<!-- ************************************************************************************ #CONSOLE -->
<div v-if="state === 'filled'" id="console" class="has-text-weight-bold">

<div class="tile is-ancestor">
  <div class="tile is-4 is-vertical is-parent">
    <div class="tile is-child box">
      <div class="columns">
        <div class="column">
        </div>
        <div class="column">
    </div>
      </div><!-- /.columns -->
    </div><!-- /.tile -->

  </div>
  <div class="tile is-parent">
    <div class="tile is-child box">
      <p class="title is-size-7" v-if="active.key">ACTIVE</p>

    </div>
  </div>
</div>

</div><!-- ************************************************************************************ /#CONSOLE -->
<!-- #.navbar </nav> -->

<div class="" id="container-main">
  <!-- -------------------------------------------------------------- SLIDER -->
<div id="network">
  <svg></svg>
</div>
</div><!-- ************************************************************************************ /#CONTAINER-MAIN -->

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
        item: null,
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

console.log('which and one in getclass');
console.log(which,one);

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

      console.log("setD3ForceDirect()...");
    
var parentDiv = document.getElementById("network");
// var svg = d3.select(parentDiv).append("svg"),
    // var svg = d3.select(parentDiv).append("svg"),
    var svg = d3.select("svg"),
    // svg.select("#network > svg"),
      // width = +svg.attr("width"),
      // height = +svg.attr("height"),
      width = parseInt(window.getComputedStyle(parentDiv).width.replace("px","")),
      height = parseInt(window.getComputedStyle(parentDiv).height.replace("px",""))
      var G = svg.append('g')

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().distance(10).strength(0.5))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

// d3.json("http://localhost:8000/miserables-daly.json", (error, graph)=>{
//   if (error) throw error;

            // var G = svg.append('g')
      var transform = d3.zoomIdentity; //zoom

            G.call(d3.zoom()
              .scaleExtent([1 / 2, 8])
                .on("zoom",()=>{
                  G.attr("transform", d3.event.transform)
                })
                );

      //       force
      // .nodes(graph.nodes)
      // .links(graph.links)
      // .start();

  // set nodes and links var from data
  // var nodes = graph.result[0].entitiez[0],
  // var nodes = graph.nodes,
  var nodes = this.nodes,
      links = this.edges,
      // this.nodes = response.result[0].entitiez[0]
// links = graph.result[0].edgez,
      nodeById = d3.map(nodes, function(d) { return d.id; }),
// links = graph.result[0].edgez,
      // links = graph.links,
      bilinks = [];
      badlinks = [];
      // bilinks = links;

/*
*/
// loop through all edges from json
  links.forEach(function(link) {
    // console.log('link.source:');console.log(link.source);
    // console.log('link.target:');console.log(link.target);
    // get relationships represented by edge
    var s = link.source = nodeById.get(link.source),
        t = link.target = nodeById.get(link.target),
        i = {}; // intermediate node
// console.log('link:',link);
// console.log('s:',s);
// console.log('t:',t);
// console.log('i:',i);
// return null;

if(!s || !t){ badlinks.push({source:link.source,target:link.target}) }


    nodes.push(i);
    links.push({source: s, target: i}, {source: i, target: t});
    bilinks.push([s, i, t]);
});

  // var link = G.selectAll(".edge")
  //   .data(bilinks)
  //   .enter().append("path")
  //     .attr("class", "edge");

console.log('badlinks:',badlinks);
break;
process.exit();
return null;
// console.log("bilinks:",bilinks);

var link = G.append("g")
.attr("class","links")
.selectAll("line")
.data(bilinks)
.enter().append("path")
.attr("class",'edge')


var node = G.append('g')
                        // .attr("class", "node")
                        .selectAll("g")
            .data(nodes.filter(function(d) { return d.id; }))
            .enter()
            .append("g")

            var circles = node.append("circle")
                        .attr("r", "5")
    // .attr("dx", 6)
            // .append("text")
    // .text(function(d) { return d.id; })
            // .append("g")
                        .attr("class",(d)=>{
                          console.log("d ob:",d);
                              return this.getClass('node',(1==1)?'daly':'person')
                            })

            .call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended)
            )
    



    var lables = node.append("text")
      .text(function(d) {
        return d.label;
      })
      .attr('x', 8)
      .attr('y', 3)
            .attr('text-anchor', 'left')

        // Append the place labels, setting their initial positions to
        // the feature's centroid
        // var placeLabels = svg.selectAll('.place-label')
        //     .data(labels)
        //     .enter()
        //     .append('text')
        //     .attr('class', 'place-label')
        //     .attr('x', function(d) { return d.x; })
        //     .attr('y', function(d) { return d.y; })
        //     .attr('text-anchor', 'middle')
        //     .text(function(d) { return d.label; });

  // node.append("title")
  //     .text(function(d) { return d.id; })
  //     // .attr("transform", function(d) { return "translate(" + node.centroid(d) + ")"; })
  //           .attr("dy", ".35em")

    // node.append("title")
    // .text(function(d){return '584';});
// node now a group, append a circle      
// node.append("circle")
//   .attr("r", 5)
//   .attr("data-target", function(d) { console.log("580d",d);return color(d.group); });

// node now a group, append a circle      
 // node.append("text")
 //    .attr("dx", 6)
 //    .text(function(d) { return d.id; });
  
  simulation
      .nodes(nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(links);

      function mouseover() {
        console.log(' mouseover()')
        d3.select(this).select("circle").transition()
      .duration(750)
      .attr("r", 16);
}

// function zoomed() {
//   console.log(' zoomed()');svg.attr("transform", d3.event.transform);
// }

// function zoomed() {
//   console.log('width:',);
//   console.log('height:',);
//     // svg.attr('transform', 'translate(' + (d3.event.translate[0] + width / 2) +
//     //     ',' + (d3.event.translate[1] + height / 2) + ') scale(' + d3.event.scale + ')');
//     svg.attr({viewBox: "" + (-width / 2) + " " + (-height / 2) + " " + width + " " + height})
// }

function mouseout() {
  console.log(' mouseout()')
  d3.select(this).select("circle").transition()
      .duration(750)
      .attr("r", 8);
}

  function ticked() {
    link.attr("d", positionLink);
    node.attr("transform", positionNode);
    
    // lables.forEach(function(o, j) {
    //             // The change in the position is proportional to the distance
    //             // between the label and the corresponding place (foci)
    //             o.y += (foci[j].y - o.y) * k;
    //             o.x += (foci[j].x - o.x) * k;
    //         });

  }
// }); //d3.json

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
    setD3HelloWorld: function () {

d3.select("#network").append("h1")
    .text("Hello, world!")
    .style("text-align", "center")
    .style("line-height", "320px")
    .style("font-size", "100px")
    .style("transform", "rotate(-180deg) scale(0.001, 0.001)")
  .transition()
    .duration(1500)
    .style("transform", null);

    }, // end of setD3HelloWorld()
    setChartLine: function () {

// make an svg canvas
const svg = d3.select('#network')
      .append('svg') // append an svg object to it
      .attr('width', 500)
      .attr('height', 270)
      .append('g') // append a g to that
      .attr('transform', 'translate(0, 10)');
    const x = d3.scaleLinear().range([0, 430]);
    const y = d3.scaleLinear().range([210, 0]);
    d3.axisLeft().scale(x);
    d3.axisTop().scale(y);
    x.domain(d3.extent(this.chartvalues, (d, i) => i));
    y.domain([0, d3.max(this.chartvalues, d => d)]);
    const createPath = d3.line()
      .x((d, i) => x(i))
      .y(d => y(d));
    svg.append('path').attr('d', createPath(this.chartvalues));

    }, //setchart
    setNetworkVisJS: function () {
console.info(
      process.env.VERBOSITY === "DEBUG"
        ? "setNetwork()..."
        : null
    );
if(!this.network){

  console.info(
    process.env.VERBOSITY === "DEBUG"
      ? "no network - you're the network..."
      : null
  );

var container = document.getElementById('network');
 // provide the data in the vis format
    var data = {nodes: this.nodes,edges: this.edges};

    var options = {
    layout:{improvedLayout: true},
    physics:{
    enabled: true,
    barnesHut: {
      gravitationalConstant: -2000,
      centralGravity: 0.3,
      springLength: 95,
      springConstant: 0.04,
      damping: 0.09,
      avoidOverlap: 0
    },
    forceAtlas2Based: {
      gravitationalConstant: -50,
      centralGravity: 0.01,
      springConstant: 0.08,
      springLength: 100,
      damping: 0.4,
      avoidOverlap: 0
    },
    repulsion: {
      centralGravity: 0.2,
      springLength: 200,
      springConstant: 0.05,
      nodeDistance: 100,
      damping: 0.09
    },
    hierarchicalRepulsion: {
      centralGravity: 0.0,
      springLength: 100,
      springConstant: 0.01,
      nodeDistance: 120,
      damping: 0.09
    },
    maxVelocity: 50,
    minVelocity: 0.1,
    solver: 'barnesHut',
    stabilization: {
      enabled: false,
      iterations: 1000,
      updateInterval: 100,
      onlyDynamicEdges: false,
      fit: false
    },
    timestep: 0.5,
    adaptiveTimestep: true
  },
      edges:{
    arrows: {
      to:     {enabled: true, scaleFactor:1, type:'arrow'},
      middle: {enabled: false, scaleFactor:1, type:'arrow'},
      from:   {enabled: false, scaleFactor:1, type:'arrow'}
    },

  }
    };

this.network = new vis.Network(container, data, options);

            this.network.on("stabilizationProgress", function(params) {
                console.log('stabilz:',params)
              });

} else {
  console.info(';;;;;;;;;;;;---:NETWORK ALREADY');
}

    }, //setNetwork
    fetchTotalEntities: function () {

          console.info(
      process.env.VERBOSITY === "DEBUG"
        ? "getTotalEntities()..."
        : null
    );

               let q = 'let entities = (\
let plcs = (for l in places return {_id:l._id})\
let ppls = (for p in people return {_id:p._id})\
let tngs = (for t in things return {_id:t._id}) RETURN flatten(append(ppls,plcs,tngs)))\
let edgees = (\
for ent in entities[0] \
FOR v, e, p IN 1..2 ANY ent edges \
FILTER e.type!=\'hasParticipant\'\
RETURN {typ:e.type,source:e._from,target:e._to,id:e._id})\
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
        'let entities = (\
let plcs = (for l in places return {_id:l._id,id:l._id,label:l.name,article:l.article})\
let ppls = (for p in people return {_id:p._id,id:p._id,label:p.name,article:p.article})\
let tngs = (for t in things return {_id:t._id,id:t._id,label:t.name,article:t.article}) RETURN flatten(append(ppls,plcs,tngs)))\
let edgees = (\
for ent in entities[0] \
FOR v, e, p IN 1..2 ANY ent edges \
FILTER e.type!=\'hasParticipant\'\
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
    nodes: {
      handler: function(vnew, vold) {
        console.info(
          process.env.VERBOSITY === "DEBUG"
            ? "WATCH:nodes:old/new:" + vold.length + "/" + vnew.length
            : null
        );
        // this.setNetwork();
        // this.setChart()
        this.d3ForceDirect()
      }
    } //nodes
  } //watch
}; //export.timeline

</script>

<style>

#network {
  position:relative;
  height: 78vh; /** output container is small for display */ 
  width: 100vw;
  background-color:rgba(55,244,244,.5);
  display: block;
}

#network > svg {
height:100vh;
width:100vw;
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

</style>