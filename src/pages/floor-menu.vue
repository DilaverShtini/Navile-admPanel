<script lang="ts" setup>

import { MainInput } from '~/utils';
import { FloorVerticalNav } from '~/utils';
import { defineEmits } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const buildingFromQuery = route.query.buildingCode
const buildingIdFromQuery = String(route.query.buildingId)

const emits = defineEmits();

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
                    :build="buildingIdFromQuery"/>
          <div class="with-bottom-border"></div>
          <div class="verticalNav">
            <FloorVerticalNav :buildingCode="buildingFromQuery"/>
          </div>
      </div>
    </div>
    <div></div>
    <div></div>
  </div>
</template>


<style scoped>
.container {
  height: 100%;
  margin-bottom: 5%;
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

.verticalNav {
  text-align: center;
}

.with-bottom-border {
  border-bottom: 1px solid #d5d5d5;
}

</style>
  