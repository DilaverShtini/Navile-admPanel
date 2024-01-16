<script lang="ts">
import { ref } from 'vue';
import { PolarArea } from 'vue-chartjs';
import "~/assets/css/visualization.css"
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend)

export default {
    name: 'PolarAreaChart',
    components: {PolarArea},
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
        const charts = ref<{ labels: any[]; datasets: { label: any; data: any; backgroundColor: string[];}[]; }[]>([]);

        const fetchData = async () => {
            try {
                const response = await fetch(`/api/visualization/data`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ type: 'Button' }),
                });

                if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();

                if (result?.length) {
                    result.forEach((el: { data: { data: any; }; counter: any; }) => {
                        dataName.value.push(el.data.data);
                        dataCount.value.push(el.counter);
                    });
                    dataLoaded.value = true;
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const fetchDataPromise = new Promise<void>(async (resolve) => {
            await fetchData();
            resolve();
        });

        await fetchDataPromise;

        // Verifico se la lunghezza dei due vettori è uguale (deve esserci corrispondenza, altrimenti non stampo nessun grafico)    
        if (dataName.value.length !== dataCount.value.length) {
            console.error('Error: dataName and dataCount have different lengths.');
            return {
                dataLoaded,
                chartData: { labels: [], datasets: [] },
                chartOptions: { responsive: true },
            };
        }

        // Creazione di coppie etichette-dati
        dataProp.value.forEach((prop: any) => {
            const chartData = {
                labels: dataName.value,
                datasets: [
                    {
                        label: prop,
                        data: dataCount.value,
                        backgroundColor: [
                            'rgba(0, 255, 255, 0.5)',
                            'rgba(255, 255, 0, 0.5)',
                            'rgba(0, 255, 0, 0.5)',
                            'rgba(255, 0, 0, 0.5)',
                            'rgba(0, 0, 255, 0.5)',
                            'rgba(100, 100, 100, 0.5)'
                        ],
                    },
                ],
            };
            charts.value.push(chartData);
        });

        return ({
            dataLoaded,
            charts,
            chartOptions: {
                responsive: true,
            },
        })
    },
};

</script>

<template>
    <div v-if="dataLoaded" class="visualization">
        <PolarArea v-for="(chartData, index) in charts" :key="index" :options="chartOptions" :data="chartData" class="polarArea"/>
    </div>
    <p v-else>Loading...</p>
</template>
