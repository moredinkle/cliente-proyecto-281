<template>
  <div class="BarraPrincipal">
    <v-toolbar color="green darken-4" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title
        ><span class="Titulo font-weight-thin"
          >TANTI AUGURI</span
        ></v-toolbar-title
      >

      <v-spacer></v-spacer>

      <v-btn plain v-if="loggedin" @click="logout">
        CERRAR SESIÓN <v-icon right>mdi-logout-variant</v-icon>
      </v-btn>
      <v-btn plain v-else to="/login">
        INICIAR SESIÓN <v-icon right>mdi-login-variant</v-icon>
      </v-btn>
    </v-toolbar>

    <v-navigation-drawer v-model="drawer" app class="green darken-4" temporary>
      <v-list>
        <v-list-item
          v-for="link in links"
          :key="link.text"
          router
          :to="link.route"
        >
          <v-list-item-action>
            <v-icon class="white--text ">{{ link.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="white--text">{{
              link.text
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <div v-if="username === 'superusuario'">
          <v-list-item router to="/observaciones">
            <v-list-item-action>
              <v-icon class="white--text ">mdi-eye</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="white--text">Observaciones</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>

      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: "NuevaBarra",

  components: {},

  computed: {
    loggedin() {
      return this.$store.state.loggedin;
    },
    username() {
      return this.$store.state.userName;
    },
  },

  data() {
    return {
      drawer: false,
      links: [
        {
          icon: "mdi-home-circle-outline",
          text: "Pagina Principal",
          route: "/",
        },
        {
          icon: "mdi-card-multiple-outline",
          text: "Categorias",
          route: "/categorias",
        },
        { icon: "mdi-folder", text: "Mis proyectos", route: "/mis-proyectos" },
        { icon: "mdi-cog-outline", text: "Opciones", route: "/opciones" },
      ],
    };
  },

  methods: {
    logout() {
      this.$store.commit("setdataUser", { nombre_completo: "", username: "" });
      this.$store.commit("salir");
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.Titulo {
  font-family: "Red Hat Display", sans-serif;
  letter-spacing: 6px;
  font-size: 30px;
  font-weight: 100;
}
</style>
