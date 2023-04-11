import Vue from 'vue'
import VueRouter from 'vue-router'
import SubmitMessage from "@/views/SubmitMessage.vue"
import QueryMessages from "@/views/QueryMessages.vue"
import ViewMessage from "@/views/ViewMessage.vue"
import ViewNonlocalizedevent from "@/views/ViewNonlocalizedevent.vue"
import AboutHermes from "@/views/AboutHermes.vue"
import ProfileView from "@/views/Profile.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "home",
    component: QueryMessages
  },
  {
    path: "/message/:id",
    name: "message",
    component: ViewMessage,
    meta: {
      title: 'Message Detail'
    }
  },
  {
    path: "/nonlocalizedevent/:id",
    name: "nonlocalizedevent",
    component: ViewNonlocalizedevent,
    meta: {
      title: 'Nonlocalizedevent Detail'
    }
  },
  {
    path: "/submit-message",
    name: "submit-message",
    component: SubmitMessage
  },
  {
    path: "/profile",
    name: "profile",
    component: ProfileView
  },
  {
    path: "/about",
    name: "about",
    component: AboutHermes
  },
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  mode: 'history',
  routes
})

export default router;
