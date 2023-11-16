<script lang="ts" setup>

import { useNuxtData, useFetch, refreshNuxtData } from 'nuxt/app';
import { useRoute, useRouter } from 'vue-router';
import { MainInput } from '../../utils';
import { SpaceVerticalNav } from '../../utils';
import { ref, watch } from 'vue';

const selectedSpace = ref('');
const route = useRoute();
const router = useRouter();

let buildingFromQuery = route.query.buildingCode
let floorFromQuery = route.query.floorNumber
const floorIdFromQuery = route.query.floorId
let spaceFromQuery = route.query.spaceCode;
let spaceIdFromQuery = route.query.spaceId;

const { data } = useNuxtData('spaces') as {data: any};

const operations = ref(['Aggiungi', 'Elimina']);
const modifieOperations = ref(['Conferma', 'Annulla']);

const oldSpaceName = ref("")
const oldSpaceDescription = ref("")
const oldSpaceCapacity = ref([])
let spaceData = ref([])

const loadData = async() => {
  try {
    spaceIdFromQuery = route.query.spaceId;
    spaceFromQuery = route.query.spaceCode;
    buildingFromQuery = route.query.buildingCode
    floorFromQuery = route.query.floorNumber

    const response = await fetch(`/api/selected-space?spaceId=${spaceIdFromQuery}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    spaceData.value = result;
    oldSpaceName.value = spaceData.value.name
    oldSpaceDescription.value = spaceData.value.description;
    oldSpaceCapacity.value = spaceData.value.capacity;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
  

const operation = (item: string) => {
  if (item === 'Aggiungi') {
    router.push({ path: '/query-operation/add-space/', query: { spaceCode: selectedSpace.value, buildingCode: buildingFromQuery, floorNumber: floorFromQuery, floorId: floorIdFromQuery } });
  } else {
    router.push({ path: '/query-operation/delete-space/', query: { spaceCode: selectedSpace.value, buildingCode: buildingFromQuery, floorNumber: floorFromQuery, floorId: floorIdFromQuery } });
  }
}

const modifieOperation = async (item: string, spaceName: string, spaceDescription: string, spaceCapacity: any) => {
  if (spaceCapacity==null) spaceCapacity = "0"
  if (item === 'Conferma') {
    await useFetch('/api/update-space', {
      method: 'PUT',
      body: {
        floorId: floorIdFromQuery,
        spaceId: spaceIdFromQuery,
        spaceName: spaceName,
        spaceDesc: spaceDescription,
        spaceCapacity: spaceCapacity
      },
      onRequest () {
        data.value.push(floorIdFromQuery, spaceIdFromQuery, spaceName, spaceDescription, spaceCapacity)
      },
      onResponse: async () => {
        await refreshNuxtData('spaces')
        router.push({ path: '/space-menu/', query: { buildingCode: buildingFromQuery, floorNumber: floorFromQuery, floorId: floorIdFromQuery } })
      }
    });
  } else {
    // TODO
  }
}

watch(() => route.query.spaceCode, (newSpaceCode) => {
    spaceFromQuery = newSpaceCode;
    spaceIdFromQuery = route.query.spaceId;
    buildingFromQuery = route.query.buildingCode
    floorFromQuery = route.query.floorNumber

    loadData();
});

loadData();

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
            <div class="space-title"> Locali </div>
            <div class="links">
              <SpaceVerticalNav :buildingCode="buildingFromQuery" :floorNumber="floorFromQuery" :floorId="floorIdFromQuery" />
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
        <div class="title" >Stai modificando: {{ spaceFromQuery }}</div>
          <div v-for="space in data">
            <div v-if="space.code == spaceFromQuery" class="listOfInput">
              <div class="floor-image">
                <img
                  :src="`/res/floors/${buildingFromQuery}_${(floorFromQuery as string).replace('-', '&#45;')}.svg`"
                  :alt="`Immagine ${buildingFromQuery}_${floorFromQuery}.svg non trovata`"
                />
              </div>
              <label for="spaceName"> Nome del locale </label>
                <div>
                  <input 
                    type="text"
                    name="spaceName"
                    id="spaceName"
                    v-model="oldSpaceName" />
                </div>
              <label for="spaceDescription"> Descrizione </label>
                <div>
                  <textarea
                    id="spaceDescription"
                    name="spaceDescription"
                    rows="3"
                    v-model="oldSpaceDescription" />
                </div>
              <label for="spaceCapacity"> Capacità </label>
                <div>
                  <input
                    type="number"
                    name="spaceCapacity"
                    id="spaceCapacity"
                    v-model="oldSpaceCapacity" />
                </div>
            </div>
          </div>
      </div>
      <div class="buttonsOperation">
        <button
          v-for="item, i in modifieOperations" :key="i" 
          class="modifieAction" :class="item.toLowerCase()"
          @click="modifieOperation(item, oldSpaceName, oldSpaceDescription, oldSpaceCapacity)"
          >{{item}}</button>
      </div>
    </div>
  </div>
</template>
 
<style scoped>
.container {
  max-height: 54em;
  display: flex;
  justify-content: left;
  flex: 1;
  border: 1px solid #d5d5d5;
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

.with-bottom-border {
  border-bottom: 1px solid #d5d5d5;
}

.verticalNav {
  text-align: center;
}

.buildingSelected, .floorSelected {
  width: auto;
  text-align: left;
  padding: 5% 0% 5% 5%;
  border-bottom: 1px solid #d5d5d5;
}

.space-title {
  width: 96%;
  text-align: center;
  padding: 3% 2% 3% 2%;
  font-weight: bold;
}

.links {
  height: auto;
  max-height: calc(37em - var(--input-height, 10em));
  overflow-y: auto;
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

.form {
  width: 100%;
  justify-content: flex-start;
  border-left: 1px solid #d5d5d5;
  overflow-y: scroll;
}

.form-container {
  width: 96%;
  margin: 0%;
  justify-content: flex-start;
  background-color: #fff;
  padding: 2% 2% 0% 2%;
}

.title {
  text-align: left;
  font-size: 1.5em;
  color: #333;
  margin-bottom: 10px;
  font-weight: bold;
}

.listOfInput {
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
}

.floor-image {
  text-align: center;
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

.buttonsOperation {
  text-align: end;
  margin-top: auto;
  padding: 10px;
}

.modifieAction {
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

.conferma {
  height: 25%;
  width: 10%;
}

.annulla {
  height: 25%;
  width: 10%;
}
</style>
