<template>
<div>
  <h5>timeline</h5>
<p><code>{{console.msg}}</code></p>
<p><code>{{windows.time.begin}}</code></p>
<p><code>{{windows.time.end}}</code></p>
</div>
</template>

<script>
export default {
name:'Timeline',
data() {
return {
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
  console.log(this.$route.params.tstart);
  return null;
  },//created
  mounted: function () {}//mounted




}//export.timeline
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>