<template>
  <div class="Comentarios">
    <v-card class="mt-2">
      <v-card-title> Comentarios </v-card-title>
      <v-card-text>
        <v-row class="px-2 pt-2">
          <v-text-field
          label="Comentar"
          outlined
          v-model="texto_comentario"
          ></v-text-field>
          <v-btn icon color="indigo" @click="comentar"><v-icon>mdi-send</v-icon></v-btn>
        </v-row>
        <v-row
          cols="12"
          v-for="comentario in comentarios"
          :key="comentario.id_comentario"
        >
          <v-col cols="12">
            <v-card class="full-height" outlined>
              <v-card-text
                class="full-height pa-2 d-flex flex-column text-left black--text"
              >
                {{ comentario.username }}
                <v-divider></v-divider>
                {{ comentario.texto_comentario }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
let url = "https://api-tanti-auguri.herokuapp.com/api/proyectos/";

export default {
  name: "Comentarios",

  data: () => ({
    comentarios: [],
    texto_comentario: "",
  }),

  created() {
    this.getComentarios();
  },

  methods: {
    getComentarios() {
      axios
        .get(url + "ver-comentarios/" + this.$route.params.id_proyecto)
        .then((response) => {
          if (response.status == 200) {
            this.comentarios = JSON.parse(JSON.stringify(response.data));
          }
        })
        .catch((error) => {
          console.log(error.response);
          alert("Error. Intenta recargar la página.");
        });
    },

    comentar() {
      let data = {
        texto_comentario: this.texto_comentario,
        id_usuario: this.$store.state.userId,
        id_proyecto: this.$route.params.id_proyecto
      }
      axios
        .post(url + "comentarios",data)
        .then((response) => {
          if (response.status == 200) {
            this.getComentarios();
            this.texto_comentario = ''
          }
        })
        .catch((error) => {
          console.log(error.response);
          alert("Error. Intenta recargar la página.");
        });
    }
  },
};
</script>
