import Vue from 'vue'
import VueRouter from 'vue-router'
import SubmitCandidates from "@/views/SubmitCandidates.vue"
import SubmitPhotometry from "@/views/SubmitPhotometry.vue"
import ViewMessages from "@/views/ViewMessages.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "home",
    component: ViewMessages
  },
  {
    path: "/report-candidates",
    name: "report-candidates",
    component: SubmitCandidates},
  {
    path: "/report-photometry",
    name: "report-photometry",
    component: SubmitPhotometry},
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router;
