import Vue from 'vue'
import VueRouter from 'vue-router'
import SubmitMessage from "@/views/SubmitMessage.vue"
import ViewMessages from "@/views/ViewMessages.vue"
import AboutHermes from "@/views/AboutHermes.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "home",
    component: ViewMessages
  },
  {
    path: "/submit-message",
    name: "submit-message",
    component: SubmitMessage},
  {
    path: "/about",
    name: "about",
    component: AboutHermes},
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  mode: 'history',
  routes
})

export default router;
