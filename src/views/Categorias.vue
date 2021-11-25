<template>
  <div class="Categorias">
    <h1 class="my-5 green-darken-3--text">Categorias</h1>
    <VistaCategorias />
  </div>
</template>

<script>
import VistaCategorias from "../components/Categorias/VistaCategorias.vue";
  export default {
    name: 'Categorias',

    components: {
      VistaCategorias
    },
  }
</script>