<script lang="ts">
    import BarChart from '../components/chart/BarChart.vue'
    import PolarAreaChart from '../components/chart/PolarAreaChart.vue'
    import PieChart from '../components/chart/PieChart.vue'
    import { MainSidebar } from '../utils';
    import "~/assets/css/main.css"

    const { } = await useAsyncData('charts', () => $fetch('/api/visualization/charts')) as {data: any};
    
    export default {
        name: 'App',
        components: { BarChart, PolarAreaChart, PieChart, MainSidebar},
        data() {
            return {
                dataBarAnalysis: ['URL', 'Road'],
                dataPolarAreaAnalysis: ['Indietro'],
                dataPieAnalysis: ['Sidebar | Mappa'],
                chartToDiplay: ref('All'),
            };
        },
        methods: {
            updateView() {
                const { data } = useNuxtData('dataToShow') as { data: any }
                this.chartToDiplay = data.value
            },
        },
    }
</script>

<template>
    <div class="container">
        <div class="menu border">
            <div class="title"> Dati da visualizzare </div>
            <MainSidebar @click="updateView()"/>
        </div>
        <div class="form">
            <div class="form-container">
                <div v-if="chartToDiplay == 'BarChart'">
                    <BarChart :dataProp="dataBarAnalysis" />
                </div>
                <div>
                    <div v-if="chartToDiplay == 'PolarAreaChart'">
                        <PolarAreaChart :dataProp="dataPolarAreaAnalysis"/>
                    </div>
                    <div v-if="chartToDiplay == 'PieChart'">
                        <PieChart :dataProp="dataPieAnalysis"/>
                    </div>
                </div>
            </div>
            <div class="form-container" v-if="chartToDiplay == 'All'">
                <div>
                    <BarChart :dataProp="dataBarAnalysis" />
                </div>
                <div>
                    <div>
                        <PolarAreaChart :dataProp="dataPolarAreaAnalysis"/>
                    </div>
                    <div>
                        <PieChart :dataProp="dataPieAnalysis"/>
                    </div>
                </div>
            </div>
            <div class="form-container" v-if="chartToDiplay == 'URL'">
                <div>
                    <BarChart :dataProp="['URL']" />
                </div>
            </div>
            <div class="form-container" v-if="chartToDiplay == 'Road'">
                <div>
                    <BarChart :dataProp="['Road']" />
                </div>
            </div>
            <div class="form-container" v-if="chartToDiplay == 'Button'">
                <div>
                    <PolarAreaChart :dataProp="['Button']" />
                </div>
            </div>
            <div class="form-container" v-if="chartToDiplay == 'Sidebar'">
                <div>
                    <PieChart :dataProp="['Sidebar | Mappa']" />
                </div>
            </div>
            <div class="form-container" v-if="chartToDiplay == 'Mappa'">
                <div>
                    <PieChart :dataProp="['Sidebar | Mappa']" />
                </div>
            </div>
            
        </div>
    </div>
</template>
