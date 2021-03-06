import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../components/Login.vue'
// import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'
const Login = () => import(/* webpackChunkName: 'login_home_welcome'*/ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: 'login_home_welcome'*/ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: 'login_home_welcome'*/ '../components/Welcome.vue')

const Users = () => import(/* webpackChunkName: 'users'*/ '../components/user/Users.vue')
// import Users from '../components/user/Users.vue'

const Rights = () => import(/* webpackChunkName: 'rights_roles'*/ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: 'rights_roles'*/ '../components/power/Roles.vue')
// import Rights from '../components/power/Rights.vue'
// import Roles from '../components/power/Roles.vue'

const Params = () => import(/* webpackChunkName: 'params_cate_list_add'*/ '../components/goods/Params.vue')
const Cate = () => import(/* webpackChunkName: 'params_cate_list_add'*/ '../components/goods/Cate.vue')
const List = () => import(/* webpackChunkName: 'params_cate_list_add'*/ '../components/goods/List.vue')
const Add = () => import(/* webpackChunkName: 'params_cate_list_add'*/ '../components/goods/Add.vue')
// import Params from '../components/goods/Params.vue'
// import Cate from '../components/goods/Cate.vue'
// import List from '../components/goods/List.vue'
// import Add from '../components/goods/Add.vue'

const Orders = () => import(/* webpackChunkName: 'order_reports'*/ '../components/orders/orders.vue')
const Reports = () => import(/* webpackChunkName: 'order_reports'*/ '../components/reports/Reports.vue')
// import Orders from '../components/orders/orders.vue'
// import Reports from '../components/reports/Reports.vue'


Vue.use(VueRouter)

const routes = [

]

const router = new VueRouter({
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [{
        path: '/welcome',
        component: Welcome
      }, {
        path: '/users',
        component: Users
      }, {
        path: '/rights',
        component: Rights
      }, {
        path: '/roles',
        component: Roles
      }, {
        path: '/categories',
        component: Cate
      }, {
        path: '/params',
        component: Params
      }, {
        path: '/goods',
        component: List
      },{
        path: '/goods/add',
        component: Add
      },{
        path: '/orders',
        component: Orders
      },{
        path: '/reports',
        component: Reports
      }]
    },
  ]
})

// ????????????????????????
router.beforeEach((to, from, next) => {
  // to???????????????????????????
  // from?????????????????????????????????
  // next??????????????????????????????
  // next()??????   next('/login')???????????????????????????'/login'??????
  if (to.path == '/login') return next()
  // ?????????????????????????????????????????????????????????????????????????????????????????????token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
