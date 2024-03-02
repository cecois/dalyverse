import { createRouter, createWebHashHistory } from "vue-router";

import CONFIG from "./config.json";

const routes = [
  {
    path: "/",
    name: "Default",
    component: () => import("@/views/Default.vue"),
    props: { _config: CONFIG },
  },

  {
    path: "/entities",
    name: "Entities",
    component: () => import("@/views/Entities.vue"),
    props: { _config: CONFIG },
  },
  {
    path: "/events",
    name: "Events",
    component: () => import("@/views/Events.vue"),
    props: { _config: CONFIG },
  },
  {
    path: "/murderers",
    name: "Murderers",
    component: () => import("@/views/Murderers.vue"),
    props: { _config: CONFIG },
  },
  {
    path: "/index",
    name: "Index",
    component: () => import("@/views/Index.vue"),
    props: { _config: CONFIG },
  },
  {
    path: "/poems",
    name: "Poems",
    component: () => import("@/views/Poems.vue"),
    props: { _config: CONFIG },
  },
  {
    path: "/observations",
    name: "Observations",
    component: () => import("@/views/Observations.vue"),
    props: { _config: CONFIG },
  },
  {
    path: "/about",
    name: "About",
    component: () => import("@/views/About.vue"),
    props: { _config: CONFIG },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});

export default router;
