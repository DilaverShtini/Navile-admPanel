/* Componenti per la pagina principale, la prima ad essere visualizzata */
export { default as MainMenu } from '../pages/main-menu.vue'
export { default as MainInput } from "../components/main-menu/main-inputLabel.vue"
export { default as MainVerticalNav } from "../components/main-menu/main-verticalNavigation.vue"

/* Componenti per la selezione dell'operazione dopo aver scelto il modello */
export { default as OperationMenu} from '../pages/operation-menu.vue'
export { default as OperationVerticalNav} from '../components/models-operation/operation-verticalNavigation.vue'

/* Componenti per le operazioni nel db da visualizzare dopo aver selezionato l'operazione di interesse */
export { default as SideBar} from "../components/sidebar/sidebar.vue"
export { default as Form } from "../components/form/form.vue"
export { default as ControlPanel } from "../pages/controlPanel.vue"

/* Componente in caso di errore */
export { default as NotFoundComponent } from "../pages/error.vue"
