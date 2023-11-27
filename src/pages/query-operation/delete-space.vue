<script lang="ts" setup>

import { MainInput } from '../../utils';
import { SpaceVerticalNav } from '../../utils';
import { ref, watch } from 'vue';
import "~/assets/css/main.css"

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
const modifyOperations = ref(['Conferma', 'Annulla']);
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

const operation = (item: string) => {
  if (item === 'Aggiungi') {
    router.push({ path: '/query-operation/add-space/', query: { spaceCode: selectedSpace.value, buildingCode: buildingFromQuery, floorNumber: floorFromQuery, floorId: floorIdFromQuery } });
  } else {
    router.push({ path: '/query-operation/delete-space/', query: { spaceCode: selectedSpace.value, buildingCode: buildingFromQuery, floorNumber: floorFromQuery, floorId: floorIdFromQuery } });
  }
}

const deleteOperation = async (item: string, spaceIdToDelete: string) => {
  try {
    if (item === 'Conferma') {
      await useFetch('/api/delete-space', {
        method: 'DELETE',
        body: {
          id: parseInt(spaceIdToDelete),
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
    } else {
      selectedSpace.value = '';
      spaceId.value = '';      
    }
  } catch (error) {
    console.error('Error in deleteOperation:', error);
  }
};

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
                    :floor="String(floorIdFromQuery)"
                    :floorNumber="String(floorFromQuery)"
                    :buildCode="String(buildingFromQuery)" />
          <div class="with-bottom-border"></div>
          <div class="verticalNav">
            <div class="buildingSelected"> Edificio: {{ buildingFromQuery }} </div>
            <div class="floorSelected"> Piano: {{ floorFromQuery }} </div>
            <div class="title"> Locali </div>
            <div class="links">
              <SpaceVerticalNav :buildingCode="buildingFromQuery" :floorNumber="floorFromQuery" :floorId="floorIdFromQuery" />
            </div>
          </div>
      </div>
      <div class="operationButton">
        <button 
          v-for="item, i in operations" :key="i" 
          class="action" :class="item.toLowerCase()"
          @click="operation(item)"
          >{{item}}</button>
      </div>
    </div>
    <div class="form">
      <div class="form-container">
        <div class="titlePage" >Stai eliminando un locale dal piano: {{ floorFromQuery }}</div>
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
                  type="number"
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
          v-for="item, i in modifyOperations" :key="i" 
          class="deleteAction" :class="item.toLowerCase()"
          @click="deleteOperation(item, spaceId)"
          >{{ item }}</button>
      </div>
    </div>
  </div>
</template>
 