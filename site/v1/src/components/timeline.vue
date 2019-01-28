<template>
<div>
  <h1 class="is-size-1">timeline</h1>
<p>console.msg:<code>{{console.msg}}</code></p>
<p>console.throb:<code>{{console.throb}}</code></p>
<p>filter:<code>{{filter}}</code></p>
<p>itemactive:<code>{{item.article}}</code></p>
<p>windows.time.begin:<code>{{windows.time.begin}}</code></p>
<p>windows.time.end:<code>{{windows.time.end}}</code></p>
<p>windows.space:<code>{{windows.space.bbox}}</code></p>

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
  item:{},
  timetimes:[],
  filter:null,
  windows:{
    time:{begin:null,end:null}
    ,space:{bbox:null}
  },
console:{msg:null,throb:false}
}//return
},//data
computed:{
  query: function () {
      return "start:"+windows.time.begin+" AND end:"+windows.time.end
    }
},//computed
watch:{
item: function() {this.routize();}
},//watch
methods:{
  routize: function(){
    console.log('routizing...')
    let rob = { params:{
  tstart:this.windows.time.begin,
  tend:this.windows.time.end,
  active:this.item.id
}}
console.log(rob)
this.$router.push(rob)

  },
  setTimes:function(){
    this.console={msg:"setting timeline data...",throb:true}

    this.timetimes = [
  { id: 19, content: "time.1", start: "2016-04-20",article:"articlecopy1" },
  { id: 41, content: "time.4", start: "2017-04-16", end: "2017-09-19",article:"articlecopy4" }
];
this.console={msg:"",throb:false}
  }
},//methods
created() {

  this.windows.time.begin=(typeof this.$route.params.tstart !== 'undefined')?this.$route.params.tstart:'20020101';
  this.windows.time.end=(typeof this.$route.params.tend !== 'undefined')?this.$route.params.tend:'20190101';
  this.filter=(typeof this.$route.params.filter !== 'undefined')?this.$route.params.filter:'*:*';

  return null;
  },//created
  mounted: function () {

/* ---------------------------------- TIMELINE -------------------- */

this.$nextTick(() => {
       // get the element
       const el = this.$el.querySelector('#line')
       // create the Timeline
       this.timeline = new vis.Timeline(el, this.timetimes, options);
       var that = this;
       this.timeline.on('select',function (properties){
                let itm = that.$_.findWhere(that.timetimes, {id:properties.items[0]})
        if(that.item.id!==itm.id){
                that.item=itm;
                // console.info(properties.items)
              } else {
                              this.setSelection(null);
                              that.item={};
                            }
});
     })

/* ---------------------------------- /TIMELINE */

this.setTimes();

  }//mounted




}//export.timeline
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.vis-item {
    background-color:rgba(91,53,23,1);
    color:#d8b422;
    border-color:#d8b422;
    border-radius:3px;
    font-weight:800;
  }
  .vis-item.vis-point.vis-selected, .vis-item.vis-selected{
    background-color:orange;
    color:rgba(91,53,23,1);
  }
</style>