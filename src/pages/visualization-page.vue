<script lang="ts">
    import BarChart from '../components/chart/BarChart.vue'
    import PolarAreaChart from '../components/chart/PolarAreaChart.vue'
    import PieChart from '../components/chart/PieChart.vue'
    import { MainSidebar } from '../utils';
    import "~/assets/css/main.css"

    const { data } = await useAsyncData('charts', () => $fetch('/api/visualization/charts')) as {data: any};

    export default {
        name: 'App',
        components: { BarChart, PolarAreaChart, PieChart, MainSidebar},
        data() {
            return {
                dataBarAnalysis: ['URL', 'Road'],
                dataPolarAreaAnalysis: ['Indietro'],
                dataPieAnalysis: ['Sidebar | Mappa'],
            };
        },
    }
</script>

<template>
    <div class="container">
        <div class="menu border">
            <div class="title"> Dati da visualizzare </div>
            <MainSidebar />
        </div>
        <div class="form">
            <div class="form-container">
                <BarChart :dataProp="dataBarAnalysis" />
                <div>
                    <div>
                        <PolarAreaChart :dataProp="dataPolarAreaAnalysis"/>
                    </div>
                    <div>
                        <PieChart :dataProp="dataPieAnalysis"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
