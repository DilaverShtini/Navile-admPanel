<script lang="ts" setup>

import { MainInput } from '../../utils';
import { MainVerticalNav } from '../../utils';
import { ref, watch } from 'vue';

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
            <div class="building-title"> Edifici </div>
            <MainVerticalNav />
          </div>
      </div>
    </div>
    <div class="form">
      <div class="form-container">
        <div class="title" >Stai modificando: {{ buildingFromQuery }}</div>
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
          class="action" :class="item.toLowerCase()"
          @click="operation(item, oldBuildName, oldBuildDescription)"
          >{{item}}</button>
      </div>
    </div>
  </div>
</template>
 
<style scoped>
.container {
  max-height: 53em;
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

.building-title {
  width: 96%;
  text-align: center;
  padding: 3% 2% 3% 2%;
  font-weight: bold;
}

.form {
  width: 100%;
  justify-content: flex-start;
  border-left: 1px solid #d5d5d5;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ed5959; /* Colore normale della barra di scorrimento */
    transition: background-color 0.3s ease; /* Effetto di transizione */
    border-radius: 10px; /* Bordi arrotondati per la barra di scorrimento */
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #b92929; /* Colore della barra di scorrimento al passaggio del mouse */
    border-radius: 10px; /* Bordi arrotondati per la barra di scorrimento */
  }

  &::-webkit-scrollbar-track {
    background-color: #ecf0f1; /* Colore dello sfondo della barra di scorrimento */
    border-radius: 10px; /* Bordi arrotondati per la barra di scorrimento */
  }
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

.action {
  width: 100%;
  margin: 0 1%;
  padding: 0.8em 0.5em;
  text-align: center;
  font-weight: bold;
  color: #000;
  letter-spacing: 2px;
  background-color: #fff;
  border-radius: 0.5em;
  overflow: hidden;
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
</style>
