<script setup>

import { ref } from 'vue';
import "~/assets/css/component.css"

/* Variable for the searches made by the user*/
const userInput = ref('');
const filteredModels = ref([]);

/* Variable to read the values passed into the component */
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

/* Variable for the main data of the selected model */
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
  </div>
</template>
