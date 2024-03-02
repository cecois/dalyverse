<template>
  <v-app>
    <v-main>
      <v-container>
        <Nav />
        <v-container fluid>
          <v-row dense>
            <v-col class="v-col-3"></v-col>
            <v-col class="v-col-6 pt-12 mt-12">
              <div class="text-center app-hero-hero">poems</div>
            </v-col>
            <v-col class="v-col-auto"></v-col>
          </v-row>
        </v-container>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
/*
                                                       /$$                                               /$$
                                                      |__/                                              | $$
                                                       /$$ /$$$$$$/$$$$   /$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$
                                                      | $$| $$_  $$_  $$ /$$__  $$ /$$__  $$ /$$__  $$|_  $$_/
                                                      | $$| $$ \ $$ \ $$| $$  \ $$| $$  \ $$| $$  \__/  | $$
                                                      | $$| $$ | $$ | $$| $$  | $$| $$  | $$| $$        | $$ /$$
                                                      | $$| $$ | $$ | $$| $$$$$$$/|  $$$$$$/| $$        |  $$$$/
                                                      |__/|__/ |__/ |__/| $$____/  \______/ |__/         \___/
                                                                        | $$
                                                                        | $$
                                                                        |__/
*/

import { ref, reactive, onMounted, computed, watch, provide, toRaw } from "vue";
import { useRoute, useRouter } from "vue-router";

import AXIOS from "axios";
import Nav from "@/components/Nav.vue";
// import Footer from "./Footer.vue";

import { useHead } from "@unhead/vue"; //head+meta manager
useHead({
  title: `DalyVerse.v2 (The Andy Daly Canon) - Poems`,
});

const ROUTER = useRouter();
const _props = defineProps({
  heroid: String,
  _config: Object,
});
</script>
