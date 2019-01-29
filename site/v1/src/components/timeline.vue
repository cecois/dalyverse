<template>
<div>
<p>console.msgs:
<code v-for="msg in console.msgs">{{msg}}</code>
</p>
<p>console.throb:<code>{{console.throb}}</code></p>
<p>filter,qyert:<code>{{filters.query}}</code></p>
<hr/>
<p>filters.active.key:<code>{{filters.active.key}}</code></p>
<p>filters.active.item.article:<code>{{filters.active.item.article}}</code></p>
<hr/>
<p>filters.time.begin:<code>{{filters.time.begin}}</code></p>
<p>filters.time.end:<code>{{filters.time.end}}</code></p>
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
    ,active:{key:'',item:{article:''}}
  },
console:{msgs:[],msg:'',throb:false}
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
  setActiveItem: function(key){

// if(this.filters.active.key==null || this.filters.active.key==''){
//   this.filters.active.item=this.getNullItem();
// } else {
  if(key!==null && (typeof key !== 'undefined')){
      this.filters.active={key:key,item:this.$_.findWhere(this.timetimes, {id:key})}
    } else {
      this.filters.active={key:'',article:''}
    }
  // }
  }//setactiveitem
  ,
  getNullItem: function(){
    return {key:null,article:null}
  },
  routize: function(){
    let rob = { params:{
  tstart:this.filters.time.begin,
  tend:this.filters.time.end,
  activeid:this.filters.active.key
}}
this.$router.push(rob)

  },
  setTimeline:function(){
    this.console.msgs.push("initting timeline w/ timetimes...")
       // get the element
       const el = this.$el.querySelector('#line')
       // create the Timeline
       this.timeline = new vis.Timeline(el, this.timetimes, options);

// this.timeline.setSelection(this.filters.active.key,{focus:true,animation:true})

       var that = this;
// that.setActiveItem(this.filters.active.key)

       this.timeline.on('select',function (properties){

                let itm = that.$_.findWhere(that.timetimes, {id:properties.items[0]})

        if(that.filters.active.key!==itm.id){
                // that.filters.active={key:itm.id};
                that.setActiveItem(itm.id)
                // console.info(properties.items)
              } else {
                              this.setSelection(null);
                              that.setactiveitem(null);
                            }
});
  },
  setTimes:function(){
    this.console.msgs.push("getting timeline data...")

//     this.timetimes = [
//   { id: 19, content: "time.1", start: "2016-04-20",article:"articlecopy1" },
//   { id: 41, content: "time.4", start: "2017-04-16", end: "2017-09-19",article:"articlecopy4" }
// ];

axios.get('http://localhost:8000/events-fake.json')
    .then(response => {
      // console.log("raw axios response:",response.data)
      // JSON response.datas are automatically parsed.
      // console.info(response.data)
    this.console.msgs.push("mapping timeline data...")
    this.timetimes = this.$_.map(response.data,(ev)=>{
      return {
        id:ev._key,
        content:ev.name,
        article:ev.article+"("+ev.nb_timestamp.nb+")",
        start:this.$MOMENT(ev.timestamp).format('YYYY-MM-DD')
      }
    })
this.console.msgs.push("CHECK TIMTIMES")

this.$nextTick(() => this.setTimeline());

    })//axios.then
    .catch(e => {
    // this.console={msg:e,throb:false}
      console.error(e)
    })//axios.catch

  }
},//methods
created() {

  this.filters.time.begin=(typeof this.$route.params.tstart !== 'undefined')?this.$route.params.tstart:'2016-12-31';
  this.filters.time.end=(typeof this.$route.params.tend !== 'undefined')?this.$route.params.tend:'2017-12-31';
  this.filters.query=(typeof this.$route.params.filter !== 'undefined')?this.$route.params.filter:'*';

  if(typeof this.$route.params.activeid !== 'undefined'){this.setActiveItem(this.$route.params.activeid)};

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