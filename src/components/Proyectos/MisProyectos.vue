<template>
  <div class="Mis Proyectos">
    <v-container class="my-5">
      <v-row>
        <v-col cols="12" sm="6" md="4" v-for="miProyecto in misProyectos" :key="miProyecto.id_proyecto">
          <v-card class="full-height">
            <v-img
              height="250"
              :src= miProyecto.logo_proyecto
            ></v-img>
            <v-card-title class="full-height pa-2 d-flex flex-column">
              {{miProyecto.nombre_proyecto}}
            </v-card-title>
            <v-card-text class="full-height pa-2 d-flex flex-column text-left black--text">
              {{miProyecto.objetivo}}
              <v-divider></v-divider>
              {{miProyecto.fecha_inicio}} - {{miProyecto.fecha_fin}}
              <v-divider></v-divider>
              {{miProyecto.monto_actual}} Bs. recaudados de {{miProyecto.monto_objetivo}} Bs. necesarios.
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text tile color="success" :to="'ver-proyecto/'+miProyecto.id_proyecto">Ver</v-btn>
              <v-btn text tile color="warning" :to="'editar-proyecto/'+miProyecto.id_proyecto">Editar</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios"
let url = "https://api-tanti-auguri.herokuapp.com/api/proyectos/"
export default {
  name: "MisProyectos",
  data: () => ({
    misProyectos: [],
  }),

  created() {
    this.mostrarMisProyectos();
  },

  methods: {
    mostrarMisProyectos() {
      axios
        .get(url+'usuarios/'+this.$store.state.userId)
        .then((response) => {
          if (response.status == 200) {
            for (let i = 0; i < response.data.length; i++) {
              const element = response.data[i].logo_proyecto;
              response.data[i].logo_proyecto = 'https://api-tanti-auguri.herokuapp.com/'+element;
              response.data[i].fecha_inicio = (response.data[i].fecha_inicio).slice(0,10)
              response.data[i].fecha_fin = (response.data[i].fecha_fin).slice(0,10)
            }
            this.misProyectos = JSON.parse(JSON.stringify(response.data));
          }
        })
        .catch((error) => {
          console.log(error.response);
          alert('Error. Intenta recargar la página.')
        });
    },
  },
};
</script>
