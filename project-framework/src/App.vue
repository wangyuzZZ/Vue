<template>
  <div id="app">
    <Header></Header>
    <router-view/>
  </div>
</template>

<script>
import Header from '../src/components/header'
export default {
  name: 'App',
  components:{
    Header
  }
}
</script>

<style>
</style>
