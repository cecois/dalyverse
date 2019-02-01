<template>
<div>
default
<code>{{console.msg}}</code>
</div>
</template>
<script>
export default {
  name: 'Default',
  data () {
    return {
      console: {msg: '', throb: false
      },
      computed: {},
      watch: {},
      methods: {},
      created () {},
      mounted () { this.console.msg = 'loaded' }
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
