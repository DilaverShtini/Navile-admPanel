<script lang="ts" setup>

import "~/assets/css/component.css"

const { data } = useNuxtData('charts') as {data: any};
const charts = ['BarChart', 'PolarAreaChart', 'PieChart', 'LineChart'];

const showData = async (dataName: any) => {
  const { } = await useAsyncData('dataToShow', () => dataName) as {data: any};

}

</script>

<template>
  <nav class="bg-gray-800 text-white">
    <div class="titolo">
      DATI
    </div>
    <ul class="listOfData">
      <li v-for="link in data" @click="showData(link.type)" :key="link.id" :title="link.type" class="listData">
        <div class="row">
          <div class="dataName">
            {{ link.type }}
          </div>
        </div>
      </li>
    </ul>
    <div class="titolo">
      TUTTI
    </div>
    <ul class="listOfData">
      <li @click="showData('All')" class="listData">
        <div class="row">
          <div class="dataName">
            Visualizza tutti i dati
          </div>
        </div>
      </li>
    </ul>
  </nav>
</template>
