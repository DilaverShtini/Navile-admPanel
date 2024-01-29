<script lang="ts">
import { ref } from 'vue';
import { PolarArea } from 'vue-chartjs';
import "~/assets/css/visualization.css"
import 'chartjs-plugin-datalabels';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend, ChartDataLabels)

export default {
    name: 'PolarAreaChart',
    components: { PolarArea },
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
        const charts = ref<{ labels: any[]; datasets: { label: any; data: any; backgroundColor: string[];}[]; }[]>([]);

        const fetchData = async (name: string) => {
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
                    const promises: any[] = [];

                    result.forEach( async(el: { data: { data: any; }; }) => {
                        promises.push(new Promise<void>(async (resolve, reject) => {
                            dataName.value.push(el);
                            const response1 = await fetch(`/api/visualization/countPolarAreaData`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ data: el }),
                            });

                            if (!response1.ok) {
                            throw new Error(`HTTP error! Status: ${response1.status}`);
                            }
                            const result = await response1.json();

                            dataCount.value.push(result);
                            resolve();
                        }))
                    });

                    await Promise.all(promises);

                    const chartData = {
                        labels: dataName.value,
                        datasets: [
                            {
                                label: name,
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
                        color: 'black',
                        font: {
                        weight: 'bold',
                        size: 17,
                        },
                    },
                },
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
