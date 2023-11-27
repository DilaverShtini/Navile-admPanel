<script lang="ts" setup>

import { MainInput } from '~/utils';
import { FloorVerticalNav } from '~/utils';
import { useRoute } from 'vue-router';
import "~/assets/css/main.css"

const route = useRoute();

const buildingFromQuery = route.query.buildingCode
const buildingIdFromQuery = String(route.query.buildingId)

</script>
  
<template>
  <div class="container">
    <div class="menu border p-4">
      <div class="box">
        <MainInput type="text"
                    placeholder="Search"
                    id="openFloor"
                    class="mb-4"
                    model="floor"
                    :build="buildingIdFromQuery"
                    :buildCode="String(buildingFromQuery)" />
          <div class="with-bottom-border"></div>
          <div class="verticalNav">
            <div class="buildingSelected"> Edificio: {{ buildingFromQuery }} </div>
            <div class="title"> Piano </div>
            <FloorVerticalNav :buildingCode="buildingFromQuery"/>
          </div>
      </div>
    </div>
    <div></div>
    <div></div>
  </div>
</template>
