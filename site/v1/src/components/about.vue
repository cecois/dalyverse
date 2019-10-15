<template>
  <div id="vue-root" class="">
    <vue-headful :title="page.title" description="People, Places, Events & Things in the Andy Dalyverse" />
    <div class="columns">
      <div class="column">
        
<div class="tile is-ancestor">
  <div class="tile is-vertical is-8">
    <div class="tile">
      <div class="tile is-parent is-vertical">
        <article class="tile is-child ">
          <p class="title">Am I a What?</p>
          <div class="content"><p class="">What we've done, here, is log thousands of data points from 60-some Andy Daly appearances; mapped and graphed them; and visualized them here from various angles. Primarily as a tribute to Daly's unparalleled ability to build out his own wild – but meticulous – canon.</p></div>
        </article>
        <!-- <article class="tile is-child ">
          <p class="title">adfadsf</p>
          <p class="subtitle"></p>
        </article> -->
      </div>
      <div class="tile is-parent">
        <article class="tile is-child ">
          <p class="title">Sources</p>
          <div class="content"><p class="">There are plenty of Daly appearances that are not represented here - <em>Conan</em> and <em>Hollywood Handbook</em> and <em>Nine Sweaters</em> and so on. But because his fullest (and arguably tightest) universe is the one spanning <em>Comedy Bang! Bang!</em> and the <em>Andy Daly Podcast Pilot Project</em> this resource focuses primarily on those characters and events. With a few <em>Super Ego</em> in there as well.</p></div>
        </article>
      </div>
    </div>
    <!-- <div class="tile is-parent">
      <article class="tile is-child notification is-danger">
        <p class="title">Wide tile</p>
        <p class="subtitle">Aligned with the right tile</p>
        <div class="content">
        </div>
      </article>
    </div> -->
  </div>
  <div class="tile is-parent">
    <article class="tile is-child">
        <p class="title">Data &amp; Specs</p>
      <div class="content">
        <p class="">Similar to the <a href="http://cbb.milleria.org">Comedy Bang! Bang! Bit Tracker project</a>, the data behind this are manually logged, simply by listening to audio of Daly and structuring the crazy shit he improvs about this or that character (or into which he's pimped). Dissimilar to that project, however, this Dalyverse is a <em>graph</em> - the people, places, and things are nodes and the edges are the relationships therebetween: <em>hasParticipant, occurredAt, worksAt, hasFriend</em>, and so on.</p>
        <p>Those objects are stored in a NoSQL db specifically designed for scalable graphed relationships, <a href="https://www.arangodb.com
">ArangoDB</a>. Stricly-speaking, anybody is welcome to build something off of this dataset. It's not well-documented like published research data should be, but if you're fan enough to even get to this paragraph you're fan enough to almost intuit what's available. Lotsa Don DiMello stuff, Cactus Tony stuff, less Neptuna stuff.</p>
      </div>
    </article>
  </div>
</div>

      </div note="/.column">
    </div>
  </div>
  <!-- ./#vue-root -->
</template>

<script>
import * as d3 from 'd3';
// import Graph from "./graph.vue";

export default {
  name: "About",
  // components:{Graph},
  data () {
    return {
      page: {
        title: "Andy Dalyverse - About"
      }
    }
  }
  ,methods: {

  }, //methods
  computed: {}, //computed

  watch: {} //watch
}; //export.timeline
</script>

<style scoped=true>
/* ---------------------------------- BULMA -- */
.tile{
  padding:1em;
}
.hero.is-medium > .hero-body {
  padding: 0px;
}
</style>
