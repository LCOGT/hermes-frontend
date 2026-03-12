import { createRouter, createWebHistory } from 'vue-router'
import AboutHermes from '@/views/AboutHermes.vue'
import Profile from '@/views/Profile.vue'
import MessageDetail from '@/views/MessageDetail.vue'
import QueryMessages from '@/views/QueryMessages.vue'
import ViewNonlocalizedevent from '@/views/ViewNonlocalizedevent.vue'
import SubmitMessage from '@/views/SubmitMessage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: QueryMessages
    },
    {
      path: '/about',
      name: 'about',
      component: AboutHermes,
    },
    {
      path: "/profile",
      name: "profile",
      component: Profile
    },
    {
      path: "/submit-message",
      name: "submit-message",
      component: SubmitMessage
    },
    {
      path: "/message/:uuid",
      name: "message",
      component: MessageDetail,
      meta: {
        title: 'Message Detail'
      },
      props: true
    },
    {
      path: "/nonlocalizedevent/:id",
      name: "nonlocalizedevent",
      component: ViewNonlocalizedevent,
      meta: {
        title: 'Nonlocalizedevent Detail'
      }
    },
  ],
});

export default router;
