import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import EditView from '@/views/EditView.vue'

Vue.use(VueRouter)

const routes = [
    {path: '/', component: HomeView},
    {path: '/edit/:id', component: EditView}
];

const router = new VueRouter({
    mode: 'history',
    routes
});

export default router
