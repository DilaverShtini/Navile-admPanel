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

const mapMode = ref(false)
const options = ref(['Codici', 'Mappa'])
const activeViewOption = ref('Codici')
const svg = ref<string>()
let idValue: string | null = null

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

watch(() => route.query.spaceCode, (newSpaceCode) => {
    spaceFromQuery.value = newSpaceCode;
    loadData();
});

onMounted(async () => {
  loadSvg();
  loadData();
  try {
    const response = await fetch(`/api/space?floorIdNumber=${floorIdFromQuery}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    data.value = result;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

const changeTab = (item: string) => {
  activeViewOption.value = item;
  if (item === 'Mappa') {
    mapMode.value = true;
  } else {
    mapMode.value = false;
  }
};

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

const loadData = async() => {
  try {
    const selectedPath = document.getElementById(String(idValue));
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
  const oldSvg = idValue
  idValue = (e.target as HTMLElement)?.getAttribute("id") ?? "";
  const spaceCode = idValue.split('_').slice(1).join('_');
  try {
    const { data: result } = await useFetch(`/api/room?spaceCode=${spaceCode}`);
    if(result.value) {
      if (oldSvg) {
        const previousSelectedPath = document.getElementById(oldSvg);
        if (previousSelectedPath) {
          previousSelectedPath.style.fill = 'rgba(0, 0, 0, 0.1)';
          previousSelectedPath.style.stroke = '';
        }
      }
      spaceId.value = String(result.value.id)
      const selectedPath = document.getElementById(String(idValue));
      if (selectedPath) {
        selectedPath.style.fill = 'rgba(255, 255, 0, 0.4)';
        selectedPath.style.stroke = 'rgba(255, 255, 0, 0.4)';
      }
    } else {
      const newCode = buildingFromQuery + "_" + floorFromQuery + "_" + idValue;
      const { data: result } = await useFetch(`/api/room?spaceCode=${newCode}`);
      if(result.value) {
        if (oldSvg) {
        const previousSelectedPath = document.getElementById(oldSvg);
        if (previousSelectedPath) {
          previousSelectedPath.style.fill = 'rgba(0, 0, 0, 0.1)';
          previousSelectedPath.style.stroke = '';
        }
      }
        spaceId.value = String(result.value.id)
        const selectedPath = document.getElementById(String(idValue));
        if (selectedPath) {
          selectedPath.style.fill = 'rgba(255, 255, 0, 0.4)';
          selectedPath.style.stroke = 'rgba(255, 255, 0, 0.4)';
        }
      }else{
        if (oldSvg) {
          const previousSelectedPath = document.getElementById(oldSvg);
          if (previousSelectedPath) {
            previousSelectedPath.style.fill = 'rgba(0, 0, 0, 0.1)';
            previousSelectedPath.style.stroke = '';
          }
        }
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
        <div class="titlePage" >Stai eliminando un locale dal piano: {{ floorFromQuery }}</div>
        <div class="deleteOption">
            <button 
              v-for="item, i in options" :key="i" 
              class="tab" :class="{ active: item === activeViewOption }"
              @click="changeTab(item)"
              >{{item}}</button>
        </div>
        <div v-if="activeViewOption == 'Codici'" class="subtitle">Lista dei locali con relativi codici:</div>
        <div v-else="activeViewOption == 'Mappa'" class="subtitle">Seleziona la stanza da eliminare:</div>
        <div v-if="activeViewOption == 'Codici'" v-for="link in data" class="listOfSpaces">
          <label>{{ link.name }}</label>
          <label>{{ link.id }}</label>
        </div>
        <div v-else="activeViewOption == 'Mappa'" class="listOfSpaces">
        <div class="img" v-html="svg" @click="handleSvgClick"/>
        </div>
        <div v-if="activeViewOption == 'Codici'">
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
