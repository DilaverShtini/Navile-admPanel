<script lang="ts" setup>

import { MainInput } from '../../utils';
import { SpaceVerticalNav } from '../../utils';
import { ref, watch } from 'vue';

interface SpaceItem {
  id: number;
  code: number;
  name: string;
}

const selectedSpace = ref('');
const spaceId = ref('');
const route = useRoute();
const router = useRouter();

const buildingFromQuery = route.query.buildingCode
const floorFromQuery = route.query.floorNumber
const floorIdFromQuery = route.query.floorId

const operations = ref(['Aggiungi', 'Elimina']);
const modifieOperations = ref(['Conferma', 'Annulla']);
let spaceFromQuery = ref(route.query.spaceCode);

const data = ref<SpaceItem[]>([]);

onMounted(async () => {
  try {
    const response = await fetch(`/api/space?floorIdNumber=${floorIdFromQuery}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    // console.log('Result from API:', result);
    data.value = result;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

const emits = defineEmits<{
  (e: "change", item: string): void;
  (e: "linkClicked", building: string): void;
}>();

const operation = (item: string) => {
  if (item === 'Aggiungi') {
    router.push({ path: '/query-operation/add-space/', query: { spaceCode: selectedSpace.value, buildingCode: buildingFromQuery, floorNumber: floorFromQuery, floorId: floorIdFromQuery } });
  } else {
    router.push({ path: '/query-operation/delete-space/', query: { spaceCode: selectedSpace.value, buildingCode: buildingFromQuery, floorNumber: floorFromQuery, floorId: floorIdFromQuery } });
  }
}

const deleteOperation = async (item: string, spaceId: string) => {
  try {
    if (item === 'Conferma') {
      await useFetch('/api/delete-space', {
        method: 'DELETE',
        body: {
          id: parseInt(spaceId),
        },
        onResponse: async () => {
          await refreshNuxtData('spaces');
          router.push({
            path: '/space-menu/',
            query: {
              buildingCode: buildingFromQuery,
              floorNumber: floorFromQuery,
              floorId: floorIdFromQuery,
            },
          });
        },
      });
    }
  } catch (error) {
    console.error('Error in deleteOperation:', error);
  }
};

// Funzione per gestire il clic del link
const handleLinkClick = (space: string): void => {
  selectedSpace.value = space;
  emits('linkClicked', space);
}

watch(() => route.query.spaceCode, (newSpaceCode) => {
    spaceFromQuery.value = newSpaceCode;
});

</script>

<template>
  <div class="container">
    <div class="menu border p-4">
      <div class="box">
        <MainInput type="text"
                    placeholder="Search"
                    id="openBuilding"
                    class="mb-4"
                    model="space" 
                    :floor="String(floorIdFromQuery)" />
          <div class="with-bottom-border"></div>
          <div class="verticalNav">
            <div class="buildingSelected"> Edificio: {{ buildingFromQuery }} </div>
            <div class="floorSelected"> Piano: {{ floorFromQuery }} </div>
            <div class="space-title"> Locali </div>
            <div class="links">
              <SpaceVerticalNav @linkClicked="handleLinkClick" :buildingCode="buildingFromQuery" :floorNumber="floorFromQuery" :floorId="floorIdFromQuery" />
            </div>
            <button 
              v-for="item, i in operations" :key="i" 
              class="action" :class="item.toLowerCase()"
              @click="operation(item)"
              >{{item}}</button>
          </div>
      </div>
    </div>
    <div class="form">
      <div class="form-container">
        <div class="title" >Stai eliminando un locale dal piano: {{ floorFromQuery }}</div>
        <div class="subtitle">Lista dei locali con relativi codici:</div>
        <div v-for="link in data" class="listOfSpaces">
          <label>{{ link.name }}</label>
          <label>{{ link.id }}</label>
        </div>
        <div>
          <div class="listOfInput">
            <label for="spaceId"> Id del locale </label>
              <div>
                <input 
                  type="text"
                  name="spaceId"
                  id="spaceId"
                  placeholder="Inserisci l'id"
                  v-model="spaceId"/>
              </div>
          </div>
        </div>
      </div>
      <div class="buttonsOperation">
        <button
          v-for="item, i in modifieOperations" :key="i" 
          class="deleteAction" :class="item.toLowerCase()"
          @click="deleteOperation(item, spaceId)"
          >{{ item }}</button>
      </div>
    </div>
  </div>
</template>
 
<style scoped>

.links {
  max-height: 64vh;
  overflow-y: scroll;
}

.space-title {
  width: 96%;
  text-align: center;
  padding: 3% 2% 3% 2%;
  font-weight: bold;
}
.listOfInput {
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
}

.subtitle {
  font-size: 1.2em;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.listOfSpaces {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  border-radius: 8px;
}

.listOfSpaces label {
  font-size: 1em;
  color: #333;
}

.listOfSpaces label:first-child {
  font-weight: bold;
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
  overflow-y: scroll;
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
  max-height: 97vh;
  display: flex;
  justify-content: left;
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

.deleteAction {
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

.action {
  width: 40%;
  position: relative;
  display: inline-block;
  margin-top: 2%;
  margin-bottom: 2%;
  padding: 0.8em 2em;
  text-align: center;
  font-weight: bold;
  color: #000;
  letter-spacing: 2px;
  background-color: #fff;
  border-radius: 0.5em;
}

.action:hover, .modifieAction:hover {
  background-color: #ed5959;
}

.aggiungi {
  margin-right: 10px;
}

.elimina {
  margin-left: 10px;
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

.buildingSelected, .floorSelected {
  width: auto;
  text-align: left;
  padding: 5% 0% 5% 5%;
  border-bottom: 1px solid #d5d5d5;
}

</style>
