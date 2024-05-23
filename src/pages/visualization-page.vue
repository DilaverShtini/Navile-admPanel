<script lang="ts">
    import BarChart from '../components/chart/BarChart.vue'
    import PolarAreaChart from '../components/chart/PolarAreaChart.vue'
    import PieChart from '../components/chart/PieChart.vue'
    import LineChart from '../components/chart/LineChart.vue'
    import InfoDetail from '../components/chart/InfoDetail.vue'
    import { MainSidebar } from '../utils';
    import "~/assets/css/main.css"

    const { } = await useAsyncData('charts', () => $fetch('/api/visualization/charts')) as {data: any};

    export default {
        name: 'App',
        components: { BarChart, PolarAreaChart, PieChart, LineChart, MainSidebar, InfoDetail},
        data() {
            return {
                dataBarAnalysis: ['URL', 'Road'],
                dataPolarAreaAnalysis: ['Indietro'],
                dataPieAnalysis: ['Sidebar | Mappa'],
                dataLineAnalysis: ['Storico'],
                chartToDiplay: ref('All'),
                options: ref(['Edificio 4', 'Edificio 5']),
                activeViewOption: ref('Edificio 4'),
            };
        },
        methods: {
            updateView() {
                const { data } = useNuxtData('dataToShow') as { data: any }
                this.chartToDiplay = data.value
            },
            changeTab(item: string) {
                this.activeViewOption = item;
            },

        },
    }
</script>

<template>
    <div class="container">
        <div class="menu border">
            <MainSidebar @click="updateView()"/>
        </div>
        <div class="form">

            <div class="form-container" v-if="chartToDiplay == 'All'">
                <div>
                    <BarChart :dataProp="dataBarAnalysis" :activeViewOption="activeViewOption" :key="activeViewOption" :chartToDisplay="chartToDiplay"/>
                </div>
                <div>
                    <div>
                        <PolarAreaChart :dataProp="dataPolarAreaAnalysis"/>
                    </div>
                    <div>
                        <PieChart :dataProp="dataPieAnalysis"/>
                    </div>
                    <div>
                        <LineChart :dataProp="dataLineAnalysis"/>
                    </div>
                </div>
            </div>

            <div class="form-container" v-if="chartToDiplay == 'URL'">
                <div class="deleteOption">
                    <button 
                        v-for="item, i in options" :key="i" 
                        class="tab" :class="{ active: item === activeViewOption }"
                        @click="changeTab(item)"
                        >{{item}}</button>
                </div>
                <div>
                    <BarChart :dataProp="['URL']" :activeViewOption="activeViewOption" :key="activeViewOption" :chartToDisplay="chartToDiplay"/>
                </div>
                <div>
                    <InfoDetail :dataProp="['URL']" :activeViewOption="activeViewOption" :key="activeViewOption"/> 
                </div>
            </div>
            <div class="form-container" v-if="chartToDiplay == 'Road'">
                <div>
                    <BarChart :dataProp="['Road']" :activeViewOption="activeViewOption" :key="activeViewOption" :chartToDisplay="chartToDiplay"/>
                </div>
                <div>
                    <InfoDetail :dataProp="['Road']" /> 
                </div>
            </div>
            <div class="form-container" v-if="chartToDiplay == 'Button'">
                <div>
                    <PolarAreaChart :dataProp="['Button']" />
                </div>
                <div>
                    <InfoDetail :dataProp="['Button']" /> 
                </div>
            </div>
            <div class="form-container" v-if="chartToDiplay == 'Sidebar'">
                <div>
                    <PieChart :dataProp="['Sidebar | Mappa']" />
                </div>
                <div>
                    <InfoDetail :dataProp="['Sidebar']" /> 
                </div>
            </div>
            <div class="form-container" v-if="chartToDiplay == 'Mappa'">
                <div>
                    <PieChart :dataProp="['Sidebar | Mappa']" />
                </div>
                <div>
                    <InfoDetail :dataProp="['Mappa']" /> 
                </div>
            </div>
            
        </div>
    </div>
</template>
