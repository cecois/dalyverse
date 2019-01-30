<template>
<div id="vue-root">
<p>console.msgs:
<p v-for="msg in console.msgs"><code>{{msg}}</code></p>
</p>
<hr/>
<p>active.key:<code>{{active.key}}</code></p>
<p>active.item.article:<code>{{active.item.article}}</code></p>
<hr/>
<p>filters.time.begin:<code>{{filters.time.begin}}</code></p>
<p>filters.time.end:<code>{{filters.time.end}}</code></p>
<p>filter.query:<code>{{filters.query}}</code></p>
<p>filters.space:<code>{{filters.space.bbox}}</code></p>

<div id="line"></div>

</div>
</template>

<script>

  // DOM element where the Timeline will be attached
var container = document.getElementById("line");

// Configuration for the Timeline
var options = {};

export default {
name:'Timeline',
data() {
return {
  timetimes:[],
  filters:{
    time:{begin:'',end:''}
    ,space:{bbox:''}
    ,query:''
    ,activeog:{key:null,itemx:{id:"id",article:"static article"}}
  }
,active:{key:"placeholderid",item:this.getActiveItem()}
,console:{msgs:[],msg:'',throb:false}
}//return
},//data
computed:{
  // query: function () {
  //     return "start:"+filters.time.begin+" AND end:"+filters.time.end
  //   }
},//computed
watch:{

},//watch
methods:{
  getActiveItem: function(){

// return {id:this.active.key,article:"can I do getactiveItem?"}
return (typeof this.active.key !=='undefined')?this.$_.findWhere(this.timetimes, {id:this.active.key}):{id:null,article:"(no article found for key)"}
  }
  ,setActiveItem: function(key){

// console.log("in setactiveitem, key: ",key)
// console.log("in setactiveitem, item: ",this.$_.findWhere(this.timetimes, {id:key}))
// if(this.filters.active.key==null || this.filters.active.key==''){
//   this.filters.active.item=this.getNullItem();
// } else {

switch (true) {

  case (typeof key == 'undefined'):
  this.console.msgs.push("this case firing:case (typeof key == 'undefined'), key:",key)
  let key = this.filters.active.key;
    this.filters.active={key:key,item:this.$_.findWhere(this.timetimes, {id:key})}
  break;
  case (key==null):
  this.console.msgs.push("this case firing:case (key==null), key:",key)
    this.filters.active=this.getNullItem()
    break;
    case (typeof key !== 'undefined'):
    this.console.msgs.push("this case firing:case (typeof key !== 'undefined'), key:",key)
    this.filters.active={key:key,item:this.$_.findWhere(this.timetimes, {id:key})}
    break;
  default:
    this.filters.active=this.getNullItem()
    break;
}


  }//setactiveitem
  ,
  getNullItem: function(){
    return {key:'',item:{article:''}}
  },
  routize: function(){
//     let rob = { params:{
//   tstart:this.filters.time.begin,
//   tend:this.filters.time.end,
//   activeid:this.filters.active.key
// }}
// this.$router.push(rob)

  },
  setTimeline:function(){
    // this.console.msgs.push("initting timeline w/ timetimes...")
       // get the element
       const el = this.$el.querySelector('#line')
       // create the Timeline
       this.timeline = new vis.Timeline(el, this.timetimes, options);

// some incoming/default selection
// if(typeof this.filters.active.key !== 'undefined' && this.filters.active.key !== null){this.timeline.setSelection(this.filters.active.key)}
this.timeline.setSelection(this.active.key)
// this.setActiveItem();

       var that = this;
// now we wire up click-selection
       this.timeline.on('select',function (properties){
                let itm = that.$_.findWhere(that.timetimes, {id:properties.items[0]})
        if(that.active.key!==itm.id){
                that.setActiveItem(itm.id)
              } else {
                              this.setSelection(null);
                              that.setActiveItem(null);
                            }
});
  },
  setTimes:function(){
    // this.console.msgs.push("getting timeline data...")

//     this.timetimes = [
//   { id: 19, content: "time.1", start: "2016-04-20",article:"articlecopy1" },
//   { id: 41, content: "time.4", start: "2017-04-16", end: "2017-09-19",article:"articlecopy4" }
// ];

// axios.get('http://localhost:8000/events-fake.json')
axios.post('http://localhost:8529/_api/cursor',{
  query:"for e in edges filter e.type==\"hasParticipant\" for ev in events filter e._from==ev._id LET tstart = HAS(ev.timestamp, \"start\")==true ? DATE_FORMAT(ev.timestamp.start, \"%yyyy-%mm-%dd\") : DATE_FORMAT(ev.timestamp, \"%yyyy-%mm-%dd\") LET tend = HAS(ev.timestamp, \"end\")==true ? DATE_FORMAT(ev.timestamp.end, \"%yyyy-%mm-%dd\") : null filter (DATE_TIMESTAMP(tstart)>=DATE_TIMESTAMP('"+this.filters.time.begin+"') && DATE_TIMESTAMP(tstart)<=DATE_TIMESTAMP('"+this.filters.time.end+"')) return distinct { id:ev._key, content:ev.name, article:ev.article, start:tstart, end:tend}"
})
    .then(response => {
      // if(response.error!==true){this.console.msgs.push("ERROR! Arango response errored out.")}
        this.timetimes = response.data.result;
      // JSON response.datas are automatically parsed.

// this.console.msgs.push("CHECK TIMTIMES")

this.$nextTick(() => this.setTimeline());

    })//axios.then
    .catch(e => {
    // this.console={msg:e,throb:false}
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
// if(typeof this.$route.params.activeid !== 'undefined'){
//   this.setActiveItem(this.$route.params.activeid)
// } else {
  // this.setActiveItem();
// }

  this.setTimes()

  return null;
  },//created
  mounted: function () {

/* ---------------------------------- TIMELINE -------------------- */

// this.$nextTick(() => )
// , () => {
// this.setTimeline();
// this.$nextTick(() => {

     // })

    // }//nextTick.setTimes


/* ---------------------------------- /TIMELINE */

// this.setTimes();

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