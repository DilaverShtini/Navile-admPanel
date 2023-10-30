<script lang="ts" setup>

import { OperationVerticalNav } from '../utils';
import { ref, defineEmits } from 'vue';
import { useRoute } from 'vue-router';

  const route = useRoute();
  const router = useRouter();
  const modelValue = ref('');
  const emits = defineEmits();
  const selectedOperation = ref('');

  // Accesso al valore della variabile 'model' dall'URL
  const modelFromQuery = route.query.model

  if (modelFromQuery !== undefined && modelFromQuery !== null) {
    modelValue.value = modelFromQuery.toString();
    console.log('Model:', modelValue.value);
  } else {
    console.error('Model non definito nell\'URL');
  }

  // Funzione per gestire il clic del link
  const handleLinkClick = (operation: string): void => {
    selectedOperation.value = operation;
    emits('linkClicked', operation);

    // Utilizza router solo quando window è definito
    if (typeof window !== 'undefined') {
      router.push({ path: '/controlPanel', query: { operation: selectedOperation.value } });
    }
  }
</script>

<template>
    <div class="container">
      <div class="menu border p-4">
        <div class="box">
          <h3 class="text-2xl font-bold mb-4"> {{ modelValue.toUpperCase() }} </h3>
          <div class="with-bottom-border"></div>
          <div class="verticalNav">
            <OperationVerticalNav @linkClicked="handleLinkClick" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  
  .allModel {
  padding: 2% 2% 5% 2%;
  font-weight: bold;
  }

  .container {
    height: 100%;
    margin-top: 5%;
    margin-bottom: 5%;
    display: flex;
    justify-content: center;
    flex: 1;
  }
  
  .menu {
    text-align: center;
    height: auto;
    width: 20em;
    height: max-content;
  }
  .custom-input {
    margin-bottom: 1em;
    padding: 4px;
  }
  
  .box {
    border: 1px solid #d5d5d5;
    border-radius: 0.5em;
    max-height: 100em;
    overflow-y: hidden;
  }
  
  .verticalNav {
    text-align: left;
  }
  
  .with-bottom-border {
    border-bottom: 1px solid #d5d5d5;
  }
  </style>
