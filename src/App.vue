<script setup>
import { onMounted } from 'vue';
import NavHeader from '@/components/NavHeader.vue'
import { useStateStore } from '@/stores/state'

const stateStore = useStateStore()

onMounted(() => {
  stateStore.hermesUrl = import.meta.env.VITE_APP_HERMES_BACKEND_ROOT_URL
})
</script>

<template>
  <v-app>
    <nav-header />
    <v-main style="--v-layout-top: 36px;">
      <router-view />
    </v-main>
    <v-footer class="acknowledgements">This project is supported by National Science Foundation grants <a href="https://www.nsf.gov/awardsearch/showAward?AWD_ID=1934752">OAC-1934752</a> and <a href="https://www.nsf.gov/awardsearch/showAward?AWD_ID=2311355&amp;HistoricalAwards=false">OAC-2311355</a></v-footer>
  </v-app>
</template>

<style scoped>
.acknowledgements {
  max-height: 40px;
  background-color: rgb(24, 24, 24);
}
</style>
