<!-- VerticalNav.vue -->
<template>
  <div class="verticalNav">
    <nav class="bg-gray-800 text-white">
      <ul class="listOfModel">
        <div class="allModel">All Model</div>
        <li v-for="link in links" :key="link.id" class="listModel">
          <router-link :to="link.to" class="linkModel">
            {{ link.text }}
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  data() {
    return {
      links: [
        { id: 1, to: '/sidebar', text: 'Building' },
        { id: 2, to: '../sidebar', text: 'Floor' },
        { id: 3, to: '../sidebar', text: 'Indication' },
        { id: 4, to: '../sidebar', text: 'Legend' },
        { id: 5, to: '../sidebar', text: 'Route' },
        { id: 6, to: '../sidebar', text: 'Sensor' },
        { id: 7, to: '../sidebar', text: 'SensorAggregatedValue' },
        { id: 8, to: '../sidebar', text: 'SensorType' },
        { id: 9, to: '../sidebar', text: 'SensorValue' },
        { id: 10, to: '../sidebar', text: 'SensorValueArchive' },
        { id: 11, to: '../sidebar', text: 'Space' },
        { id: 12, to: '../sidebar', text: 'Unit' },
      ],
    };
  },
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
}

.listModel:hover {
  background-color: #e2e8f0;
  border-radius: 0.2em;
}

</style>
