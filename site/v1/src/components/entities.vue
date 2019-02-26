<template>
<div id="vue-root" class="container is-fixed-top">
  <vue-headful :title="page.title" description="People of the Andy Dalyverse" />
<!-- ************************************************************************************ #CONSOLE -->
<div v-if="state === 'filled'" id="console" class="has-text-weight-bold">

<div class="tile is-ancestor">
  <div class="tile is-4 is-vertical is-parent">
    <div class="tile is-child box">
      <div class="columns">
        <div class="column">
        </div>
        <div class="column">
    </div>
      </div><!-- /.columns -->
    </div><!-- /.tile -->

  </div>
  <div class="tile is-parent">
    <div class="tile is-child box">
      <p class="title is-size-7" v-if="active.key">ACTIVE</p>

    </div>
  </div>
</div>

</div><!-- ************************************************************************************ /#CONSOLE -->
<!-- #.navbar </nav> -->

<div class="" id="container-main">
  <!-- -------------------------------------------------------------- SLIDER -->
<div id="network">
  <svg></svg>
</div>
</div><!-- ************************************************************************************ /#CONTAINER-MAIN -->

</div><!-- ./#vue-root -->
</template>

<script>
  import * as d3 from 'd3';

export default {
  name: "Entities",
  data() {
    return {
      chartvalues:[99, 71, 78, 25, 36, 92],
      page: {
        title: "Andy Dalyverse Entities Graph"
      },
      state: "filled",
      fittable: true,
      nodes: new vis.DataSet([
        {id: 1, label: 'N1'},
        {id: 2, label: 'N2'},
        {id: 3, label: 'N3'},
        {id: 4, label: 'N4'},
        {id: 5, label: 'N5'}
    ]),
      edges: new vis.DataSet([
        {from: 1, to: 3},
        {from: 1, to: 2},
        {from: 2, to: 4},
        {from: 2, to: 5}
    ]),
      seens: [],
      styles: {
        previous: null,
        default: {
          radius: 6,
          fillColor: "#df04a3",
          color: "#fc00b5",
          weight: 1,
          opacity: 0.8,
          fillOpacity: 0.8
        },
        active: {
          radius: 12,
          fillColor: "#e3e10b",
          color: "#c9c70a",
          weight: 1,
          opacity: 0.8,
          fillOpacity: 0.6
        },
        clicked: {
          radius: 12,
          fillColor: "#e3e10b",
          color: "white",
          weight: 5,
          opacity: 1,
          fillOpacity: 0.9
        },
        seen: {
          radius: 6,
          fillColor: "white",
          color: "aqua",
          weight: 1,
          opacity: 0.8,
          fillOpacity: 0.8
        }
      },
      active: {
        key: null,
        item: null,
        graph: null
      },
      entities_total: 0,
      console: {
        msg: "",
        clazz: null,
        throb: false
      },
      miserables: {
  "nodes": [
    {"id": "Myriel", "group": 1},
    {"id": "Napoleon", "group": 1},
    {"id": "Mlle.Baptistine", "group": 1},
    {"id": "Mme.Magloire", "group": 1},
    {"id": "CountessdeLo", "group": 1},
    {"id": "Geborand", "group": 1},
    {"id": "Champtercier", "group": 1},
    {"id": "Cravatte", "group": 1},
    {"id": "Count", "group": 1},
    {"id": "OldMan", "group": 1},
    {"id": "Labarre", "group": 2},
    {"id": "Valjean", "group": 2},
    {"id": "Marguerite", "group": 3},
    {"id": "Mme.deR", "group": 2},
    {"id": "Isabeau", "group": 2},
    {"id": "Gervais", "group": 2},
    {"id": "Tholomyes", "group": 3},
    {"id": "Listolier", "group": 3},
    {"id": "Fameuil", "group": 3},
    {"id": "Blacheville", "group": 3},
    {"id": "Favourite", "group": 3},
    {"id": "Dahlia", "group": 3},
    {"id": "Zephine", "group": 3},
    {"id": "Fantine", "group": 3},
    {"id": "Mme.Thenardier", "group": 4},
    {"id": "Thenardier", "group": 4},
    {"id": "Cosette", "group": 5},
    {"id": "Javert", "group": 4},
    {"id": "Fauchelevent", "group": 0},
    {"id": "Bamatabois", "group": 2},
    {"id": "Perpetue", "group": 3},
    {"id": "Simplice", "group": 2},
    {"id": "Scaufflaire", "group": 2},
    {"id": "Woman1", "group": 2},
    {"id": "Judge", "group": 2},
    {"id": "Champmathieu", "group": 2},
    {"id": "Brevet", "group": 2},
    {"id": "Chenildieu", "group": 2},
    {"id": "Cochepaille", "group": 2},
    {"id": "Pontmercy", "group": 4},
    {"id": "Boulatruelle", "group": 6},
    {"id": "Eponine", "group": 4},
    {"id": "Anzelma", "group": 4},
    {"id": "Woman2", "group": 5},
    {"id": "MotherInnocent", "group": 0},
    {"id": "Gribier", "group": 0},
    {"id": "Jondrette", "group": 7},
    {"id": "Mme.Burgon", "group": 7},
    {"id": "Gavroche", "group": 8},
    {"id": "Gillenormand", "group": 5},
    {"id": "Magnon", "group": 5},
    {"id": "Mlle.Gillenormand", "group": 5},
    {"id": "Mme.Pontmercy", "group": 5},
    {"id": "Mlle.Vaubois", "group": 5},
    {"id": "Lt.Gillenormand", "group": 5},
    {"id": "Marius", "group": 8},
    {"id": "BaronessT", "group": 5},
    {"id": "Mabeuf", "group": 8},
    {"id": "Enjolras", "group": 8},
    {"id": "Combeferre", "group": 8},
    {"id": "Prouvaire", "group": 8},
    {"id": "Feuilly", "group": 8},
    {"id": "Courfeyrac", "group": 8},
    {"id": "Bahorel", "group": 8},
    {"id": "Bossuet", "group": 8},
    {"id": "Joly", "group": 8},
    {"id": "Grantaire", "group": 8},
    {"id": "MotherPlutarch", "group": 9},
    {"id": "Gueulemer", "group": 4},
    {"id": "Babet", "group": 4},
    {"id": "Claquesous", "group": 4},
    {"id": "Montparnasse", "group": 4},
    {"id": "Toussaint", "group": 5},
    {"id": "Child1", "group": 10},
    {"id": "Child2", "group": 10},
    {"id": "Brujon", "group": 4},
    {"id": "Mme.Hucheloup", "group": 8}
  ],
  "links": [
    {"source": "Napoleon", "target": "Myriel", "value": 1},
    {"source": "Mlle.Baptistine", "target": "Myriel", "value": 8},
    {"source": "Mme.Magloire", "target": "Myriel", "value": 10},
    {"source": "Mme.Magloire", "target": "Mlle.Baptistine", "value": 6},
    {"source": "CountessdeLo", "target": "Myriel", "value": 1},
    {"source": "Geborand", "target": "Myriel", "value": 1},
    {"source": "Champtercier", "target": "Myriel", "value": 1},
    {"source": "Cravatte", "target": "Myriel", "value": 1},
    {"source": "Count", "target": "Myriel", "value": 2},
    {"source": "OldMan", "target": "Myriel", "value": 1},
    {"source": "Valjean", "target": "Labarre", "value": 1},
    {"source": "Valjean", "target": "Mme.Magloire", "value": 3},
    {"source": "Valjean", "target": "Mlle.Baptistine", "value": 3},
    {"source": "Valjean", "target": "Myriel", "value": 5},
    {"source": "Marguerite", "target": "Valjean", "value": 1},
    {"source": "Mme.deR", "target": "Valjean", "value": 1},
    {"source": "Isabeau", "target": "Valjean", "value": 1},
    {"source": "Gervais", "target": "Valjean", "value": 1},
    {"source": "Listolier", "target": "Tholomyes", "value": 4},
    {"source": "Fameuil", "target": "Tholomyes", "value": 4},
    {"source": "Fameuil", "target": "Listolier", "value": 4},
    {"source": "Blacheville", "target": "Tholomyes", "value": 4},
    {"source": "Blacheville", "target": "Listolier", "value": 4},
    {"source": "Blacheville", "target": "Fameuil", "value": 4},
    {"source": "Favourite", "target": "Tholomyes", "value": 3},
    {"source": "Favourite", "target": "Listolier", "value": 3},
    {"source": "Favourite", "target": "Fameuil", "value": 3},
    {"source": "Favourite", "target": "Blacheville", "value": 4},
    {"source": "Dahlia", "target": "Tholomyes", "value": 3},
    {"source": "Dahlia", "target": "Listolier", "value": 3},
    {"source": "Dahlia", "target": "Fameuil", "value": 3},
    {"source": "Dahlia", "target": "Blacheville", "value": 3},
    {"source": "Dahlia", "target": "Favourite", "value": 5},
    {"source": "Zephine", "target": "Tholomyes", "value": 3},
    {"source": "Zephine", "target": "Listolier", "value": 3},
    {"source": "Zephine", "target": "Fameuil", "value": 3},
    {"source": "Zephine", "target": "Blacheville", "value": 3},
    {"source": "Zephine", "target": "Favourite", "value": 4},
    {"source": "Zephine", "target": "Dahlia", "value": 4},
    {"source": "Fantine", "target": "Tholomyes", "value": 3},
    {"source": "Fantine", "target": "Listolier", "value": 3},
    {"source": "Fantine", "target": "Fameuil", "value": 3},
    {"source": "Fantine", "target": "Blacheville", "value": 3},
    {"source": "Fantine", "target": "Favourite", "value": 4},
    {"source": "Fantine", "target": "Dahlia", "value": 4},
    {"source": "Fantine", "target": "Zephine", "value": 4},
    {"source": "Fantine", "target": "Marguerite", "value": 2},
    {"source": "Fantine", "target": "Valjean", "value": 9},
    {"source": "Mme.Thenardier", "target": "Fantine", "value": 2},
    {"source": "Mme.Thenardier", "target": "Valjean", "value": 7},
    {"source": "Thenardier", "target": "Mme.Thenardier", "value": 13},
    {"source": "Thenardier", "target": "Fantine", "value": 1},
    {"source": "Thenardier", "target": "Valjean", "value": 12},
    {"source": "Cosette", "target": "Mme.Thenardier", "value": 4},
    {"source": "Cosette", "target": "Valjean", "value": 31},
    {"source": "Cosette", "target": "Tholomyes", "value": 1},
    {"source": "Cosette", "target": "Thenardier", "value": 1},
    {"source": "Javert", "target": "Valjean", "value": 17},
    {"source": "Javert", "target": "Fantine", "value": 5},
    {"source": "Javert", "target": "Thenardier", "value": 5},
    {"source": "Javert", "target": "Mme.Thenardier", "value": 1},
    {"source": "Javert", "target": "Cosette", "value": 1},
    {"source": "Fauchelevent", "target": "Valjean", "value": 8},
    {"source": "Fauchelevent", "target": "Javert", "value": 1},
    {"source": "Bamatabois", "target": "Fantine", "value": 1},
    {"source": "Bamatabois", "target": "Javert", "value": 1},
    {"source": "Bamatabois", "target": "Valjean", "value": 2},
    {"source": "Perpetue", "target": "Fantine", "value": 1},
    {"source": "Simplice", "target": "Perpetue", "value": 2},
    {"source": "Simplice", "target": "Valjean", "value": 3},
    {"source": "Simplice", "target": "Fantine", "value": 2},
    {"source": "Simplice", "target": "Javert", "value": 1},
    {"source": "Scaufflaire", "target": "Valjean", "value": 1},
    {"source": "Woman1", "target": "Valjean", "value": 2},
    {"source": "Woman1", "target": "Javert", "value": 1},
    {"source": "Judge", "target": "Valjean", "value": 3},
    {"source": "Judge", "target": "Bamatabois", "value": 2},
    {"source": "Champmathieu", "target": "Valjean", "value": 3},
    {"source": "Champmathieu", "target": "Judge", "value": 3},
    {"source": "Champmathieu", "target": "Bamatabois", "value": 2},
    {"source": "Brevet", "target": "Judge", "value": 2},
    {"source": "Brevet", "target": "Champmathieu", "value": 2},
    {"source": "Brevet", "target": "Valjean", "value": 2},
    {"source": "Brevet", "target": "Bamatabois", "value": 1},
    {"source": "Chenildieu", "target": "Judge", "value": 2},
    {"source": "Chenildieu", "target": "Champmathieu", "value": 2},
    {"source": "Chenildieu", "target": "Brevet", "value": 2},
    {"source": "Chenildieu", "target": "Valjean", "value": 2},
    {"source": "Chenildieu", "target": "Bamatabois", "value": 1},
    {"source": "Cochepaille", "target": "Judge", "value": 2},
    {"source": "Cochepaille", "target": "Champmathieu", "value": 2},
    {"source": "Cochepaille", "target": "Brevet", "value": 2},
    {"source": "Cochepaille", "target": "Chenildieu", "value": 2},
    {"source": "Cochepaille", "target": "Valjean", "value": 2},
    {"source": "Cochepaille", "target": "Bamatabois", "value": 1},
    {"source": "Pontmercy", "target": "Thenardier", "value": 1},
    {"source": "Boulatruelle", "target": "Thenardier", "value": 1},
    {"source": "Eponine", "target": "Mme.Thenardier", "value": 2},
    {"source": "Eponine", "target": "Thenardier", "value": 3},
    {"source": "Anzelma", "target": "Eponine", "value": 2},
    {"source": "Anzelma", "target": "Thenardier", "value": 2},
    {"source": "Anzelma", "target": "Mme.Thenardier", "value": 1},
    {"source": "Woman2", "target": "Valjean", "value": 3},
    {"source": "Woman2", "target": "Cosette", "value": 1},
    {"source": "Woman2", "target": "Javert", "value": 1},
    {"source": "MotherInnocent", "target": "Fauchelevent", "value": 3},
    {"source": "MotherInnocent", "target": "Valjean", "value": 1},
    {"source": "Gribier", "target": "Fauchelevent", "value": 2},
    {"source": "Mme.Burgon", "target": "Jondrette", "value": 1},
    {"source": "Gavroche", "target": "Mme.Burgon", "value": 2},
    {"source": "Gavroche", "target": "Thenardier", "value": 1},
    {"source": "Gavroche", "target": "Javert", "value": 1},
    {"source": "Gavroche", "target": "Valjean", "value": 1},
    {"source": "Gillenormand", "target": "Cosette", "value": 3},
    {"source": "Gillenormand", "target": "Valjean", "value": 2},
    {"source": "Magnon", "target": "Gillenormand", "value": 1},
    {"source": "Magnon", "target": "Mme.Thenardier", "value": 1},
    {"source": "Mlle.Gillenormand", "target": "Gillenormand", "value": 9},
    {"source": "Mlle.Gillenormand", "target": "Cosette", "value": 2},
    {"source": "Mlle.Gillenormand", "target": "Valjean", "value": 2},
    {"source": "Mme.Pontmercy", "target": "Mlle.Gillenormand", "value": 1},
    {"source": "Mme.Pontmercy", "target": "Pontmercy", "value": 1},
    {"source": "Mlle.Vaubois", "target": "Mlle.Gillenormand", "value": 1},
    {"source": "Lt.Gillenormand", "target": "Mlle.Gillenormand", "value": 2},
    {"source": "Lt.Gillenormand", "target": "Gillenormand", "value": 1},
    {"source": "Lt.Gillenormand", "target": "Cosette", "value": 1},
    {"source": "Marius", "target": "Mlle.Gillenormand", "value": 6},
    {"source": "Marius", "target": "Gillenormand", "value": 12},
    {"source": "Marius", "target": "Pontmercy", "value": 1},
    {"source": "Marius", "target": "Lt.Gillenormand", "value": 1},
    {"source": "Marius", "target": "Cosette", "value": 21},
    {"source": "Marius", "target": "Valjean", "value": 19},
    {"source": "Marius", "target": "Tholomyes", "value": 1},
    {"source": "Marius", "target": "Thenardier", "value": 2},
    {"source": "Marius", "target": "Eponine", "value": 5},
    {"source": "Marius", "target": "Gavroche", "value": 4},
    {"source": "BaronessT", "target": "Gillenormand", "value": 1},
    {"source": "BaronessT", "target": "Marius", "value": 1},
    {"source": "Mabeuf", "target": "Marius", "value": 1},
    {"source": "Mabeuf", "target": "Eponine", "value": 1},
    {"source": "Mabeuf", "target": "Gavroche", "value": 1},
    {"source": "Enjolras", "target": "Marius", "value": 7},
    {"source": "Enjolras", "target": "Gavroche", "value": 7},
    {"source": "Enjolras", "target": "Javert", "value": 6},
    {"source": "Enjolras", "target": "Mabeuf", "value": 1},
    {"source": "Enjolras", "target": "Valjean", "value": 4},
    {"source": "Combeferre", "target": "Enjolras", "value": 15},
    {"source": "Combeferre", "target": "Marius", "value": 5},
    {"source": "Combeferre", "target": "Gavroche", "value": 6},
    {"source": "Combeferre", "target": "Mabeuf", "value": 2},
    {"source": "Prouvaire", "target": "Gavroche", "value": 1},
    {"source": "Prouvaire", "target": "Enjolras", "value": 4},
    {"source": "Prouvaire", "target": "Combeferre", "value": 2},
    {"source": "Feuilly", "target": "Gavroche", "value": 2},
    {"source": "Feuilly", "target": "Enjolras", "value": 6},
    {"source": "Feuilly", "target": "Prouvaire", "value": 2},
    {"source": "Feuilly", "target": "Combeferre", "value": 5},
    {"source": "Feuilly", "target": "Mabeuf", "value": 1},
    {"source": "Feuilly", "target": "Marius", "value": 1},
    {"source": "Courfeyrac", "target": "Marius", "value": 9},
    {"source": "Courfeyrac", "target": "Enjolras", "value": 17},
    {"source": "Courfeyrac", "target": "Combeferre", "value": 13},
    {"source": "Courfeyrac", "target": "Gavroche", "value": 7},
    {"source": "Courfeyrac", "target": "Mabeuf", "value": 2},
    {"source": "Courfeyrac", "target": "Eponine", "value": 1},
    {"source": "Courfeyrac", "target": "Feuilly", "value": 6},
    {"source": "Courfeyrac", "target": "Prouvaire", "value": 3},
    {"source": "Bahorel", "target": "Combeferre", "value": 5},
    {"source": "Bahorel", "target": "Gavroche", "value": 5},
    {"source": "Bahorel", "target": "Courfeyrac", "value": 6},
    {"source": "Bahorel", "target": "Mabeuf", "value": 2},
    {"source": "Bahorel", "target": "Enjolras", "value": 4},
    {"source": "Bahorel", "target": "Feuilly", "value": 3},
    {"source": "Bahorel", "target": "Prouvaire", "value": 2},
    {"source": "Bahorel", "target": "Marius", "value": 1},
    {"source": "Bossuet", "target": "Marius", "value": 5},
    {"source": "Bossuet", "target": "Courfeyrac", "value": 12},
    {"source": "Bossuet", "target": "Gavroche", "value": 5},
    {"source": "Bossuet", "target": "Bahorel", "value": 4},
    {"source": "Bossuet", "target": "Enjolras", "value": 10},
    {"source": "Bossuet", "target": "Feuilly", "value": 6},
    {"source": "Bossuet", "target": "Prouvaire", "value": 2},
    {"source": "Bossuet", "target": "Combeferre", "value": 9},
    {"source": "Bossuet", "target": "Mabeuf", "value": 1},
    {"source": "Bossuet", "target": "Valjean", "value": 1},
    {"source": "Joly", "target": "Bahorel", "value": 5},
    {"source": "Joly", "target": "Bossuet", "value": 7},
    {"source": "Joly", "target": "Gavroche", "value": 3},
    {"source": "Joly", "target": "Courfeyrac", "value": 5},
    {"source": "Joly", "target": "Enjolras", "value": 5},
    {"source": "Joly", "target": "Feuilly", "value": 5},
    {"source": "Joly", "target": "Prouvaire", "value": 2},
    {"source": "Joly", "target": "Combeferre", "value": 5},
    {"source": "Joly", "target": "Mabeuf", "value": 1},
    {"source": "Joly", "target": "Marius", "value": 2},
    {"source": "Grantaire", "target": "Bossuet", "value": 3},
    {"source": "Grantaire", "target": "Enjolras", "value": 3},
    {"source": "Grantaire", "target": "Combeferre", "value": 1},
    {"source": "Grantaire", "target": "Courfeyrac", "value": 2},
    {"source": "Grantaire", "target": "Joly", "value": 2},
    {"source": "Grantaire", "target": "Gavroche", "value": 1},
    {"source": "Grantaire", "target": "Bahorel", "value": 1},
    {"source": "Grantaire", "target": "Feuilly", "value": 1},
    {"source": "Grantaire", "target": "Prouvaire", "value": 1},
    {"source": "MotherPlutarch", "target": "Mabeuf", "value": 3},
    {"source": "Gueulemer", "target": "Thenardier", "value": 5},
    {"source": "Gueulemer", "target": "Valjean", "value": 1},
    {"source": "Gueulemer", "target": "Mme.Thenardier", "value": 1},
    {"source": "Gueulemer", "target": "Javert", "value": 1},
    {"source": "Gueulemer", "target": "Gavroche", "value": 1},
    {"source": "Gueulemer", "target": "Eponine", "value": 1},
    {"source": "Babet", "target": "Thenardier", "value": 6},
    {"source": "Babet", "target": "Gueulemer", "value": 6},
    {"source": "Babet", "target": "Valjean", "value": 1},
    {"source": "Babet", "target": "Mme.Thenardier", "value": 1},
    {"source": "Babet", "target": "Javert", "value": 2},
    {"source": "Babet", "target": "Gavroche", "value": 1},
    {"source": "Babet", "target": "Eponine", "value": 1},
    {"source": "Claquesous", "target": "Thenardier", "value": 4},
    {"source": "Claquesous", "target": "Babet", "value": 4},
    {"source": "Claquesous", "target": "Gueulemer", "value": 4},
    {"source": "Claquesous", "target": "Valjean", "value": 1},
    {"source": "Claquesous", "target": "Mme.Thenardier", "value": 1},
    {"source": "Claquesous", "target": "Javert", "value": 1},
    {"source": "Claquesous", "target": "Eponine", "value": 1},
    {"source": "Claquesous", "target": "Enjolras", "value": 1},
    {"source": "Montparnasse", "target": "Javert", "value": 1},
    {"source": "Montparnasse", "target": "Babet", "value": 2},
    {"source": "Montparnasse", "target": "Gueulemer", "value": 2},
    {"source": "Montparnasse", "target": "Claquesous", "value": 2},
    {"source": "Montparnasse", "target": "Valjean", "value": 1},
    {"source": "Montparnasse", "target": "Gavroche", "value": 1},
    {"source": "Montparnasse", "target": "Eponine", "value": 1},
    {"source": "Montparnasse", "target": "Thenardier", "value": 1},
    {"source": "Toussaint", "target": "Cosette", "value": 2},
    {"source": "Toussaint", "target": "Javert", "value": 1},
    {"source": "Toussaint", "target": "Valjean", "value": 1},
    {"source": "Child1", "target": "Gavroche", "value": 2},
    {"source": "Child2", "target": "Gavroche", "value": 2},
    {"source": "Child2", "target": "Child1", "value": 3},
    {"source": "Brujon", "target": "Babet", "value": 3},
    {"source": "Brujon", "target": "Gueulemer", "value": 3},
    {"source": "Brujon", "target": "Thenardier", "value": 3},
    {"source": "Brujon", "target": "Gavroche", "value": 1},
    {"source": "Brujon", "target": "Eponine", "value": 1},
    {"source": "Brujon", "target": "Claquesous", "value": 1},
    {"source": "Brujon", "target": "Montparnasse", "value": 1},
    {"source": "Mme.Hucheloup", "target": "Bossuet", "value": 1},
    {"source": "Mme.Hucheloup", "target": "Joly", "value": 1},
    {"source": "Mme.Hucheloup", "target": "Grantaire", "value": 1},
    {"source": "Mme.Hucheloup", "target": "Bahorel", "value": 1},
    {"source": "Mme.Hucheloup", "target": "Courfeyrac", "value": 1},
    {"source": "Mme.Hucheloup", "target": "Gavroche", "value": 1},
    {"source": "Mme.Hucheloup", "target": "Enjolras", "value": 1}
  ]
}
    }; // return
  }, // data
  beforeCreate() {}, // beforeCreate
  created() {
    console.info(
      process.env.VERBOSITY === "DEBUG"
        ? "begin CREATED, processing incoming vars"
        : null
    );

      this.$once('hook:once', function () {
    this.fittable = false;
    this.fetchTotalEntities();
  })

    this.console = {
      msg: "loading...",
      throb: true,
      clazz: "mdi-clock"
    };

    if (this.$route.params.activeid) {
      this.active.key = this.$route.params.activeid;
    }

    window.addEventListener("keydown", this.onKey);
    console.info(
      process.env.VERBOSITY === "DEBUG"
        ? "end CREATED, initial state set"
        : null
    );
  }, // created
  mounted: function() {
    console.info(
      process.env.VERBOSITY === "DEBUG"
        ? "MOUNTED! Bootstrapping events and initting vizes..."
        : null
    );
    // this.setSlider();
    this.fetchEntities();
    this.d3ForceDirect();
  }, //mounted
  methods: {
    getClass: function (which,one) {

//which == node|edge
//one == 'worksAt'|'hasFriend'|etc
let clas = null;

      switch (true) {
        case (one == 'daly'):
          clas = 'node node-pi'
          break;
        case (which == 'node' && one !== 'daly'):
          clas = 'node node-pu'
          break;
      case (which == 'edge' && one == 'worksAt'):
          clas = 'edge edge-wa'
          break;
        default:
          clas = 'node-edge-default'
          break;
      }

return clas

    }, // getclass
    d3ForceDirect: function () {

      console.log("setD3ForceDirect()...");
    
var parentDiv = document.getElementById("network");
// var svg = d3.select(parentDiv).append("svg"),
    // var svg = d3.select(parentDiv).append("svg"),
    var svg = d3.select("svg"),
    // svg.select("#network > svg"),
      // width = +svg.attr("width"),
      // height = +svg.attr("height"),
      width = parseInt(window.getComputedStyle(parentDiv).width.replace("px","")),
      height = parseInt(window.getComputedStyle(parentDiv).height.replace("px",""))

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().distance(10).strength(0.5))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

d3.json("http://localhost:8000/miserables.json", (error, graph)=>{
  if (error) throw error;

            var G = svg.append('g')
      ,transform = d3.zoomIdentity; //zoom

            G.call(d3.zoom()
              // .scaleExtent([1 / 2, 8])
              .scaleExtent([1 / 2, Infinity])
              // .scaleExtent([1, Infinity])
              // .on("zoom", function() {
              //   console.log("svg in zoom:",svg);
              //   G.attr("transform", d3.event.transform);})
              //   );
                .on("zoom",()=>{
                  G.attr("transform", d3.event.transform)
                })
                );

  // set nodes and links var from data
  var nodes = graph.nodes,
      nodeById = d3.map(nodes, function(d) { return d.id; }),
      links = graph.links,
      bilinks = [];

// loop through all edges from json
  links.forEach(function(link) {
    // get relationships represented by edge
    var s = link.source = nodeById.get(link.source),
        t = link.target = nodeById.get(link.target),
        i = {}; // intermediate node
    nodes.push(i);
    links.push({source: s, target: i}, {source: i, target: t});
    bilinks.push([s, i, t]);
  });

  var link = G.selectAll(".link")
    .data(bilinks)
    .enter().append("path")
      .attr("class", "link");
      // .attr("class",'edge')
      // .attr("class",this.getClass('edge','worksAt'))

var node = G.selectAll(".node")
            .data(nodes.filter(function(d) { return d.id; }))
            .enter()
            .append("circle")
            .append("text")
    .attr("dx", 6)
    .text(function(d) { return d.id; })
            // .append("g")
                        // .attr("class",(d)=>{
            //                   return this.getClass('node',(d.daly==true)?'daly':'person')
            //                 })
                        .attr("r", "5")
                        .attr("class", "node")

            .call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended)
            )
    
    // node.append("title")
    // .text(function(d){return '584';});
// node now a group, append a circle      
// node.append("circle")
//   .attr("r", 5)
  // .attr("data-target", function(d) { console.log("580d",d);return color(d.group); });

// node now a group, append a circle      
 // node.append("text")
 //    .attr("dx", 6)
 //    .text(function(d) { return d.id; });
  
  simulation
      .nodes(nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(links);

      function mouseover() {
        console.log(' mouseover()')
        d3.select(this).select("circle").transition()
      .duration(750)
      .attr("r", 16);
}

// function zoomed() {
//   console.log(' zoomed()');svg.attr("transform", d3.event.transform);
// }

// function zoomed() {
//   console.log('width:',);
//   console.log('height:',);
//     // svg.attr('transform', 'translate(' + (d3.event.translate[0] + width / 2) +
//     //     ',' + (d3.event.translate[1] + height / 2) + ') scale(' + d3.event.scale + ')');
//     svg.attr({viewBox: "" + (-width / 2) + " " + (-height / 2) + " " + width + " " + height})
// }

function mouseout() {
  console.log(' mouseout()')
  d3.select(this).select("circle").transition()
      .duration(750)
      .attr("r", 8);
}

  function ticked() {
    link.attr("d", positionLink);
    node.attr("transform", positionNode);
  }
});

function positionLink(d) {
  return "M" + d[0].x + "," + d[0].y
       + "S" + d[1].x + "," + d[1].y
       + " " + d[2].x + "," + d[2].y;
}

function positionNode(d) {
  return "translate(" + d.x + "," + d.y + ")";
}

function dragstarted(d) {
  console.log("dragsimulation",simulation);
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x, d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x, d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null, d.fy = null;
}
    }, // setd3force
    setD3HelloWorld: function () {

d3.select("#network").append("h1")
    .text("Hello, world!")
    .style("text-align", "center")
    .style("line-height", "320px")
    .style("font-size", "100px")
    .style("transform", "rotate(-180deg) scale(0.001, 0.001)")
  .transition()
    .duration(1500)
    .style("transform", null);

    }, // end of setD3HelloWorld()
    setChartLine: function () {

// make an svg canvas
const svg = d3.select('#network')
      .append('svg') // append an svg object to it
      .attr('width', 500)
      .attr('height', 270)
      .append('g') // append a g to that
      .attr('transform', 'translate(0, 10)');
    const x = d3.scaleLinear().range([0, 430]);
    const y = d3.scaleLinear().range([210, 0]);
    d3.axisLeft().scale(x);
    d3.axisTop().scale(y);
    x.domain(d3.extent(this.chartvalues, (d, i) => i));
    y.domain([0, d3.max(this.chartvalues, d => d)]);
    const createPath = d3.line()
      .x((d, i) => x(i))
      .y(d => y(d));
    svg.append('path').attr('d', createPath(this.chartvalues));

    }, //setchart
    setNetworkVisJS: function () {
console.info(
      process.env.VERBOSITY === "DEBUG"
        ? "setNetwork()..."
        : null
    );
if(!this.network){

  console.info(
    process.env.VERBOSITY === "DEBUG"
      ? "no network - you're the network..."
      : null
  );

var container = document.getElementById('network');
 // provide the data in the vis format
    var data = {nodes: this.nodes,edges: this.edges};

    var options = {
    layout:{improvedLayout: true},
    physics:{
    enabled: true,
    barnesHut: {
      gravitationalConstant: -2000,
      centralGravity: 0.3,
      springLength: 95,
      springConstant: 0.04,
      damping: 0.09,
      avoidOverlap: 0
    },
    forceAtlas2Based: {
      gravitationalConstant: -50,
      centralGravity: 0.01,
      springConstant: 0.08,
      springLength: 100,
      damping: 0.4,
      avoidOverlap: 0
    },
    repulsion: {
      centralGravity: 0.2,
      springLength: 200,
      springConstant: 0.05,
      nodeDistance: 100,
      damping: 0.09
    },
    hierarchicalRepulsion: {
      centralGravity: 0.0,
      springLength: 100,
      springConstant: 0.01,
      nodeDistance: 120,
      damping: 0.09
    },
    maxVelocity: 50,
    minVelocity: 0.1,
    solver: 'barnesHut',
    stabilization: {
      enabled: false,
      iterations: 1000,
      updateInterval: 100,
      onlyDynamicEdges: false,
      fit: false
    },
    timestep: 0.5,
    adaptiveTimestep: true
  },
      edges:{
    arrows: {
      to:     {enabled: true, scaleFactor:1, type:'arrow'},
      middle: {enabled: false, scaleFactor:1, type:'arrow'},
      from:   {enabled: false, scaleFactor:1, type:'arrow'}
    },

  }
    };

this.network = new vis.Network(container, data, options);

            this.network.on("stabilizationProgress", function(params) {
                console.log('stabilz:',params)
              });

} else {
  console.info(';;;;;;;;;;;;---:NETWORK ALREADY');
}

    }, //setNetwork
    fetchTotalEntities: function () {

          console.info(
      process.env.VERBOSITY === "DEBUG"
        ? "getTotalEntities()..."
        : null
    );

               let q = 'let entities = (let ppls = (for p in people return {_id:p._id,label:p.name,article:p.article})\
let tngs = (for t in things return {_id:t._id,label:t.name,article:t.article})\
let plcs = (for l in things return {_id:l._id,label:l.name,article:l.article})\
let evts = (for ev in events return {_id:ev._id,label:ev.name,article:ev.article})\
 RETURN flatten(append(append(ppls,tngs),append(plcs,evts))))\
return count(entities[0])'

      axios
        .post("http://" + process.env.ARANGOIP + ":8529/_api/cursor", {
          query: q
        })
        .then(response => {
          console.info(
            process.env.VERBOSITY === "DEBUG"
              ? "setting entities_total w/ axios response..."
              : null
          );
          this.entities_total = response.data.result[0];
        }) //axios.then
        .catch(e => {
          console.error(e);
        }); //axios.catch

    }, //getotalevents
    onKey: function(e) {
      switch (true) {
        case e.keyCode == 18 && this.state == "empty":
          this.state = "filled";
          break;
        case e.keyCode == 18 && this.state !== "empty":
          this.state = "empty";
          break;
        default:
          this.state = this.state;
          break;
      }
    }, //onkey
    setPageTitle: function() {
      let sub = null;

      switch (true) {
        case typeof this.active.item == "undefined":
          sub = this.active.key;
          break;
        default:
          sub = this.active.item.content;
          break;
      }

      this.page.title = "Dalyverse Events Graph: " + sub;
    }, //setPageTitle
    nullItem: function() {
      console.info(
        process.env.VERBOSITY === "DEBUG" ? "returning null item..." : null
      );
      return {
_key:null,
_rev:null,
name:null,
has_murdered:null,
article:null
      };
    }, //nullItem
        nullGraph: function() {
      console.info(
        process.env.VERBOSITY === "DEBUG" ? "returning null graph..." : null
      );
      return {
        participants: null,
        locations: null
      };
    }, //nullGraph
    DUMP: function (thing) {

console.info(
        (process.env.VERBOSITY === "DEBUG" && (thing)) ? thing : null
      );

if(process.env.VERBOSITY === 'DEBUG'){
      console.log("DUMP:thing",thing)}

    }, //dump
    fetchEntities: function() {
      console.info(
        process.env.VERBOSITY === "DEBUG" ? "fetchEntities()..." : null
      );

      let q =
        'let entities = (\
let plcs = (for l in places return {_id:l._id,label:l.name,article:l.article})\
let ppls = (for p in people return {_id:p._id,label:p.name,article:p.article})\
let tngs = (for t in things return {_id:t._id,label:t.name,article:t.article}) RETURN flatten(append(ppls,plcs,tngs)))\
let edgees = (\
for ent in entities[0] \
FOR v, e, p IN 1..2 ANY ent edges \
FILTER e.type!=\'hasParticipant\'\
RETURN {typ:e.type,from:e._from,to:e._to,id:e._id})\
return {entitiez:unique(entities),edgez:unique(edgees)}'

      axios
        .post("http://" + process.env.ARANGOIP + ":8529/_api/cursor", {
          query: q
        })
        .then(response => {
          console.info(
            process.env.VERBOSITY === "DEBUG"
              ? "setting entities w/ axios response..."
              : null
          );

          let deeznodes = this.$_.map(response.data.result[0].entitiez[0],(n)=>{return {id:n._id,label:n.label,article:n.article}})

          this.nodes = deeznodes
          this.edges = response.data.result[0].edgez

        }) //axios.then
        .catch(e => {
          console.error(e);
        }); //axios.catch
    }, //fetchEntities
    setGraph: function() {
      console.log(process.env.VERBOSITY == "DEBUG" ? "setGraph()..." : null);
      console.log(
        process.env.VERBOSITY == "DEBUG"
          ? "  -> active.key is " + this.active.key
          : null
      );
      // if we have an active.key
      if (this.active.key !== null) {
        axios
          .post("http://" + process.env.ARANGOIP + ":8529/_api/cursor", {
            query:
              'for p in people return p'
          })
          .then(response => {
            this.active.graph = response.data.result[0];
          }) //axios.then
          .catch(e => {
            console.error(e);
          }); //axios.catch
      } //if key
      else {
        // no key? null it out
        console.log(
          process.env.VERBOSITY == "DEBUG"
            ? "no active.key, nulling graph..."
            : null
        );
        this.active.graph = this.nullGraph();
      }
    }, //setgraph
    setRoute: function() {
      console.info(process.env.VERBOSITY === "DEBUG" ? "setRoute()..." : null);

      this.$router.push({
        params: {
          activeid: this.active.key
        }
      }); //rejplace
    } //setRoute
  }, //methods
  computed: {}, //computed
  watch: {
    nodes: {
      handler: function(vnew, vold) {
        console.info(
          process.env.VERBOSITY === "DEBUG"
            ? "WATCH:nodes:old/new:" + vold.length + "/" + vnew.length
            : null
        );
        // this.setNetwork();
        // this.setChart()
      }
    } //nodes
  } //watch
}; //export.timeline

</script>

<style>

#network {
  position:relative;
  height: 78vh; /** output container is small for display */ 
  width: 100vw;
  background-color:rgba(55,244,244,.5);
  display: block;
}

#network > svg {
height:100vh;
width:100vw;
}

.node {
  stroke: #fff;
  stroke-width: 1.5px;
}

.link {
  fill: none;
  stroke: #bbb;
}
/*
.node-edge-default{
  stroke: rgba(4,4,4,.4);
  fill:none;
  stroke-width: 2px;
}

.node-pu{
  stroke: #3f0081;
  stroke-width: 1.5px;
}

text{
    fill: #fff;
    stroke: #fff;
    font-size:.7em;
}

.node-pi{
  stroke: #e300db;
  stroke-width: 1.5px;
}

.edge-wa
  {
  fill: none;
  stroke: #bbb;
}

.edge-hf
  {
  fill: none;
  stroke: #aaa;
}
*/

</style>