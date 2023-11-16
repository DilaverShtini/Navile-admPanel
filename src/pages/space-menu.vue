<script lang="ts" setup>
//TODO modificare il calcolo dell'altezza della classe .links dopo la ricerca nel MainInput

import { MainInput } from '~/utils';
import { SpaceVerticalNav} from '~/utils';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const operations = ref(['Aggiungi', 'Elimina']);

const route = useRoute();

const buildingFromQuery = route.query.buildingCode
const floorFromQuery = route.query.floorNumber
const floorIdFromQuery = route.query.floorId

// Stato per il titolo del link selezionato
const selectedSpace = ref('');

const router = useRouter();

const { data } = await useAsyncData('spaces', () => $fetch(`/api/space?floorIdNumber=${floorIdFromQuery}`)) as {data: any};

const operation = (item: string) => {
  if (item === 'Aggiungi') {
    router.push({ path: '/query-operation/add-space/', query: { spaceCode: selectedSpace.value, buildingCode: buildingFromQuery, floorNumber: floorFromQuery, floorId: floorIdFromQuery } });
  } else {
    router.push({ path: '/query-operation/delete-space/', query: { spaceCode: selectedSpace.value, buildingCode: buildingFromQuery, floorNumber: floorFromQuery, floorId: floorIdFromQuery } });
  }
}

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
                      :buildCode="String(buildingFromQuery)"/>
            <div class="with-bottom-border"></div>
            <div class="verticalNav">
              <div class="buildingSelected"> Edificio: {{ buildingFromQuery }} </div>
              <div class="floorSelected"> Piano: {{ floorFromQuery }} </div>
              <div class="title"> Locali </div>
              <div class="links">
                <SpaceVerticalNav :buildingCode="buildingFromQuery" :floorNumber="floorFromQuery" :floorId="floorIdFromQuery" all="true"/>
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
          <div class="title-list" >Dati realtivi ai locali presenti nel piano {{ floorFromQuery }}: </div>
            <div v-for="space in data">
              <div class="listOfInput">
                <label for="spaceCode"> Codice: {{ space.code }} </label>
                <label for="spaceName"> Nome: {{ space.name }} </label>
                <label for="spaceDescription"> Descrizione: {{space.description}} </label>
                <label for="spaceCapacity"> Capacità: {{space.capacity}} </label>
              </div>
            </div>
            <div v-if="data.length==0" class="noLinks">Nessun locale disponibile</div>
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
  height: 100%;
}

.box {
  border-right: 1px solid #d5d5d5;
  overflow-y: hidden;
  width: 20em;
  height: 100%;
}

.with-bottom-border {
  border-bottom: 1px solid #d5d5d5;
}

.verticalNav {
  height: 100%;
  text-align: center;
}

.buildingSelected, .floorSelected {
  width: auto;
  text-align: left;
  padding: 5% 0% 5% 5%;
  border-bottom: 1px solid #d5d5d5;
}

.title {
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

.action:hover {
  background-color: #ed5959;
}

.aggiungi {
  margin-right: 10px;
}

.elimina {
  margin-left: 10px;
}

.form {
  overflow-y: scroll;
  width: 100%;
  justify-content: flex-start;
}

.form-container {
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  padding: 20px;
  border-left: 1px solid #d5d5d5;
}

.title-list {
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

.noLinks {
  color: #777;
  margin-top: 1em;
}
</style>
