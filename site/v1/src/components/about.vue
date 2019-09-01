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
          <p class="title">Am I the What?</p>
          <p class="">What we've done, here, is log thousands of data points from 60-some Andy Daly appearances; mapped and graphed them; and visualized them here. Primarily as a tribute to Daly's unparalleled ability to build out his own wild – but meticulous – canon.</p>
        </article>
        <article class="tile is-child ">
          <p class="title">adfadsf</p>
          <p class="subtitle"></p>
        </article>
      </div>
      <div class="tile is-parent">
        <article class="tile is-child ">
          <p class="title">Sources</p>
          <p class="">There are plenty of Daly appearances that are not represented here - <em>Conan</em> and <em>Hollywood Handbook</em> and <em>Nine Sweaters</em> and so on. But because his fullest (and arguably tightest) universe is the one spanning <em>Comedy Bang! Bang!</em> and the <em>Andy Daly Podcast Pilot Project</em> this resource focuses primarily on those characters and events. With a few <em>Super Ego</em> in there as well.</p>
          <figure class="image is-4by3">
            <img src="https://bulma.io/images/placeholders/640x480.png">
          </figure>
        </article>
      </div>
    </div>
    <div class="tile is-parent">
      <article class="tile is-child notification is-danger">
        <p class="title">Wide tile</p>
        <p class="subtitle">Aligned with the right tile</p>
        <div class="content">
          <!-- Content -->
        </div>
      </article>
    </div>
  </div>
  <div class="tile is-parent">
    <article class="tile is-child notification is-success">
      <div class="content">
        <p class="title">Tall tile</p>
        <p class="subtitle">With even more content</p>
        <div class="content">
          <!-- Content -->
        </div>
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
