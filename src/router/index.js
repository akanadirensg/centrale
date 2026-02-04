import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../views/AppLayout.vue'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import Carte from '../views/Carte.vue'
import Historique from '../views/Historique.vue'

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: 'carte',
        name: 'Carte',
        component: Carte
      },
      {
        path: 'historique',
        name: 'Historique',
        component: Historique
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router