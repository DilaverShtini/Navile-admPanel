<script lang="ts" setup>
import { MainInput } from "../utils";
import { MainVerticalNav } from '../utils';
import { ref } from 'vue';

// Stato per il titolo del link selezionato
const selectedBuilding = ref('');
const { data } = await useAsyncData('buildings', () => $fetch('/api/building')) as {data: any};

const emits = defineEmits<{
  (e: "change", item: string): void;
  (e: "linkClicked", building: string): void;
}>();

// Funzione per gestire il clic del link
const handleLinkClick = (building: string): void => {
  selectedBuilding.value = building;
  emits('linkClicked', building);

}
</script>

<template>
  <div class="container">
    <div class="menu border p-4">
      <div class="box">
        <MainInput type="text"
                    placeholder="Search"
                    id="openBuilding"
                    class="mb-4" />
          <div class="with-bottom-border"></div>
          <div class="verticalNav">
            <div class="title"> Edifici </div>
            <MainVerticalNav @linkClicked="handleLinkClick" />
          </div>
      </div>
    </div>
    <div class="form">
      <div class="form-container">
        <div class="title-list" >Dati realtivi agli edifici: </div>
          <div v-for="build in data">
            <div class="listOfInput">
              <label for="buildingCode"> Codice: {{ build.code }} </label>
              <label for="buildingName"> Nome: {{ build.name }} </label>
              <label for="buildingDescription"> Descrizione: {{build.description}} </label>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>
 
<style scoped>

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

.title-list {
  text-align: left;
  font-size: 1.5em;
  color: #333;
  margin-bottom: 10px;
  font-weight: bold;
}

.form {
  width: 100%;
  justify-content: flex-start;
}

.form-container {
  width: 96%;
  margin: 0%;
  justify-content: flex-start;
  background-color: #fff;
  padding: 2% 2% 0% 2%;
}

.title {
  width: 96%;
  text-align: center;
  padding: 3% 2% 3% 2%;
  font-weight: bold;
}

.container {
  max-height: 100%;
  display: flex;
  justify-content: left;
  flex: 1;
  border: 1px solid #d5d5d5;
}

.form-container {
  /*min-height: 50vh;*/
  max-height: 92vh;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  padding: 20px;
  border-left: 1px solid #d5d5d5;
}

.menu {
  text-align: center;
  width: 20em;
  height: max-content;
}

.box {
  border-right: 1px solid #d5d5d5;
  overflow-y: hidden;
  width: 20em;
}

.action {
  width: 40%;
  position: relative;
  display: inline-block;
  margin-bottom: 3%;
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
