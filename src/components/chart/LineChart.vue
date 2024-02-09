<script lang="ts">
import { ref } from 'vue';
import { Line } from 'vue-chartjs';
import { type ChartOptions } from 'chart.js';
import "~/assets/css/visualization.css"
import 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)


export default {
    name: 'LineChart',
    components: { Line },
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
        const charts = ref<{ labels: any[]; datasets: { label: any; data: any; backgroundColor: string[];}[]; }[]>([]);

        const fetchData = async () => {
            try {
                const response = await fetch(`/api/visualization/allData`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();

                if (result) {
                    const dataName = ref(<any>[]);
                    const dataCount = ref(<any>[]);

                    const promises = result.map(async (el: any) => {
                        const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
                        const monthIndex = el.month - 1;
                        const monthName = monthNames[monthIndex];
                        dataName.value.push(monthName);
                        dataCount.value.push(el?.count);
                    });

                    await Promise.all(promises);

                    const chartData = {
                        labels: dataName.value,
                        datasets: [
                            {
                                label: 'Storico',
                                data: dataCount.value,
                                tension: 0.3,
                                pointRadius: 0,
                                backgroundColor: [
                                    'rgb(100, 255, 100)'
                                ],
                                borderColor: "#6cd996",
                            },
                        ],
                        options: {
                            interaction: {
                                intersect: false,
                            },
                        },
                    };

                    charts.value.push(chartData);
                }
                dataLoaded.value = true;

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        await Promise.all(dataProp.value.map(() => fetchData()));

        return ({
            dataLoaded,
            charts,
            chartOptions: {
                responsive: true,
                plugins: {
                    datalabels: {
                        color: 'black',
                        font: {
                            weight: 'bold',
                            size: 17,
                        },
                    },
                },
            } as ChartOptions<'line'>,
        })
    },
};

</script>

<template>
    <div v-if="dataLoaded" class="visualization">
        <Line v-for="(chartData, index) in charts" :key="index" :options="chartOptions" :data="chartData" class="line"/>
    </div>
    <p v-else>Loading...</p>
</template>
