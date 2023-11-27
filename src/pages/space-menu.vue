<script lang="ts" setup>

import { MainInput } from '~/utils';
import { SpaceVerticalNav} from '~/utils';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import "~/assets/css/main.css"

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
          <div class="titlePage" >Dati realtivi ai locali presenti nel piano {{ floorFromQuery }}: </div>
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
