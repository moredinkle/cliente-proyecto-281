<template>
  <div class="Principal">
    <h1 class="my-5 green-darken-3--text">Pagina Principal</h1>
    <VistaPrincipal />
  </div>
  
</template>

<script>
import VistaPrincipal from '../components/PaginaPrincipal/VistaPrincipal.vue'
  export default {
    name: 'Principal',

    components: {
      VistaPrincipal,
    },
  }
</script>
