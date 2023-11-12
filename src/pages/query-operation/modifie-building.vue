<script lang="ts" setup>

import { MainInput } from '../../utils';
import { MainVerticalNav } from '../../utils';
import { ref, watch } from 'vue';

const { data } = useNuxtData('buildings') as {data: any};
const router = useRouter();

const selectedBuilding = ref('');
const route = useRoute();
const buildName = ref('');
const buildDescription = ref('');

const operations = ref(['Conferma', 'Annulla']);
let buildingFromQuery = ref(route.query.buildingCode);
let buildingIdFromQuery = ref(route.query.buildingId);

const emits = defineEmits<{
  (e: "change", item: string): void;
  (e: "linkClicked", building: string): void;
}>();

// Funzione per gestire il clic del link
const handleLinkClick = (building: string): void => {
  selectedBuilding.value = building;
  emits('linkClicked', building);
}

const operation = async (item: string, buildName: string, buildDescription: string) => {
  const { data: buildData } = await useFetch('/api/selected-build', {
    method: 'POST',
    body: {
      buildId: buildingIdFromQuery
    },
  })

  const oldBuildName = ref(buildData.value[0]?.name);
  const oldBuildDescription = ref(buildData.value[0]?.description);
  
  if (item === 'Conferma') {
    if (buildName=="") buildName = oldBuildName.value;
    if (buildDescription=="") buildDescription = oldBuildDescription.value;
    
    oldBuildName.value = buildName;
    oldBuildDescription.value = buildDescription;

    await useFetch('/api/update-build', {
      method: 'PUT',
      body: {
        buildingId: buildingIdFromQuery.value,
        buildingCode: buildingFromQuery.value,
        buildingName: buildName,
        buildingDesc: buildDescription,
      },
      onRequest () {
        data.value.push(buildingIdFromQuery.value, buildingFromQuery.value, buildName, buildDescription)
      },
      onResponse: async () => {
        await refreshNuxtData('buildings')
        router.push({ path: '/main-menu/', query: { buildingCode: buildingFromQuery.value } })
      }
    });
  } else {

  }
}

watch(() => route.query.buildingCode, (newBuildingCode) => {
  buildingFromQuery.value = newBuildingCode;
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
                    model="building" />
          <div class="with-bottom-border"></div>
          <div class="verticalNav">
            <div class="building-title"> Edifici </div>
            <MainVerticalNav @linkClicked="handleLinkClick" />
          </div>
      </div>
    </div>
    <div class="form">
      <div class="form-container">
        <div class="title" >Stai modificando: {{ buildingFromQuery }}</div>
          <div v-for="build in data">
            <div v-if="build.code == buildingFromQuery" class="listOfInput">
              <label for="buildingName"> Nome dell'edificio </label>
                <div>
                  <input 
                    type="text"
                    name="buildName"
                    id="buildName"
                    v-model="buildName" />
                </div>
              <label for="buildingDescription"> Descrizione </label>
              <div>
                <textarea
                  id="buildDescription"
                  name="buildDescription"
                  rows="3"
                  v-model="buildDescription" />
              </div>
            </div>
          </div>
      </div>
      <div class="buttonsOperation">
        <button
          v-for="item, i in operations" :key="i" 
          class="action" :class="item.toLowerCase()"
          @click="operation(item, buildName, buildDescription)"
          >{{item}}</button>
      </div>
    </div>
  </div>
</template>
 
<style scoped>

.building-title {
  width: 96%;
  text-align: center;
  padding: 3% 2% 3% 2%;
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

.title {
  text-align: left;
  font-size: 1.5em;
  color: #333;
  margin-bottom: 10px;
  font-weight: bold;
}

.form {
  width: 100%;
  justify-content: flex-start;
  border-left: 1px solid #d5d5d5;
}

.buttonsOperation {
  text-align: end;
  margin-top: auto;
  padding: 10px;
}

.container {
  height: 100%;
  width: 100%;
  display: flex;
  flex: 1;
  border: 1px solid #d5d5d5;
}

.form-container {
  width: 96%;
  margin: 0%;
  justify-content: flex-start;
  background-color: #fff;
  padding: 2% 2% 0% 2%;
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

.action {
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

.tab {
  position: relative;
  display: inline-block;
  padding: 1rem 2rem;
  text-align: center;
  font-weight: bold;
  color: #333;
  letter-spacing: 2px;
  background-color: #fff;
  border: none;
}

.tab::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 2px;
  width: calc(100% - 30px);
  border-radius: 0 0 8px 8px;
  background-color: rgb(255, 37, 37);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tab.active {
  color: rgb(234, 37, 37);
}

.tab.active::after {
  opacity: 1;
}

.verticalNav {
  text-align: center;
}
.with-bottom-border {
  border-bottom: 1px solid #d5d5d5;
}
</style>
