<!-- VerticalNav.vue -->
<template>
  <div class="verticalNav">
    <nav class="bg-gray-800 text-white">
      <ul class="listOfModel">
        <div class="allModel">All Model</div>
        <li v-for="link in links" :key="link.id" class="listModel">
          <router-link :to="link.to" class="linkModel">
            {{ link.text }}
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  data() {
    return {
      links: [
        { id: 1, to: '/', text: 'Space' },
        { id: 2, to: '/about', text: 'Building' },
        { id: 3, to: '/contact', text: 'Legend' },
        { id: 4, to: '/about', text: 'Building' },
        { id: 5, to: '/contact', text: 'Legend' },
        { id: 6, to: '/about', text: 'Building' },
        { id: 7, to: '/contact', text: 'Legend' },
        { id: 8, to: '/about', text: 'Building' },
        { id: 9, to: '/contact', text: 'Legend' },
        { id: 10, to: '/about', text: 'Building' },
        { id: 11, to: '/contact', text: 'Legend' },
        { id: 12, to: '/about', text: 'Building' },
        { id: 13, to: '/contact', text: 'Legend' },
        { id: 14, to: '/about', text: 'Building' },
        { id: 15, to: '/contact', text: 'Legend' },
        { id: 16, to: '/about', text: 'Building' },
        { id: 17, to: '/contact', text: 'Legend' },
        { id: 18, to: '/about', text: 'Building' },
        { id: 19, to: '/contact', text: 'Legend' },
        { id: 20, to: '/about', text: 'Building' },
        { id: 21, to: '/contact', text: 'Legend' },
        { id: 22, to: '/about', text: 'Building' },
        { id: 23, to: '/contact', text: 'Legend' },
        { id: 24, to: '/about', text: 'Building' },
        { id: 25, to: '/contact', text: 'Legend' },
      ],
    };
  },
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
}

.listModel:hover {
  background-color: #e2e8f0;
  border-radius: 0.2em;
}

</style>
