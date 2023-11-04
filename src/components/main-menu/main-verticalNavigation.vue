<script lang="ts" setup>

const { data } = await useFetch('/api/building') as { data: any };
const props = defineProps(['editMode']);

</script>

<template>
  <nav class="bg-gray-800 text-white">
    <ul class="listOfBuilding">
      <li v-for="link in data" :key="link.id" :title="link.buildingCode" class="listBuilding">
        <router-link :to="{ path: props.editMode ? '/query-operation/modifie-building/' : '/floor-menu/', query: { buildingCode: link.code }}" class="linkBuilding">
          <div>{{ link.name }}</div>
        </router-link>
      </li>
      <li v-if="!data.length" class="noLinks">Nessun edificio disponibile</li>
    </ul>
  </nav>
</template>

<style scoped>

.noLinks {
  color: #777;
  margin-top: 1em;
}

.verticalNav {
  width: 100%;
  position: relative;
  margin: auto;
  overflow-y: auto;
  text-align: center;
}

ul.listOfBuilding {
  width: auto;
  list-style-type: none;
  text-align: left;
  padding: 0% 8% 0% 8%;
}

.linkBuilding {
  color: black;
  text-decoration: none;
  transition: 0.3s ease;
  margin-bottom: 15em;
}

.listBuilding {
  padding-left: 3%;
  margin: 0.5em 0em 0.5em 0em;
  background-size: 2em;
  line-height: 2em;
  text-transform: capitalize;
}

.listBuilding:hover {
  background-color: #e2e8f0;
  border-radius: 0.2em;
}

</style>
