<template>
<div id="vue-root" class="">
  <vue-headful :title="page.title" description="People, Places, & Things in the Andy Dalyverse" />

<nav id="dv-nav-main" class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div id="dv-nav-menu" class="navbar-menu">
    <div class="navbar-start">
      <a class="navbar-item">
        Home
      </a>

      <a class="navbar-item">
        Entities
      </a>
      <a class="navbar-item">
        Events
      </a>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        
      </div>
    </div>
  </div>
</nav>

<div class="columns dv-vertical-columns"><div class="column is-half dv-column-left">
  <!-- <div id="network"><svg></svg></div note="/#network"> -->
    <Graph :data="sourceOfTruth" />
</div note="/.dv-column-left">
<div class="column is-half dv-column-right">
  active.key: {{active.key}}<br/>
      active.item.article: {{active.item.article}}<br/>
      active.graph: {{active.graph}}<br/>
</div note="/.dv-column-right">
</div>
</div><!-- ./#vue-root -->
</template>

<script>
  // import * as d3 from 'd3';
  import Graph from "./graph.vue";

const sourceOfTruth = {p1:"im p1",p2:"im p2"}

export default {
  name: "Entities",
  components:{Graph},
  data:sourceOfTruth, // data
  beforeCreate() {}, // beforeCreate
  created() {
    if (this.$route.params.activeid) {
      this.active.key = this.$route.params.activeid;
    }

    window.addEventListener("keydown", this.onKey);
  }, // created
  mounted: function() {}, //mounted
  methods: {
    saveTask: function() {
      store.addTask(this.newTask)
      this.newTask = ''
    },
    d3ForceDirect: function () {


let graph = this.fakeg

var parentDiv = document.getElementById("network");
let parentWidth = parseInt(window.getComputedStyle(parentDiv).width.replace("px","")),
      parentHeight = parseInt(window.getComputedStyle(parentDiv).height.replace("px",""))

var svg = d3.select('svg')
    .attr('width', parentWidth)
    .attr('height', parentHeight)

// remove any previous graphs
    svg.selectAll('.g-main').remove();

    var gMain = svg.append('g')
    .classed('g-main', true);

    var rect = gMain.append('rect')
    .attr('width', parentWidth)
    .attr('height', parentHeight)
    .style('fill', 'white')
    .on('click', (d) => {
        // node.each(function(d) {
        //     d.selected = false;
        //     d.previouslySelected = false;
        // });
        // node.classed("selected", false);
        nodeSelect(d);
    });

    var gDraw = gMain.append('g');

    var zoom = d3.zoom()
    .on('zoom', zoomed)

    gMain.call(zoom);


    function zoomed() {
        gDraw.attr('transform', d3.event.transform);
    }

    // var color = d3.scaleOrdinal(d3.schemeCategory20);

    if (! ("links" in graph)) {
        console.log("Graph is missing links");
        return;
    }

    var nodes = [];
    var i;
    // for (i = 0; i < graph.nodes.length; i++) {
    //     nodes[graph.nodes[i].id] = graph.nodes[i];
    //     graph.nodes[i].weight = 1.01;
    // }
    var nodeById = d3.map(graph.nodes, function(d) { return d.id; })
    var bilinks=[];

    graph.links.forEach(function(link) {
    
    var s = link.source = nodeById.get(link.source),
        t = link.target = nodeById.get(link.target),
        i = {}; // intermediate node
    graph.nodes.push(i);
    graph.links.push({source: s, target: i}, {source: i, target: t});
    bilinks.push([s, i, t]);
  });

    // the brush needs to go before the nodes so that it doesn't
    // get called when the mouse is over a node
    var gBrushHolder = gDraw.append('g');
    var gBrush = null;

    var link = gDraw.append("g")
        .attr("class", "edge")
        .selectAll("line")
        .data(bilinks)
        .enter().append("path")
        .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

    var node = gDraw.append("g")
        .attr("class", "node")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("r", 5)
        .attr("fill", function(d) { 
return (d._id)?'rgba(44,144,44,.5)':'rgba(255,255,255,0)'; 
    })
        .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

      
    // add titles for mouseover blurbs
    node.append("title")
        .text(function(d) { 
            if ('name' in d)
                return d.name;
            else
                return d.id; 
        });

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink()
                .id(function(d) { return d.id; })
                .distance(function(d) { 
                    return 30;

                    return dist; 
                })
              )
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(parentWidth / 2, parentHeight / 2))
        .force("x", d3.forceX(parentWidth/2))
        .force("y", d3.forceY(parentHeight/2));

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

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

    function tickedog() {
        // update node and line positions at every step of 
        // the force simulation
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    }

    var brushMode = false;
    var brushing = false;

    var brush = d3.brush()
        .on("start", brushstarted)
        .on("brush", brushed)
        .on("end", brushended);

    function brushstarted() {
        // keep track of whether we're actively brushing so that we
        // don't remove the brush on ke]\yup in the middle of a selection
        brushing = true;

        node.each(function(d) { 
            d.previouslySelected = shiftKey && d.selected; 
        });
    }

function nodeSelect(d,w){
  if(!w){
          node.each(function(d) {
              d.selected = false;
              d.previouslySelected = false;
          });
          node.classed("selected", false);
        }
}

    rect.on('click', (d) => {
      nodeSelect(d,null);
        // node.each(function(d) {
        //     d.selected = false;
        //     d.previouslySelected = false;
        // });
        // node.classed("selected", false);
    });

    function brushed() {
        if (!d3.event.sourceEvent) return;
        if (!d3.event.selection) return;

        var extent = d3.event.selection;

        node.classed("selected", function(d) {
            return d.selected = d.previouslySelected ^
            (extent[0][0] <= d.x && d.x < extent[1][0]
             && extent[0][1] <= d.y && d.y < extent[1][1]);
        });
    }

    function brushended() {
        if (!d3.event.sourceEvent) return;
        if (!d3.event.selection) return;
        if (!gBrush) return;

        gBrush.call(brush.move, null);

        if (!brushMode) {
            // the shift key has been release before we ended our brushing
            gBrush.remove();
            gBrush = null;
        }

        brushing = false;
    }

    d3.select('body').on('keydown', keydown);
    d3.select('body').on('keyup', keyup);

    var shiftKey;

    function keydown() {
    //     shiftKey = d3.event.shiftKey;

    //     if (shiftKey) {
    //         // if we already have a brush, don't do anything
    //         if (gBrush)
    //             return;

    //         brushMode = true;

    //         if (!gBrush) {
    //             gBrush = gBrushHolder.append('g');
    //             gBrush.call(brush);
    //         }
    //     }
    }

    function keyup() {
        shiftKey = false;
        brushMode = false;

        if (!gBrush)
            return;

        if (!brushing) {
            // only remove the brush if we're not actively brushing
            // otherwise it'll be removed when the brushing ends
            gBrush.remove();
            gBrush = null;
        }
    }

    function dragstarted(d) {
      this.active.key=d._id
      if (!d3.event.active) simulation.alphaTarget(0.9).restart();

// those hidden nodes we don't wanna show
if(d._id){
        if (!d.selected && !shiftKey) {
            // if this node isn't selected, then we have to unselect every other node
            node.classed("selected", function(p) { return p.selected =  p.previouslySelected = false; });
        }

        d3.select(this).classed("selected", function(p) { d.previouslySelected = d.selected; return d.selected = true; });

        node.filter(function(d) { return d.selected; })
        .each(function(d) { //d.fixed |= 2; 
          d.fx = d.x;
          d.fy = d.y;
        })
      }

    }

    function dragged(d) {
      //d.fx = d3.event.x;
      //d.fy = d3.event.y;
            node.filter(function(d) { return d.selected; })
            .each(function(d) { 
                d.fx += d3.event.dx;
                d.fy += d3.event.dy;
            })
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
        node.filter(function(d) { return d.selected; })
        .each(function(d) { //d.fixed &= ~6; 
            d.fx = null;
            d.fy = null;
        })
    }

    var texts = ['Use the scroll wheel to zoom',
                 'Hold the shift key to select nodes']

    svg.selectAll('text')
        .data(texts)
        .enter()
        .append('text')
        .attr('x', 900)
        .attr('y', function(d,i) { return 470 + i * 18; })
        .text(function(d) { return d; });


    },
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

this.active.item=this.$_.findWhere(this.graph.nodes,{_id:q})

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
          .post("http://" + process.env.ARANGOIP + "/cursor", {
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
    'active': {handler:function(vnew){console.log("vnew:",vnew);}} //active
    ,nodes: {
      handler: function(vnew, vold) {
        console.info(
          process.env.VERBOSITY === "DEBUG"
            ? "WATCH:nodes:old/new:" + vold.length + "/" + vnew.length
            : null
        );
      }
    } //nodes
  } //watch
}; //export.timeline

</script>

<style>
body{height:100%;overflow:hidden;}


.dv-column-left{background-color:white;}
.dv-column-right{background-color:black;color:#00eb11;}


/*
.node {
  stroke: #fff;
  stroke-width: 1.5px;
}

.edge {
  fill: none;
  stroke: #bbb;
}
.node-edge-default{
  stroke: rgba(4,4,4,.4);
  fill:none;
  stroke-width: 2px;
}

.node-pu{
  stroke: #3f0081;
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
*/

text{
    fill: #fff;
    stroke: transparent;
    font-size:.7em;
}



/* ---------------------------------- BULMA -- */
.hero.is-medium > .hero-body{
  padding:0px;
}

</style>