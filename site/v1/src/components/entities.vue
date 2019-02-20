<template>
<div id="vue-root" class="container is-fixed-top">
  <vue-headful :title="page.title" description="People of the Andy Dalyverse" />

<!-- ************************************************************************************ #CONSOLE -->
<div v-if="state === 'filled'" id="console" class="has-text-weight-bold">

<div class="tile is-ancestor">
  <div class="tile is-4 is-vertical is-parent">
    <div class="tile is-child box">
      <div class="columns">
        <div class="column">
        </div>
        <div class="column">
    </div>
      </div><!-- /.columns -->
    </div><!-- /.tile -->

  </div>
  <div class="tile is-parent">
    <div class="tile is-child box">
      <p class="title is-size-7" v-if="active.key">ACTIVE</p>
      
    </div>
  </div>
</div>

</div><!-- ************************************************************************************ /#CONSOLE -->
<!-- #.navbar </nav> -->

<div class="" id="container-main">
  <!-- -------------------------------------------------------------- SLIDER -->
<div id="network"/>
</div><!-- ************************************************************************************ /#CONTAINER-MAIN -->

</div><!-- ./#vue-root -->
</template>

<script>
export default {
  name: "People",
  data() {
    return {
      page: {
        title: "Andy Dalyverse Entities Graph"
      },
      state: "filled",
      fittable: true,
      nodes: new vis.DataSet([
        {id: 1, label: 'N1'},
        {id: 2, label: 'N2'},
        {id: 3, label: 'N3'},
        {id: 4, label: 'N4'},
        {id: 5, label: 'N5'}
    ]),
      edges: new vis.DataSet([
        {from: 1, to: 3},
        {from: 1, to: 2},
        {from: 2, to: 4},
        {from: 2, to: 5}
    ]),
      seens: [],
      styles: {
        previous: null,
        default: {
          radius: 6,
          fillColor: "#df04a3",
          color: "#fc00b5",
          weight: 1,
          opacity: 0.8,
          fillOpacity: 0.8
        },
        active: {
          radius: 12,
          fillColor: "#e3e10b",
          color: "#c9c70a",
          weight: 1,
          opacity: 0.8,
          fillOpacity: 0.6
        },
        clicked: {
          radius: 12,
          fillColor: "#e3e10b",
          color: "white",
          weight: 5,
          opacity: 1,
          fillOpacity: 0.9
        },
        seen: {
          radius: 6,
          fillColor: "white",
          color: "aqua",
          weight: 1,
          opacity: 0.8,
          fillOpacity: 0.8
        }
      },
      active: {
        key: null,
        item: null,
        graph: null
      },
      entities_total: 0,
      entities_added: 0,
      console: {
        msg: "",
        clazz: null,
        throb: false
      }
    }; // return
  }, // data
  beforeCreate() {}, // beforeCreate
  created() {
    console.info(
      process.env.VERBOSITY === "DEBUG"
        ? "begin CREATED, processing incoming vars"
        : null
    );

      this.$once('hook:once', function () {
    this.fittable = false;
    this.fetchTotalEntities();
  })

    this.console = {
      msg: "loading...",
      throb: true,
      clazz: "mdi-clock"
    };

    if (this.$route.params.activeid) {
      this.active.key = this.$route.params.activeid;
    }

    window.addEventListener("keydown", this.onKey);
    console.info(
      process.env.VERBOSITY === "DEBUG"
        ? "end CREATED, initial state set"
        : null
    );
  }, // created
  mounted: function() {
    console.info(
      process.env.VERBOSITY === "DEBUG"
        ? "MOUNTED! Bootstrapping events and initting vizes..."
        : null
    );
    // this.setSlider();
    this.fetchEntities();
  }, //mounted
  methods: {
    setNetwork: function () {
console.info(
      process.env.VERBOSITY === "DEBUG"
        ? "setNetwork()..."
        : null
    );
if(!this.network){

  console.info(
    process.env.VERBOSITY === "DEBUG"
      ? "no network - you're the network..."
      : null
  );

var container = document.getElementById('network');
 // provide the data in the vis format
    var data = {nodes: this.nodes,edges: this.edges};

    var options = {
    layout:{improvedLayout: false},
      edges:{
    arrows: {
      to:     {enabled: true, scaleFactor:1, type:'arrow'},
      middle: {enabled: false, scaleFactor:1, type:'arrow'},
      from:   {enabled: false, scaleFactor:1, type:'arrow'}
    },
    physics:{
    enabled: true,
    barnesHut: {
      gravitationalConstant: -2000,
      centralGravity: 0.3,
      springLength: 95,
      springConstant: 0.04,
      damping: 0.09,
      avoidOverlap: 0
    },
    forceAtlas2Based: {
      gravitationalConstant: -50,
      centralGravity: 0.01,
      springConstant: 0.08,
      springLength: 100,
      damping: 0.4,
      avoidOverlap: 0
    },
    repulsion: {
      centralGravity: 0.2,
      springLength: 200,
      springConstant: 0.05,
      nodeDistance: 100,
      damping: 0.09
    },
    hierarchicalRepulsion: {
      centralGravity: 0.0,
      springLength: 100,
      springConstant: 0.01,
      nodeDistance: 120,
      damping: 0.09
    },
    maxVelocity: 50,
    minVelocity: 0.1,
    solver: 'barnesHut',
    stabilization: {
      enabled: false,
      iterations: 1000,
      updateInterval: 100,
      onlyDynamicEdges: false,
      fit: false
    },
    timestep: 0.5,
    adaptiveTimestep: true
  }
  }
    };

this.network = new vis.Network(container, data, options);

} else {
  console.info(';;;;;;;;;;;;---:NETWORK ALREADY');
}

    }, //setNetwork
    fetchTotalEntities: function () {

          console.info(
      process.env.VERBOSITY === "DEBUG"
        ? "getTotalEntities()..."
        : null
    );

               let q = 'let entities = (let ppls = (for p in people return {_id:p._id,label:p.name,article:p.article})\
let tngs = (for t in things return {_id:t._id,label:t.name,article:t.article})\
let plcs = (for l in things return {_id:l._id,label:l.name,article:l.article})\
let evts = (for ev in events return {_id:ev._id,label:ev.name,article:ev.article})\
 RETURN flatten(append(append(ppls,tngs),append(plcs,evts))))\
return count(entities[0])'

      axios
        .post("http://" + process.env.ARANGOIP + ":8529/_api/cursor", {
          query: q
        })
        .then(response => {
          console.info(
            process.env.VERBOSITY === "DEBUG"
              ? "setting entities_total w/ axios response..."
              : null
          );
          this.entities_total = response.data.result[0];
        }) //axios.then
        .catch(e => {
          console.error(e);
        }); //axios.catch

    }, //getotalevents
    onKey: function(e) {
      switch (true) {
        case e.keyCode == 18 && this.state == "empty":
          this.state = "filled";
          break;
        case e.keyCode == 18 && this.state !== "empty":
          this.state = "empty";
          break;
        default:
          this.state = this.state;
          break;
      }
    }, //onkey
    setPageTitle: function() {
      let sub = null;

      switch (true) {
        case typeof this.active.item == "undefined":
          sub = this.active.key;
          break;
        default:
          sub = this.active.item.content;
          break;
      }

      this.page.title = "Dalyverse Events Graph: " + sub;
    }, //setPageTitle
    nullItem: function() {
      console.info(
        process.env.VERBOSITY === "DEBUG" ? "returning null item..." : null
      );
      return {
_key:null,
_rev:null,
name:null,
has_murdered:null,
article:null
      };
    }, //nullItem
        nullGraph: function() {
      console.info(
        process.env.VERBOSITY === "DEBUG" ? "returning null graph..." : null
      );
      return {
        participants: null,
        locations: null
      };
    }, //nullGraph
    fetchEntities: function() {
      console.info(
        process.env.VERBOSITY === "DEBUG" ? "fetchEntities()..." : null
      );

      let q =
        'let entities = (\
        let evts = (for ev in events return {_id:ev._id,label:ev.name,article:ev.article})\
        let plcs = (for l in places return {_id:l._id,label:l.name,article:l.article})\
        let ppls = (for p in people return {_id:p._id,label:p.name,article:p.article})\
        let tngs = (for t in things return {_id:t._id,label:t.name,article:t.article}) RETURN flatten(append(append(ppls,plcs),append(tngs,evts))))\
        let edgees = (for ent in entities[0] FOR v, e, p IN 1..2 ANY ent edges RETURN {from:e._from,to:e._to,id:e._id})\
        return {entitiez:unique(entities),edgez:unique(edgees)}'

      axios
        .post("http://" + process.env.ARANGOIP + ":8529/_api/cursor", {
          query: q
        })
        .then(response => {
          console.info(
            process.env.VERBOSITY === "DEBUG"
              ? "setting entities w/ axios response..."
              : null
          );

          let deeznodes = this.$_.map(response.data.result[0].entitiez[0],(n)=>{return {id:n._id,label:n.label,article:n.article}})

          this.nodes = deeznodes
          this.edges = response.data.result[0].edgez
          
        }) //axios.then
        .catch(e => {
          console.error(e);
        }); //axios.catch
    }, //fetchEntities
    setGraph: function() {
      console.log(process.env.VERBOSITY == "DEBUG" ? "setGraph()..." : null);
      console.log(
        process.env.VERBOSITY == "DEBUG"
          ? "  -> active.key is " + this.active.key
          : null
      );
      // if we have an active.key
      if (this.active.key !== null) {
        axios
          .post("http://" + process.env.ARANGOIP + ":8529/_api/cursor", {
            query:
              'for p in people return p'
          })
          .then(response => {
            this.active.graph = response.data.result[0];
          }) //axios.then
          .catch(e => {
            console.error(e);
          }); //axios.catch
      } //if key
      else {
        // no key? null it out
        console.log(
          process.env.VERBOSITY == "DEBUG"
            ? "no active.key, nulling graph..."
            : null
        );
        this.active.graph = this.nullGraph();
      }
    }, //setgraph
    setRoute: function() {
      console.info(process.env.VERBOSITY === "DEBUG" ? "setRoute()..." : null);

      this.$router.push({
        params: {
          activeid: this.active.key
        }
      }); //rejplace
    } //setRoute
  }, //methods
  computed: {}, //computed
  watch: {
    nodes: {
      handler: function(vnew, vold) {
        console.info(
          process.env.VERBOSITY === "DEBUG"
            ? "WATCH:nodes:old/new:" + vold.length + "/" + vnew.length
            : null
        );
        // this.setNetwork();
      }
    } //nodes
  } //watch
}; //export.timeline

</script>