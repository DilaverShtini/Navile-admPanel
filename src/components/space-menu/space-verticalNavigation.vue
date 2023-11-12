<script lang="ts" setup>

const route = useRoute();
const router = useRouter();

const buildingFromQuery = route.query.buildingCode
const floorFromQuery = route.query.floorNumber
const floorIdFromQuery = route.query.floorId

const { data } = useNuxtData('spaces') as {data: any};

const edit = (code: number, id: string) => {
  router.push({ path: '/query-operation/modifie-space/', query: { spaceId: id, spaceCode: code, buildingCode:buildingFromQuery, floorNumber:floorFromQuery, floorId:floorIdFromQuery } });
}

const navigate = (buildingCode: any, floorNumber: any, floorId: any) => {
  router.push({ path: '/space-menu/', query: {buildingCode: buildingCode, floorNumber: floorNumber, floorId: floorId} });
};

</script>

<template>
    <nav class="bg-gray-800 text-white">
      <ul class="listOfSpace">
        <li v-for="link in data" :key="link.code" class="listSpace">
          <div class="row">
            <div class="space-name" @click="navigate(buildingFromQuery, floorFromQuery, floorIdFromQuery)">
              {{ link.name }}
            </div>
            <div class="edit-button">
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

<style scoped>

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
