<!-- VerticalNav.vue -->
<template>
  <div class="verticalNav">
    <nav class="bg-gray-800 text-white">
      <ul class="listOfModel">
        <div class="allModel">All Model</div>
        <li v-for="link in links" :key="link.id" :title="link.model" class="listModel">
          <router-link @click="handleLinkClick(link.model)" :to="link.to" class="linkModel">
            <div>{{ link.text }}</div>
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const links = [
  { id: 1, to: '/operation-menu', text: 'Building', model: 'Building' },
  { id: 2, to: '/operation-menu', text: 'Floor', model: 'Floor' },
  { id: 3, to: '/operation-menu', text: 'Indication', model: 'Indication' },
  { id: 4, to: '/operation-menu', text: 'Legend', model: 'Legend' },
  { id: 5, to: '/operation-menu', text: 'Route', model: 'Route' },
  { id: 6, to: '/operation-menu', text: 'Sensor', model: 'Sensor' },
  { id: 7, to: '/operation-menu', text: 'SensorAggregatedValue', model: 'SensorAggregatedValue' },
  { id: 8, to: '/operation-menu', text: 'SensorType', model: 'SensorType' },
  { id: 9, to: '/operation-menu', text: 'SensorValue', model: 'SensorValue' },
  { id: 10, to: '/operation-menu', text: 'SensorValueArchive', model: 'SensorValueArchive' },
  { id: 11, to: '/operation-menu', text: 'Space', model: 'Space' },
  { id: 12, to: '/operation-menu', text: 'Unit', model: 'Unit' },
];

const props = defineProps(['model']);
const emits = defineEmits(['linkClicked']);

const handleLinkClick = (model) => {
  emits('linkClicked', model);
};
</script>

<style scoped>
.verticalNav {
  height: 20em;
  width: 100%;
  position: relative;
  margin: auto;
  overflow-y: auto;
}

.allModel {
  padding: 2% 2% 5% 2%;
  font-weight: bold;
}

ul.listOfModel {
  width: auto;
  list-style-type: none;
  text-align: left;
  padding: 0% 8% 0% 8%;
}

.linkModel {
  color: black;
  text-decoration: none;
  transition: 0.3s ease;
  margin-bottom: 15em;
}

.listModel {
  padding-left: 3%;
  margin: 0.5em 0em 0.5em 0em;
  background-size: 2em;
  line-height: 2em;
}

.listModel:hover {
  background-color: #e2e8f0;
  border-radius: 0.2em;
}

</style>
