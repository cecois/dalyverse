<template>
<div id="vue-root" class="">
    <div class="container">
  <!-- created->setTimes->axios.get.events->set timelinetimes->setTimeline->setSelection (timeline)->setActiveItem[->setActiveGraph]->wire timeline select

  (setActiveItem last) -->

  <vue-headful
            :title="page.title"
        description="Events Timeline and Graph from the Andy Dalyverse"
        />
<div id="console">
<div class="columns is-size-7">
<div class="column"><code v-if="console">{{console.msg}}</code></div>
</div>

  <!-- <span v-bind:class="{ throbber: console.throb }" class="icon">
          <i :class="console.clazz" class="mdi"></i>
        </span>
<hr/> -->
<div class="columns is-size-7">
<div class="column" v-if="active.key">active.key:<code>{{active.key}}</code></div>
<div class="column" v-if="filterz.time.beginz">filterz.time.beginz:<code>{{filterz.time.beginz}}</code></div>
<div class="column" v-if="filterz.time.endz">filterz.time.endz:<code>{{filterz.time.endz}}</code></div>
<!-- <div class="column" v-if="timelinetimes">events found:<code>{{timelinetimes.length}}</code></div> -->
<!-- <div class="column" v-if="active.item">active.item.content:<code>{{active.item.content}}</code></div> -->
<!-- <div class="column" v-if="active.item">active.item.article:<code>{{active.item.article}}</code></div> -->
<div class="column" v-if="active.item">active.item.start:<code>{{active.item.start}}</code></div>
<!-- <div class="column" v-if="active.graph">active.graph.participants:<code>{{active.graph.participants}}</code></div> -->
</div></div>

<div id="slider"/>
<div id="line"/>
    </div><!-- /.container -->
</div><!-- ./#vue-root -->
</template>

<script>

