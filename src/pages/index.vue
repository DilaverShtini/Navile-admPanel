<script lang="ts" setup>

useHead({
  title: "ControlPanel - Navile",
  htmlAttrs: {
    lang: "it"
  }
})

const router = useRouter();

if (typeof window !== 'undefined') {
  router.push({ path: '/mode-menu/' });
}

</script>

<template>
  <Head>
    <Link rel="icon" href="favicon.png" type="image/png" />
  </Head>
  <div id="app">
    <RouterView />
  </div>
</template>
