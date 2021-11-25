<template>
  <div class="Opciones">
    <div v-if="loggedin">
      <MenuOpciones />
      <MenuTarjetas />
    </div>
    <div v-else class="py-5">
      <h2>Oh Oh</h2>
      <h3>Necesitas iniciar sesión para ver esta sección</h3>
    </div>
  </div>
</template>

<script>
import MenuOpciones from "../components/Opciones/MenuOpciones.vue";
import MenuTarjetas from "../components/Opciones/MenuTarjetas.vue";

export default {
  name: "Opciones",

  components: {
    MenuOpciones,
    MenuTarjetas,
  },

  computed: {
    loggedin() {
      return this.$store.state.loggedin;
    },
  },
};
</script>
