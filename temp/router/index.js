import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

// const routes = [
//   {
//       path:'/',
//       component: Home,
//       name: 'Home'
//   },
//   {
//       path:'/case/:id',
//       props: true,
//       name: 'View Case',
//       component: Case
//   },
//   {
//       path:'/documents',
//       component: Documents,
//       name: 'Documents'
//   },
// ]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
