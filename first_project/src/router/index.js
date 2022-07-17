import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from "../components/Welcome"
import User from "../components/User"

Vue.use(VueRouter)

const routes = [
    {
        path: '',
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
        children: [
            {
                path: '/welcome',
                component: Welcome
            },
            {
                path: '/users',
                component: User
            }
        ]
    }
]

const router = new VueRouter({
    routes,
    mode: 'history'
})
router.beforeEach((to, from, next) => {
    //进入路由界面
    if (to.path === '/login') {
        next()
    }
    const token = window.sessionStorage.getItem("token")
    console.log("token" + token)
    //没有登录，强制进入
    if (!token) {
        next('/login')
    }
    next()
})

export default router
