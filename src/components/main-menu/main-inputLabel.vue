<!-- MainInput.vue -->
<template>
  <div class="inputModel">
    <h3 class="text-2xl font-bold mb-4">OPEN A MODEL</h3>
    <input
      @input="onInput"
      :type="type"
      :placeholder="placeholder"
      :id="id"
      :name="id"
    />
    <ul class="listOfModel" v-if="filteredModels.length">
      <li class="listModel" v-for="model in filteredModels" :key="model.id">
        <router-link @click="handleLinkClick()" :to="{ path: '/operation-menu/', query: { model: model }}" class="linkModel">
          <div>{{ model }}</div>
        </router-link></li>
    </ul>
  </div>
</template>

<script setup>
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

<style scoped>

input {
  width: 20em;
  padding: 4px;
  border: 1px solid #e2e8f0;
  border-radius: 
  0.2em;
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
