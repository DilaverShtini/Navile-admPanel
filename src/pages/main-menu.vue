<script lang="ts" setup>

import { MainInput } from "../utils";
import { MainVerticalNav } from '../utils';

const { data } = await useAsyncData('buildings', () => $fetch('/api/building')) as {data: any};

</script>

<template>
  <div class="container">
    <div class="menu border p-4">
      <div class="box">
        <MainInput type="text"
                    placeholder="Search"
                    id="openBuilding"
                    class="mb-4" 
                    model="building"/>
          <div class="with-bottom-border"></div>
          <div class="verticalNav">
            <div class="title"> Edifici </div>
            <MainVerticalNav />
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
.container {
  max-height: 47em;
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
  width: 20em;
}

.with-bottom-border {
  border-bottom: 1px solid #d5d5d5;
}

.verticalNav {
  text-align: center;
}

.title {
  width: 96%;
  text-align: center;
  padding: 3% 2% 3% 2%;
  font-weight: bold;
}

.form {
  width: 100%;
  justify-content: flex-start;
}

.form-container {
  max-height: 92vh;
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
</style>
