<template>
<div id="vue-root">
<p>console.msgs:
<p v-for="msg in console.msgs"><code>{{msg}}</code></p>
</p>
<hr/>
<p>rob:<code>{{rob}}</code></p>
<p>active.key:<code>{{active.key}}</code></p>
<p>active.item.article:<code>{{active.item.article}}</code></p>
<p>active.graph.participants:<code>{{active.graph.participants}}</code></p>
<p>active.graph.locations:<code>{{active.graph.locations}}</code></p>
<hr/>
<p>filters.time.begin:<code>{{filters.time.begin}}</code></p>
<p>filters.time.end:<code>{{filters.time.end}}</code></p>
<p>filter.query:<code>{{filters.query}}</code></p>
<p>filters.space:<code>{{filters.space.bbox}}</code></p>

<div id="line"/>

</div>
</template>

<script>

var container = document.getElementById("line");

// Configuration for the Timeline
var options = {};

export default {
name:'Timeline',
data() {
return {
  rob:null,
  active:{key:null,item:{id:null,article:null},graph:{}},
  timetimes:[],
  filters:{
    time:{begin:'',end:''}
    ,space:{bbox:''}
    ,query:''
    ,activeog:{key:null,itemx:{id:"id",article:"static article"}}
  }
,console:{msgs:[],msg:'',throb:false}
}//return
},//data
computed:{},//computed
watch:{
  'active.key': function () {
        this.routize()
      }
},//watch
methods:{
  setActiveGraph: function(q){

if(typeof q == 'undefined'){this.console.msg="no graph query incoming, dying...";return}

axios.post('http://'+process.env.ARANGOIP+':8529/_api/cursor',{
  query:q
})
    .then(response => {
        this.active.graph = response.data.result[0];
      // JSON response.datas are automatically parsed.

    })//axios.then
    .catch(e => {
      console.error(e)
    })//axios.catch

  },
  setActiveItem: function(){

this.active.item=(typeof this.active !=='undefined' && this.active.key !== null)?this.$_.findWhere(this.timetimes, {id:this.active.key}):{id:null,article:"(no article found for key)"};

let q='LET event = (for vertices, edges, paths in OUTBOUND "events/'+this.active.key+'" edges return distinct { name: FIRST(paths.vertices).name, evid: FIRST(paths.edges)._from }) LET people = ( for v,e,p in 1..1 OUTBOUND "events/'+this.active.key+'" edges filter e.type==\'hasParticipant\' RETURN {name:v.name,key:v._id} ) LET places = ( for v,e,p in 1..1 OUTBOUND "events/'+this.active.key+'" edges filter e.type==\'occurredAt\' RETURN {name:v.name,key:v._id} ) return { event:event, participants:people, locations:places }'
this.console.msgs.push(q)
this.setActiveGraph(q)
  }
  ,getNullItem: function(){
    return {key:null,item:null}
  },
  routize: function(){
    let rob = { params:{
  tstart:this.filters.time.begin,
  tend:this.filters.time.end,
  filter:this.filters.query,
  activeid:this.active.key
}}
this.rob=rob;
this.$router.push(rob)

  },
  setTimeline:function(){
       // get the element
       const el = this.$el.querySelector('#line')
       // create the Timeline
       this.timeline = new vis.Timeline(el, this.timetimes, options);

// some incoming/default selection
this.timeline.setSelection(this.active.key)
this.setActiveItem();

       var that = this;
// now we wire up click-selection
       this.timeline.on('select',function (properties){
                
                that.active.key=properties.items[0]
                console.log("that.active.key after set from select:",that.active.key)
                              this.setSelection(properties.items[0]);
                              that.setActiveItem();
  })
     },
  setTimes:function(){

// axios.get('http://localhost:8000/events-fake.json')
axios.post('http://'+process.env.ARANGOIP+':8529/_api/cursor',{
  query:"for e in edges filter e.type==\"hasParticipant\" for ev in events filter e._from==ev._id LET tstart = HAS(ev.timestamp, \"start\")==true ? DATE_FORMAT(ev.timestamp.start, \"%yyyy-%mm-%dd\") : DATE_FORMAT(ev.timestamp, \"%yyyy-%mm-%dd\") LET tend = HAS(ev.timestamp, \"end\")==true ? DATE_FORMAT(ev.timestamp.end, \"%yyyy-%mm-%dd\") : null filter (DATE_TIMESTAMP(tstart)>=DATE_TIMESTAMP('"+this.filters.time.begin+"') && DATE_TIMESTAMP(tstart)<=DATE_TIMESTAMP('"+this.filters.time.end+"')) return distinct { id:ev._key, content:ev.name, article:ev.article, start:tstart, end:tend}"
})
    .then(response => {
        this.timetimes = response.data.result;
      // JSON response.datas are automatically parsed.

this.$nextTick(() => this.setTimeline());

    })//axios.then
    .catch(e => {
      console.error(e)
    })//axios.catch

  }
},//methods
created() {

  this.filters.time.begin=(typeof this.$route.params.tstart !== 'undefined')?this.$route.params.tstart:'1900-01-01';
  this.filters.time.end=(typeof this.$route.params.tend !== 'undefined')?this.$route.params.tend:'1950-12-31';
  this.filters.query=(typeof this.$route.params.filter !== 'undefined')?this.$route.params.filter:'*';

  this.active.key=(typeof this.$route.params.activeid !== 'undefined')?this.$route.params.activeid:'';
this.console.msgs.push("in created after activeid check, active.key:",this.active.key);

  this.setTimes()

  return null;
  },//created
  mounted: function () {

  }//mounted




}//export.timeline
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
body{
  background-color:rgba(0,0,0,1);
}
#vue-root{margin:0 1%;background-color:white;}
.vis-panel{
  font-weight:800;font-size:.8em;
}
.vis-even{
  background-color:rgba(0,0,0,.01)
}
.vis-odd{
  background-color:rgba(0,0,0,.05)
}
.vis-item {
    background-color:rgba(91,53,23,1);
    color:#d8b425;
    border-color:#d8b422;
  }
  .vis-item.vis-box{
    border-radius:3px;
  }
  .vis-item-content{
    font-weight:800;
font-size:.8em;
  }
  .vis-item.vis-point.vis-selected, .vis-item.vis-selected{
    background-color:orange;
    color:rgba(91,53,23,1);
  }
</style>