import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import bookList from "../components/bookList";
import bookDetail from "../components/bookDetail";
import Cart from '../components/cart';
import Profile from '../components/profile';
import Order from '../components/order';
import Panel from '../components/panel';
import Login from '../components/login';
import Register from '../components/register';
import axios from "axios";
import AdminUserPanel from "@/components/adminUserPanel";
import AdminStockPanel from '@/components/adminStockPanel';
import AdminOrderPanel from '@/components/adminOrderPanel';

Vue.use(VueRouter);

const routes = [
    {
        path: '/home',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '',
                component: bookList
            },
            {
                path: 'bookList',
                component: bookList,
                props: "passInput"
            },
            {
                path: 'bookDetail/:bookId',
                component: bookDetail
            },
            {
                path: 'cart',
                meta: {
                    requireAuth: true
                },
                component: Cart,
            },
            {
                path: 'profile',
                meta: {
                    requireAuth: true
                },
                component: Profile
            },
            {
                path: 'order',
                meta: {
                    requireAuth: true
                },
                component: Order,
                props: "passInput"

            },
            {
                path: 'admin/manageUser',
                meta: {
                    requireAuth: true,
                    requireAdmin: true
                },
                component: AdminUserPanel
            },
            {
                path: 'admin/manageStock',
                meta: {
                    requireAuth: true,
                    requireAdmin: true
                },
                component: AdminStockPanel
            },
            {
                path: 'admin/manageOrder',
                meta: {
                    requireAuth: true,
                    requireAdmin: true
                },
                component: AdminOrderPanel
            }
        ]
    },
    {
        path: '/',
        name: 'Panel',
        component: Panel,
        children: [
            {
                path: '',
                component: Login
            },
            {
                path: 'login',
                component: Login
            },
            {
                path: 'register',
                component: Register
            }
        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

router.beforeEach((to, from, next) => {
    let loginStat = localStorage.getItem('Login');

        if (to.matched.some(function (item) {
            return item.meta.requireAuth;
        })) {
            if (loginStat !== 'True') {
                next('/login')
            }
            else
            {

                if(to.matched.some(function (item){
                    return item.meta.requireAdmin;
                })) {
                    axios.get("http://localhost:8080/user/getUser", {
                        params: {
                            userId: localStorage.getItem('UserId')
                        }
                    })
                        .then(response => {
                            let fetchUser = JSON.stringify(response.data);
                            let fetchType = response.data.userType;
                            if(fetchType === 2) {
                                localStorage.removeItem('User');
                                localStorage.setItem('User', fetchUser);
                                next();
                            }
                        });
                }else{
                    axios.get("http://localhost:8080/user/getUser", {
                        params: {
                            userId: localStorage.getItem('UserId')
                        }
                    })
                        .then(response => {
                            let fetchUser = JSON.stringify(response.data);
                            localStorage.removeItem('User');
                            localStorage.setItem('User', fetchUser);
                            next();
                        });
                }
            }
        }
    else
        next();
    }
);

export default router
