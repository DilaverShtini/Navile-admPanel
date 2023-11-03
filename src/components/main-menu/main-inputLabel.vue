<script setup>

//TODO cambiare la logica del search, non bisogna più cercare solamente i modelli nel database.

import { ref, defineProps } from 'vue';

const { data } = await useFetch('/api/models')
const emit = defineEmits();
const userInput = ref('');
const filteredModels = ref([]);

const props = defineProps({
  label: String,
  type: {
    type: String,
    default: "text",
  },
  placeholder: String,
  id: String,
});

const onInput = (event) => {
  const searchTerm = event.target.value.toLowerCase();
  userInput.value = searchTerm;
  filteredModels.value = searchTerm ? data.value.filter(model => model.toLowerCase().includes(searchTerm)) : [];
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
        <router-link :to="{ path: '/operation-menu/', query: { model: model }}" class="linkModel">
          <div>{{ model }}</div>
        </router-link></li>
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
  margin: 5% 0% 0% 0%;
}

.linkModel {
  color: black;
  text-decoration: none;
  transition: 0.3s ease;
  margin-bottom: 15em;
}

.listModel {
  padding-left: 0%;
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
