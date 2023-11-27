import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { createApp } from 'vue';
import { MainMenu, FloorMenu, SpaceMenu, NotFoundComponent } from './utils/index'; 
import { AddSpace, DeleteSpace, ModifySpace, ModifyBuilding } from './utils/index';

const routes: RouteRecordRaw[] = [
  { path: '/main-menu', component: MainMenu },
  { path: '/floor-menu', component: FloorMenu },
  { path: '/space-menu', component: SpaceMenu },
  { path: '/query-operation/add-space', component: AddSpace },
  { path: '/query-operation/delete-space', component: DeleteSpace },
  { path: '/query-operation/modify-space', component: ModifySpace },
  { path: '/query-operation/modify-building', component: ModifyBuilding },
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
