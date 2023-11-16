<script lang="ts" setup>

const { data } = useNuxtData('buildings') as {data: any};
let { data: filter } = useNuxtData('filteredItem') as {data: any};

const router = useRouter();

const edit = (code: string, id: number) => {
  const { data: filter } = useAsyncData('filteredItem', () => "");
  router.push({ path: '/query-operation/modifie-building/', query: { buildingId: id, buildingCode: code} });
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
          <div class="building-name" @click="navigate(link.code, link.id)">
            {{ link.name }}
          </div>
          <div class="edit-button">
            <button @click.stop="edit(link.code, link.id)">
              Edit
            </button>
          </div>
        </div>
      </li>
      <li v-if="filter" v-for="link in filter" :key="link.code" class="listBuilding">
        <div class="row">
          <div class="building-name" @click="navigate(link.code, link.id)">
            {{ link.name }}
          </div>
          <div class="edit-button">
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

<style scoped>
ul.listOfBuilding {
  width: auto;
  list-style-type: none;
  text-align: left;
  padding: 0% 8% 0% 8%;
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

.row {
  display: flex;
  justify-content: space-between;
}

.building-name {
  flex-grow: 1;
  cursor: pointer;
}

.edit-button {
  margin-left: 10px;
}

.noLinks {
  color: #777;
  margin-top: 1em;
}
</style>
