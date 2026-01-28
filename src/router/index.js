import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "@/views/Dashboard.vue";
import Carte from "@/views/Carte.vue";
import Historique from "@/views/Historique.vue";
import Home from "@/views/Home.vue";


const routes = [
    {
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/dashboard",
        name: "Dashboard",
        component: Dashboard
    },
    {
        path: "/historique",
        name: "historique",
        component: Historique
    },
    {
        path: "/carte",
        name: "carte",
        component: Carte
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
