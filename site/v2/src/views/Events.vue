<template>
  <v-app>
    <v-main>
      <v-container>
        <Nav />
        <v-container fluid>
          <v-row dense>
            <v-col class="v-col-3"></v-col>
            <v-col class="v-col-6 pt-12 mt-12">
              <div class="text-center app-hero-hero">
                {{ times.beg }} to {{ times.end }} —>
                {{ events.payload.length }}
              </div>
            </v-col>
            <v-col class="v-col-auto"></v-col>
          </v-row>

          <v-row>
            <v-timeline align="start" side="end">
              <v-timeline-item dot-color="pink" size="small">
                <div class="d-flex">
                  <strong class="me-4">5pm</strong>
                  <div>
                    <strong>New Icon</strong>
                    <div class="text-caption">Mobile App</div>
                  </div>
                </div>
              </v-timeline-item>

              <v-timeline-item dot-color="teal-lighten-3" size="small">
                <div class="d-flex">
                  <strong class="me-4">3-4pm</strong>
                  <div>
                    <strong>Design Stand Up</strong>
                    <div class="text-caption mb-2">Hangouts</div>
                  </div>
                </div>
              </v-timeline-item>

              <v-timeline-item dot-color="pink" size="small">
                <div class="d-flex">
                  <strong class="me-4">12pm</strong>
                  <div>
                    <strong>Lunch break</strong>
                  </div>
                </div>
              </v-timeline-item>

              <v-timeline-item dot-color="teal-lighten-3" size="small">
                <div class="d-flex">
                  <strong class="me-4">9-11am</strong>
                  <div>
                    <strong>Finish Home Screen</strong>
                    <div class="text-caption">Web App</div>
                  </div>
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-row>
        </v-container>
      </v-container>
    </v-main>
    <Footer />
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
import Footer from "@/components/Footer.vue";

import { useHead } from "@unhead/vue"; //head+meta manager
useHead({
  title: `DalyVerse.v2 (The Andy Daly Canon) - Events`,
});

const ROUTER = useRouter();
const _props = defineProps({
  heroid: String,
  _config: Object,
});

const times = reactive({
  beg: "1981-11-23",
  end: "2002-11-23",
});

const events = reactive({
  payload: [],
});

const $events = async () => {
  // const timeBeg = "1981-11-23";
  // const timeEnd = "1999-11-23";

  const q = `for e in edges filter e.type=="hasParticipant" OR e.type=="occurredAt" for ev in events filter e._from==ev._id AND e.type=="hasParticipant" LET tstart = HAS(ev.timestamp, "start")==true ? DATE_FORMAT(ev.timestamp.start, "%yyyy-%mm-%dd") : DATE_FORMAT(ev.timestamp, "%yyyy-%mm-%dd") LET tend = HAS(ev.timestamp, "end")==true ? DATE_FORMAT(ev.timestamp.endz, "%yyyy-%mm-%dd") : null LET geo=( for g in edges filter g._from==ev._id AND g.type=="occurredAt" for pl in places filter g._to==pl._id return distinct pl ) filter (DATE_TIMESTAMP(tstart)>=DATE_TIMESTAMP('${times.beg}') && DATE_TIMESTAMP(tstart)<=DATE_TIMESTAMP('${times.end}')) return distinct { id:ev._key, content:ev.name, article:ev.article, start:tstart, end:tend,geo:geo}`;

  const eventsCall = await AXIOS.post(
    _props._config.graph.endpoint,
    {
      query: q,
    },
    {
      // auth: {
      //   username: process.env.ARANGOUSER,
      //   password: process.env.ARANGOPSSW,
      // },
      auth: {
        username: "root",
        password: "JEAlHs20oUvk23RF",
      },
    }, //options
  ); //axios.post

  // console.log("eventsCall", eventsCall);
  events.payload = eventsCall.data.result;
}; //events

onMounted(() => {
  $events();
});
</script>
