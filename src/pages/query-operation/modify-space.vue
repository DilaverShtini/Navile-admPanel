<script lang="ts" setup>

import { useNuxtData, useFetch, refreshNuxtData } from 'nuxt/app';
import { MainInput, SpaceVerticalNav } from '../../utils';
import { useRoute, useRouter } from 'vue-router';
import { ref, watch, reactive } from 'vue';
import "~/assets/css/main.css"

const selectedSpace = ref('');
const route = useRoute();
const router = useRouter();

let buildingFromQuery = route.query.buildingCode
let floorFromQuery = route.query.floorNumber
const floorIdFromQuery = route.query.floorId
let spaceFromQuery = route.query.spaceCode;
let spaceIdFromQuery = route.query.spaceId;
let selectedSvgSpace: string | null = null

const { data } = useNuxtData('spaces') as {data: any};

const operations = ref(['Aggiungi', 'Elimina']);
const modifyOperations = ref(['Conferma', 'Annulla']);

const oldSpaceName = ref("")
const oldSpaceDescription = ref("")
const oldSpaceCapacity = ref<number>(0);
const spaceName = ref("")
const spaceDescription = ref("")
const spaceCapacity = ref<number>(0)
let spaceData = ref([])
let legendData = ref([])
const svg = ref<string>()

const isFormDirty = ref(false);

const state = reactive<{
  svgElement: HTMLElement | null;
}>({
  svgElement: null,
});

watch(() => route.query.spaceCode, (newSpaceCode) => {
    spaceFromQuery = newSpaceCode;
    spaceIdFromQuery = route.query.spaceId;
    buildingFromQuery = route.query.buildingCode
    floorFromQuery = route.query.floorNumber
    loadData();
    updateLegend();

    if (state.svgElement) {
    state.svgElement.removeEventListener("click", handleSvgClick);
    }

    state.svgElement = document.querySelector(".img svg");

    if (state.svgElement) {
      state.svgElement.addEventListener("click", handleSvgClick);
    }
});

onBeforeMount(async() => {
  loadSvg();
  loadData();
  await updateLegend();
  if (state.svgElement) {
    state.svgElement.removeEventListener("click", handleSvgClick);
  }
})

onMounted(async () => {
  setTimeout(async () => {
    const selectedPath = document.getElementById(String(selectedSvgSpace));
    if (selectedPath) {
      selectedPath.style.fill = 'rgba(255, 255, 0, 0.4)';
      selectedPath.style.stroke = 'rgba(255, 255, 0, 0.4)';
    } else {
      console.log("Selected Path Not Found in mounted");
    }
  }, 0);

  state.svgElement = document.querySelector(".img svg");

  if (state.svgElement) {
    state.svgElement.addEventListener("click", handleSvgClick);
  }

  await updateLegend();
})

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

