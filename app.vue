<script lang="ts" setup>

useHead({
  title: "ControlPanel - Navile",
  htmlAttrs: {
    lang: "it"
  }
})

</script>

<template>
  <Head>
    <Link rel="icon" href="favicon.png" type="image/png" />
  </Head>
  <div id="app">
    <RouterView />
  </div>
</template>
