<script lang="ts" setup>

import { MainInput } from '../../utils';
import { MainVerticalNav } from '../../utils';
import { ref, watch } from 'vue';

const { data } = await useFetch('/api/building') as { data: any };
const selectedBuilding = ref('');
const route = useRoute();
const router = useRouter();
const isEditMode = ref(true);

const items = ref(['Edificio', 'Modifica']);
const operations = ref(['Conferma', 'Annulla']);
const activeItem = ref('Modifica');
let buildingFromQuery = ref(route.query.buildingCode);

const emits = defineEmits<{
  (e: "change", item: string): void;
  (e: "linkClicked", building: string): void;
}>();

const changeTab = (item: string) => {
  activeItem.value = item;
  emits('change', item);
  if (item === 'Modifica') {
    isEditMode.value = true;
  } else {
    isEditMode.value = false;
  }
};

// Funzione per gestire il clic del link
const handleLinkClick = (building: string): void => {
  selectedBuilding.value = building;
  emits('linkClicked', building);

  // Utilizza router solo quando window è definito
  if (typeof window !== 'undefined') {
    if (activeItem.value === 'Modifica') {
      router.push({ path: '/query-operation/modifie-building/', query: { buildingCode: selectedBuilding.value } });
    } else {
      router.push({ path: '/floor-menu/', query: { buildingCode: selectedBuilding.value } });
    }
  }
}

const operation = (item: string) => {
  // TODO logica delle operazioni di conferma/annulla modifica

  if (item === 'Conferma') {

  } else {

  }
}

watch(() => route.query.buildingCode, (newBuildingCode) => {
  buildingFromQuery.value = newBuildingCode;
});

</script>

<template>
  <div class="container">
    <div class="menu border p-4">
      <div class="box">
        <MainInput type="text" placeholder="Search" id="openBuilding" class="mb-4" />
          <div class="with-bottom-border"></div>
          <div class="verticalNav">
            <button 
              v-for="item, i in items" :key="i" 
              class="tab" :class="{ active: item === activeItem }"
              @click="changeTab(item)"
              >{{item}}</button>
            <MainVerticalNav @linkClicked="handleLinkClick" :editMode=isEditMode />
          </div>
      </div>
    </div>
    <div class="form">
      <div v-if="activeItem === 'Modifica'" class="form-container">
        <div class="title" >Stai modificando: {{ buildingFromQuery }}</div>
          <div v-for="build in data">
            <div v-if="build.code == buildingFromQuery" class="listOfInput">
              <label for="buildingName"> Nome dell'edificio </label>
                <div>
                  <input 
                    type="text"
                    name="buildName"
                    id="buildName"
                    :placeholder="'Cambia ' + build.name " />
                </div>
              <label for="buildingDescription"> Descrizione </label>
              <div>
                <textarea
                  id="buildDescription"
                  name="buildDescription"
                  rows="3"
                  :placeholder=build.description />
              </div>
            </div>
          </div>
      </div>
      <div class="buttonsOperation" v-if=isEditMode>
        <button
          v-for="item, i in operations" :key="i" 
          class="action" :class="item.toLowerCase()"
          @click="operation(item)"
          >{{item}}</button>
      </div>
    </div>
  </div>
</template>
 
<style scoped>

.listOfInput {
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
}

.listOfInput label {
  display: block;
  font-size: 1em;
  margin-bottom: 8px;
  color: #333;
}

.listOfInput input,
.listOfInput textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.listOfInput textarea {
  resize: vertical;
}

.title {
  text-align: left;
  font-size: 1.5em;
  color: #333;
  margin-bottom: 10px;
  font-weight: bold;
}

.form {
  width: 100%;
  justify-content: flex-start;
  border-left: 1px solid #d5d5d5;
}

.buttonsOperation {
  text-align: end;
  margin-top: auto;
  padding: 10px;
}

.container {
  height: 100%;
  width: 100%;
  display: flex;
  flex: 1;
  border: 1px solid #d5d5d5;
}

.form-container {
  width: 96%;
  margin: 0%;
  justify-content: flex-start;
  background-color: #fff;
  padding: 2% 2% 0% 2%;
}

.menu {
  text-align: center;
  width: 20em;
  height: max-content;
}

.box {
  border-right: 1px solid #d5d5d5;
  overflow-y: hidden;
  justify-content: left;
  width: 20em;
}

.action {
  width: 100%;
  margin: 0 1%;
  padding: 0.8em 2em;
  text-align: center;
  font-weight: bold;
  color: #000;
  letter-spacing: 2px;
  background-color: #fff;
  border-radius: 0.5em;
}

.action:hover {
  background-color: #ed5959;
}

.conferma {
  height: 25%;
  width: 10%;
}

.annulla {
  height: 25%;
  width: 10%;
}

.tab {
  position: relative;
  display: inline-block;
  padding: 1rem 2rem;
  text-align: center;
  font-weight: bold;
  color: #333;
  letter-spacing: 2px;
  background-color: #fff;
  border: none;
}

.tab::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 2px;
  width: calc(100% - 30px);
  border-radius: 0 0 8px 8px;
  background-color: rgb(255, 37, 37);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tab.active {
  color: rgb(234, 37, 37);
}

.tab.active::after {
  opacity: 1;
}

.verticalNav {
  text-align: center;
}
.with-bottom-border {
  border-bottom: 1px solid #d5d5d5;
}
</style>
