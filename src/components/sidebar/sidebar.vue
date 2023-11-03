<template>
  <div class="verticalNav">
    <nav class="bg-gray-800 text-white">
      <ul class="listOfModel">
        Spazi già esistenti nel db
        <li v-for="name in uniqueNames" :key="name" class="listModel">
          <router-link @click="handleLinkClick()" :to="{ path: '/operation-menu/'}" class="linkModel">
            <div>{{ name }}</div>  
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps(['modelValue']);
const apiPath = `/api/${props.modelValue}`;
const { data } = await useFetch(apiPath);
const uniqueNames = Array.from(new Set(data.value.map(item => item.name)));

</script>

<style scoped>
.verticalNav {
    height: 40em;
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
    height: auto;
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
