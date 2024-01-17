<script>
    import BarChart from '../components/chart/BarChart.vue'
    import PolarAreaChart from '../components/chart/PolarAreaChart.vue'

    export default {
        name: 'App',
        components: { BarChart, PolarAreaChart },
        data() {
            return {
                dataBarAnalysis: ['URL', 'Road', 'Sidebar', 'Mappa'],
                dataPolarAreaAnalysis: ['Indietro'],
            };
        },
    }
</script>

<template>
    <BarChart :dataProp="dataBarAnalysis" />
    <PolarAreaChart :dataProp="dataPolarAreaAnalysis"/>
</template>
