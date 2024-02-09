<script lang="ts">
import { ref } from 'vue';
import { Bar } from 'vue-chartjs';
import "~/assets/css/visualization.css"
import { type ChartOptions } from 'chart.js';
import 'chartjs-plugin-datalabels';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartDataLabels);

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
    const { dataProp } = toRefs(props);
    const dataLoaded = ref(false);
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
          const dataName = ref(<any>[]);
          const dataCount = ref(<any>[]);
          const promises: any[] = [];
          
          if(name === 'URL') {
            result.forEach( async (el: { data: { data: any; };}) => {
              promises.push(new Promise<void>(async (resolve, reject) => {
                dataName.value.push(el);
                const response1 = await fetch(`/api/visualization/countElement`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ type: name, data: el }),
                });

                if (!response1.ok) {
                  throw new Error(`HTTP error! Status: ${response1.status}`);
                }
                const result = await response1.json();

                dataCount.value.push(result);
                resolve();
              }))
            });

          } else if(name == 'Road') {
          
            result.forEach( async(el: { data: any; }) => {
              promises.push(new Promise<void>(async (resolve, reject) => {
                const road = JSON.parse(el.data)
                dataName.value.push(road[0]?.start + "->" + road[1]?.end);
                const response1 = await fetch(`/api/visualization/countRoad`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ type: name, startPoint: road[0]?.start, endPoint: road[1]?.end }),
                });

                if (!response1.ok) {
                  throw new Error(`HTTP error! Status: ${response1.status}`);
                }
                const result = await response1.json();

                dataCount.value.push(result);
                resolve();
              }))
            });

          } else if(name == 'Sidebar') {
          
            result.forEach( async(el: { data: any; counter: any; }) => {
              promises.push(new Promise<void>(async (resolve, reject) => {

                dataName.value.push(el);
                
                const response = await fetch(`/api/visualization/countElement`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ type: name, data: el }),
                });

                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = await response.json();

                dataCount.value.push(result);
                resolve();
              }))
            });
          } else if(name == 'Mappa') {
          
            result.forEach( async(el: { data: any; counter: any; }) => {
              promises.push(new Promise<void>(async (resolve, reject) => {

                dataName.value.push(el);
                const response = await fetch(`/api/visualization/countElement`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ type: name, data: el }),
                });

                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = await response.json();

                dataCount.value.push(result);
                resolve();
              }))
            });
        }

        await Promise.all(promises);

        dataCount.value.sort((number1: number, number2: number) => number2 - number1);

        const chartData = {
          labels: dataName.value,
          datasets: [
            {
              label: name,
              data: dataCount.value,
              barThickness: 25,
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

    return ({
      dataLoaded,
      charts,
      chartOptions: {
        responsive: true,
        plugins: {
          datalabels: {
            color: 'white',
            font: {
              weight: 'bold',
              size: 17,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              font: {
                weight: 'bold',
                size: 17,
              },
            },
          },
          y: {
            ticks: {
              font: {
                weight: 'bold',
                size: 15,
              },
            },
          },
        },
      } as ChartOptions<'bar'>,
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
