<script lang="ts" setup>

import { MainInput } from "../utils";
import { MainVerticalNav } from '../utils';
import "~/assets/css/main.css"

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
        <div class="titlePage" >Dati realtivi agli edifici: </div>
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
