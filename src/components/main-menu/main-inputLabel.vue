<script setup>

import { ref, defineProps } from 'vue';

const emit = defineEmits();
const userInput = ref('');
const filteredModels = ref([]);
const router = useRouter();

const props = defineProps({
  model: String,
  floor: String,
  floorNumber: String,
  build: String,
  buildCode: String,
  label: String,
  type: {
    type: String,
    default: "text",
  },
  placeholder: String,
  id: String,
});

const { data, error } = await useFetch('/api/models', {
  method: 'post',
  body: {
    model: props.model,
    floor: props.floor,
    build: props.build,
  },
});

if (error.value) {
  console.error('Error fetching data:', error.value);
} else {
  // console.log('Data:', data.value);
}

const onInput = (event) => {
  const searchTerm = event.target.value.toLowerCase();
  userInput.value = searchTerm;
  if(props.model == 'floor') {
    filteredModels.value = searchTerm ? data.value.filter((model) => String(model.number).includes(searchTerm)) : [];
    if(filteredModels.value == "") {
      const { data: filter } = useAsyncData('filteredFloor', () => "");
    }else {
      const { data: filter } = useAsyncData('filteredFloor', () => filteredModels);
    }
  } else if (props.model == 'building') {
    filteredModels.value = searchTerm ? data.value.filter((model) => model.name.toLowerCase().includes(searchTerm)) : [];
    if(filteredModels.value == "") {
      const { data: filter } = useAsyncData('filteredItem', () => "");
    }else {
      const { data: filter } = useAsyncData('filteredItem', () => filteredModels);
    }
  } else if (props.model == 'space') {
    filteredModels.value = searchTerm ? data.value.filter((model) => model.name.toLowerCase().includes(searchTerm)) : [];
    if(filteredModels.value == "") {
      const { data: filter } = useAsyncData('filteredSpace', () => "");
    }else {
      const { data: filter } = useAsyncData('filteredSpace', () => filteredModels);
    }
  }
  const height = filteredModels.value.length * 2;
  document.documentElement.style.setProperty('--input-height', `${height}em`);
};

const navigateFloor = (code, id) => {
  document.documentElement.style.setProperty('--input-height', 0);
  const { data: filter } = useAsyncData('filteredItem', () => "");
  router.push({ path: '/floor-menu/', query: { buildingId: id, buildingCode: code } });
};

const navigateSpace = (number, id) => {
  document.documentElement.style.setProperty('--input-height', 0);
  const { data: filter } = useAsyncData('filteredFloor', () => "");
  router.push({ path: '/space-menu/', query: { buildingCode: props.buildCode, floorNumber: number, floorId: id } });
};

const navigateInSpace = (code, id) => {
  document.documentElement.style.setProperty('--input-height', 0);
  const { data: filter } = useAsyncData('filteredSpace', () => "");
  router.push({ path: '/query-operation/modifie-space/', query: { spaceId: id, spaceCode: code, buildingCode: props.buildCode, floorNumber: props.floorNumber, floorId: props.floor } });
};

</script>

<template>
  <div class="inputModel">
    <input
      @input="onInput"
      :type="type"
      :placeholder="placeholder"
      :id="id"
      :name="id"
    />
    <ul class="listOfModel" v-if="filteredModels.length">
      <li class="listModel" v-for="model in filteredModels" :key="model.id">
        <div v-if="props.model == 'building'" @click="navigateFloor(model.code, model.id)" >{{ model.name }}</div>
        <div v-if="props.model == 'floor'" @click="navigateSpace(model.number, model.id)" >Piano n. {{ model.number }}</div>
        <div v-if="props.model == 'space'" @click="navigateInSpace(model.code, model.id)" >{{ model.name }}</div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.inputModel {
  width: 100%;
}

input {
  width: 100%;
  height: 3.5em;
  box-sizing: border-box;
  border: 1px solid #e2e8f0;
  border-radius: 0.2em;
  border: none;
}

ul.listOfModel {
  width: auto;
  list-style-type: none;
  text-align: left;
  padding: 0% 8% 0% 8%;
  margin: 3% 0% 3% 0%;
}

.listModel {
  padding-left: 2%;
  height: 2em; /* Altezza dell'elemento */
  background-size: 2em;
  line-height: 2em;
  text-transform: capitalize;
}

.listModel:hover {
  background-color: #e2e8f0;
  border-radius: 0.2em;
}
</style>
