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
    <div class="columns dv-vertical-columns">
      <div class="column is-half dv-column-left">
        <!-- <div id="network"><svg></svg></div note="/#network"> -->
        <ul>
          <li>entities_total:
            <span v-if="entities_total.loading==true">1 sec...</span>
            <span v-else>{{entities_total.v}}</span>
          </li>
          <li><span v-bind:class="console.clazz" class="icon mdi"></span>{{console.msg}}</li>
        </ul>
        <div id="network">
          <svg></svg>
        </div note="/#network">
      </div note="/.dv-column-left">
      <div class="column is-half dv-column-right">
        active.key: {{active.key}}
        <br/>
        <!-- active.article: {{active.article}} -->
        <ul>
          <li v-for="articlechunk in active.article">
            {{articlechunk}}
          </li>
        </ul>
        <br/> active.graph: {{active.graph}}
        <br/>
      </div note="/.dv-column-right">
    </div>
  </div>
  <!-- ./#vue-root -->
</template>

<script>
import * as d3 from 'd3';
// import Graph from "./graph.vue";

const sourceOfTruth = { p1: "im p1", p2: "im p2" }

export default {
  name: "Entities",
  // components:{Graph},
  data () {
    return {
      url_arango: "http://" + process.env.ARANGOIP + ":" + process.env.ARANGOPORT + process.env.ARANGOCURSOR,
      graph: null,
      page: {
        title: "Andy Dalyverse Entities Graph"
      },
      state: "filled",
      fittable: true,
      active: {
        key: null,
        item: { article: null },
        graph: null
      },
      entities_total: { v: 0, loading: true },
      console: {
        msg: "",
        clazz: null,
        throb: false
      },
      graf: {
        nodes: [
          { id: "people/_:daltonwilcox", daly: true, _id: "people/_:daltonwilcox", "label": "Dalton Wilcox", article: ["Dalton Wilcox is the Poet Laureate of the West"] }, { id: "people/_:vampire", daly: false, _id: "people/_:vampire", "label": "Random Vampire", article: ["Random Vampire is a random vampire vanquished by Dalton Wilcox"] }, { id: "people/_:mummy", daly: false, _id: "people/_:mummy", "label": "Random Mummy", article: ["Random Mummy is a random mummy vanquished by Dalton Wilcox"] }
        ],
        edges: [
          { source: 'people/_:daltonwilcox', target: 'people/_:vampire' },
          { source: 'people/_:daltonwilcox', target: 'people/_:mummy' }
        ]
      }
    }
  }, // data
  beforeCreate () {}, // beforeCreate
  created () {
    if (this.$route.params.activeid) {
      this.active.key = this.$route.params.activeid;
    }

    window.addEventListener("keydown", this.onKey);


    console.info(
      process.env.VERBOSITY === "DEBUG" ? "begin CREATED, processing incoming vars" : null
    );

    this.$once('hook:once', function () {
      this.fittable = false;

    })

    this.console = {
      msg: new Date(),
      throb: true,
      clazz: "mdi-clock"
    };

  }, // created
  mounted: function () {
    console.log("env.mode=", process.env.MODE)
      // this.fetchTotalEntities();
    if (process.env.MODE == "T") { this.fakeEntities(); } else { this.fetchEntities(); }
    this.fetchEntities();
    if (process.env.MODE == "T") this.D3init();

  }, //mounted
  methods: {
    setActive (_id) {
      console.info(
        process.env.VERBOSITY === "DEBUG" ? "activating w _id:" + _id : null
      );
      let ai = this.$_.findWhere((process.env.MODE == "33") ? this.graph.nodes : this.graf.nodes, { id: _id })

      this.active = {
        key: ai.id,
        article: ai.article,
        graph: null
      }
    },
    unsetActive (_id) {
      this.active = {
        key: null,
        article: null,
        graph: null
      }

    },
    dragends (d) {

      this.setActive(d._id)

    },
    vodeSelect (__id) {

      let s = this.$_.findWhere(this.graf.nodes, { id: "people*_•daltonwilcox" })
      console.log("s", s);
      // .classed("selected", function (p) {
      //   return p.selected = p.previouslySelected = false;
      // })
      // .attr("r", process.env.GRAPH_NODE_SIZE_DEF);

    },
    idMute: function (id, way) {

      if (way == 'forward') {
        return id.replace(':', '•').replace('/', '*')
      } else {
        return id.replace('•', ":").replace('*', '/')
      }

    }, //idmute
    D3init: function () {

      // if both d3v3 and d3v4 are loaded, we'll assume
      // that d3v4 is called d3v4, otherwise we'll assume
      // that d3v4 is the default (d3)
      // if (typeof d3v4 == 'undefined')
      const d3v4 = d3;

      var svg = d3.select('#network > svg')
      var width = +svg.attr("width"),
        height = +svg.attr("height");

      let parentWidth = d3v4.select('svg').node().parentNode.clientWidth;
      let parentHeight = d3v4.select('svg').node().parentNode.clientHeight;

      var svg = d3v4.select('svg')
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
        .on('click.vue', this.unsetActive)
        .on('click.native', () => {
          node.each(function (d) {
            d.selected = false;
            d.previouslySelected = false;
          });
          node.classed("selected", false)
            // .attr("r", process.env.GRAPH_NODE_SIZE_DEF)
        });

      var gDraw = gMain.append('g');

      var zoom = d3v4.zoom()
        .on('zoom', zoomed)

      gMain.call(zoom);


      function zoomed() {
        gDraw.attr('transform', d3v4.event.transform);
      }

      var color = d3v4.scaleOrdinal(d3v4.schemeCategory20);

      var graph_nodes = (process.env.MODE == "33") ? this.graph.nodes : this.graf.nodes;
      var graph_edges = (process.env.MODE == "33") ? this.graph.edges : this.graf.edges

      console.info(
        process.env.VERBOSITY === "DEBUG" ? "initing D3 w/ nodes, edges: " + graph_nodes.length + "," + graph_edges.length : null
      );
      /*    var nodes = {};
          var i;
          for (i = 0; i < graph_nodes.length; i++) {
              nodes[graph_nodes[i].id] = graph_nodes[i];
              graph_nodes[i].weight = 1.01;
          }
      */

      /* ---------------------------- bezier hack: */

      var nodes = graph_nodes,
        nodeById = d3.map(graph_nodes, function (d) {
          return d.id;
        })

      , links = graph_edges, bilinks = [];
      // var i;

      //   var nodes = graph.nodes,
      // nodeById = d3.map(nodes, function(d) { return d.id; }),
      // bilinks = [];

      links.forEach((link) => {
        // this.graf.edges.forEach((link) => {

        if (link) {
          var s = link.source = nodeById.get(link.source),
            t = link.target = nodeById.get(link.target),
            i = {}; // intermediate node

          // if(!s)console.log('this s notfound by nodeById:',link.source)
          //   if(!t)console.log('this t notfound by nodeById:',link.target)
          //     if(!s && !t){console.log("...and this is link ob:",link)}

          // this.graf.nodes.push(i);
          nodes.push(i);

          // this.graf.edges.push({ source: s, target: i }, { source: i, target: t });
          links.push({ source: s, target: i }, { source: i, target: t });
          bilinks.push([s, i, t]);
        } else {
          console.error("link ainta thing")
        }
      });

      /* /bezier hack */

      // the brush needs to go before the nodes so that it doesn't
      // get called when the mouse is over a node
      var gBrushHolder = gDraw.append('g');
      var gBrush = null;

      var link = gDraw.append("g")
        .attr("class", "link")
        .selectAll("line")
        .data(bilinks)
        .enter().append("path")
        .attr("stroke-width", 1);

      var node = gDraw.append("g")
        .attr("class", "node")
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        // .attr("r", process.env.GRAPH_NODE_SIZE_DEF)
        .attr("fill", (d) => {
          return this.D3getFill(d)
        })
        .attr("id", (d) => {
          if (d._id) {
            return this.idMute(d._id, 'forward')
          } else {
            return null;
          }
        })
        .call(d3v4.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end.native", dragended)
          .on("end.vue", this.dragends));


      // add titles for mouseover blurbs
      node.append("title")
        .text(function (d) {
          if ('name' in d)
            return d.name;
          else
            return d.id;
        });

      var simulation = d3v4.forceSimulation()
        .force("link", d3v4.forceLink()
          .id(function (d) {
            return d.id;
          })
          .distance(function (d) {
            return 30;
            //var dist = 20 / d.value;
            //console.log('dist:', dist);

            return dist;
          })
        )
        .force("charge", d3v4.forceManyBody())
        .force("center", d3v4.forceCenter(parentWidth / 2, parentHeight / 2))
        .force("x", d3v4.forceX(parentWidth / 2))
        .force("y", d3v4.forceY(parentHeight / 2));

      simulation
        .nodes(graph_nodes)
        .on("tick", ticked);

      simulation.force("link")
        .links(graph_edges);

      function ticked() {
        link.attr("d", positionLink);
        node.attr("transform", positionNode);
      }

      function positionLink(d) {
        if (d[0] && d[1] && d[2]) {
          return "M" + d[0].x + "," + d[0].y + "S" + d[1].x + "," + d[1].y + " " + d[2].x + "," + d[2].y;
        } else {
          return null;
        }
      }

      function positionNode(d) {
        return "translate(" + d.x + "," + d.y + ")";
      }

      function tickedog() {
        // update node and line positions at every step of 
        // the force simulation
        link.attr("x1", function (d) {
            return d[0].x;
          })
          .attr("y1", function (d) {
            return d[0].y;
          })
          .attr("x2", function (d) {
            return d[2].x;
          })
          .attr("y2", function (d) {
            return d[2].y;
          });

        node.attr("cx", function (d) {
            return d.x;
          })
          .attr("cy", function (d) {
            return d.y;
          });
      }

      var brushMode = false;
      var brushing = false;

      var brush = d3v4.brush()
        .on("start", brushstarted)
        .on("brush", brushed)
        .on("end", brushended);

      function brushstarted() {
        // keep track of whether we're actively brushing so that we
        // don't remove the brush on keyup in the middle of a selection
        brushing = true;

        node.each(function (d) {
          d.previouslySelected = shiftKey && d.selected;
        });
      }

      rect.on('click', () => {
        node.each(function (d) {
          d.selected = false;
          d.previouslySelected = false;
        });
        node.classed("selected", false);
      });

      function brushed() {
        if (!d3v4.event.sourceEvent) return;
        if (!d3v4.event.selection) return;

        var extent = d3v4.event.selection;

        node.classed("selected", function (d) {
          return d.selected = d.previouslySelected ^
            (extent[0][0] <= d.x && d.x < extent[1][0] && extent[0][1] <= d.y && d.y < extent[1][1]);
        });
      }

      function brushended() {
        if (!d3v4.event.sourceEvent) return;
        if (!d3v4.event.selection) return;
        if (!gBrush) return;

        gBrush.call(brush.move, null);

        if (!brushMode) {
          // the shift key has been release before we ended our brushing
          gBrush.remove();
          gBrush = null;
        }

        brushing = false;
      }

      d3v4.select('body').on('keydown', keydown);
      d3v4.select('body').on('keyup', keyup);

      var shiftKey;

      function keydown() {
        shiftKey = d3v4.event.shiftKey;

        if (shiftKey) {
          // if we already have a brush, don't do anything
          if (gBrush)
            return;

          brushMode = true;

          if (!gBrush) {
            gBrush = gBrushHolder.append('g');
            gBrush.call(brush);
          }
        }
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
        if (!d3v4.event.active) simulation.alphaTarget(0.9).restart();

        // if(d._id){
        if (!d.selected && !shiftKey) {
          // if this node isn't selected, then we have to unselect every other node
          node.classed("selected", function (p) {
              return p.selected = p.previouslySelected = false;
            })
            // .attr("r", process.env.GRAPH_NODE_SIZE_DEF);
        }

        d3v4.select(this).classed("selected", function (p) {
          d.previouslySelected = d.selected;
          return d.selected = true;
        });

        node.filter(function (d) {
            return d.selected;
          })
          .each(function (d) { //d.fixed |= 2; 
            d.fx = d.x;
            d.fy = d.y;
          })
          // .attr("r", process.env.GRAPH_NODE_SIZE_SEL)
          // }//d._id

      }

      function dragged(d) {
        //d.fx = d3v4.event.x;
        //d.fy = d3v4.event.y;
        node.filter(function (d) {
            return d.selected;
          })
          .each(function (d) {
            d.fx += d3v4.event.dx;
            d.fy += d3v4.event.dy;
          })
      }

      function dragended(d) {
        if (!d3v4.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        node.filter(function (d) {
            return d.selected;
          })
          .each(function (d) { //d.fixed &= ~6; 
            d.fx = null;
            d.fy = null;
          })
      }

      var texts = ['Use the scroll wheel to zoom',
        'Hold the shift key to select nodes'
      ]

      svg.selectAll('text')
        .data(texts)
        .enter()
        .append('text')
        .attr('x', 900)
        .attr('y', function (d, i) {
          return 470 + i * 18;
        })
        .text(function (d) {
          return d;
        });

      return null;
    }, //d3init
    D3getFill: function (d) {
      // all fill logic here
      let c = null
      switch (true) {
        case (!d._id):
          c = 'rgba(255,255,255,0)'
          break;
        case (d.daly == true):
          c = 'rgba(3,3,3,1)'
          break;
          // case (!d.daly):
          //   c = 'rgba(44,44,44,1)'
          //   break;
        default:
          c = 'rgba(210,220,214,1)'
          break;
      }

      return c;

    },
    onKey: function (e) {
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

      this.page.title = "Dalyverse Events Graph: " + sub;
    }, //setPageTitle
    setItem: function (q) {

      this.active.item = this.$_.findWhere(this.graph.nodes, { daly: false, _id: q })

    },
    nullItem: function () {
      console.info(
        process.env.VERBOSITY === "DEBUG" ? "returning null item..." : null
      );
      return {
        _key: null,
        _rev: null,
        name: null,
        has_murdered: null,
        article: null
      };
    }, //nullItem
    nullGraph: function () {
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

      if (process.env.VERBOSITY === 'DEBUG') {
        console.log("DUMP:thing", thing)
      }

    }, //dump
    setGraph: function () {
      console.log(process.env.VERBOSITY == "DEBUG" ? "setGraph()..." : null);
      console.log(
        process.env.VERBOSITY == "DEBUG" ? "  -> active.key is " + this.active.key : null
      );

      // if we have an active.key
      if (this.active.key !== null) {
        axios
          .post(this.url_arango, {
            query: 'for p in people return p'
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
          process.env.VERBOSITY == "DEBUG" ? "no active.key, nulling graph..." : null
        );
        this.active.graph = this.nullGraph();
      }
    }, //setgraph
    setRoute: function () {
        console.info(process.env.VERBOSITY === "DEBUG" ? "setRoute()..." : null);

        this.$router.push({
          params: {
            activeid: this.active.key
          }
        }); //rejplace
      } //setRoute
      ,
    fakeEntities: function () {

      console.info(
        process.env.VERBOSITY === "DEBUG" ? "process.env.mode:" + process.env.MODE : null
      );
      this.entities_total.loading = false
      this.entities_total.v = this.graf.nodes.length

    },
    fetchEntities: function () {
        console.info(
          process.env.VERBOSITY === "DEBUG" ? "fetchEntities()..." : null
        );

        let q =
          'let plcs = (for l in places return {daly:false,_id:l._id,id:l._id,label:l.name,article:l.article})\
let ppls = (for p in people return {daly:p.daly,_id:p._id,id:p._id,label:p.name,article:p.article})\
let tngs = (for t in things return {daly:false,_id:t._id,id:t._id,label:t.name,article:t.article})\
let evnts = (for ev in events return {daly:false,_id:ev._id,id:ev._id,label:ev.name,article:ev.article})\
let pplsplcs = (flatten(append(ppls,plcs)))\
let tngsevts = (flatten(append(tngs,evnts)))\
let entities = (RETURN flatten(append(pplsplcs,tngsevts)))\
let edgees = (\
for ent in entities[0] \
FOR v, e, p IN 1..1 ANY ent edges \
RETURN {typ:e.type,source:e._from,target:e._to,id:e._id,_id:e._id})\
return {entitiez:unique(entities),edgez:unique(edgees)}'

        axios
          .post(this.url_arango, {
            query: q
          })
          .then(response => {
            console.info(
              process.env.VERBOSITY === "DEBUG" ? "setting entities w/ axios response..." : null
            );

            // let deeznodes = this.$_.map(response.data.result[0].entitiez[0],(n)=>{return {id:n.id,label:n.label,article:n.article}})
            let deeznodes = response.data.result[0].entitiez[0]
            this.entities_total.loading = false
            this.entities_total.v = deeznodes.length
            this.graph = {
              edges: response.data.result[0].edgez,
              nodes: deeznodes
            }

          }) //axios.then
          .catch(e => {
            console.error(e);
          }); //axios.catch
      } //fetchEntities
      ,
    getClass: function (which, one) {
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

    }
  }, //methods
  computed: {}, //computed
  watch: {
    // 'active': { handler: function (vnew) { console.log("vnew:", vnew); } } //active // ,

    nodes: {
      handler: function (vnew, vold) {
        console.info(
          process.env.VERBOSITY === "DEBUG" ? "WATCH:nodes:old/new:" + vold.length + "/" + vnew.length : null
        );
      }
    } //nodes
  } //watch
}; //export.timeline
</script>

<style>
body {
  height: 100%;
  overflow: hidden;
}

.dv-column-left {
  background-color: white;
}

.dv-column-right {
  background-color: black;
  color: #00eb11;
}


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

text {
  fill: #fff;
  stroke: transparent;
  font-size: .7em;
}


/* ---------------------------------- BULMA -- */

.hero.is-medium > .hero-body {
  padding: 0px;
}
</style>
