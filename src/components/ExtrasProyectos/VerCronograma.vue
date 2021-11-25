<template>
  <div class="VerCronograma my-10">
    <div v-if="numActividades > 0">
      <h3 class="black--text">Cronograma</h3>
      <v-data-table
        :headers="headers"
        :items="actividades"
        sort-by="nombre_actividad"
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
  name: "VerCronograma",
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
        text: "Actividad",
        align: "start",
        sortable: false,
        value: "nombre_actividad",
      },
      { text: "Lugar", value: "lugar_actividad" },
      { text: "Fecha", value: "fecha_actividad" },
      { text: "Hora", value: "hora_actividad" },
    ],
    actividades: [],
    numActividades: 0,
  }),

  created() {
    this.mostrar();
  },

  methods: {
    mostrar() {
      axios
        .get(url + this.idProyecto + "/actividades")
        .then((response) => {
          if (response.status == 200) {
            this.actividades = JSON.parse(JSON.stringify(response.data));
            for (let i = 0; i < this.actividades.length; i++) {
              let aux = this.actividades[i].fecha_actividad;
              this.actividades[i].fecha_actividad = aux.slice(0, 10);
              this.actividades[i].hora_actividad = this.actividades[i].hora_actividad.slice(0, 5);
              this.numActividades = response.data.length;
            }
          }
        })
        .catch((error) => {
          console.log(error.response);
          if (error.response.status == 400)
            alert("Error al mostrar actividades");
          else alert("Error de servidor");
        });
    },
  },
};
</script>
