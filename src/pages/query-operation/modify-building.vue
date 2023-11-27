<script lang="ts" setup>

import { MainInput } from '../../utils';
import { MainVerticalNav } from '../../utils';
import { ref, watch } from 'vue';
import "~/assets/css/main.css"

const { data } = useNuxtData('buildings') as {data: any};
const router = useRouter();
const route = useRoute();
const operations = ref(['Conferma', 'Annulla']);

let buildingFromQuery = route.query.buildingCode;
let buildingIdFromQuery = route.query.buildingId;

const oldBuildName = ref([]);
const oldBuildDescription = ref([]);
const buildName = ref([]);
const buildDescription = ref([]);
let buildData = ref([])

const isFormDirty = ref(false);

onBeforeRouteLeave((_to, _from, next) => {
  if (isFormDirty.value) {
    const leave = window.confirm('Hai apportato modifiche non salvate. Vuoi davvero lasciare la pagina?');
    if (leave) {
      next();
    } else {
      next(false);
    }
  } else {
    next();
  }
});

const markFormDirty = () => {
  isFormDirty.value = true;
};

const loadData = async () => {
  try {
    buildingIdFromQuery = route.query.buildingId;
    buildingFromQuery = route.query.buildingCode;
    const response = await fetch(`/api/selected-build?buildingId=${buildingIdFromQuery}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    buildData.value = result;
    oldBuildName.value = buildData.value.name
    oldBuildDescription.value = buildData.value.description;
    buildName.value = oldBuildName.value;
    buildDescription.value = oldBuildDescription.value; 
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

const operation = async (item: string, newBuildName: any, newBuildDescription: any) => {
  isFormDirty.value = false
  if (item === 'Conferma') {
    await useFetch('/api/update-build', {
      method: 'PUT',
      body: {
        buildingId: buildingIdFromQuery,
        buildingCode: buildingFromQuery,
        buildingName: newBuildName,
        buildingDesc: newBuildDescription,
      },
      onRequest () {
        data.value.push(buildingIdFromQuery, buildingFromQuery, newBuildName, newBuildDescription)
      },
      onResponse: async () => {
        await refreshNuxtData('buildings')
        router.push({ path: '/main-menu/', query: { buildingCode: buildingFromQuery } })
      }
    });
  } else {
    oldBuildName.value = buildName.value;
    oldBuildDescription.value = buildDescription.value;
    isFormDirty.value = false;
  }
}

watch(() => route.query.buildingCode, (newBuildingCode) => {
  buildingFromQuery = newBuildingCode;
  buildingIdFromQuery = route.query.buildingId;
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
                    model="building" />
          <div class="with-bottom-border"></div>
          <div class="verticalNav">
            <div class="title"> Edifici </div>
            <MainVerticalNav />
          </div>
      </div>
    </div>
    <div class="form">
      <div class="form-container">
        <div class="titlePage" >Stai modificando: {{ buildingFromQuery }}</div>
          <div v-for="build in data">
            <div v-if="build.code == buildingFromQuery" class="listOfInput">
              <label for="spaceName"> Nome dell'edificio </label>
                <div>
                  <input 
                    @click="markFormDirty()"
                    type="text"
                    name="buildName"
                    id="buildName"
                    v-model="oldBuildName"/>
                </div>
              <label for="spaceDescription"> Descrizione </label>
                <div>
                  <textarea
                    @click="markFormDirty()"
                    id="buildDescription"
                    name="buildDescription"
                    rows="3"
                    v-model="oldBuildDescription" />
                </div>
            </div>
          </div>
      </div>
      <div class="buttonsOperation">
        <button
          v-for="item, i in operations" :key="i" 
          class="modifyAction" :class="item.toLowerCase()"
          @click="operation(item, oldBuildName, oldBuildDescription)"
          >{{item}}</button>
      </div>
    </div>
  </div>
</template>
