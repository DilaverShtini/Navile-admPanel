<script lang="ts" setup>

import { MainInput } from '../../utils';
import { MainVerticalNav } from '../../utils';
import { ref, watch } from 'vue';

const selectedBuilding = ref('');
const route = useRoute();
const router = useRouter();
const isEditMode = ref(true);

const items = ref(['Edificio', 'Modifica']);
const operations = ref(['Aggiungi', 'Elimina']);
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
            <button 
              v-for="item, i in operations" :key="i" 
              class="action" :class="item.toLowerCase()"
              >{{item}}</button>
          </div>
      </div>
    </div>
    <div v-if="activeItem === 'Modifica'" class="form-container">
      Stai modificando: {{ buildingFromQuery }}
    </div>
  </div>
</template>
 
<style scoped>

.container {
  height: 100%;
  margin-bottom: 5%;
  display: flex;
  justify-content: left;
  flex: 1;
  border: 1px solid #d5d5d5;
}

.form-container {
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  padding: 20px;
  border-left: 1px solid #d5d5d5;
}

.menu {
  text-align: center;
  width: 20em;
  height: max-content;
}

.box {
  border-right: 1px solid #d5d5d5;
  overflow-y: hidden;
  width: 20em;
}

.action {
  width: 40%;
  position: relative;
  display: inline-block;
  margin-bottom: 3%;
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

.aggiungi {
  margin-right: 10px;
}

.elimina {
  margin-left: 10px;
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
