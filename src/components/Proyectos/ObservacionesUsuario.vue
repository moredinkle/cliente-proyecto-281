<template>
  <div class="ObservacionesUsuario my-3">
    <div v-if="numobservaciones > 0">
      <h2 class="black--text mb-3">Observaciones</h2>
      <v-data-table
        :headers="headers"
        :items="observaciones"
        sort-by="nombre_proyecto"
        class="elevation-1"
      >
      </v-data-table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
let url = "https://api-tanti-auguri.herokuapp.com/api/observaciones/";
export default {
  name: "ObservacionesUsuario",

  data: () => ({
    headers: [
      {
        text: "Observacion",
        align: "start",
        sortable: false,
        value: "descripcion_observacion",
      },
      { text: "Urgencia", value: "urgencia" },
      { text: "Nombre proyecto", value: "nombre_proyecto" },
    ],
    observaciones: [],
    numobservaciones: 0,
  }),

  mounted() {
    this.mostrar();
  },

  methods: {
    mostrar() {
      axios
        .get(url + this.$store.state.userId)
        .then((response) => {
          if (response.status == 200) {
            this.observaciones = JSON.parse(JSON.stringify(response.data));
            this.numobservaciones = response.data.length;
          }
        })
        .catch((error) => {
          console.log(error.response);
          if (error.response.status == 400)
            alert("Error al guardar recompensa");
          else alert("Error de servidor");
        });
    },
  },
};
</script>