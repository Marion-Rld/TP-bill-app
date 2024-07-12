import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/bills',
      name: 'bills',
      props: true,
      component: () => import('../views/BillsView.vue')
    },
    {
      path: '/clients',
      name: 'clients',
      props: true,
      component: () => import('../views/ClientsView.vue')
    },
    {
      path: '/client/add',
      name: 'addClient',
      component: () => import('../views/AddOrEditClientView.vue')
    },
    {
      path: '/client/edit/:id',
      name: 'editClient',
      component: () => import('../views/AddOrEditClientView.vue'),
      props: true
    },
    {
      path: '/add',
      name: 'addBill',
      component: () => import('../views/AddBillView.vue')
    },
    {
      path: '/bills/:id/edit',
      name: 'editBill',
      props: true,
      component: () => import('../views/EditBillView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
