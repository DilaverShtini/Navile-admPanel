<template>
  <div class="verticalNav">
    <nav class="bg-gray-800 text-white">
      <ul class="listOfModel">
        Spazi già esistenti nel db
        <li v-for="link in links" :key="link.id" :title="link.operation" class="listModel">
          <router-link @click="handleLinkClick(link.operation)" :to="link.to" class="linkModel">
            <div>{{ link.text }}</div>  
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const links = [
  { id: 1, to: '/controlPanel', text: 'a', operation: 'a' },
  { id: 2, to: '/controlPanel', text: 'b', operation: 'b' },
  { id: 3, to: '/controlPanel', text: 'c', operation: 'c' },
];

const props = defineProps(['operation']);
const emits = defineEmits(['linkClicked']);

const handleLinkClick = (model) => {
emits('linkClicked', model);
};
</script>

<style scoped>


.verticalNav {
    height: 100%;
    width: 100%;
    position: relative;
    margin: auto;
    overflow-y: auto;
  }
  
  .allModel {
    padding: 2% 2% 5% 2%;
    font-weight: bold;
  }
  
  ul.listOfModel {
    width: auto;
    list-style-type: none;
    text-align: left;
    padding: 0% 8% 0% 8%;
  }
  
  .linkModel {
    color: black;
    text-decoration: none;
    transition: 0.3s ease;
    margin-bottom: 15em;
  }
  
  .listModel {
    padding-left: 3%;
    margin: 0.5em 0em 0.5em 0em;
    background-size: 2em;
    line-height: 2em;
  }
  
  .listModel:hover {
    background-color: #e2e8f0;
    border-radius: 0.2em;
  }
  
</style>
