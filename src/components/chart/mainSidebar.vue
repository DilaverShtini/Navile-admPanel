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
    GRAFICI
    <ul class="listOfChart">
      <li v-for="link in charts" @click="showData(link)" class="listChart">
        <div class="row">
          <div class="chartName">
              {{ link }}
          </div>
        </div>
      </li>
    </ul>
    DATI
    <ul class="listOfData">
      <li v-for="link in data" @click="showData(link.type)" :key="link.id" :title="link.type" class="listData">
        <div class="row">
          <div class="dataName">
            {{ link.type }}
          </div>
        </div>
      </li>
    </ul>
    TUTTI
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