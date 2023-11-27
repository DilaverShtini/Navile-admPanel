<script lang="ts" setup>

import "~/assets/css/component.css"

const route = useRoute();
const router = useRouter();

const buildingFromQuery = route.query.buildingCode
const floorFromQuery = route.query.floorNumber
const floorIdFromQuery = route.query.floorId

const { data } = useNuxtData('spaces') as {data: any};

const edit = (code: number, id: string) => {
  const { data: filter } = useAsyncData('filteredSpace', () => "");
  router.push({ path: '/query-operation/modify-space/', query: { spaceId: id, spaceCode: code, buildingCode:buildingFromQuery, floorNumber:floorFromQuery, floorId:floorIdFromQuery } });
}

const navigate = (buildingCode: any, floorNumber: any, floorId: any) => {
  const { data: filter } = useAsyncData('filteredSpace', () => "");
  router.push({ path: '/space-menu/', query: {buildingCode: buildingCode, floorNumber: floorNumber, floorId: floorId} });
};

let { data: filter } = useNuxtData('filteredSpace') as {data: any};

</script>

<template>
    <nav class="bg-gray-800 text-white">
      <ul class="listOfSpace">
        <li v-if="filter" v-for="link in filter" :key="link.code" class="listSpace">
          <div class="row">
            <div class="spaceName" @click="navigate(buildingFromQuery, floorFromQuery, floorIdFromQuery)">
              {{ link.name }}
            </div>
            <div class="editButton">
              <button @click.stop="edit(link.code, link.id)">
                Edit
              </button>
            </div>
          </div>
        </li>
        <li v-if="!filter" v-for="link in data" :key="link.code" class="listSpace">
          <div class="row">
            <div class="spaceName" @click="navigate(buildingFromQuery, floorFromQuery, floorIdFromQuery)">
              {{ link.name }}
            </div>
            <div class="editButton">
              <button @click.stop="edit(link.code, link.id)">
                Edit
              </button>
            </div>
          </div>
        </li>
        <li v-if="!data.length" class="noLinks">Nessun locale disponibile</li>
      </ul>
    </nav>
</template>
