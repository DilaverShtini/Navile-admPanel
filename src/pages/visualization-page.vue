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
                isSidebarVisible: ref(false),
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
            toggleSidebar() {
                this.isSidebarVisible = !this.isSidebarVisible
            }

        },
    }
</script>

<template>
    <div class="container">
        <button class="menu-button" @click="toggleSidebar">Menu</button>

        <div :class="['menu', { show: isSidebarVisible }]" @click="toggleSidebar">
            <MainSidebar @click="updateView()" />
        </div>
        <div class="form">

            <div class="form-container" v-if="chartToDiplay == 'All'">
                <div>
                    <BarChart :dataProp="dataBarAnalysis" :activeViewOption="activeViewOption" :key="activeViewOption" :chartToDisplay="chartToDiplay"/>
                </div>
                <div>
                    <div class="chart-description">
                        Il seguente grafico rappresenta il confronto tra i vari bottoni presenti nei chioschi del complesso Navile di Bologna.
                    </div>
                    <div>
                        <PolarAreaChart :dataProp="dataPolarAreaAnalysis"/>
                    </div>
                    <div class="chart-description">
                        Il seguente grafico mette a confronto il numero di interazioni avute con la Mappa e con la Sidebar nei chioschi del complesso Navile di Bologna.
                    </div>
                    <div>
                        <PieChart :dataProp="dataPieAnalysis"/>
                    </div>
                    <div class="chart-description">
                        Il seguente grafico rappresenta tutte le interazioni avute nei chioschi del complesso Navile di Bologna nei diversi mesi dell'anno.
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
                    <div class="chart-description">
                        Il seguente grafico rappresenta, in maniera decrescente, il numero di URL visitati, e le loro occorrenze, nei chioschi del complesso Navile di Bologna.
                    </div>
                    <BarChart :dataProp="['URL']" :activeViewOption="activeViewOption" :key="activeViewOption" :chartToDisplay="chartToDiplay"/>
                </div>
                <div>
                    <div class="chart-description">
                    Il seguente grafico mette a confronto il numero di URL visitati nei chioschi nei diversi mesi dell'anno.
                    </div>
                    <InfoDetail :dataProp="['URL']" :activeViewOption="activeViewOption" :key="activeViewOption"/> 
                </div>
            </div>
            <div class="form-container" v-if="chartToDiplay == 'Road'">
                <div>
                    <div class="chart-description">
                    Il seguente grafico rappresenta, in maniera decrescente, il numero di indicazioni cercate, e le loro occorrenze, nei chioschi del complesso Navile di Bologna.
                     </div>
                    <BarChart :dataProp="['Road']" :activeViewOption="activeViewOption" :key="activeViewOption" :chartToDisplay="chartToDiplay"/>
                </div>
                <div>
                    <div class="chart-description">
                    Il seguente grafico mette a confronto il numero delle indicazioni cercate nei chioschi presenti nel complesso Navile di Bologna nei diversi mesi dell'anno.
                    </div>
                    <InfoDetail :dataProp="['Road']" /> 
                </div>
            </div>
            <div class="form-container" v-if="chartToDiplay == 'Button'">
                <div>
                    <div class="chart-description">
                        Il seguente grafico rappresenta il confronto tra i vari bottoni presenti nei chioschi del complesso Navile di Bologna.
                    </div>
                        <PolarAreaChart :dataProp="['Button']" />
                </div>
                <div>
                    <div class="chart-description">
                        Il seguente grafico mette a confronto il numero di interazioni avute con i diversi bottoni presenti dei chioschi presenti nel complesso Navile di Bologna nei diversi mesi dell'anno.
                    </div>
                        <InfoDetail :dataProp="['Button']" /> 
                </div>
            </div>
            <div class="form-container" v-if="chartToDiplay == 'Sidebar'">
                <div>
                    <div class="chart-description">
                        Il seguente grafico mette a confronto il numero di interazioni avute con la Mappa e con la Sidebar nei chioschi del complesso Navile di Bologna.
                    </div>
                        <PieChart :dataProp="['Sidebar | Mappa']" />
                </div>
                <div>
                    <div class="chart-description">
                        Il seguente grafico mette a confronto il numero interazioni avute con il menù laterale nei chioschi presenti nel complesso Navile di Bologna nei diversi mesi dell'anno.
                   </div>    
                    <InfoDetail :dataProp="['Sidebar']" /> 
                </div>
            </div>
            <div class="form-container" v-if="chartToDiplay == 'Mappa'">
                <div>
                    <div class="chart-description">
                        Il seguente grafico mette a confronto il numero di interazioni avute con la Mappa e con la Sidebar nei chioschi del complesso Navile di Bologna.
                    </div>
                    <PieChart :dataProp="['Sidebar | Mappa']" />
                </div>
                <div>
                    <div class="chart-description">
                        Il seguente grafico mette a confronto le interazioni avute con la mappa chioschi presenti nel complesso Navile di Bologna nei diversi mesi dell'anno.
                    </div>
                        <InfoDetail :dataProp="['Mappa']" /> 
                </div>
            </div>
            
        </div>
    </div>
</template>
