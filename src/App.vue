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

<style lang="scss">
@import "assets/_custom.scss";
@import "~bootstrap/scss/bootstrap.scss";
@import '~bootstrap-vue/dist/bootstrap-vue.css';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-left: 10px;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
#nav {
  padding: 30px;
  padding-top: 10px;
  width: 100%;

}

</style>
