<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-text-field
      v-model="username"
      :rules="usernameRules"
      label="Username"
      required
    ></v-text-field>

    <v-text-field
      v-model="password"
      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="passwordRules"
      :type="show ? 'text' : 'password'"
      label="Contraseña"
      hint="Minimo 8 caracteres"
      @click:append="show = !show"
      required
    ></v-text-field>

    <v-row justify="center">
      <v-btn
        :disabled="!valid"
        color="success"
        class="mr-4 my-4"
        @click="validate"
      >
        Ingresar
      </v-btn>
      <v-btn color="warning" class="mr-4 my-4" @click="reset"> Vaciar </v-btn>
    </v-row>

    <v-row justify="center">
      <v-btn text class="my-1 blue--text" to="/recuperar-password">
        ¿Olvidaste tu contraseña?
      </v-btn>
    </v-row>

    <v-alert
      class="my-4 text-center error"
      v-model="alerta"
      close-text="Cerrar"
      dark
      dismissible
    >
      {{ msgalerta }}
    </v-alert>
  </v-form>
</template>

<script>
import axios from "axios";
let url = "https://api-tanti-auguri.herokuapp.com/api/usuarios";

export default {
  name: "FormLogin",

  computed: {},

  data: () => ({
    valid: true,
    nombre_completo: "",
    username: "",
    usernameRules: [
      (v) => !!v || "Nombre de usuario es obligatorio",
      (v) =>
        (v && v.length <= 50) ||
        "El nombre de usuario debe tener un máximo de 50 caracteres",
    ],

    show: false,
    password: "",
    passwordRules: [
      (v) => !!v || "Contraseña obligatoria",
      (v) => v.length >= 8 || "Minimo 8 caracteres",
    ],
    msgalerta: "",
    alerta: false,
  }),

  methods: {
    validate() {
      this.$refs.form.validate();
      this.nombreUser();
      this.login();
    },
    reset() {
      this.$refs.form.reset();
    },
    login() {
      let parametros = { username: this.username, password: this.password };
      axios.post(url + "/login", parametros).then((response) => {
          if (response.status == 200) {
            axios.get(url + "/" + this.username + "/id").then((resp) => {
                let datauser = {
                  nombre_completo: this.nombre_completo,
                  username: this.username,
                  userId: resp.data.id_usuario,
                };
                this.$store.commit("setdataUser", datauser);
                this.$store.commit("entrar");
                this.$router.push("/");
              })
              .catch((err) => {
                this.alerta = true;
                this.msgalerta = err.response.data;
              });
          }
        })
        .catch((error) => {
          this.alerta = true;
          this.msgalerta = error.response.data;
        });
    },

    nombreUser() {
      let urlNombre = url + "/" + this.username + "/nombre";
      axios.get(urlNombre).then((response) => {
        if (response.status == 200) this.nombre_completo = response.data;
      });
    },
  },
};
</script>
