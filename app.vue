<script lang="ts" setup>
import { MainInput } from "./src/pages"
import { MainVerticalNav } from "./src/pages"

useHead({
  title: "PanelControl - Navile",
  htmlAttrs: {
    lang: "it"
  }
})
</script>

<template>
  <div class="container">
    <div class="menu border p-4">
      <div class="box">
        <h3 class="text-2xl font-bold mb-4">Open a Model</h3>
        <MainInput type="text" placeholder="Search" id="openModel" class="mb-4 custom-input " />
        <div class="with-bottom-border"></div>
        <div class="verticalNav">
          <MainVerticalNav />
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
