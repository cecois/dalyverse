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
                {{ universe.minYear }} —> {{ universe.maxYear }}
                <br />
                <span v-if="universe.minYear"
                  >{{ parseInt(universe.minYear.split("-")[0]) }} ::::
                  {{ parseInt(universe.maxYear.split("-")[0]) }}</span
                >
                <br />
                {{ D.userQuery.temporal.beg }} to
                {{ D.userQuery.temporal.end }} —>
                {{ events.payload.length }}
              </div>
              <br />
              <div>
                <v-range-slider
                  v-if="universe.minYear"
                  elevation="24"
                  :min="13920101"
                  :max="20241231"
                  :v-model="[
                    D.userQuery.temporal.beg,
                    D.userQuery.temporal.end,
                  ]"
                  step="1"
                  thumb-label="true"
                  strict
                ></v-range-slider>
              </div>
            </v-col>
            <v-col class="v-col-auto"></v-col>
          </v-row>

          <v-row>
            <v-timeline align="start" side="end">
              <v-timeline-item
                v-for="ev in sortedEvents"
                dot-color="teal-lighten-3"
                size="12"
              >
                <div class="mt-n1 d-flex">
                  <div class="me-4 text-body-2">
                    {{ DateTime.fromISO(ev.start).toFormat("yyyy.LLL.dd") }}
                  </div>
                  <div>
                    <div class="mt-n1">
                      {{ ev.content }}
                    </div>
                    <div class="text-caption mb-2">{{ ev.article[0] }}</div>
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
import { DateTime } from "luxon";

import { useHead } from "@unhead/vue"; //head+meta manager
useHead({
  title: `DalyVerse.v2 (The Andy Daly Canon) - Events`,
});

const ROUTER = useRouter();
const _props = defineProps({
  userQuery: Object,
  oid: String,
  _config: Object,
});

const universe = reactive({
  minYear: null,
  maxYear: null,
});

/*

      */
const D = reactive({
  userQuery: {
    string: null,
    temporal: {
      beg: null,
      end: null,
    },
  },
  oid: null,
  _config: null,
});

// const times = reactive({
//   beg: "1981-11-23",
//   end: "2002-11-23",
// });

const events = reactive({
  payload: [],
});

const eventAscend = ref(true);

const sortedEvents = computed(() => {
  return events.payload.sort((e1, e2) =>
    eventAscend.value
      ? Math.floor(new Date(e1.start) / 1000) >
        Math.floor(new Date(e2.start) / 1000)
      : Math.floor(new Date(e1.start) / 1000) <
        Math.floor(new Date(e2.start) / 1000),
  );
});

const $universe = async () => {
  const q =
    "FOR e IN events COLLECT AGGREGATE min = MIN(e.timestamp.start),max = MAX(e.timestamp.end) RETURN {min,max}";
  const universeCall = await AXIOS.post(
    _props._config.graph.endpoint,
    {
      query: q,
    },
    {
      auth: {
        username: "root",
        password: "JEAlHs20oUvk23RF",
      },
    }, //options
  ); //axios.post

  let rgx = new RegExp(/-+/gm);
  universe.minYear = universeCall.data.result[0].min.replace(rgx, "");
  universe.maxYear = universeCall.data.result[0].max.replace(rgx, "");
}; //universe
const $events = async () => {
  const q = `for e in edges filter e.type=="hasParticipant" OR e.type=="occurredAt" for ev in events filter e._from==ev._id AND e.type=="hasParticipant" LET tstart = HAS(ev.timestamp, "start")==true ? DATE_FORMAT(ev.timestamp.start, "%yyyy-%mm-%dd") : DATE_FORMAT(ev.timestamp, "%yyyy-%mm-%dd") LET tend = HAS(ev.timestamp, "end")==true ? DATE_FORMAT(ev.timestamp.end, "%yyyy-%mm-%dd") : null LET geo=( for g in edges filter g._from==ev._id AND g.type=="occurredAt" for pl in places filter g._to==pl._id return distinct pl ) filter (DATE_TIMESTAMP(tstart)>=DATE_TIMESTAMP('${D.userQuery.temporal.beg}') && DATE_TIMESTAMP(tstart)<=DATE_TIMESTAMP('${D.userQuery.temporal.end}')) return distinct { id:ev._key, content:ev.name, article:ev.article, start:tstart, end:tend,geo:geo}`;

  const eventsCall = await AXIOS.post(
    _props._config.graph.endpoint,
    {
      query: q,
    },
    {
      auth: {
        username: "root",
        password: "JEAlHs20oUvk23RF",
      },
    }, //options
  ); //axios.post

  events.payload = eventsCall.data.result;
}; //events

watch(
  () => [D.userQuery],
  (newp, oldp) => {
    const path = `/events/${D.userQuery.string}/${D.oid}/${D.userQuery.temporal.beg}/${D.userQuery.temporal.end}`;
    ROUTER.push({ path: path });
  },
);

onMounted(() => {
  D.userQuery = _props.userQuery; //copy so we can fuk widdit
  $events();
  $universe();
});
</script>
