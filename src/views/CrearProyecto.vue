<template>
  <div class="CrearProyecto">
    <div class="class py-3 px-5">
        <FormCrearProyecto />
    </div>
  </div>
</template>

<script>
import FormCrearProyecto from "../components/Proyectos/FormCrearProyecto.vue";

export default {
  name: "CrearProyecto",

  components: {
    FormCrearProyecto,
  },
};
</script>
