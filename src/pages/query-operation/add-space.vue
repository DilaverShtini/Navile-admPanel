<script lang="ts" setup>

import { MainInput } from '../../utils';
import { SpaceVerticalNav } from '../../utils';
import { ref, watch } from 'vue';

const selectedSpace = ref('');
const spaceName = ref('');
const spaceDescription = ref('');
const spaceCapacity = ref('');
const route = useRoute();
const router = useRouter();

const buildingFromQuery = route.query.buildingCode
const floorFromQuery = route.query.floorNumber
const floorIdFromQuery = route.query.floorId

const operations = ref(['Aggiungi', 'Elimina']);
const modifieOperations = ref(['Conferma', 'Annulla']);
let spaceFromQuery = ref(route.query.spaceCode);

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
  isFormDirty.value = true
}

const operation = (item: string) => {
  if (item === 'Aggiungi') {
    router.push({ path: '/query-operation/add-space/', query: { spaceCode: selectedSpace.value, buildingCode: buildingFromQuery, floorNumber: floorFromQuery, floorId: floorIdFromQuery } });
  } else {
    router.push({ path: '/query-operation/delete-space/', query: { spaceCode: selectedSpace.value, buildingCode: buildingFromQuery, floorNumber: floorFromQuery, floorId: floorIdFromQuery } });
  }
}

const createOperation = async (item: string, newSpaceName: string, newSpaceDescription:string, newSpaceCapacity: string) => {
  isFormDirty.value = false;
  try {
    if (item === 'Conferma') {
      if (newSpaceCapacity.length == 0) newSpaceCapacity = '0';
      await useFetch('/api/create-space', {
        method: 'PUT',
        body: {
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
        <div class="title" >Stai aggiungendo un nuovo locale al piano: {{ floorFromQuery }}</div>
          <div>
            <div class="listOfInput">
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
          v-for="item, i in modifieOperations" :key="i" 
          class="createAction" :class="item.toLowerCase()"
          @click="createOperation(item, spaceName, spaceDescription, spaceCapacity)"
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
  max-height: calc(30em - var(--input-height, 0px));
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

.action:hover, .createAction:hover {
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

.createAction {
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
