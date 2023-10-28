<template>
    <div class="verticalNav">
      <nav class="bg-gray-800 text-white">
        <ul class="listOfOperation">
          <div class="allOperation">All operations</div>
          <li v-for="link in links" :key="link.id" :title="link.operation" class="listOperation">
            <router-link @click="handleLinkClick(link.operation)" :to="link.to" class="linkOperation">
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
    { id: 1, to: '/controlPanel', text: 'Add data', operation: 'create' },
    { id: 2, to: '/controlPanel', text: 'Data visualization', operation: 'read' },
    { id: 3, to: '/controlPanel', text: 'Change data', operation: 'update' },
    { id: 4, to: '/controlPanel', text: 'Remove data', operation: 'delete' },
  ];

  const props = defineProps(['operation']);
  const emits = defineEmits(['linkClicked']);

  const handleLinkClick = (model) => {
    emits('linkClicked', model);
  };
  </script>
  
  <style scoped>
  .verticalNav {
    height: 20em;
    width: 100%;
    position: relative;
    margin: auto;
    overflow-y: auto;
  }
  
  .allOperation {
    padding: 2% 2% 5% 2%;
    font-weight: bold;
  }
  
  ul.listOfOperation {
    width: auto;
    list-style-type: none;
    text-align: left;
    padding: 0% 8% 0% 8%;
  }
  
  .linkOperation {
    color: black;
    text-decoration: none;
    transition: 0.3s ease;
    margin-bottom: 15em;
  }
  
  .listOperation {
    padding-left: 3%;
    margin: 0.5em 0em 0.5em 0em;
    background-size: 2em;
    line-height: 2em;
  }
  
  .listOperation:hover {
    background-color: #e2e8f0;
    border-radius: 0.2em;
  }
  
  </style>
  