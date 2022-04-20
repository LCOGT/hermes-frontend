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
    path: "/report-events",
    name: "report-events",
    component: SubmitCandidates},
  {
    path: "/report-candidates",
    name: "report-candidates",
    component: SubmitCandidates},
  {
    path: "/report-non-detections",
    name: "report-non-detections",
    component: SubmitCandidates},
  {
    path: "/report-search",
    name: "report-search",
    component: SubmitCandidates},
  {
    path: "/report-photometry",
    name: "report-photometry",
    component: SubmitPhotometry},
  {
    path: "/report-spectroscopy",
    name: "report-spectroscopy",
    component: SubmitPhotometry},
  {
    path: "/report-availability",
    name: "report-availability",
    component: SubmitPhotometry},

]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router;
