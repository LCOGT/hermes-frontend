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
  </v-app>
</template>

<style scoped>
</style>
