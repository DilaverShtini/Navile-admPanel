<script setup>

import { ref, onMounted } from 'vue';

const props = defineProps(['buildingCode']);
const buildingNumber = props.buildingCode.replace(/[^\d]/g, '');
const data = ref([]);
const router = useRouter();

const { data: filter } = useNuxtData('filteredFloor');

onMounted(async () => {
  try {
    const response = await fetch(`/api/floor?buildingId=${buildingNumber}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    //console.log('Result from API:', result);
    data.value = result;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

const navigate = (buildingCode, floorNumber, floorId) => {
  const { data: filter } = useAsyncData('filteredFloor', () => "");
  router.push({ path: '/space-menu/', query: {buildingCode: buildingCode, floorNumber: floorNumber, floorId: floorId} });
};

</script>

<template>
  <div class="verticalNav">
      <div class="buildingSelected"> Edificio: {{ props.buildingCode }} </div>
      <nav class="bg-gray-800 text-white">
      <ul class="listOfFloor">
          <div class="visualization">
            <div class="allFloor">Piani</div>
          </div>
          <li v-if="!filter" v-for="link in data" :key="link.id" :title="link.floor" class="listFloor">
            <div class="floor" @click="navigate(props.buildingCode, link.number, link.id)">
              <div>Piano n.{{ link.number }}</div>
            </div>
          </li>
          <li v-if="filter" v-for="link in filter" :key="link.id" :title="link.floor" class="listFloor">
            <div class="floor" @click="navigate(props.buildingCode, link.number, link.id)">
              <div>Piano n.{{ link.number }}</div>
            </div>
          </li>
      </ul>
      </nav>
  </div>
</template>

<style scoped>
.verticalNav {
  width: 100%;
  position: relative;
  margin: auto;
  overflow-y: auto;
}

.buildingSelected {
  width: auto;
  text-align: left;
  padding: 5% 0% 5% 5%;
  border-bottom: 1px solid #d5d5d5;
}

ul.listOfFloor {
  width: auto;
  list-style-type: none;
  text-align: left;
  padding: 0% 8% 0% 8%;
}

.visualization {
  display: flex;
}

.allFloor {
  width: 100%;
  text-align: center;
  padding: 2% 2% 5% 2%;
  font-weight: bold;
}

.listFloor {
  padding-left: 3%;
  margin: 0.5em 0em 0.5em 0em;
  background-size: 2em;
  line-height: 2em;
  text-transform: capitalize;
}

.floor {
  flex-grow: 1;
  cursor: pointer;
}

.listFloor:hover {
  background-color: #e2e8f0;
  border-radius: 0.2em;
}
.linkFloor {
  color: black;
  text-decoration: none;
  transition: 0.3s ease;
  margin-bottom: 15em;
}
</style>
