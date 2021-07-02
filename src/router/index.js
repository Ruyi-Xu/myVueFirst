import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'


Vue.use(VueRouter)

const routes = [

]

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home
    },
  ]
})

// 挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  // to代表将要访问的路径
  // from代表从哪个路径跳转而来
  // next是一个函数，表示放行
  // next()放行   next('/login')表示强制跳转至目标'/login'路径
  if(to.path == '/login') return next()
  // 先看路径，如果路径是登录页面，那直接放行，如果不是，那就先获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})

export default router
