<template>
  <v-app color="grey lighten-5">
    <BarraPrincipal />

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import BarraPrincipal from './components/BarraPrincipal.vue';

export default {
  name: 'App',
  data: () => ({
    //
  }),

  components: {
        BarraPrincipal
    },
  methods: {
    
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300&display=swap');
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&family=Red+Hat+Display:wght@300&family=Work+Sans&display=swap');

#app {
  font-family: 'Red Hat Display', sans-serif;
  text-align: center;
}
</style>