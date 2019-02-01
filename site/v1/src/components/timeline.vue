<template>
<div id="vue-root">
  created->setTimes->axios.get.events->set timelinetimes->setTimeline->setSelection (timeline)->setActiveItem[->setActiveGraph]->wire timeline select

  (setActiveItem last)

  <span v-bind:class="{ throbber: console.throb }" class="icon">
          <i :class="console.clazz" class="mdi"></i>
        </span>
  <p style="font-size:1.4em;"><code>{{console.msg}}</code></p>
<hr/>
<p>events found:<code>{{timelinetimes.length}}</code></p>
<p>active.key:<code>{{active.key}}</code></p>
<p>active.item.content:<code>{{active.item.content}}</code></p>
<p>active.item.article:<code>{{active.item.article}}</code></p>
<p>active.item.start:<code>{{active.item.start}}</code></p>
<p>active.graph.participants:<code>{{active.graph.participants}}</code></p>
<p>active.graph.locations:<code>{{active.graph.locations}}</code></p>
<hr/>
<p>filters.time.begin:<code>{{filters.time.begin}}</code></p>
<p>filters.time.end:<code>{{filters.time.end}}</code></p>

<div id="slider"/>
<div id="line"/>

</div>
</template>

<script>

export default {
  name: 'Timeline',
  data () {
    return {
      rob: null,
      active: {key: null, item: {id: null, article: null}, graph: {participants: null, locations: null}},
      timelinetimes: [],
      filters: {
        time: {begin: '', end: ''},
        space: {bbox: ''}
        // ,query:''
        // ,activeog:{key:null,itemx:{id:"id",article:"static article"}}
  },
  console: {
    msg: '',
    clazz: null,
    throb: false
  }
  }//return
  },//data
  computed: {}, //computed
  watch: {
    'active.key': function () {
          this.routize()
          this.setActiveItem()
        },
    'timelinetimes': function() {
          this.setTimeline();
          this.setSlider();
        }
  }, //watch
  methods: {
    liveTest: function (){

    // test of activeitem is legit (found within timelinetimes array)
    if(typeof this.$_.findWhere(this.timelinetimes, {id:this.active.key}) == 'undefined'){
    this.console={clazz:"mdi-alert-circle-outline has-text-danger is-size-1 has-text-weight-bold",msg:"event ("+this.active.key+") not found in current set - check temporal filters",throb:false}
    } else {
      this.console={
        clazz:null
        ,msg:null
        ,throb:false
      }
    }

  },
  setActiveGraph: function () {
    // if we have an active.key
    if(this.active.key !== null){
    var q='LET event = (for vertices, edges, paths in OUTBOUND "events/'+this.active.key+'" edges return distinct { name: FIRST(paths.vertices).name, evid: FIRST(paths.edges)._from }) LET people = ( for v,e,p in 1..1 OUTBOUND "events/'+this.active.key+'" edges filter e.type==\'hasParticipant\' RETURN {name:v.name,key:v._id} ) LET places = ( for v,e,p in 1..1 OUTBOUND "events/'+this.active.    key+'" edges filter e.type==\'occurredAt\' RETURN {name:v.name,key:v._id} ) return { event:event, participants:people, locations:places }'
    
    console.info(q)
    
    if(typeof q == 'undefined'){this.console.msg="no graph query incoming, dying...";return}
    
    axios.post('http://'+process.env.ARANGOIP+':8529/_api/cursor',{
      query:q
    })
        .then(response => {
            this.active.graph = response.data.result[0];
          // JSON response.datas are automatically parsed.
    this.$nextTick(() => this.liveTest());
    
        })//axios.then
        .catch(e => {
          console.error(e)
        })//axios.catch
      }//if key
      else {
        // no key? null it out
        this.active.graph = {event:null, participants:null, locations:null}
      }
  },
  setActiveItem: function() {
    // set the active *item* based on the active key/trigger
    this.active.item=(this.active.key !== null)?this.$_.findWhere(this.timelinetimes, {id:this.active.key}):{id:null, article:"(no article found for key)", start:null};
    // also throw that to timeline (if it's null nothing will be selected - including any unselecte of a somehow-selected timeline item)
    this.timeline.setSelection(this.active.key)
    // also set (or clear) any associated graphs
    this.setActiveGraph()

  },
  getNullItem: function(){
    return {key:null, item:null}
  },
  routize: function(){
    let rob = { params:{
  tstart:this.filters.time.begin,
  tend:this.filters.time.end,
  activeid:this.active.key
}}
this.rob=rob;
this.$router.push(rob)

  },
  setSlider:function(){

if(typeof this.slider == 'undefined'){
  // first ime here? let's make a slider to actually use
  console.log("no slider - you're the slider: [initting slider]")
var slider = document.getElementById('slider');

this.slider = this.$NOUISLIDER.create(slider, {
    start: [this.$MOMENT(this.filters.time.begin, "YYYYMMDD").valueOf(), this.$MOMENT(this.filters.time.end, "YYYYMMDD").valueOf()],
    connect: true,
    pips: {
        mode: 'range',
        density: 3
    },
    range: {
        'min': this.$MOMENT(this.filters.time.begin, "YYYYMMDD").subtract(5, 'years').valueOf()
        ,'max': this.$MOMENT(this.filters.time.end, "YYYYMMDD").add(5, 'years').valueOf()
    }
})

var that=this;
this.slider.on('update', function(values,handle){

  that.filters.time.begin=that.$MOMENT(values[0],'x').format('YYYY-MM-DD');
  that.filters.time.end=that.$MOMENT(values[1],'x').format('YYYY-MM-DD');
});

this.slider.on('end', function(values,handle){
  that.routize()
  that.setTimes()
});

}//slider no exist

  },
  setTimeline:function(){
console.log('running setTimeline...')

      // old magic
      var that = this;
      
    if(typeof this.timeline == 'undefined'){
      //first time here?
       const el = this.$el.querySelector('#line')
       // create the Timeline
       this.timeline = new vis.Timeline(el, this.timelinetimes, {});

      // now we wire up click-selection
       this.timeline.on('select',function (properties){
        // if it's active alrady we deactivate
        if(properties.items[0]==that.active.key){
                that.active.key=null
                              this.setSelection(null);
                              // that.setActiveItem();
        } else {
                that.active.key=properties.items[0]
                this.setSelection(properties.items[0]);
          }//else itemselect matches active.key
          // that.setActiveItem();
      })//.on
       that.setActiveItem()
    }//timeline.create and wireup
    else {
      console.log("timeline exists already, active.key is:",that.active.key)
          this.setSelection(that.active.key);
    }
       
     },
  setTimes:function(){
console.log('running setTimes...')
  // axios.get('http://localhost:8000/events-fake.json')
  let q = "for e in edges filter e.type==\"hasParticipant\" for ev in events filter e._from==ev._id LET tstart = HAS(ev.timestamp, \"start\")==true ? DATE_FORMAT(ev.timestamp.start, \"%yyyy-%mm-%dd\") : DATE_FORMAT(ev.timestamp, \"%yyyy-%mm-%dd\") LET tend = HAS(ev.timestamp, \"end\")==true ? DATE_FORMAT(ev.timestamp.end, \"%yyyy-%mm-%dd\") : null filter (DATE_TIMESTAMP(tstart)>=DATE_TIMESTAMP('"+this.filters.time.begin+"') && DATE_TIMESTAMP(tstart)<=DATE_TIMESTAMP('"+this.filters.time.end+"')) return distinct { id:ev._key, content:ev.name, article:ev.article, start:tstart, end:tend}"

  axios.post('http://'+process.env.ARANGOIP+':8529/_api/cursor',{
    query:q
  })
    .then(response => {
        this.timelinetimes = response.data.result;
      // JSON response.datas are automatically parsed.

    })//axios.then
    .catch(e => {
      console.error(e)
    })//axios.catch

  }
},//methods
created() {

this.console={msg:"loading...",throb:true,clazz:"mdi-clock"}

  this.filters.time.begin=(typeof this.$route.params.tstart !== 'undefined' && this.$route.params.tstart!==null && this.$route.params.tstart!=='null')?this.$route.params.tstart:'1988-01-01';
  this.filters.time.end=(typeof this.$route.params.tend !== 'undefined' && this.$route.params.tend!==null && this.$route.params.tend!=='null')?this.$route.params.tend:'1999-12-31';
  // this.filters.query=(typeof this.$route.params.filter !== 'undefined')?this.$route.params.filter:'*';

  this.active.key=(typeof this.$route.params.activeid !== 'undefined')?this.$route.params.activeid:null;

  return null;
  },//created
  mounted: function () {

this.setTimes()

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
  .vis-text.vis-major{
    font-weight:800;
    font-size:1.7em;
  }
  .vis-text.vis-minor{
    font-size:.9em;
    color:rgba(5,5,5,.5);
  }

  /* ------------------ THROBBER -- */

.throbber {
  animation: rotator 1.4s linear infinite;
}

@keyframes rotator {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(270deg); }
}

.path {
  stroke-dasharray: 187;
  stroke-dashoffset: 0;
  transform-origin: center;
  animation:
    dash 1.4s ease-in-out infinite,
    colors (1.4s*4) ease-in-out infinite;
}

@keyframes colors {
  0% { stroke: #4285F4; }
  25% { stroke: #DE3E35; }
  50% { stroke: #F7C223; }
  75% { stroke: #1B9A59; }
  100% { stroke: #4285F4; }
}

@keyframes dash {
 0% { stroke-dashoffset: 187; }
 50% {
   stroke-dashoffset: 187/4;
   transform:rotate(135deg);
 }
 100% {
   stroke-dashoffset: 187;
   transform:rotate(450deg);
 }
}
</style>