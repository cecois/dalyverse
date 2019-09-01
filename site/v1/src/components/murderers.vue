<template>
  <div id="vue-root" class="">
    <vue-headful :title="page.title" description="People, Places, Events & Things in the Andy Dalyverse" />
    <div class="columns dv-vertical-columns">
      <div class="column ">
        maybe dump pie chart in favor of daly character list that toggles who has/has not murdered
        <div class="dv-pie-murderers"></div>
      </div note="/.column">
    </div>
  </div>
  <!-- ./#vue-root -->
</template>

<script>
import * as d3 from 'd3';
// import Graph from "./graph.vue";

export default {
  name: "Murderers",
  // components:{Graph},
  data () {
    return {
      // url_arango: "http://" + process.env.ARANGOIP + ":" + process.env.ARANGOPORT + process.env.ARANGOCURSOR,
      // url_arango: "http://" + process.env.ARANGOIP + ":" + process.env.ARANGOPORT + process.env.ARANGOCURSOR,
      url_arango: "http://localhost:8000",
      graph: null,
      page: {
        title: "Andy Dalyverse Murderers"
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
      // this.fetchEntities()

    // }

    // if (this.$route.params
    //   .activeid) {
    //   console.log("key incoming -- " + decodeURIComponent(this.$route.params.activeid) + " -- activating...");
    //   this.active.key = decodeURIComponent(this.$route.params.activeid);
    //   console.log("setting acxtive w/ route param/this.active.key:", this.active.key);
    // }
this.doPieChart()
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
    doPieChart: function(){

// set the dimensions and margins of the graph
var width = 450
    ,height = 450
    ,margin = 40

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width, height) / 2 - margin

// append the svg object to the div called 'my_dataviz'
var svg = d3.select(".dv-pie-murderers")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Create dummy data
var data = {a: 9, b: 20, c:30, d:8, e:12}

// set the color scale
var color = d3.scaleOrdinal()
  .domain(data)
  .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"])

// Compute the position of each group on the pie:
var pie = d3.pie()
  .value(function(d) {return d.value; })
var data_ready = pie(d3.entries(data))

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg
  .selectAll('whatever')
  .data(data_ready)
  .enter()
  .append('path')
  .attr('d', d3.arc()
    .innerRadius(0)
    .outerRadius(radius)
  )
  .attr('fill', function(d){ return(color(d.data.key)) })
  .attr("stroke", "black")
  .style("stroke-width", "2px")
  .style("opacity", 0.7)

    },
    doPieChartOG: function(){

var data = [
{"name":"<5",value:19912018},
{"name":"5-9",value:20501982},
{"name":"10-14",value:20679786},
{"name":"15-19",value:21354481},
{"name":"20-24",value:22604232},
{"name":"25-29",value:21698010},
{"name":"30-34",value:21183639},
{"name":"35-39",value:19855782},
{"name":"40-44",value:20796128},
{"name":"45-49",value:21370368},
{"name":"50-54",value:22525490},
{"name":"55-59",value:21001947},
{"name":"60-64",value:18415681},
{"name":"65-69",value:14547446},
{"name":"70-74",value:10587721},
{"name":"75-79",value:7730129},
{"name":"80-84",value:5811429},
{"name":"≥85",value:5938752}
]

        const arcs = this.d3.pie(data);

        const svg = d3.select(".dv-pie-murderers").create("svg")
            .attr("viewBox", [-width / 2, -height / 2, width, height]);

        svg.append("g")
            .attr("stroke", "white")
          .selectAll("path")
          .data(arcs)
          .join("path")
            .attr("fill", d => color(d.data.name))
            .attr("d", arc)
          .append("title")
            .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

        svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 12)
            .attr("text-anchor", "middle")
          .selectAll("text")
          .data(arcs)
          .join("text")
            .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
            .call(text => text.append("tspan")
                .attr("y", "-0.4em")
                .attr("font-weight", "bold")
                .text(d => d.data.name))
            .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
                .attr("x", 0)
                .attr("y", "0.7em")
                .attr("fill-opacity", 0.7)
                .text(d => d.data.value.toLocaleString()));

        return svg.node();

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
          }); //axios.catch
      } //fetchEntities

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
