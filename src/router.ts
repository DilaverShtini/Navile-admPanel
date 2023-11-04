import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { createApp } from 'vue';
import { MainMenu, Floor, Space, NotFoundComponent } from './utils/index'; 
import { AddSpace, DeleteSpace, ModifieSpace, ModifieBuilding } from './utils/index';

const routes: RouteRecordRaw[] = [
  { path: '/main-menu', component: MainMenu },
  { path: '/floor-menu', component: Floor },
  { path: '/space-menu', component: Space },
  { path: '/query-operation/add-space', component: AddSpace },
  { path: '/query-operation/delete-space', component: DeleteSpace },
  { path: '/query-operation/modifie-space', component: ModifieSpace },
  { path: '/query-operation/modifie-building', component: ModifieBuilding },
  { path: '/error', component: NotFoundComponent },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.onError((error) => {
  console.error('Router Error:', error);
});

const app = createApp({})
app.use(router)

app.mount('#app')

export default router;
