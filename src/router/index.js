import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import EditView from '@/views/EditView.vue';

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: '/', component: HomeView},
        {
            path: '/edit/:id',
            name: 'edit-task',
            component: EditView,
        },
    ],
});

export default router;
