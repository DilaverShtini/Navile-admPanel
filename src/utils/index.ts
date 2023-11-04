/* Componenti per la pagina principale, la prima ad essere visualizzata */
export { default as MainMenu } from '../pages/main-menu.vue'
export { default as MainInput } from "../components/main-menu/main-inputLabel.vue"
export { default as MainVerticalNav } from "../components/main-menu/main-verticalNavigation.vue"

/* Componenti per le operazioni nel db da visualizzare */
export { default as AddSpace } from '../pages/query-operation/add-space.vue'
export { default as DeleteSpace } from '../pages/query-operation/delete-space.vue'
export { default as ModifieSpace } from '../pages/query-operation/modifie-space.vue'
export { default as ModifieBuilding } from '../pages/query-operation/modifie-building.vue'

/* Componente in caso di errore */
export { default as NotFoundComponent } from "../pages/error.vue"

/* Componenti per il piano */
export { default as Floor } from "../pages/floor-menu.vue"
export { default as FloorVerticalNav } from "../components/floor-menu/floor-verticalNavigation.vue"

/* Componenti per gli spazi */
export { default as Space } from "../pages/space-menu.vue"
export { default as SpaceVerticalNav } from "../components/space-menu/space-verticalNavigation.vue"
