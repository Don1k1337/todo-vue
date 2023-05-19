import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import EditView from '@/views/EditView.vue';
import NotFoundView from "@/views/NotFoundView.vue";

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history', // Use history mode for clean URLs
    routes: [
        // Home page with list of tasks
        {
            path: '/',
            component: HomeView
        },
        // Edit view for a specific task
        {
            path: '/task/edit/:id',
            name: 'edit-task',
            component: EditView,
        },
        // Route to catch incorrect paths and display a "Not Found" view
        {
            path: '*',
            name: 'NotFound',
            component: NotFoundView,
        },
    ],
});

export default router;
