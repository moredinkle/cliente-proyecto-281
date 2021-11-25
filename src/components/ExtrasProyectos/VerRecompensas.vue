<template>
  <div class="VerRecompensas my-3">
    <div v-if="numRecompensas > 0">
      <h3 class="black--text">Recompensas</h3>
      <v-data-table
        :headers="headers"
        :items="recompensas"
        sort-by="monto_minimo"
        class="elevation-1"
      >
      </v-data-table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
let url = "https://api-tanti-auguri.herokuapp.com/api/proyectos/";
export default {
  name: "VerRecompensas",
  props: {
    nombreProyecto: {
      type: String,
      default: "",
    },
    idProyecto: {
      type: Number,
      default: 0,
    },
  },

  data: () => ({
    headers: [
      {
        text: "Recompensa",
        align: "start",
        sortable: false,
        value: "descripcion_recompensa",
      },
      { text: "Monto minimo", value: "monto_minimo" },
      { text: "Monto maximo", value: "monto_maximo" },
    ],
    recompensas: [],
    numRecompensas: 0,
  }),

  mounted() {
    this.mostrar();
  },

  methods: {
    mostrar() {
      axios
        .get(url + this.$route.params.id_proyecto + "/recompensas")
        .then((response) => {
          if (response.status == 200) {
            this.recompensas = JSON.parse(JSON.stringify(response.data));
            this.numRecompensas = response.data.length;
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
