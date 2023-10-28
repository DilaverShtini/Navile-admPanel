import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { createApp } from 'vue';
import { MainMenu, OperationMenu, ControlPanel } from './utils/index';
import { NotFoundComponent } from './utils/index';

const routes: RouteRecordRaw[] = [
  { path: '/main-menu', component: MainMenu },
  { path: '/operation-menu', name: 'operation-menu', component: OperationMenu },
  { path: '/controlPanel', component: ControlPanel },
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
