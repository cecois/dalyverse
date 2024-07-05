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
                entities:
                <span v-if="M.waiting">
                  <v-progress-circular model-value="20"></v-progress-circular>
                </span>
                <span v-else>{{ entities.payload.length }}</span>
              </div>
              <v-divider></v-divider>
              <div class="text-center app-hero-hero">
                _props.userQuery: {{ _props.userQuery }}
              </div>
              <v-divider></v-divider>
              <div class="text-center app-hero-hero">
                M.userQuery: {{ M.userQuery }}
              </div>
              <div class="text-center app-hero-hero">{{ _props.oid }}</div>
            </v-col>
            <v-col class="v-col-auto"></v-col>
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
import { DateTime } from "luxon";
import Nav from "@/components/Nav.vue";
import Footer from "@/components/Footer.vue";
import { useHead } from "@unhead/vue"; //head+meta manager

/*
 _____   ______  ____    ______   __    ____  __    _ ______  ______
|     | |   ___||    \  |   ___|_|  |_ |    |\  \  //|   ___||   ___|
|     \ |   ___||     \ |   |__|_    _||    | \  \// |   ___| `-.`-.
|__|\__\|______||__|\__\|______| |__|  |____|  \__/  |______||______|
*/

const M = reactive({
  userQuery: null,
  oid: null,
  config: null,
  waiting: false,
});

useHead({
  title: `DalyVerse.v2 (The Andy Daly Canon) - Entity Graph`,
});

const ROUTER = useRouter();
const _props = defineProps({
  userQuery: Object,
  oid: String,
  _config: Object,
});

const entities = reactive({ payload: [] });

const $entities = async () => {
  M.waiting = true;

  // works but w/ no event copy filter (only temporal range):
  // const q = `for e in edges filter e.type=="hasParticipant" OR e.type=="occurredAt" for ev in events filter e._from==ev._id AND e.type=="hasParticipant" LET tstart = HAS(ev.timestamp, "start")==true ? DATE_FORMAT(ev.timestamp.start, "%yyyy-%mm-%dd") : DATE_FORMAT(ev.timestamp, "%yyyy-%mm-%dd") LET tend = HAS(ev.timestamp, "end")==true ? DATE_FORMAT(ev.timestamp.endz, "%yyyy-%mm-%dd") : null LET geo=( for g in edges filter g._from==ev._id AND g.type=="occurredAt" for pl in places filter g._to==pl._id return distinct pl ) filter (DATE_TIMESTAMP(tstart)>=DATE_TIMESTAMP('${
  //   M.userQuery.temporal.beg ? M.userQuery.temporal.beg : "1000-01-01"
  // }') && DATE_TIMESTAMP(tstart)<=DATE_TIMESTAMP('${
  //   M.userQuery.temporal.end
  //     ? M.userQuery.temporal.end
  //     : DateTime.now().toISODate()
  // }')) return distinct { id:ev._key, content:ev.name, article:ev.article, start:tstart, end:tend,geo:geo}`;

  // works
  const q = `for e in edges filter e.type=="hasParticipant" OR e.type=="occurredAt" for ev in events filter e._from==ev._id AND e.type=="hasParticipant" AND LOWER(ev.name) LIKE '%${
    M.userQuery.string == "*:*" ? "" : M.userQuery.string
  }%' LET tstart = HAS(ev.timestamp, "start")==true ? DATE_FORMAT(ev.timestamp.start, "%yyyy-%mm-%dd") : DATE_FORMAT(ev.timestamp, "%yyyy-%mm-%dd") LET tend = HAS(ev.timestamp, "end")==true ? DATE_FORMAT(ev.timestamp.endz, "%yyyy-%mm-%dd") : null LET geo=( for g in edges filter g._from==ev._id AND g.type=="occurredAt" for pl in places filter g._to==pl._id return distinct pl ) filter (DATE_TIMESTAMP(tstart)>=DATE_TIMESTAMP('${
    M.userQuery.temporal.beg ? M.userQuery.temporal.beg : "1000-01-01"
  }') && DATE_TIMESTAMP(tstart)<=DATE_TIMESTAMP('${
    M.userQuery.temporal.end
      ? M.userQuery.temporal.end
      : DateTime.now().toISODate()
  }')) return distinct { id:ev._key, content:ev.name, article:ev.article, start:tstart, end:tend,geo:geo}`;

  const entitiesCall = await AXIOS.post(
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

  M.waiting = false;
  entities.payload = entitiesCall.data.result;
}; //events

onMounted(() => {
  //copy so we can edit here
  M.userQuery = _props.userQuery;
  M.oid = _props.oid;
  M.config = _props._config;

  // M.userQuery.temporal.beg = "2020-01-01";
  // M.userQuery.temporal.end = "2024-01-01";
  $entities();
});

// watch(
//   () => [M.userQuery],
//   (newValue, oldValue) => {
//     // ROUTER.push({ path: _QU.value });
//     $entities();
//   },
//   { deep: true },
// );
</script>
