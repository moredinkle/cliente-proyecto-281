<template>
  <div class="Editar proyecto" justify-center align-center>
    <FormEditarProyecto />
  </div>
</template>

<script>
import FormEditarProyecto from "../components/Proyectos/FormEditarProyecto.vue";


export default {
  name: "Proyectos",

  components: {
    FormEditarProyecto,
  },

  computed: {
    loggedin() {
      return this.$store.state.loggedin;
    },
  },
};
</script>
