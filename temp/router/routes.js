import Documents from '../pages/Documents.vue'
import Home from '../pages/Home.vue'
import Case from '../pages/Case.vue'
import Login from '../pages/Login.vue'

const routes = [
    {
        path:'/home',
        component: Home,
        name: 'Home'
    },
    {
        path:'/case/:id',
        props: true,
        name: 'View Case',
        component: Case
    },
    {
        path:'/login',
        component: Login,
        name: 'Login'
    },
]

export default routes;