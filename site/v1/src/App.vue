<template>
  <div class="dv-app
">
    <nav id="dv-nav-main" class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div id="dv-nav-menu" class="navbar-menu">
        <div class="navbar-start">
          <a v-for="pane in panes" :href="pane.slug" class="navbar-item">
        {{pane.nom}}
      </a>
          <!-- <a href="#/" class="navbar-item">
        Home
      </a>
<a href="#/entities" class="navbar-item">
        Entities
      </a>
<a href="#/events" class="navbar-item">
        Events
      </a><a href="#/murderers" class="navbar-item">
        Murderers
      </a>
 -->
        </div>
        <div class="navbar-end">
          <div class="navbar-item">
          </div>
        </div>
      </div>
    </nav>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App",
  data () {
    return {
      panes: [{ nom: "Home", active: true, slug: "#/" }, { nom: "Entities", active: false, slug: "#/entities" }, { nom: "Events", active: false, slug: "#/events" }, { nom: "Murderers", active: false, slug: "#/murderers" }
      // , { nom: "Concordance", active: false, slug: "#/concordance" }
      , { nom: "Index", active: false, slug: "#/index" }
      , { nom: "Poems", active: false, slug: "#/poetry" }
      , { nom: "Observations", active: false, slug: "#/observations" }
      , { nom: "About", active: false, slug: "#/about" }
      ]
    }
  } //data
}
</script>

<style lang="scss">
// Import Bulma's core
@import "~bulma/sass/utilities/_all";
// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";
// Import custom shiz
@import "@/sass/style.scss";
</style>
