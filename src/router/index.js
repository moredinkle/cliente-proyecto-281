import Vue from 'vue'
import VueRouter from 'vue-router'
import Principal from '../views/Principal.vue'
import Categorias from '../views/Categorias.vue'
import Opciones from '../views/Opciones.vue'
import Proyectos from '../views/Proyectos.vue'
import Login from '../views/Login.vue'
import RecuperarPassword from '../views/RecuperarPassword.vue'
import CrearProyecto from '../views/CrearProyecto.vue'
import EditarProyecto from '../views/EditarProyecto.vue'
import VerProyecto from '../views/VerProyecto.vue'
import Observaciones from '../views/Observaciones.vue'




Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Principal',
    component: Principal
  },
  {
    path: '/categorias',
    name: 'Categorias',
    component: Categorias
  },
  {
    path: '/opciones',
    name: 'Opciones',
    component: Opciones
  },
  {
    path: '/mis-proyectos',
    name: 'misProyectos',
    component: Proyectos
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/recuperar-password',
    name: 'RecuperarPassword',
    component: RecuperarPassword
  },
  {
    path: '/crear-proyecto',
    name: 'CrearProyecto',
    component: CrearProyecto
  },
  {
    path: '/editar-proyecto/:id_proyecto',
    name: 'EditarProyecto',
    component: EditarProyecto
  },
  {
    path: '/ver-proyecto/:id_proyecto',
    name: 'VerProyecto',
    component: VerProyecto
  },
  {
    path: '/observaciones',
    name: 'Observaciones',
    component: Observaciones
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
