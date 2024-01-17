<script lang="ts">
import { ref } from 'vue';
import { Bar } from 'vue-chartjs';
import "~/assets/css/visualization.css"
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  name: 'BarChart',
  components: { Bar },
  props: {
    dataProp: {
      type: Array,
      required: true,
      validator: (value: any) => value.every((str: any) => typeof str === 'string'),
    },
  },
  setup: async (props) => {
    const dataName = ref(<any>[]);
    const dataCount = ref(<any>[]);
    const { dataProp } = toRefs(props);
    const dataLoaded = ref(false);
    const chartOptions = { responsive: true };
    const charts = ref<{ labels: any[]; datasets: { label: any; data: any; barThickness: number; backgroundColor: string[];}[] }[]>([]);
 
    const fetchData = async (name: string) => {
      
      try {
        const response = await fetch(`/api/visualization/data`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ type: name }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        if (result?.length) {
          const dataName = ref(<any>[]);;
          const dataCount = ref(<any>[]);;

          if(name === 'URL') {
            result.forEach((el: { data: { data: any; }; counter: any; }) => {
              dataName.value.push(el.data.data);
              dataCount.value.push(el.counter);
            });
          
          } else if(name == 'Road') {
          
            result.forEach((el: { data: any; counter: any; }) => {
              dataName.value.push(el.data[0]?.start + "->" + el.data[1]?.end);
              dataCount.value.push(el.counter);
            });
          } else if(name == 'Sidebar') {
          
            result.forEach((el: { data: any; counter: any; }) => {
              dataName.value.push(el.data.data);
              dataCount.value.push(el.counter);
            });
          } else if(name == 'Mappa') {
          
            result.forEach((el: { data: any; counter: any; }) => {
              dataName.value.push(el.data.data);
              dataCount.value.push(el.counter);
            });
        }

          const chartData = {
            labels: dataName,
            datasets: [
              {
                label: name,
                data: dataCount,
                barThickness: 15,
                backgroundColor: [
                  'rgba(0, 0, 0, 1)',
                ],
              },
            ],
          };

          charts.value.push(chartData);
        }
          dataLoaded.value = true;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    await Promise.all(dataProp.value.map((name: any) => fetchData(name)));

    // Verifico se la lunghezza dei due vettori è uguale (deve esserci corrispondenza, altrimenti non stampo nessun grafico)    
    if (dataName.value.length !== dataCount.value.length) {
      console.error('Error: dataName and dataCount have different lengths.');
      return {
        dataLoaded,
        chartData: { labels: [], datasets: [] },
        chartOptions: { responsive: true },
      };
    }

    return ({
      dataLoaded,
      charts,
      chartOptions: {
        responsive: true,
      },
    });
  },
};

</script>

<template>
  <div v-if="dataLoaded" class="visualization">
    <Bar v-for="(chartData, index) in charts" :key="index" :options="chartOptions" :data="chartData" class="bar"/>
  </div>
  <p v-else>Loading...</p>
</template>