export default {
  name: 'Timeline',
  data () {
    return {
      slidertime:{min:null,max:null},
      filterz: {
        time: {
          beginz: process.env.FILTER_TIME_BEGIN,
          endz: process.env.FILTER_TIME_END
        },
        space: { bbox: null}
      },
      page: {title: null},
      active: {key: null, feature: {id:null}, item: {id: null, article: null}, graph: {participants: null, locations: null}},
      timelinetimes: [],

  console: {
    msg: '',
    clazz: null,
    throb: false
  }
  }//return
  },//data
  beforeCreate () {


  },//beforeCreate
  created () {
this.console={msg:"loading...",throb:true,clazz:"mdi-clock"}
this.filterz.time.beginz=(this.$route.params.tstart)?this.$route.params.tstart:this.filterz.time.beginz;
this.filterz.time.endz=(this.$route.params.tend)?this.$route.params.tend:this.filterz.time.endz;
this.active.key=(this.$route.params.activeid)?this.$route.params.activeid:null;



  },//created
  mounted: function () {
this.console={msg:"mounted",throb:false,clazz:""}
// this.setPageTitle();
// this.setTimes()
this.initData();

  }, //mounted
  methods: {

    initData: function () {

      this.console.msg="initing data..."
      this.fetchTimeMinMax();
      this.fetchEvents();

// now with some data in place we can default some app elements:
      // this.$nextTick(function() {
      //   this.initArchitecture();
      // });

    }, //initData
    // initArchitecture: function () {

    //   this.console.msg="initing architecture..."
    //   this.initSlider();
    //   this.initTimeline();


    // }, //initArchitecture
    initSlider: function () {
      var slider = document.getElementById('slider');

      console.info('this.slidertime.min:',this.slidertime.min)
console.info('this.slidertime.max:',this.slidertime.max)

      this.slider = this.$NOUISLIDER.create(slider, {
        start: [this.$MOMENT(this.filterz.time.beginz, "YYYYMMDD").valueOf(), this.$MOMENT(this.filterz.time.endz, "YYYYMMDD").valueOf()],
        connect: true,
        pips: {
            mode: 'range',
            density: 3
        },
        range: {
            'min': this.$MOMENT(this.slidertime.min).subtract(2,'years').valueOf(),
            'max': this.$MOMENT(this.slidertime.max).add(2,'years').valueOf()
        }
        // range: {
        //     'min': this.$MOMENT(this.filterz.time.beginz, "YYYYMMDD").subtract(5, 'years').valueOf()
        //     ,'max': this.$MOMENT(this.filterz.time.endz, "YYYYMMDD").add(5, 'years').valueOf()
        // }
    })
    }, //initslider
    fetchTimeMinMax: function () {

    let q = "for ev in events filter ev.timestamp.start != null COLLECT AGGREGATE mintime = MIN(ev.timestamp.start),maxtime = MAX(ev.timestamp) return { minstart:mintime,maxstart:maxtime }"
    console.info(q);

      axios.post('http://'+process.env.ARANGOIP+':8529/_api/cursor',{
        query:q
      })
        .then(response => {
          console.log("SETTING SLIDERTIMES!")
          this.slidertime={min:'2018-01-01T00:00:01Z',max:response.data.result[0].maxstart.start}
          // JSON response.datas are automatically parsed.
        })//axios.then
        .catch(e => {
          console.error(e)
        })//axios.catch

    }, //timeminmax
    initTimeline: function () {

          // old magic
          var that = this;

           const el = this.$el.querySelector('#line')
           // create the Timeline
           var titems = new vis.DataSet(this.timelinetimes);
           this.timeline = new vis.Timeline(el, titems, {});

    // and bootstrap data
          // now we wire up click-selection
           // this.timeline.on('select',function (properties){
            // if it's active alrady we deactivate
            // if(properties.items[0]==that.active.key){
                    // that.active.key=null
                                  // this.setSelection(null);
                                  // that.setActiveItem();
            // } else {
                    // that.active.key=properties.items[0]
                    // this.setSelection(properties.items[0]);
              // }//else itemselect matches active.key
              // that.setActiveItem();
          // })//.on
           // that.setActiveItem()
        // }//timeline.create and wireup

    }, //inittimeline
    fetchEvents: function () {

    let q = "for e in edges filter e.type==\"hasParticipant\" OR e.type==\"occurredAt\" for ev in events filter e._from==ev._id AND e.type==\"hasParticipant\" LET tstart = HAS(ev.timestamp, \"start\")==true ? DATE_FORMAT(ev.timestamp.start, \"%yyyy-%mm-%dd\") : DATE_FORMAT(ev.timestamp, \"%yyyy-%mm-%dd\") LET tend = HAS(ev.timestamp, \"end\")==true ? DATE_FORMAT(ev.timestamp.endz, \"%yyyy-%mm-%dd\") : null LET geo=( for g in edges filter g._from==ev._id AND g.type==\"occurredAt\" for pl in places filter g._to==pl._id return distinct pl ) filter (DATE_TIMESTAMP(tstart)>=DATE_TIMESTAMP('"+this.filterz.time.beginz+"') && DATE_TIMESTAMP(tstart)<=DATE_TIMESTAMP('"+this.filterz.time.endz+"')) return distinct { id:ev._key, content:ev.name, article:ev.article, start:tstart, end:tend,geo:geo}"

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

    }, //fetchEvents
    updateTimeline: function () {

      console.log("checking updatetimeline:");
      console.log('typeof this.timeline:');
      console.log(typeof this.timeline);

    } //updatetimeline
  }, //methods
  computed: {}, //computed
  watch: {
    slidertime: function() {
        // this should only happen once, btw
          this.initSlider();
        }, //watch.slidertime
    timelinetimes: function() {
          this.updateTimeline();
        } //watch.timelinetimes
  } //watch
} //export.timeline
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
body{
  /*background-color:rgba(0,0,0,1);*/
}
#vue-root{margin:0 1%;background-color:white;}
.vis-panel{
  font-weight:800;font-size:.8em;
}
#console{
  background-color:black;
  color:white;
}
  /* ------------------ TIMELINE -- */
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

  /* ------------------ SLIDER -- */
  .noUi-handle {
    border: 2px solid rgba(43,43,43,.8);
    border-radius: 50%;
    background: #FFF;
    cursor: default;
}

.noUi-handle:focus{
  outline:none;
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