const updateLegend = async() => {
  try {
    const response = await fetch(`/api/selected-space?spaceId=${spaceIdFromQuery}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    legendData.value = result;

    const legendIdResponse = await fetch(`/api/legend?legendId=${String(legendData.value.legendId)}`);
    if (!legendIdResponse.ok) {
      throw new Error(`HTTP error! Status: ${legendIdResponse.status}`);
    }
    const legendCodeResult = await legendIdResponse.json();
    legendData.value = legendCodeResult;
    
    if(spaceFromQuery){
      const parts = String(spaceFromQuery).split('_');
      if (parts.length >= 3) {
        const stringAfterSecondUnderscore = parts.slice(2).join('_');
        const regex = /^[A-Z][a-z.]/;
        selectedSvgSpace = stringAfterSecondUnderscore;
        if (regex.test(String(selectedSvgSpace))) {
          selectedSvgSpace = legendData.value.name + "_" + spaceFromQuery;
        } else {
          selectedSvgSpace = stringAfterSecondUnderscore
        }
      }
    }

    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
}

const markFormDirty = () => {
  isFormDirty.value = true;
}

const operation = (item: string) => {
  if (item === 'Aggiungi') {
    router.push({ path: '/query-operation/add-space/', query: { spaceCode: selectedSpace.value, buildingCode: buildingFromQuery, floorNumber: floorFromQuery, floorId: floorIdFromQuery } });
  } else {
    router.push({ path: '/query-operation/delete-space/', query: { spaceCode: selectedSpace.value, buildingCode: buildingFromQuery, floorNumber: floorFromQuery, floorId: floorIdFromQuery } });
  }
}

const modifyOperation = async (item: string, newSpaceName: string, newSpaceDescription: string, newSpaceCapacity: any) => {
  isFormDirty.value = false
  if (newSpaceCapacity==null) newSpaceCapacity = "0"
  if (item === 'Conferma') {
    await useFetch('/api/update-space', {
      method: 'PUT',
      body: {
        floorId: floorIdFromQuery,
        spaceId: spaceIdFromQuery,
        spaceName: newSpaceName,
        spaceDesc: newSpaceDescription,
        spaceCapacity: newSpaceCapacity
      },
      onRequest () {
        data.value.push(floorIdFromQuery, spaceIdFromQuery, newSpaceName, newSpaceDescription, newSpaceCapacity)
      },
      onResponse: async () => {
        await refreshNuxtData('spaces')
        router.push({ path: '/space-menu/', query: { buildingCode: buildingFromQuery, floorNumber: floorFromQuery, floorId: floorIdFromQuery } })
      }
    });
  } else {
    selectedSpace.value = '';
    oldSpaceName.value = spaceName.value;
    oldSpaceDescription.value = spaceDescription.value;
    oldSpaceCapacity.value = spaceCapacity.value;
    isFormDirty.value = false;
  }
}

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
    spaceName.value = oldSpaceName.value
    spaceDescription.value = oldSpaceDescription.value
    spaceCapacity.value = oldSpaceCapacity.value

    await updateLegend()

    const selectedPath = document.getElementById(String(selectedSvgSpace));
    if (selectedPath) {
      selectedPath.style.fill = 'rgba(255, 255, 0, 0.4)';
      selectedPath.style.stroke = 'rgba(255, 255, 0, 0.4)';
    } else {
      console.log("Selected Path Not Found in watch");
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

const loadSvg = async () => {
  const svgPath = `/res/floors/${buildingFromQuery}_${floorFromQuery}.svg`;

  try {
    const response = await fetch(svgPath);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const svgData = await response.text();
    const blob = new Blob([svgData], { type: "image/svg+xml" });

    var reader = new FileReader();
    reader.readAsText(blob, "UTF-8");
    reader.onload = (e) => {
      svg.value = e.target?.result as string;
    };
  } catch (error) {
    console.error('Error loading SVG:', error);
  }
};

const handleSvgClick = async (e: MouseEvent) => {
  const idValue = (e.target as HTMLElement)?.getAttribute("id") ?? "";
  const spaceCode = idValue.split('_').slice(1).join('_');
  try {
    const { data: result } = await useFetch(`/api/room?spaceCode=${spaceCode}`);
    if(result.value) {
      router.push({
        path: '/query-operation/modify-space/',
        query: { spaceId: result.value.id,
                  spaceCode: spaceCode,
                  buildingCode: buildingFromQuery,
                  floorNumber: floorFromQuery,
                  floorId: floorIdFromQuery },
      });
    } else {
      const newCode = buildingFromQuery + "_" + floorFromQuery + "_" + idValue;
      const { data: result } = await useFetch(`/api/room?spaceCode=${newCode}`);
      if(result.value) {
        router.push({
          path: '/query-operation/modify-space/',
          query: { spaceId: result.value.id,
                    spaceCode: newCode,
                    buildingCode: buildingFromQuery,
                    floorNumber: floorFromQuery,
                    floorId: floorIdFromQuery },
        });
      }else{
        window.confirm('Stanza non esistente o non accessibile :/');
      }
    }
  } catch (error) {
    window.confirm('Stanza non esistente o non accessibile');
  }
};

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
        <div class="titlePage" >Stai modificando: {{ spaceFromQuery }}</div>
          <div v-for="space in data">
            <div v-if="space.code == spaceFromQuery" class="listOfInput">
              <div class="img" v-html="svg" @click="handleSvgClick"/>
              <label for="spaceName"> Nome del locale </label>
                <div>
                  <input 
                    @click="markFormDirty()"
                    type="text"
                    name="spaceName"
                    id="spaceName"
                    v-model="oldSpaceName" />
                </div>
              <label for="spaceDescription"> Descrizione </label>
                <div>
                  <textarea
                    @click="markFormDirty()"
                    id="spaceDescription"
                    name="spaceDescription"
                    rows="3"
                    v-model="oldSpaceDescription" />
                </div>
              <label for="spaceCapacity"> Capacità </label>
                <div>
                  <input
                    @click="markFormDirty()"
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
          v-for="item, i in modifyOperations" :key="i" 
          class="modifyAction" :class="item.toLowerCase()"
          @click="modifyOperation(item, oldSpaceName, oldSpaceDescription, oldSpaceCapacity)"
          >{{item}}</button>
      </div>
    </div>
  </div>
</template>
