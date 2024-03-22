<script lang="ts">
import BarChart from './BarChart.vue'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'
import "~/assets/css/visualization.css"
import 'chartjs-plugin-datalabels';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)

export default {
  name: 'PieChart',
  components: { Pie, BarChart },
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
    const dataLoaded = ref(false);
    const showSecondChart = ref(false);
    const chartOptions = { responsive: true };
    const charts = ref<{ labels: any[]; datasets: { label: any; data: any; barThickness: number; backgroundColor: string[];}[] }[]>([]);

    const fetchData = async (name: string) => {
      try {
        const responseSideBar = await fetch(`/api/visualization/countSideBarMap`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ type: 'Sidebar' }),
        });

        if (!responseSideBar.ok) {
          throw new Error(`HTTP error! Status: ${responseSideBar.status}`);
        }

        const resultSideBar = await responseSideBar.json();

        const responseMappa = await fetch(`/api/visualization/countSideBarMap`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ type: 'Mappa' }),
        });

        if (!responseMappa.ok) {
          throw new Error(`HTTP error! Status: ${responseMappa.status}`);
        }

        const resultMappa = await responseMappa.json();

        if (Number(resultSideBar) > 0 || Number(resultMappa) > 0) {

            const chartData = {
                labels: ['Sidebar', 'Mappa'],
                datasets: [
                {
                    label: name,
                    data: [resultSideBar, resultMappa],
                    barThickness: 15,
                    backgroundColor: [
                        'rgba(255, 165, 0.8)',
                        'rgba(175, 238, 238)',
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

    fetchData(String(props.dataProp));

    // Verifico se la lunghezza dei due vettori è uguale (deve esserci corrispondenza, altrimenti non stampo nessun grafico)    
    if (dataName.value.length !== dataCount.value.length) {
      console.error('Error: dataName and dataCount have different lengths.');
      return {
        dataLoaded,
        chartData: { labels: [], datasets: [] },
        chartOptions: { responsive: true },
      };
    }

    const handleChartClick = () => {
        showSecondChart.value = !showSecondChart.value;
    };

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
              size: 30,
            },
          },
        },
      },
      showSecondChart,
      handleChartClick,
    });

  },
  
  options: {
    responsive: true,
    maintainAspectRatio: true,
    onClick: function(evt: any) {
        console.log(evt);
    }

  },
};

</script>

<template>
    <div v-if="dataLoaded" class="visualization">
      <Pie v-for="(chartData, index) in charts" :key="index" :options="chartOptions" :data="chartData" class="pie" :onClick="handleChartClick" />
    </div>
    <p v-else>Loading...</p>
    <div v-if="showSecondChart">
        <BarChart :dataProp="['Sidebar', 'Mappa']" />
    </div>
  </template>
