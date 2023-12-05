<script lang="ts" setup>

import { MainInput } from '../../utils';
import { SpaceVerticalNav } from '../../utils';
import { ref, watch } from 'vue';
import "~/assets/css/main.css"

const selectedSpace = ref('');
const spaceName = ref('');
const spaceDescription = ref('');
const spaceCapacity = ref('');
const spaceLegend = ref('');
const route = useRoute();
const router = useRouter();
const svg = ref<string>()
const legendData = ref<{ id: number }[]>([]);
const legends = ref([])
const registeredRoom = ref(true)
let idValue: string | null = null
let selectedSvgSpaces: string[] = [];

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
  if (state.svgElement) {
    state.svgElement.removeEventListener("click", handleSvgClick);
  }
})

onMounted(async () => {
  setTimeout(async () => {
    const selectedPath = document.getElementById(String(selectedSvgSpaces[selectedSvgSpaces.length-1]));
    if (selectedPath) {
      selectedPath.style.fill = 'rgba(255, 255, 0, 0.4)';
      selectedPath.style.stroke = 'rgba(255, 255, 0, 0.4)';
    } else {
      console.log("Selected Path Not Found in mounted");
    }
    selectedSvgSpaces.pop()
    loadRoom();
  }, 0);
  state.svgElement = document.querySelector(".img svg");

  const legendList = await fetch(`/api/legend-list`);
    if (!legendList.ok) {
      throw new Error(`HTTP error! Status: ${legendList.status}`);
    }
    const legendResult = await legendList.json();
    legends.value = legendResult;    
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

const createOperation = async (item: string, newSpaceName: string, newSpaceDescription:string, newSpaceCapacity: string, newSpaceLegend: string) => {
  isFormDirty.value = false;

  try {
    if (item === 'Conferma') {
      const legendIdResponse = await fetch(`/api/legend-number?legendName=${newSpaceLegend}`);
      if (!legendIdResponse.ok) {
          throw new Error(`HTTP error! Status: ${legendIdResponse.status}`);
        }
      const legendIdResult = await legendIdResponse.json();
      legendData.value = legendIdResult;

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
          legendId: legendData.value.id,
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
      spaceLegend.value = ''
      isFormDirty.value = false;
    }

    return Promise.resolve();
  } catch (error) {
    console.error('Error in createOperation:', error);
    window.confirm('Mancano dei parametri');
    return Promise.reject(error);
  }
};

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
  const oldSvg = idValue
  idValue = (e.target as HTMLElement)?.getAttribute("id") ?? "";
  const spaceCode = idValue.split('_').slice(1).join('_');
  try {
    const { data: result } = await useFetch(`/api/room?spaceCode=${spaceCode}`);
    loadRoom()

    if(!result.value && !selectedSvgSpaces?.includes(idValue)) {
      if (oldSvg && !registeredRoom.value) {
        registeredRoom.value = !registeredRoom.value
        const previousSelectedPath = document.getElementById(oldSvg);
        if (previousSelectedPath) {
          previousSelectedPath.style.fill = 'rgba(0, 0, 0, 0.1)';
          previousSelectedPath.style.stroke = '';
        }
      }
      
      const selectedPath = document.getElementById(String(idValue));
      if (selectedPath) {
        registeredRoom.value = !registeredRoom.value
        selectedPath.style.fill = 'rgba(255, 255, 0, 0.4)';
        selectedPath.style.stroke = 'rgba(255, 255, 0, 0.4)';
        newSpaceCode.value = idValue;
      } else {
        console.log("Selected Path Not Found in watch");
      }
    } else {
      if (oldSvg && !registeredRoom.value) {
        registeredRoom.value = !registeredRoom.value
        const previousSelectedPath = document.getElementById(oldSvg);
        if (previousSelectedPath) {
          previousSelectedPath.style.fill = 'rgba(0, 0, 0, 0.1)';
          previousSelectedPath.style.stroke = '';
        }
      }
      selectedSvgSpaces.pop()
      window.confirm('Stanza già memorizzata');
    }
  } catch (error) {
    window.confirm('Errore nella selezione della stanza.. '+error);
  }
};

const loadRoom = async () => {
  try {
    const { data: allRoomCode } = await useFetch('/api/all-room');
    if (allRoomCode.value) {
      for (const element of allRoomCode.value) {
        const buildingFloorCode = `${buildingFromQuery}_${floorFromQuery}`;
        if (element.code.startsWith(buildingFloorCode) || element.code.includes(buildingFloorCode)) {
          const parts = String(element.code).split('_');
          const stringAfterSecondUnderscore = parts.slice(2).join('_');
          const regex = /^[A-Z][a-z.]/;
          if (regex.test(String(stringAfterSecondUnderscore))) {
            selectedSvgSpaces.push(element.code);
          } else {
            selectedSvgSpaces.push(stringAfterSecondUnderscore)
          }
          const selectedPath = document.querySelector(`[id*="${selectedSvgSpaces[selectedSvgSpaces.length-1]}"]`) as HTMLElement;
          if (selectedPath) { 
            selectedPath.style.fill = 'rgba(255, 255, 0, 0.4)';
            selectedPath.style.stroke = 'rgba(255, 255, 0, 0.4)';
          }
        }
      }
    }

  } catch (error) {
    console.error('Error loading SVG:', error);
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
              <label for="spaceCapacity"> Tipologia stanza </label>
                <select id="buildingSelector" v-model="spaceLegend" required>
                  <option value="" disabled selected>Seleziona una opzione...</option>
                  <option v-for="legend in legends" :key="legend">{{ legend.name }}</option>
                </select>
            </div>
          </div>
      </div>
      <div class="buttonsOperation">
        <button
          v-for="item, i in modifyOperations" :key="i" 
          class="createAction" :class="item.toLowerCase()"
          @click="createOperation(item, spaceName, spaceDescription, spaceCapacity, spaceLegend)"
          >{{item}}</button>
      </div>
    </div>
  </div>
</template>
