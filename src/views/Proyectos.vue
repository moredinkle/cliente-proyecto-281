<template>
  <div class="Proyectos" justify-center align-center>
    <div v-if="loggedin" class="ma-5">
      <v-row class="ma-5">
        <h1>Proyectos</h1>
        <v-spacer></v-spacer>
        <v-btn tile large color="primary" to="/crear-proyecto">Crear proyecto</v-btn>
      </v-row>
      <div class="Mis proyectos">
        <h2 class="align-start">Mis proyectos</h2>
        <MisProyectos />
      </div>
      <div class="Proyectos financiados">
        <ObservacionesUsuario />
      </div>
    </div>
    <div v-else class="py-5">
      <h2>Oh Oh</h2>
      <h3>Necesitas iniciar sesión para ver esta sección</h3>
    </div>
  </div>
</template>

<script>
import MisProyectos from "../components/Proyectos/MisProyectos.vue";
import ObservacionesUsuario from "../components/Proyectos/ObservacionesUsuario.vue";


export default {
  name: "Proyectos",

  components: {
    MisProyectos,
    ObservacionesUsuario,
  },

  computed: {
    loggedin() {
      return this.$store.state.loggedin;
    },
  },
};
</script>
