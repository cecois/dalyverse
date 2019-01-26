<template>
<div>
  <h1 class="is-size-1">timeline</h1>
<p>console.msg:<code>{{console.msg}}</code></p>
<p>console.throb:<code>{{console.throb}}</code></p>
<p>filter:<code>{{filter}}</code></p>
<p>windows.time.begin:<code>{{windows.time.begin}}</code></p>
<p>windows.time.end:<code>{{windows.time.end}}</code></p>
<p>windows.space:<code>{{windows.space.bbox}}</code></p>
</div>
</template>

<script>
export default {
name:'Timeline',
data() {
return {
  filter:null,
  windows:{
    time:{begin:null,end:null}
    ,space:{bbox:null}
  },
console:{msg:null,throb:false}
}//return
},//data
computed:{},//computed
watch:{},//watch
methods:{},//methods
created() {
  
  this.windows.time.begin=(typeof this.$route.params.tstart !== 'undefined')?this.$route.params.tstart:null;
  this.windows.time.end=(typeof this.$route.params.tend !== 'undefined')?this.$route.params.tend:null;
  this.filter=(typeof this.$route.params.filter !== 'undefined')?this.$route.params.filter:null;

  return null;
  },//created
  mounted: function () {}//mounted




}//export.timeline
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>