<script>
    import BarChart from '../components/chart/BarChart.vue'
    import PolarAreaChart from '../components/chart/PolarAreaChart.vue'
    import PieChart from '../components/chart/PieChart.vue'

    export default {
        name: 'App',
        components: { BarChart, PolarAreaChart, PieChart },
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
    <BarChart :dataProp="dataBarAnalysis" />
    <PolarAreaChart :dataProp="dataPolarAreaAnalysis"/>
    <PieChart :dataProp="dataPieAnalysis"/>
</template>
