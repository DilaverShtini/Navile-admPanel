<script setup>

import { ref, onMounted } from 'vue';
import "~/assets/css/component.css"

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
    <nav class="bg-gray-800 text-white">
      <ul class="listOfFloor">
          <li v-if="!filter" v-for="link in data" :key="link.id" :title="link.floor" class="listFloor">
            <div class="floorNumber" @click="navigate(props.buildingCode, link.number, link.id)">
              <div>Piano n.{{ link.number }}</div>
            </div>
          </li>
          <li v-if="filter" v-for="link in filter" :key="link.id" :title="link.floor" class="listFloor">
            <div class="floorNumber" @click="navigate(props.buildingCode, link.number, link.id)">
              <div>Piano n.{{ link.number }}</div>
            </div>
          </li>
      </ul>
    </nav>
</template>
