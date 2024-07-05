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
    path: "/entities/:userQuery?/:oid?/:temporalBeg?/:temporalEnd?",
    name: "Entities",
    component: () => import("@/views/Entities.vue"),
    props: (route) => {
      return {
        userQuery: {
          string: route.params.userQuery ? route.params.userQuery : "*:*",
          temporal: {
            beg: route.params.temporalBeg,
            end: route.params.temporalEnd,
          },
        },
        oid: route.params.oid,
        _config: CONFIG,
      };
    },
  },
  {
    path: "/events/:userQuery?/:oid?/:temporalBeg?/:temporalEnd?",
    name: "Events",
    component: () => import("@/views/Events.vue"),
    props: (route) => {
      return {
        userQuery: {
          string: route.params.userQuery ? route.params.userQuery : "*:*",
          temporal: {
            beg: route.params.temporalBeg
              ? route.params.temporalBeg
              : "1922-01-01",
            end: route.params.temporalEnd
              ? route.params.temporalEnd
              : "1922-12-31",
          },
        },
        oid: route.params.oid,
        _config: CONFIG,
      };
    },
  },
  // {
  //   path: "/events",
  //   name: "Events",
  //   component: () => import("@/views/Events.vue"),
  //   props: { _config: CONFIG },
  // },
  {
    path: "/murderers/:userQuery?/:mid?",
    name: "Murderers",
    component: () => import("@/views/Murderers.vue"),
    props: { _config: CONFIG },
  },
  {
    path: "/index/:userQuery?",
    name: "Index",
    component: () => import("@/views/Index.vue"),
    props: { _config: CONFIG },
  },
  {
    path: "/poems/:userQuery?",
    name: "Poems",
    component: () => import("@/views/Poems.vue"),
    props: { _config: CONFIG },
  },
  {
    path: "/observations/:userQuery?",
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
