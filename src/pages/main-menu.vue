<script lang="ts" setup>
import { MainInput } from "../utils";
import { MainVerticalNav } from '../utils';
import { ref } from 'vue';

// Stato per il titolo del link selezionato
const selectedBuilding = ref('');

const emits = defineEmits<{
  (e: "change", item: string): void;
  (e: "linkClicked", building: string): void;
}>();

// Funzione per gestire il clic del link
const handleLinkClick = (building: string): void => {
  selectedBuilding.value = building;
  emits('linkClicked', building);

}
</script>

<template>
  <div class="container">
    <div class="menu border p-4">
      <div class="box">
        <MainInput type="text"
                    placeholder="Search"
                    id="openBuilding"
                    class="mb-4" />
          <div class="with-bottom-border"></div>
          <div class="verticalNav">
            <div class="title"> Edifici </div>
            <MainVerticalNav @linkClicked="handleLinkClick" />
          </div>
      </div>
    </div>
  </div>
</template>
 
<style scoped>

.title {
  width: 96%;
  text-align: center;
  padding: 3% 2% 3% 2%;
  font-weight: bold;
}

.container {
  min-height: 100%;
  display: flex;
  justify-content: left;
  flex: 1;
  border: 1px solid #d5d5d5;
}

.form-container {
  min-height: 100vh;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  padding: 20px;
  border-left: 1px solid #d5d5d5;
}

.menu {
  text-align: center;
  width: 20em;
  height: max-content;
}

.box {
  border-right: 1px solid #d5d5d5;
  overflow-y: hidden;
  width: 20em;
}

.action {
  width: 40%;
  position: relative;
  display: inline-block;
  margin-bottom: 3%;
  padding: 0.8em 2em;
  text-align: center;
  font-weight: bold;
  color: #000;
  letter-spacing: 2px;
  background-color: #fff;
  border-radius: 0.5em;
}

.action:hover {
  background-color: #ed5959;
}

.tab {
  position: relative;
  display: inline-block;
  padding: 1rem 2rem;
  text-align: center;
  font-weight: bold;
  color: #333;
  letter-spacing: 2px;
  background-color: #fff;
  border: none;
}

.tab::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 2px;
  width: calc(100% - 30px);
  border-radius: 0 0 8px 8px;
  background-color: rgb(255, 37, 37);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tab.active {
  color: rgb(234, 37, 37);
}

.tab.active::after {
  opacity: 1;
}


.verticalNav {
  text-align: center;
}

.with-bottom-border {
  border-bottom: 1px solid #d5d5d5;
}
</style>
