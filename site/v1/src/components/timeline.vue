<template>
<div>
  <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/vis/4.17.0/vis.min.css'><link rel='stylesheet' href="https://visjs.org/dist/vis-timeline-graph2d.min.css">
  <h1 class="is-size-1">timeline</h1>
<p>console.msg:<code>{{console.msg}}</code></p>
<p>console.throb:<code>{{console.throb}}</code></p>
<p>filter:<code>{{filter}}</code></p>
<p>windows.time.begin:<code>{{windows.time.begin}}</code></p>
<p>windows.time.end:<code>{{windows.time.end}}</code></p>
<p>windows.space:<code>{{windows.space.bbox}}</code></p>

<div id="line"></div>

</div>
</template>

<script>

  // DOM element where the Timeline will be attached
var container = document.getElementById("line");

// Create a DataSet (allows two way data-binding)
var items = new vis.DataSet([
  { id: 1, content: "item 1", start: "2017-04-20" },
  { id: 2, content: "item 2", start: "2017-04-14" },
  { id: 3, content: "item 3", start: "2017-04-18" },
  { id: 4, content: "item 4", start: "2017-04-16", end: "2017-04-19" },
  { id: 5, content: "item 5", start: "2017-04-25" },
  { id: 6, content: "item 6", start: "2017-04-27", type: "point" }
]);

// Configuration for the Timeline
var options = {};

export default {
name:'Timeline',
data() {
return {
  times:[
  { id: 1, content: "time.1", start: "1912-04-20" },
  { id: 2, content: "time.2", start: "2017-04-14" },
  { id: 3, content: "time.3", start: "2017-04-18" },
  { id: 4, content: "time.4", start: "2017-04-16", end: "2017-04-19" },
  { id: 5, content: "time.5", start: "2017-04-25" },
  { id: 6, content: "time.6", start: "2019-01-27", type: "point" }
],
  filter:null,
  windows:{
    time:{begin:null,end:null}
    ,space:{bbox:null}
  },
console:{msg:null,throb:false}
}//return
},//data
computed:{},//computed
watch:{},//watch
methods:{},//methods
created() {
  
  this.windows.time.begin=(typeof this.$route.params.tstart !== 'undefined')?this.$route.params.tstart:null;
  this.windows.time.end=(typeof this.$route.params.tend !== 'undefined')?this.$route.params.tend:null;
  this.filter=(typeof this.$route.params.filter !== 'undefined')?this.$route.params.filter:null;

  return null;
  },//created
  mounted: function () {

/* ---------------------------------- TIMELINE -------------------- */

this.$nextTick(() => {
       // get the element
       const el = this.$el.querySelector('#line')
       // create the Timeline
       this.timeline = new vis.Timeline(el, this.times, options);
     })

/* ---------------------------------- /TIMELINE */

  }//mounted




}//export.timeline
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#mynetwork {
    width: 600px;
    height: 400px;
    border: 1px solid lightgray;
}
</style>