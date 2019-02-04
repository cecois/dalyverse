<template>
<div id="vue-root" class="">
    <div class="container">
  <!-- created->setTimes->axios.get.events->set timelinetimes->setTimeline->setSelection (timeline)->setActiveItem[->setActiveGraph]->wire timeline select

  (setActiveItem last) -->

  <vue-headful
            :title="page.title"
        description="Events Timeline and Graph from the Andy Dalyverse"
        />

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
</div>

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
this.init();

  }, //mounted
  methods: {
    init: function () {

      this.console.msg="initing..."
      this.initSlider();

    }, //init
initSlider: function () {
  var slider = document.getElementById('slider');

  this.slider = this.$NOUISLIDER.create(slider, {
    start: [this.$MOMENT(this.filterz.time.beginz, "YYYYMMDD").valueOf(), this.$MOMENT(this.filterz.time.endz, "YYYYMMDD").valueOf()],
    connect: true,
    pips: {
        mode: 'range',
        density: 3
    },
    range: {
        'min': this.$MOMENT(this.filterz.time.beginz, "YYYYMMDD").subtract(5, 'years').valueOf()
        ,'max': this.$MOMENT(this.filterz.time.endz, "YYYYMMDD").add(5, 'years').valueOf()
    }
})
} //initslider

}, //methods
  computed: {}, //computed
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