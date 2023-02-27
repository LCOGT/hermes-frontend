import Vue from 'vue'
import VueRouter from 'vue-router'
import SubmitDiscoveries from "@/views/SubmitDiscoveries.vue"
import SubmitNonDetections from "@/views/SubmitNonDetection.vue"
import SubmitSearchPointings from "@/views/SubmitSearchPointing.vue"
import SubmitPhotometry from "@/views/SubmitPhotometry.vue"
import SubmitSpectroscopy from "@/views/SubmitSpectroscopy.vue"
import SubmitTelescopeEvents from "@/views/SubmitTelescopeEvents.vue"
import ViewMessages from "@/views/ViewMessages.vue"
import SubmitNonLocalizedEvent from "@/views/SubmitNonLocalizedEvent.vue"
import AboutHermes from "@/views/AboutHermes.vue"

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
    component: SubmitNonLocalizedEvent},
  {
    path: "/report-discoveries",
    name: "report-discoveries",
    component: SubmitDiscoveries},
  {
    path: "/report-non-detections",
    name: "report-non-detections",
    component: SubmitNonDetections},
  {
    path: "/report-search",
    name: "report-search",
    component: SubmitSearchPointings},
  {
    path: "/report-photometry",
    name: "report-photometry",
    component: SubmitPhotometry},
  {
    path: "/report-spectroscopy",
    name: "report-spectroscopy",
    component: SubmitSpectroscopy},
  {
    path: "/report-availability",
    name: "report-availability",
    component: SubmitTelescopeEvents},
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
