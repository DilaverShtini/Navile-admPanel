<script setup>

import { ref, defineProps } from 'vue';

const emit = defineEmits();
const userInput = ref('');
const filteredModels = ref([]);

const props = defineProps({
  model: String,
  floor: String,
  build: String,
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
  console.log('Data:', data.value);
}

const onInput = (event) => {
  const searchTerm = event.target.value.toLowerCase();
  userInput.value = searchTerm;
  if(props.model == 'floor') {
    filteredModels.value = searchTerm ? data.value.filter((model) => String(model.number).includes(searchTerm)) : [];
  }else {
    filteredModels.value = searchTerm ? data.value.filter((model) => model.name.toLowerCase().includes(searchTerm)) : [];
  }
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
        <div v-if="props.model !== 'floor'">{{ model.name }}</div>
        <div v-if="props.model == 'floor'">Piano n. {{ model.number }}</div>
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

.linkModel {
  color: black;
  text-decoration: none;
  transition: 0.3s ease;
  margin-bottom: 15em;
}

.listModel {
  padding-left: 2%;
  margin: 0em;
  background-size: 2em;
  line-height: 2em;
  text-transform: capitalize;
}

.listModel:hover {
  background-color: #e2e8f0;
  border-radius: 0.2em;
}

#openModel {
  background-color: #e2e8f0;
}

#openModel:focus {
  background-color: #e2e8f0;
}

</style>
