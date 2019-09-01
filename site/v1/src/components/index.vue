<template>
  <div id="vue-root" class="">
    <vue-headful :title="page.title" description="People, Places, Events & Things in the Andy Dalyverse" />
</div>
  <!-- ./#vue-root -->
</template>

<script>

import simplebar from 'simplebar-vue';
  import 'simplebar/dist/simplebar.min.css';

export default {
  name: "Index",
    components: {
    simplebar
  },
  data () {
    return {
      page: {
        title: "Andy Dalyverse Entities Graph"
      },
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
      },
    }
  }, // data
  beforeCreate () {
    // some laziness to be fixed in the future
    // console.log(document.getElementById('map'))
  }, // beforeCreate
  created () {


    window.addEventListener("keydown", this.onKey);


    console.info(
      process.env.VERBOSITY === "DEBUG" ? "begin CREATED, processing incoming vars" : null
    );

    this.$once('hook:once', function () {
      this.fittable = false;

    })

    // if (process.env.MODE == "T") {
      // this.fakeFetchEntities('small')

    // } else {
      this.fetchEntities()

    // }

    this.console = {
      msgs: [{ msg: "created", severity: "normal" }],
      throb: true,
      clazz: "mdi-clock"
    };

    this.d3 = d3;

  }, // created
  mounted: function () {
    console.info(
      process.env.VERBOSITY === "DEBUG" ? "running in mode:" + process.env.MODE : null
    );
    

    if (this.$route.params
      .activeid) {
      console.log("key incoming -- " + decodeURIComponent(this.$route.params.activeid) + " -- activating...");
      this.active.key = decodeURIComponent(this.$route.params.activeid);
      console.log("setting acxtive w/ route param/this.active.key:", this.active.key);
      
    }

  }, //mounted
  methods: {
    dvMute () {


    },
    dvFind (q) {

      // get valid nodes
      let circlz = this.d3.selectAll('g.node > circle');


      this.d3.selectAll('g.link').classed("muted", (q));


      // validate them - only those with n.label
      let yeas =
        this.$_.reject(
          circlz.data(), (n) => {
            return (!n.label)
          })

      // shop the query against each to set muted class
      this.$_.each(this.$_.filter(yeas, (n) => {
        this.d3.select(this.prepId(n.id)).classed("muted", (n.label.toLowerCase().indexOf(q.toLowerCase()) < 0))
      }));

    },
    subGraph (G) {

      /*
      the raw graph is going to be so many hasWorkedAt|hasParticipatedIn|occuredAt relations etc.
      the problem is the vector between the source and target: e.g. if an edge connecting to Radio City sports a hasWorkedAt then we know Radio City is the target and we'll display the source under 'current & former employees' or whatever. Other relations sport more ambiguous direction (e.g. hasFriend). For viz, this all needs to be sorted out into situationally-sensitive categories (and their headings).

      So we first figure out what the typ (source|target) of the node core is (person,place,thing,event) so we know whether to grab the "source" or "target" heading out of this.relationMap.

      Then we'll group all relations by typ and sort them into buckets with that chosen heading, viz those.
      */

      // get the edges that have a typ (by filtering) and bucket em with a concat of the edgetype and which of the node ends (' id) matches active.key
      let buckets =
        this.$_.groupBy(
          this.$_.map(this.$_.filter(G, (g) => {
            return this.$_.has(g, 'typ')
          }), (lg) => {
            let lgo = lg
            let primary = (lg.source.id == this.active.key) ? 'source' : 'target'
            lgo.edge_primary = lg.typ + '_for_' + primary
            return lgo
          }), 'edge_primary')


      let graf = this.$_.map(buckets, (Rs) => {

        // get bucket type - same for all, take first, bust it open for edgetype
        // get bucket type - same for all, take first, bust it open for primary (driving) node
        // shop btyp to relationMap for situational labels (we choose which later)
        let btyp = this.$_.first(Rs).edge_primary.split('_for_')[0],
          bprm = this.$_.first(Rs).edge_primary.split('_for_')[1],
          brel = this.$_.findWhere(this.relationMap, { rel: btyp });

        // gather up all the entries of this bucket        
        let entries = this.$_.map(Rs, (t) => {
            let datanode = (t.source.id == this.active.key) ? t.target : t.source;
            return datanode
          }) //map

        let o = {
          bucket_raw: btyp,
          bucket_label: (bprm == 'source') ? brel.source : brel.target,
          nodes: entries
        }

        return o

      })

      return graf

    } //subgraph
    ,
    getGraph (nid) {

      this.meta.graph.loading = true
      let ge = this.$_.filter(this.graph.edges, (e) => {
        return e.source.id == this.active.key || e.target.id == this.active.key
      })
      this.meta.graph.loading = false
      return ge

    } //getgraph
    ,
    setActive (nak) {
      let nik = (nak)?nak:null;
      console.log('setting active w :nak:', nik);
      let nakk = (nik) ? nik : this.active.key

      if (nakk) {
        let nakkf = (nakk.indexOf('%') >= 0) ? decodeURIComponent(nakk) : nakk

        console.info(
          process.env.VERBOSITY === "DEBUG" ? "activating w _id:" + nakkf : null
        );


        let ai = this.$_.findWhere(this.graph.nodes, { id: nakkf })

        this.active = {
          key: (!ai) ? null : ai.id,
          label: (!ai) ? null : ai.label,
          article: (!ai) ? null : ai.article,
          graph: null
        }

        this.d3.select('circle').classed("selected", false)
        this.d3.select(this.prepId(nakkf)).classed("selected", true)
      } //if nakk

    },
    prepId (iak) {


      let iakk = null;

      if (iak) {
        // switch (way) {
        //   case 'escape':
        //     iakk = iak.replace('/', '\\\\/').replace(':', '\\\\:')
        //     break;
        //   case 'unescape':
        //     iakk = iak.replace('\\\\/', '/').replace('\\\\:', ':')
        //     break;
        //   default:
        //     // code block
        // }
        iakk = "circle[id='" + iak + "']"
      }

      return iakk

    } //prepid
    ,
    unSetActive (nak) {

let nik = (nak)?nak:null
      console.log("nak in unset active:", null);
      this.nullGraph();
      this.d3.select(this.prepId(null)).classed("selected", false)

    },
    dragends (d) {
      if (this.active.key == d._id) {
        this.unSetActive(d._id)
      } else {
        this.setActive(d._id)
      }

    },
    D3init: function () {

      // if both d3v3 and d3v4 are loaded, we'll assume
      // that d3v4 is called d3v4, otherwise we'll assume
      // that d3v4 is the default (d3)
      // if (typeof d3v4 == 'undefined')
      // const d3v4 = d3;
      const d3v4 = this.d3;

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
        .style('fill', "white")
        .on('click.vue', (w) => {
          this.unSetActive();
        })
        .on('click.native', () => {
          node.each(function (d) {
            d.selected = false;
            d.previouslySelected = false;
          });
          node.classed("selected", false)
        });

      var gDraw = gMain.append('g');

      var zoom = d3v4.zoom()
        .on('zoom', zoomed)

      gMain.call(zoom);


      function zoomed() {
        gDraw.attr('transform', d3v4.event.transform);
      }

      var color = d3v4.scaleOrdinal(d3v4.schemeCategory20);

      var graph_nodes = this.$_.sortBy(this.graph.nodes, 'daly');
      var graph_edges = this.graph.edges;

      console.info(
        process.env.VERBOSITY === "DEBUG" ? "initing D3 w/ nodes, edges: " + graph_nodes.length + "," + graph_edges.length : null
      );

      /* ---------------------------- bezier hack: */

      var nodes = graph_nodes,
        nodeById = d3.map(graph_nodes, function (d) {
          return d.id;
        })

      , links = graph_edges, bilinks = [];

      links.forEach((link) => {

        if (link) {
          var s = link.source = nodeById.get(link.source),
            t = link.target = nodeById.get(link.target),
            i = {}; // intermediate node

          nodes.push(i);

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
        .enter().append("path");
      // .attr("stroke-width", 1);

      var node = gDraw.append("g")
        .attr("class", "node")
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        // .attr("fill", (d) => {
        //   return "purple";
        //   // return this.D3getFill(d)
        // })
        .attr("r", (d) => {
          return 6
          // return this.D3getFill(d)
        })
        .attr('class', (d) => {
          return this.D3getClass(d);
        })
        .attr("id", (d) => {
          if (d._id) {
            return d._id
          } else {
            return null;
          }
        })
        // .on("mouseover", mouseOver(.2))
        // .on("mouseout", mouseOut)
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
            return d.label;
        });

      var simulation = d3v4.forceSimulation()
        .force("link", d3v4.forceLink()
          .id(function (d) {
            return d.id;
          })
          .distance(function (d) {
            return 30;

            return dist;
          })
        )
        .force("charge", d3v4.forceManyBody())
        .force("center", d3v4.forceCenter(parentWidth / 2, parentHeight / 2))
        .force("x", d3v4.forceX(parentWidth / 2))
        .force("y", d3v4.forceY(parentHeight / 2));

      this.simulation = simulation

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

      // build a dictionary of nodes that are linked
      var linkedByIndex = {};
      links.forEach(function (d) {
        // if (d._id) {
        linkedByIndex[d.source.index + "," + d.target.index] = 1;
        // }
      });

      // check the dictionary to see if nodes are linked
      function isConnected(a, b) {
        return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
      }

      // fade nodes on hover
      function mouseOver(opacity) {
        return function (d) {
          // check all other nodes to see if they're connected
          // to this one. if so, keep the opacity at 1, otherwise
          // fade
          // node.style("stroke-opacity", function (o) {
          //   let thisOpacity = isConnected(d, o) ? 1 : opacity;
          //   return thisOpacity;
          // });
          // node.style("fill-opacity", function (o) {
          //   let thisOpacity = isConnected(d, o) ? 1 : opacity;
          //   return thisOpacity;
          // });

          // function (o) {let thisClass = isConnected(d, o) ? 'lit' : 'muted';return thisClass;}

          node.classed("muted", function (o) {
              //mute whatever is not connected
              return !isConnected(d, o);
            })
            // also style link accordingly
            // link.attr("class", function (o) {
            //     let thisClass = o.source === d || o.target === d ? '' : 'muted';
            //     return thisClass;
            //   })
          link.classed("muted", (o) => {
              let oids = o.map(m => m['id'])
                //mute whatever is not connected
                // return (o.source !== d && o.target !== d);
                // return !_.contains(_.pluck(o, 'id'), d.id);
                // console.log("oids in test:", oids);
                // console.log("did in test:", d.id);
              return !oids.includes(d.id);
            })
            // link.style("stroke-opacity", function (o) {
            //   return o.source === d || o.target === d ? 1 : opacity;
            // });
            // link.style("stroke", function (o) { // return o.source === d || o.target === d ? o.source.colour : "#ddd"; // });

        };
      }

      function mouseOut() {
        node.classed('muted', false);
        link.classed('muted', false);
        // node.style("stroke-opacity", 1);
        // node.style("fill-opacity", 1);
        // link.style("stroke-opacity", 1);
        // link.style("stroke", "#ddd");
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

        if (!d.selected && !shiftKey && d._id) {
          // if this node isn't selected, then we have to unselect every other node
          node.classed("selected", function (p) {
            return p.selected = p.previouslySelected = false;
          })
        }
// console.log("@715:",this.className.baseVal.indexOf('invisible'))
// console.log("@715:",this.className)
if(this.className.baseVal.indexOf('invisible')<0){
        d3v4.select(this).classed("selected", function (p) {
          // console.log("p after:",p);
          d.previouslySelected = d.selected;
          return d.selected = true;
        });
      }

        node.filter(function (d) {
            return d.selected;
          })
          .each(function (d) { //d.fixed |= 2; 
            d.fx = d.x;
            d.fy = d.y;
          })

      }

      function dragged(d) {
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
      // svg.selectAll('text')
      //   .data(texts)
      //   .enter()
      //   .append('text')
      //   .attr('x', 900)
      //   .attr('y', function (d, i) {
      //     return 470 + i * 18;
      //   })
      //   .text(function (d) {
      //     return d;
      //   });

      return null;
    }, //d3init
    D3getClass: function (d) {
      // all fill logic here
      let c = null

if(d.hasOwnProperty('_id')==false){
  c='invisible'
}
      else if(d.daly=='false' || !d.daly){
        c=''
      } else if(d.daly=='true' || d.daly){
        c='daly'
      } else {
        c='invisible'
      }

      return c;

    },
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
      // let sub = null;

      // switch (true) {
      //   case typeof this.active.item == "undefined":
      //     sub = this.active.key;
      //     break;
      //   default:
      //     sub = this.active.item.content;
      //     break;
      // }
let sub = "Dalyverse Entities Graph: "
      this.page.title = (this.active.label)?sub+this.active.label:sub;
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
      this.active.key = null
      this.active.graph = null
      this.active.article = null
        // return {
        //   participants: null,
        //   locations: null
        // };
    }, //nullGraph
    // setGraph: function () {
    //   console.log(process.env.VERBOSITY == "DEBUG" ? "setGraph()..." : null);
    //   console.log(
    //     process.env.VERBOSITY == "DEBUG" ? "  -> active.key is " + this.active.key : null
    //   );

    //   // if we have an active.key
    //   if (this.active.key !== null) {
    //     axios
    //       .post(this.url_arango, {
    //         query: 'for p in people return p'
    //       })
    //       .then(response => {
    //         this.active.graph = response.data.result[0];
    //       }) //axios.then
    //       .catch(e => {
    //         console.error(e);
    //       }); //axios.catch
    //   } //if key
    //   else {
    //     // no key? null it out
    //     console.log(
    //       process.env.VERBOSITY == "DEBUG" ? "no active.key, nulling graph..." : null
    //     );
    //     this.active.graph = this.nullGraph();
    //   }
    // }, //setgraph
    setRoute: function () {

        this.$router.push({
          params: {
            activeid: (this.active.key) ? this.active.key : ''
          }
        }); //rejplace
      } //setRoute
      ,
    fakeFetchEntities: function (small) {


      console.info(
        process.env.VERBOSITY === "DEBUG" ? "fakeFetchEntities()..." : null
      );

      if (small) {
        this.graph = {
          nodes: [
            { id: "people/_:daltonwilcox", daly: true, _id: "people/_:daltonwilcox", "label": "Dalton Wilcox", article: ["Dalton Wilcox is the Poet Laureate of the West", "He is known to fashion \"land virginies\" while roaming the western range."] }, { id: "people/_:vampire", daly: false, _id: "people/_:vampire", "label": "Random Vampire", article: ["Random Vampire is a random vampire vanquished by Dalton Wilcox"] }, { id: "people/_:mummy", daly: false, _id: "people/_:mummy", "label": "Random Mummy", article: ["Random Mummy is a random mummy vanquished by Dalton Wilcox"] }
          ],
          edges: [
            { source: 'people/_:daltonwilcox', target: 'people/_:vampire' },
            { source: 'people/_:daltonwilcox', target: 'people/_:mummy' }
          ]
        }

        this.entities_total.loading = false
        this.entities_total.v = this.graph.nodes.length
      } else {
        // we'll pull a large fake set from local

        axios
          .get("http://localhost:8000/full-graph-fake.json")
          .then(response => {
            console.info(
              process.env.VERBOSITY === "DEBUG" ? "setting entities w/ axios response..." : null
            );

            this.entities_total.loading = false
            let deeznodes = response.data.result[0].entitiez[0]
            this.entities_total.v = deeznodes.length
            let co = { msg: deeznodes.length + ' entities loaded', severity: "normal" }
            this.console.msgs.push(co)
            this.graph = {
              edges: response.data.result[0].edgez,
              nodes: deeznodes
            }

          }) //axios.then
          .catch(e => {
            console.error(e);
          }); //axios.catch
      }


    }, //fakefetch
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

if(process.env.MODE=="T"){

axios
          .get('http://localhost:8000/dv-init.json')
          .then(response => {
            console.info(
              process.env.VERBOSITY === "DEBUG" ? "setting entities w/ axios response..." : null
            );

            let deeznodes = response.data.result[0].entitiez[0]
            this.entities_total.loading = false
            this.entities_total.v = deeznodes.length
            this.console.msgs.push({ msg: deeznodes.length + ' entities loaded', severity: 'normal' })
            this.graph = {
              edges: response.data.result[0].edgez,
              nodes: deeznodes
            }

          }) //axios.then
          .catch(e => {
            console.error(e);
          }) //axios.catch
          .finally(e => {
            
            if(this.active.key && !this.active.graph){
              this.active.graph = this.subGraph(this.getGraph());
            }

          })

}
else {        axios
          .post("http://" + process.env.ARANGOIP + ":" + process.env.ARANGOPORT + process.env.ARANGOCURSOR, {
            query: q
          })
          .then(response => {
            console.info(
              process.env.VERBOSITY === "DEBUG" ? "setting entities w/ axios response..." : null
            );

            let deeznodes = response.data.result[0].entitiez[0]
            this.entities_total.loading = false
            this.entities_total.v = deeznodes.length
            this.console.msgs.push({ msg: deeznodes.length + ' entities loaded', severity: 'normal' })
            this.graph = {
              edges: response.data.result[0].edgez,
              nodes: deeznodes
            }

          }) //axios.then
          .catch(e => {
            console.error(e);
          }) //axios.catch
          .finally(e => {
            
            if(this.active.key && !this.active.graph){
              this.active.graph = this.subGraph(this.getGraph());
            }

          }) //axios.finally
          }
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
    // 'active': { handler: function (vnew) { this.setActive(vnew) } } //active // ,
    query: {
      handler: function (vnew, vold) {

        // this.setRoute();
        // this.unSetActive(vold)
        // this.active.graph = this.subGraph(this.getGraph());
        // this.setPageTitle();
        this.dvFind(vnew);
      }
    },
    "active.key": {
      handler: function (vnew, vold) {

        this.setRoute();
        // this.unSetActive(vold)
        this.active.graph = this.subGraph(this.getGraph());
        this.setPageTitle();
      }
    },
    graph: {
      handler: function (vnew, vold) {
        if (vnew !== null) this.D3init()
        this.$nextTick(() => {
          console.log("in next tick, setting active...");
          this.setActive()
        })
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
