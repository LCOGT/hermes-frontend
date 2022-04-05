<template>
  <div id="app">
    <div id="nav"> <nav-header></nav-header></div>
    <router-view />
  </div>
</template>

<script lang="ts">
import NavHeader from "@/components/NavHeader.vue"

export default {
  components: {
    "nav-header": NavHeader
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  margin-left: 10px;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
#nav {
  padding: 30px;
  width: 100%;
  a {
    font-weight: bold;
    color: #2c3e50;
  }
}

</style>
