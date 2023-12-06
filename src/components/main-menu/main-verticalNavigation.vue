<script lang="ts" setup>

import "~/assets/css/component.css"

/* Variable to access the current cached value (es. of useAsyncData)*/
const { data } = useNuxtData('buildings') as {data: any};
let { data: filter } = useNuxtData('filteredItem') as {data: any};

/* Variables for navigation */
const router = useRouter();

const edit = (code: string, id: number) => {
  const { data: filter } = useAsyncData('filteredItem', () => "");
  router.push({ path: '/query-operation/modify-building/', query: { buildingId: id, buildingCode: code} });
}

const navigate = (code: string, id: number) => {
  const { data: filter } = useAsyncData('filteredItem', () => "");
  router.push({ path: '/floor-menu/', query: { buildingId: id, buildingCode: code } });
};

</script>

<template>
  <nav class="bg-gray-800 text-white">
    <ul class="listOfBuilding">
      <li v-if="!filter" v-for="link in data" :key="link.id" :title="link.buildingCode" class="listBuilding">
        <div class="row">
          <div class="buildingName" @click="navigate(link.code, link.id)">
            {{ link.name }}
          </div>
          <div class="editButton">
            <button @click.stop="edit(link.code, link.id)">
              Edit
            </button>
          </div>
        </div>
      </li>
      <li v-if="filter" v-for="link in filter" :key="link.code" class="listBuilding">
        <div class="row">
          <div class="buildingName" @click="navigate(link.code, link.id)">
            {{ link.name }}
          </div>
          <div class="editButton">
            <button @click.stop="edit(link.code, link.id)">
              Edit
            </button>
          </div>
        </div>
      </li>
      <li v-if="!data.length" class="noLinks">Nessun edificio disponibile</li>
    </ul>
  </nav>
</template>
