<script lang="ts" setup>
import { MainInput } from "../utils"
import { MainVerticalNav } from '../utils';
import { ref, defineEmits } from 'vue';

const emits = defineEmits();

// Stato per il titolo del link selezionato
const selectedModel = ref('');

const router = useRouter();

// Funzione per gestire il clic del link
const handleLinkClick = (model: string): void => {
  selectedModel.value = model;
  emits('linkClicked', model);

  // Utilizza router solo quando window è definito
  if (typeof window !== 'undefined') {
    router.push({ path: '/operation-menu/', query: { model: selectedModel.value } });
  }
}
</script>

<template>
    <div class="container">
      <div class="menu border p-4">
        <div class="box">
          <MainInput type="text" placeholder="Search" id="openModel" class="mb-4 custom-input " />
            <div class="with-bottom-border"></div>
            <div class="verticalNav">
                <MainVerticalNav @linkClicked="handleLinkClick" />
            </div>
        </div>
      </div>
      <div></div>
      <div></div>
    </div>
  </template>
  
  <style scoped>
  
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
    max-height: 50em;
    overflow-y: hidden;
  }
  
  .verticalNav {
    text-align: left;
  }
  
  .with-bottom-border {
    border-bottom: 1px solid #d5d5d5;
  }
  </style>
