<script lang="ts" setup>

import { ref, onMounted } from 'vue';

interface SpaceItem {
  code: number;
  name: string;
}

const props = defineProps(['buildingCode', 'floorNumber', 'floorId']);
const data = ref<SpaceItem[]>([]);
const items = ref(['Locali', 'Modifica']);
const operations = ref(['Aggiungi', 'Elimina']);
const activeItem = ref('Locali');

onMounted(async () => {
  try {
    const response = await fetch(`/api/space?floorIdNumber=${props.floorId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    console.log('Result from API:', result);
    data.value = result;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

const emit = defineEmits<{
  (e: "change", item: string): void
}>()

const changeTab = (item: string) => {
  activeItem.value = item;
  emit('change', item);
}

</script>

<template>
  <div class="verticalNav">
    <div class="buildingSelected"> Edificio: {{ props.buildingCode }} </div>
    <div class="floorSelected"> Piano: {{ props.floorNumber }} </div>
    <button 
      v-for="item, i in items" :key="i" 
      class="tab btn" :class="{ active: item === activeItem }"
      @click="changeTab(item)"
      >{{item}}</button>
    <nav class="bg-gray-800 text-white">
      <ul class="listOfSpace">
        <li v-for="link in data" :key="link.code" class="listSpace">
          <router-link :to="{ path: '/' }" class="linkSpace">
              <div>{{ link.name }}</div>
          </router-link>
        </li>
        <li v-if="!data.length" class="noLinks">Nessun locale disponibile</li>
      </ul>
    </nav>
    <button 
        v-for="item, i in operations" :key="i" 
        class="action" :class="item.toLowerCase()"
        >{{item}}</button>
  </div>
</template>

<style scoped>

.noLinks {
  color: #777;
  margin-top: 1em;
}

.action {
  width: 40%;
  position: relative;
  display: inline-block;
  margin-bottom: 3%;
  padding: 0.8em 2em;
  text-align: center;
  font-weight: bold;
  color: #000;
  letter-spacing: 2px;
  background-color: #fff;
  border-radius: 0.5em;
}

.action:hover {
  background-color: #ed5959;
}

.aggiungi {
  margin-right: 10px;
}

.elimina {
  margin-left: 10px;
}

.tab {
  position: relative;
  display: inline-block;
  padding: 1rem 2rem;
  text-align: center;
  font-weight: bold;
  color: #333;
  letter-spacing: 2px;
  background-color: #fff;
  border: none;
}

.tab::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 2px;
  width: calc(100% - 30px);
  border-radius: 0 0 8px 8px;
  background-color: rgb(255, 37, 37);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tab.active {
  color: rgb(234, 37, 37);
}

.tab.active::after {
  opacity: 1;
}

.verticalNav {
  width: 100%;
  position: relative;
  margin: auto;
  overflow-y: auto;
  text-align: center;
}

.buildingSelected, .floorSelected {
  width: auto;
  text-align: left;
  padding: 5% 0% 5% 5%;
  border-bottom: 1px solid #d5d5d5;
}

ul.listOfSpace {
  width: auto;
  list-style-type: none;
  text-align: left;
  padding: 0% 8% 0% 8%;
}

.linkSpace {
  color: black;
  text-decoration: none;
  transition: 0.3s ease;
  margin-bottom: 15em;
}

.listSpace {
  padding-left: 3%;
  margin: 0.5em 0em 0.5em 0em;
  background-size: 2em;
  line-height: 2em;
  text-transform: capitalize;
}

.listSpace:hover {
  background-color: #e2e8f0;
  border-radius: 0.2em;
}

</style>
