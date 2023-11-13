<script lang="ts" setup>

import { MainInput } from '../../utils';
import { SpaceVerticalNav } from '../../utils';
import { ref, watch } from 'vue';

const selectedSpace = ref('');
const route = useRoute();
const router = useRouter();

const spaceName = ref('');
const spaceDescription = ref('');
const spaceCapacity = ref('');

const buildingFromQuery = route.query.buildingCode
const floorFromQuery = route.query.floorNumber
const floorIdFromQuery = route.query.floorId
const spaceIdFromQuery = ref(route.query.spaceId);
const spaceFromQuery = ref(route.query.spaceCode);

const { data } = useNuxtData('spaces') as {data: any};

const operations = ref(['Aggiungi', 'Elimina']);
const modifieOperations = ref(['Conferma', 'Annulla']);

const operation = (item: string) => {
  if (item === 'Aggiungi') {
    router.push({ path: '/query-operation/add-space/', query: { spaceCode: selectedSpace.value, buildingCode: buildingFromQuery, floorNumber: floorFromQuery, floorId: floorIdFromQuery } });
  } else {
    router.push({ path: '/query-operation/delete-space/', query: { spaceCode: selectedSpace.value, buildingCode: buildingFromQuery, floorNumber: floorFromQuery, floorId: floorIdFromQuery } });
  }
}

const modifieOperation = async (item: string, spaceName: string | undefined, spaceDescription: string | null | undefined, spaceCapacity: string) => {
  const { data: spaceData } = await useFetch('/api/selected-space', {
    method: 'POST',
    body: {
      spaceId: spaceIdFromQuery
    },
  })

  const oldSpaceName = ref(spaceData.value[0]?.name);
  const oldSpaceDescription = ref(spaceData.value[0]?.description);
  const oldSpaceCapacity = ref(spaceData.value[0]?.capacity);

  if (item === 'Conferma') {
    if (spaceName=="") spaceName = oldSpaceName.value;
    if (spaceDescription=="") spaceDescription = oldSpaceDescription.value;
    if (spaceCapacity=="" && String(oldSpaceCapacity.value)=="") {
      spaceCapacity = "0"
    }else if(spaceCapacity=="" && String(oldSpaceCapacity.value)!=="") {
      spaceCapacity = String(oldSpaceCapacity.value)
    }
    oldSpaceName.value = spaceName;
    oldSpaceDescription.value = spaceDescription;
    oldSpaceCapacity.value = parseInt(spaceCapacity);

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
              <label for="spaceName"> Nome del locale presente </label>
                <div>
                  <input 
                    type="text"
                    name="spaceName"
                    id="spaceName"
                    :placeholder="space.name"
                    readonly />
                </div>
              <label for="spaceDescription"> Descrizione presente </label>
                <div>
                  <textarea
                    id="spaceDescription"
                    name="spaceDescription"
                    rows="3"
                    :placeholder="space.description"
                    readonly />
                </div>
              <label for="spaceCapacity"> Capacità presente </label>
                <div>
                  <input
                    type="number"
                    name="spaceCapacity"
                    id="spaceCapacity"
                    :placeholder="space.capacity"
                    readonly />
                </div>
            </div>
            <div v-if="space.code == spaceFromQuery" class="listOfInput">
              <label for="spaceName"> Nome del locale </label>
                <div>
                  <input 
                    type="text"
                    name="spaceName"
                    id="spaceName"
                    v-model="spaceName" />
                </div>
              <label for="spaceDescription"> Descrizione </label>
                <div>
                  <textarea
                    id="spaceDescription"
                    name="spaceDescription"
                    rows="3"
                    v-model="spaceDescription" />
                </div>
              <label for="spaceCapacity"> Capacità </label>
                <div>
                  <input
                    type="number"
                    name="spaceCapacity"
                    id="spaceCapacity"
                    v-model="spaceCapacity" />
                </div>
            </div>
          </div>
      </div>
      <div class="buttonsOperation">
        <button
          v-for="item, i in modifieOperations" :key="i" 
          class="modifieAction" :class="item.toLowerCase()"
          @click="modifieOperation(item, spaceName, spaceDescription, spaceCapacity)"
          >{{item}}</button>
      </div>
    </div>
  </div>
</template>
 
<style scoped>
.container {
  height: 100%;
  max-height: 95vh;
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
  max-height: 64vh;
  overflow-y: scroll;
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
