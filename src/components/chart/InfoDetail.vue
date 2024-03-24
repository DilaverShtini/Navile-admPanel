<script lang="ts">
import { ref } from 'vue';
import { Line } from 'vue-chartjs';
import "~/assets/css/visualization.css";
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
    name: 'InfoDetail',
    components: { Line },
    props: {
        dataProp: {
            type: Array,
            required: true,
            validator: (value: any) => value.every((str: any) => typeof str === 'string'),
        },
        activeViewOption: {
            type: String,
            required: false,
        },
    },
    setup: async (props) => {
        const dataName = ref(<any>[]);
        const dataCount = ref(<any>[]);
        const { dataProp } = toRefs(props);
        const dataLoaded = ref(false);
        const charts = ref<{ labels: any[]; datasets: { label: any; data: any; tension: any; pointRadius: any; backgroundColor: any; borderColor: any}[]; }[]>([]);

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

                const result = await response.json()
                const resultValues = ref([''])
                resultValues.value.pop()

                if (result?.length) {
                    const promises: any[] = [];
                    const promise: any[] = [];

                    if(name == 'URL') {
                        // filtro per ottenere tutti gli url relativi all'edificio indicato in activeViewOption
                        const filteredResult = result.filter((el: any) =>
                            JSON.parse(el).data.includes(props.activeViewOption+"-")
                        );

                        filteredResult.forEach(async (el: any) => {
                            resultValues.value.push(JSON.parse(el).data)

                            promises.push(new Promise<void>(async (resolve, _reject) => {
                            const response1 = await fetch(`/api/visualization/detailTimeData`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ type: name, nameField: el, startPoint: 0, endPoint: 0 }),
                            });

                            if (!response1.ok) {
                                throw new Error(`HTTP error! Status: ${response1.status}`);
                            }

                            const timeData = await response1.json();

                            const dataCountTemp: any[] = [];

                            const monthCountMap: { [key: string]: number } = {};
                            const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

                            monthNames.forEach(month => {
                                monthCountMap[month] = 0;
                            });

                            const currentDate = new Date()
                            const currentMonthIndex = currentDate.getMonth()
                            timeData.filter((elem: { month: number; }) => elem.month - 1 <= currentMonthIndex)
                                .forEach((elem: { month: any; count: any; }) => {
                                    const monthIndex = elem.month - 1;
                                    const monthName = monthNames[monthIndex];
                                    monthCountMap[monthName] += elem.count;
                            });

                            Object.values(monthCountMap).forEach(count => {
                                dataCountTemp.push(count);
                            });

                            dataName.value = monthNames.slice(0, currentMonthIndex + 1);
                            dataCount.value.push(dataCountTemp);
                            await Promise.all(promise);
                            resolve();
                            }));
                        })
                    } else {
                        result.forEach(async (el: any) => {
                            if(name == 'Road') {
                                const start = JSON.parse(el.data)
                                const end = JSON.parse(el.data)
                                resultValues.value.push(start[0].start+"-"+end[1].end)

                                promises.push(new Promise<void>(async (resolve, _reject) => {
                                    const response1 = await fetch(`/api/visualization/detailTimeData`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({ type: name, nameField: el, startPoint: start[0].start, endPoint: end[1].end }),
                                    });

                                    if (!response1.ok) {
                                        throw new Error(`HTTP error! Status: ${response1.status}`);
                                    }

                                    const timeData = await response1.json();

                                    const dataCountTemp: any[] = [];

                                    const monthCountMap: { [key: string]: number } = {};
                                    const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
                                    
                                    monthNames.forEach(month => {
                                        monthCountMap[month] = 0;
                                    });

                                    const currentDate = new Date()
                                    const currentMonthIndex = currentDate.getMonth()
                                    timeData.filter((elem: { month: number; }) => elem.month - 1 <= currentMonthIndex)
                                        .forEach((elem: { month: any; count: any; }) => {
                                            const monthIndex = elem.month - 1;
                                            const monthName = monthNames[monthIndex];
                                            monthCountMap[monthName] += elem.count;
                                    });

                                    Object.values(monthCountMap).forEach(count => {
                                        dataCountTemp.push(count);
                                    });

                                    dataName.value = monthNames.slice(0, currentMonthIndex + 1);
                                    dataCount.value.push(dataCountTemp);
                                    await Promise.all(promise);
                                    resolve();
                                }));

                            } else {
                                promises.push(new Promise<void>(async (resolve, _reject) => {
                                const response1 = await fetch(`/api/visualization/detailTimeData`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ type: name, nameField: el, startPoint: 0, endPoint: 0 }),
                                });

                                if (!response1.ok) {
                                    throw new Error(`HTTP error! Status: ${response1.status}`);
                                }

                                const timeData = await response1.json();

                                const dataCountTemp: any[] = [];

                                const monthCountMap: { [key: string]: number } = {};
                                const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

                                monthNames.forEach(month => {
                                    monthCountMap[month] = 0;
                                });

                                const currentDate = new Date()
                                const currentMonthIndex = currentDate.getMonth()
                                timeData.filter((elem: { month: number; }) => elem.month - 1 <= currentMonthIndex)
                                    .forEach((elem: { month: any; count: any; }) => {
                                        const monthIndex = elem.month - 1;
                                        const monthName = monthNames[monthIndex];
                                        monthCountMap[monthName] += elem.count;
                                });

                                Object.values(monthCountMap).forEach(count => {
                                    dataCountTemp.push(count);
                                });

                                dataName.value = monthNames.slice(0, currentMonthIndex + 1);
                                dataCount.value.push(dataCountTemp);
                                await Promise.all(promise);
                                resolve();
                                resultValues.value.push(JSON.parse(el).data)

                                }));
                            }
                        });
                    };

                    const datasets: any[] = [];

                    await Promise.all(promises);

                    resultValues.value.forEach((fieldValue: any, index: number) => {
                        const colors = [
                            'rgba(255, 99, 132, 0.5)',   // Rosso
                            'rgba(54, 162, 235, 0.5)',   // Blu
                            'rgba(255, 205, 86, 0.5)',   // Giallo
                            'rgba(75, 192, 192, 0.5)',   // Verde acqua
                            'rgba(153, 102, 255, 0.5)',  // Viola
                            'rgba(255, 159, 64, 0.5)',   // Arancione
                            'rgba(255, 99, 71, 0.5)',    // Rosso chiaro
                            'rgba(0, 206, 209, 0.5)',    // Ciano
                            'rgba(255, 140, 0, 0.5)',    // Arancione scuro
                            'rgba(65, 105, 225, 0.5)',   // Blu reale
                            'rgba(255, 20, 147, 0.5)',   // Rosa
                            'rgba(50, 205, 50, 0.5)',    // Verde lime
                            'rgba(255, 69, 0, 0.5)',     // Rosso fuoco
                            'rgba(173, 255, 47, 0.5)',   // Verde chartreuse
                            'rgba(255, 182, 193, 0.5)',  // Rosa chiaro
                            'rgba(0, 128, 0, 0.5)',      // Verde scuro
                            'rgba(0, 255, 255, 0.5)',    // Turchese
                            'rgba(240, 230, 140, 0.5)',  // Khaki
                            'rgba(255, 0, 255, 0.5)',    // Magenta
                            'rgba(240, 128, 128, 0.5)'   // Rosa chiaro
                        ];
                        const colorIndex = index % colors.length;
                        const dataset = {
                            label: fieldValue,
                            data: dataCount.value[index],
                            tension: 0.3,
                            pointRadius: 0,
                            backgroundColor: colors[colorIndex],
                            borderColor: colors[colorIndex],
                        };
                        datasets.push(dataset);
                    })

                    const chartData = {
                        labels: dataName.value,
                        datasets: datasets,
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
        <Line v-for="(chartData, index) in charts" :key="index" :options="chartOptions" :data="chartData" class="line"/>
    </div>
    <p v-else>Loading...</p>
</template>
