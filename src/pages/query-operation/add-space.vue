<script lang="ts" setup>

import { MainInput } from '../../utils';
import { SpaceVerticalNav } from '../../utils';
import { ref, watch } from 'vue';
import "~/assets/css/main.css"

const selectedSpace = ref('');
const spaceName = ref('');
const spaceDescription = ref('');
const spaceCapacity = ref('');
const route = useRoute();
const router = useRouter();
const svg = ref<string>()
let selectedSvgSpace: string | null = null

let buildingFromQuery = route.query.buildingCode
let floorFromQuery = route.query.floorNumber
let floorIdFromQuery = route.query.floorId

const operations = ref(['Aggiungi', 'Elimina']);
const modifyOperations = ref(['Conferma', 'Annulla']);
let spaceFromQuery = ref(route.query.spaceCode);
let newSpaceCode: { value: string; } = ref('')

const isFormDirty = ref(false);

const state = reactive<{
  svgElement: HTMLElement | null;
}>({
  svgElement: null,
});

watch(() => route.query.spaceCode, (newSpaceCode) => {
    spaceFromQuery.value = newSpaceCode;
    loadData();
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

const markFormDirty = () => {
  isFormDirty.value = true
}

const operation = (item: string) => {
  if (item === 'Aggiungi') {
    router.push({ path: '/query-operation/add-space/', query: { spaceCode: selectedSpace.value, buildingCode: buildingFromQuery, floorNumber: floorFromQuery, floorId: floorIdFromQuery } });
  } else {
    router.push({ path: '/query-operation/delete-space/', query: { spaceCode: selectedSpace.value, buildingCode: buildingFromQuery, floorNumber: floorFromQuery, floorId: floorIdFromQuery } });
  }
}

// TODO rivedere l'assegnazione del legendId
const createOperation = async (item: string, newSpaceName: string, newSpaceDescription:string, newSpaceCapacity: string) => {
  isFormDirty.value = false;
  try {
    if (item === 'Conferma') {
      if (newSpaceCapacity.length == 0) newSpaceCapacity = '0';
      await useFetch('/api/create-space', {
        method: 'PUT',
        body: {
          code: newSpaceCode.value,
          buildCode: buildingFromQuery,
          floorNumber: floorFromQuery,
          name: newSpaceName,
          description: newSpaceDescription,
          floorId: floorIdFromQuery,
          legendId: 1,
          capacity: newSpaceCapacity,
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
      spaceName.value = '';
      spaceDescription.value = '';
      spaceCapacity.value = '';
      isFormDirty.value = false;
    }
  } catch (error) {
    console.error('Error in createOperation:', error);
  }
};

const loadData = async() => {
  try {
    spaceFromQuery.value = route.query.spaceCode;
    buildingFromQuery = route.query.buildingCode
    floorFromQuery = route.query.floorNumber

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
    if(!result.value) {
      const selectedPath = document.getElementById(String(idValue));
      if (selectedPath) {
        selectedPath.style.fill = 'rgba(255, 255, 0, 0.4)';
        selectedPath.style.stroke = 'rgba(255, 255, 0, 0.4)';
        newSpaceCode.value = idValue;
      } else {
        console.log("Selected Path Not Found in watch");
      }
    }else {
      window.confirm('Stanza già memorizzata');
    }
  } catch (error) {
    window.confirm('Errore nella selezione della stanza.. '+error);
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
        <div class="titlePage" >Stai aggiungendo un nuovo locale al piano: {{ floorFromQuery }}</div>
          <div>
            <div class="listOfInput">
              <div class="img" v-html="svg" @click="handleSvgClick"/>
              <label for="spaceName"> Nome del locale </label>
                <div>
                  <input
                    @change="markFormDirty()"
                    type="text"
                    name="spaceName"
                    id="spaceName"
                    placeholder="Nome" 
                    v-model="spaceName"/>
                </div>
              <label for="spaceDescription"> Descrizione </label>
                <div>
                  <textarea
                    @change="markFormDirty()"
                    id="spaceDescription"
                    name="spaceDescription"
                    rows="3"
                    placeholder="Descrizione"
                    v-model="spaceDescription"/>
                </div>
              <label for="spaceCapacity"> Capacità </label>
                <div>
                  <input
                    @change="markFormDirty()"
                    type="number"
                    id="spaceCapacity"
                    name="spaceCapacity"
                    rows="3"
                    placeholder="Capacità"
                    v-model="spaceCapacity"/>
                </div>
            </div>
          </div>
      </div>
      <div class="buttonsOperation">
        <button
          v-for="item, i in modifyOperations" :key="i" 
          class="createAction" :class="item.toLowerCase()"
          @click="createOperation(item, spaceName, spaceDescription, spaceCapacity)"
          >{{item}}</button>
      </div>
    </div>
  </div>
</template>
