<template>
  <v-app-bar class="">
    <v-container class="align-items-baseline pl-0 text-uppercase">
      <router-link to="/">
        <span class="text-lowercase" style="font-size: 1.5em"> DV </span>
      </router-link>

      <router-link
        :class="[_path == '/entities' ? 'text-disabled' : '', 'ml-6']"
        to="/entities"
        >Entities</router-link
      >
      <router-link
        :class="[_path == '/events' ? 'text-disabled' : '', 'ml-6']"
        to="/events"
        >Events</router-link
      >
      <router-link
        :class="[_path == '/murderers' ? 'text-disabled' : '', 'ml-6']"
        to="/murderers"
        >Murderers</router-link
      >
      <router-link
        :class="[_path == '/index' ? 'text-disabled' : '', 'ml-6']"
        to="/index"
        >Index</router-link
      >
      <router-link
        :class="[_path == '/poems' ? 'text-disabled' : '', 'ml-6']"
        to="/poems"
        >Poems</router-link
      >
      <router-link
        :class="[_path == '/observations' ? 'text-disabled' : '', 'ml-6']"
        to="/observations"
        >Observations</router-link
      >
      <router-link
        :class="[_path == '/about' ? 'text-disabled' : '', 'ml-6']"
        to="/about"
        >About</router-link
      >
    </v-container>
  </v-app-bar>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed, onMounted } from "vue";
const route = useRoute();
const _path = computed(() => route.path);
const _props = defineProps({ userQuery: String });
onMounted(() => {});
</script>
