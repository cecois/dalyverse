<template>
  <div id="app">
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
          <a href="#/" class="navbar-item">
        Home
      </a>
          <a href="#/entities" class="navbar-item">
        Entities
      </a>
          <a href="#/events" class="navbar-item">
        Events
      </a>
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
  name: 'App'
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
