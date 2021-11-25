<template>
  <div class="PaginaPrincipal">
    <v-container class="my-5">
      <h3 class="mb-3 green--text text--darken-4 text-left">Proyectos destacados</h3>
      <v-row>
        <v-col
          cols="12"
          sm="6"
          md="4"
          v-for="proyecto in proyectos"
          :key="proyecto.id_proyecto"
        >
          <v-card class="full-height">
            <v-img height="250" :src="proyecto.logo_proyecto"></v-img>
            <v-card-title class="full-height pa-2 d-flex flex-column">
              {{ proyecto.nombre_proyecto }}
            </v-card-title>
            <v-card-text
              class="full-height pa-2 d-flex flex-column text-left black--text"
            >
              {{ proyecto.objetivo }}
              <v-divider></v-divider>
              {{ proyecto.fecha_inicio }} - {{ proyecto.fecha_fin }}
              <v-divider></v-divider>
              {{ proyecto.monto_actual }} Bs. recaudados de
              {{ proyecto.monto_objetivo }} Bs. necesarios.
            </v-card-text>
            <v-card-actions>
              <!--<v-btn icon color="indigo">
                <v-icon>mdi-thumb-up-outline</v-icon>
                {{ proyecto.numero_me_gusta }}
              </v-btn>-->
              <v-spacer></v-spacer>
              <v-btn
                text
                tile
                color="success"
                :to="'ver-proyecto/' + proyecto.id_proyecto"
                >Ver</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="ma-3" justify="center" align = "center">
        <v-btn class="ma-2" tile text color="info" @click="anteriores10">Anterior</v-btn>
        <v-btn class="ma-2" tile text color="info" @click="siguientes10">Siguiente</v-btn>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios"
import Vue2Filters from "vue2-filters"
let url = "https://api-tanti-auguri.herokuapp.com/api/proyectos-activos"
export default {
  name: "VistaPrincipal",
  data: () => ({
    proyectos: [],
    liminf: 0,
    limsup: 10,
    numpaginas: 0,
  }),

  mixins: [Vue2Filters.mixin],

  created() {
    this.mostrarProyectos();
  },

  methods: {
    mostrarProyectos() {
      axios
        .get(url)
        .then((response) => {
          if (response.status == 200) {
            for (let i = 0; i < response.data.length; i++) {
              const element = response.data[i].logo_proyecto;
              response.data[i].logo_proyecto =
                "https://api-tanti-auguri.herokuapp.com/" + element;
              response.data[i].fecha_inicio = response.data[i].fecha_inicio.slice(0, 10);
              response.data[i].fecha_fin = response.data[i].fecha_fin.slice(0,10);
            }
            this.numpaginas = response.data.length/10;
            this.proyectos = JSON.parse(JSON.stringify(response.data));
          }
        })
        .catch((error) => {
          console.log(error.response);
          alert("Error. Intenta recargar la página.");
        });
    },

    siguientes10(){
      let control = Math.floor(this.numpaginas)
      if(this.liminf < control*10){
        this.liminf += 10
        this.limsup += 10
        this.$vuetify.goTo(0,{duration: 200})
      }
    },

    anteriores10(){
      if(this.liminf > 0){
        this.liminf -= 10
        this.limsup -= 10
        this.$vuetify.goTo(0,{duration: 200})
      }
    },

  },
};
</script>
