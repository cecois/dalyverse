<template>
  <div id="vue-root" class="">
    <h1 class="is-size-1">{{akey}}</h1>
    <ul>
      <li>entities_total: {{entities_total}}</li>
      <li><span v-bind:class="console.clazz" class="icon mdi"></span>{{console.msg}}</li>
    </ul>
    <div id="network">
      <svg></svg>
    </div note="/#network">
  </div>
  <!-- ./#vue-root -->
</template>

<script>
import * as d3 from 'd3';
export default {
  name: "Graph",
  props: {akey: {
                type: Object,
                required: false
            }},
  data () {
    return {
      shared: store.state,
      private:{
            graph: null,
            svg:null,
            shiftKey:null,
            entities_total: 0,
            console: {
              msg: "",
              clazz: "mdi-clock",
              throb: false
            } //console
            ,
            graf: {
              nodes: [
                { id: "people/_:daltonwilcox", _id: "people/_:daltonwilcox", "active": true, "label": "Dalton Wilcox", article: "Dalton Wilcox is the Poet Laureate of the West" }, { id: "people/_:vampire", _id: "people/_:vampire", "active": false, "label": "Random Vampire", article: "Random Vampire is a random vampire vanquished by Dalton Wilcox" }, { id: "people/_:mummy", _id: "people/_:mummy", "active": false, "label": "Random Mummy", article: "Random Mummy is a random mummy vanquished by Dalton Wilcox" }
              ],
              edges: [
                { source: 'people/_:daltonwilcox', target: 'people/_:vampire' },
                { source: 'people/_:daltonwilcox', target: 'people/_:mummy' }
              ]
            }
          }//private
    } //return
  } //data
  ,
  beforeCreate () {}, // beforeCreate
  methods: {
    D3nodeSelect: function(d,w){
  if(!w){
          node.each(function(d) {
              d.selected = false;
              d.previouslySelected = false;
          });
          node.classed("selected", false);
        }
},
    // updateActive: function (did) {
    //   console.log("emitting "+did);
    //   this.$emit('akey', did);
    // },
dragends(d) {
      
      console.log("this.graf.nodes",this.graf.nodes);
      let actv={graph:null,key:d._id,item:this.$_.findWhere(this.graf.nodes,{id:d._id})}
      this.$emit('active', actv);

    },
    D3init: function () {

      var parentDiv = document.getElementById("network");
      let parentWidth = parseInt(window.getComputedStyle(parentDiv).width.replace("px", "")),
        parentHeight = parseInt(window.getComputedStyle(parentDiv).height.replace("px", ""))

      this.svg = d3.select('svg')
        .attr('width', parentWidth)
        .attr('height', parentHeight)

// remove any previous graphs
    this.svg.selectAll('.g-main').remove();

    var gMain = this.svg.append('g')
    .classed('g-main', true);

    var rect = gMain.append('rect')
    .attr('width', parentWidth)
    .attr('height', parentHeight)
    .style('fill', 'white')
    .on('click', (d) => {
        this.D3nodeSelect(d);
    });

    var gDraw = gMain.append('g');

    function zoomed() {
        gDraw.attr('transform', d3.event.transform);
    }

    var zoom = d3.zoom()
    .on('zoom', zoomed)

    gMain.call(zoom);

    var nodes = [];
    var i;
    var nodeById = d3.map(this.graf.nodes, function(d) { return d.id; })
    var bilinks=[];

    this.graf.edges.forEach((link)=>{
    
    var s = link.source = nodeById.get(link.source),
        t = link.target = nodeById.get(link.target),
        i = {}; // intermediate node
    this.graf.nodes.push(i);
    this.graf.edges.push({source: s, target: i}, {source: i, target: t});
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
        .data(this.graf.nodes)
        .enter().append("circle")
        .attr("r", 5)
        .attr("fill", (d)=>{return this.D3getFill(d)})
        .call(d3.drag()
        .on("start", dragstarted)
        .on("end.native", dragged)
        .on("end.vue", this.dragends)
        .on("drag", dragged));
        // .on("start", (d,node)=>{return this.D3dragstarted(d,node)})

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
        .nodes(this.graf.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(this.graf.edges);

        function ticked() {
    link.attr("d", positionLink);
    node.attr("transform", positionNode);
  }

 function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.9).restart();

        if (!d.selected) {
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


function positionLink(d) {
  return "M" + d[0].x + "," + d[0].y
       + "S" + d[1].x + "," + d[1].y
       + " " + d[2].x + "," + d[2].y;
}

function positionNode(d) {
  return "translate(" + d.x + "," + d.y + ")";
}

var brushMode = false;
    var brushing = false;

    var brush = d3.brush()
        .on("start", brushstarted)
        .on("brush", (d,node)=>{
         var extent = d3.event.selection;

        node.classed("selected", function(d) {
            return d.selected = d.previouslySelected ^
            (extent[0][0] <= d.x && d.x < extent[1][0]
             && extent[0][1] <= d.y && d.y < extent[1][1]);
        });
      })
        .on("end", brushended);

    function brushstarted() {
        // keep track of whether we're actively brushing so that we
        // don't remove the brush on keyup in the middle of a selection
        brushing = true;

        node.each(function(d) { 
            d.previouslySelected = this.shiftKey && d.selected; 
        });
    }

    // function brushed() {
    //     if (!d3.event.sourceEvent) return;
    //     if (!d3.event.selection) return;

    //     var extent = d3.event.selection;

    //     node.classed("selected", function(d) {
    //         return d.selected = d.previouslySelected ^
    //         (extent[0][0] <= d.x && d.x < extent[1][0]
    //          && extent[0][1] <= d.y && d.y < extent[1][1]);
    //     });
    // }

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

    // var this.shiftKey=null;

    function keydown() {} //keydown

    function keyup() {
        this.shiftKey = false;
        brushMode = false;

        if (!gBrush)
            return;

        if (!brushing) {
            // only remove the brush if we're not actively brushing
            // otherwise it'll be removed when the brushing ends
            gBrush.remove();
            gBrush = null;
        }
    } // keyup

        function dragged(d) {
      // node.filter(function(d) { return d.selected; })
      //       .each(function(d) { 
      //           d.fx += d3.event.dx;
      //           d.fy += d3.event.dy;
      //       })
    }

    // function dragged(d) {
    //   //d.fx = d3.event.x;
    //   //d.fy = d3.event.y;
    //         node.filter(function(d) { return d.selected; })
    //         .each(function(d) { 
    //             d.fx += d3.event.dx;
    //             d.fy += d3.event.dy;
    //         })
    // }



    // function 

    var texts = ['Use the scroll wheel to zoom',
                 'Hold the shift key to select nodes']

    this.svg.selectAll('text')
        .data(texts)
        .enter()
        .append('text')
        .attr('x', 900)
        .attr('y', function(d,i) { return 470 + i * 18; })
        .text(function(d) { return d; });

    },
//     D3dragstarted: function(d){
//       if (!d3.event.active) simulation.alphaTarget(0.9).restart();

// if(d._id){
//         if (!d.selected) {
//             // if this node isn't selected, then we have to unselect every other node
//             node.classed("selected", function(p) { return p.selected =  p.previouslySelected = false; });
//         }

//         d3.select(this).classed("selected", function(p) { d.previouslySelected = d.selected; return d.selected = true; });

//         node.filter(function(d) { return d.selected; })
//         .each(function(d) { //d.fixed |= 2; 
//           d.fx = d.x;
//           d.fy = d.y;
//         })
//       } //if d._id

//     }, //d3dragstarted
    D3getFill: function(d){
// all fill logic here
    return (d._id)?'rgba(44,44,244,.5)':'rgba(255,255,255,0)';
    
    },
    D3nodeSelect: function(d,w){
  if(!w){
          node.each(function(d) {
              d.selected = false;
              d.previouslySelected = false;
          });
          node.classed("selected", false);
        }
},
    fetchEntities: function () {
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
        .post("http://" + process.env.ARANGOIP + "/cursor", {
          query: q
        })
        .then(response => {
          console.info(
            process.env.VERBOSITY === "DEBUG" ? "setting entities w/ axios response..." : null
          );

          // let deeznodes = this.$_.map(response.data.result[0].entitiez[0],(n)=>{return {id:n.id,label:n.label,article:n.article}})
          let deeznodes = response.data.result[0].entitiez[0]
          this.entities_total = deeznodes.length
          this.graph = {
            edges: response.data.result[0].edgez,
            nodes: deeznodes
          }

        }) //axios.then
        .catch(e => {
          console.error(e);
        }); //axios.catch
    }, //fetchEntities
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

    }, // getclass
  }, //methods
  computed: {}, //computed
  watch: {} //watch
   ,created () {
    console.info(
      process.env.VERBOSITY === "DEBUG" ? "begin CREATED, processing incoming vars" : null
    );

    this.$once('hook:once', function () {
      this.fittable = false;
      this.fetchTotalEntities();
    })

    this.console = {
      msg: new Date(),
      throb: true,
      clazz: "mdi-clock"
    };
  }, // created
  mounted: function () {
    console.info(
      process.env.VERBOSITY === "DEBUG" ? "MOUNTED! Bootstrapping events and initting vizes..." : null
    );
    // this.setSlider();
    // this.fetchEntities();
    // this.d3ForceDirect();
    this.D3init();
  }, //mounted
}; //export.timeline
</script>

<style>
</style>
