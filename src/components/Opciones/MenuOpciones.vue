<template>
  <div class="MenuOpciones">
    <v-container class="">
      <v-card outlined tile>
        <v-card-title primary-title>
          <h3 class="headline mb-0">
            Opciones usuario
          </h3>
        </v-card-title>
        <v-row justify="space-around" align="center" class="pa-5">
          <v-btn
            tile
            color="primary"
            @click.stop="dialogPassword = true"
            class="my-2 mx-auto"
          >
            <v-icon left>mdi-pencil-lock</v-icon> Cambiar contraseña</v-btn
          >
          <v-btn
            tile
            color="primary"
            @click.stop="getDatosUsuario"
            class="my-2 mx-auto"
          >
            <v-icon left>mdi-pencil</v-icon> Editar información</v-btn
          >
          <v-btn tile color="error" class="my-2 mx-auto" @click.stop="dialogEliminarCuenta = true">
            <v-icon left>mdi-delete-forever</v-icon> Eliminar cuenta</v-btn
          >
        </v-row>
      </v-card>
    </v-container>

    <!-- Formulario editar y guardar información -->
    <v-dialog v-model="dialogEditar" width="500px">
      <v-card>
        <v-card-title primary-title>
          Editar información
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid" lazy-validation ref="form">
            <v-text-field
              v-model="nombre_completo"
              :counter="50"
              :rules="nombre_completoRules"
              label="Nombre completo"
              required
              filled
            ></v-text-field>

            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              required
              filled
            ></v-text-field>

            <v-select
              v-model="selectPais"
              :items="items"
              :rules="[(v) => !!v || 'Debes escoger un pais']"
              label="Pais"
              required
              filled
            ></v-select>

            <v-row justify="center">
              <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4 my-4"
                @click="guardarCambioInfoUsuario"
              >
                Guardar
              </v-btn>
              <v-btn color="error" class="mr-4 my-4" @click="dialogEditar=false"
                >Cancelar</v-btn
              >
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>


    <!-- Formulario cambiar contraseña -->
    <v-dialog v-model="dialogPassword" width="500px">
      <v-card>
        <v-card-title primary-title>
          Cambiar contraseña
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid" lazy-validation ref="form">
            <v-text-field
              v-model="password"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="passwordRules"
              :type="show ? 'text' : 'password'"
              label="Contraseña actual"
              hint="Minimo 8 caracteres"
              @click:append="show = !show"
              required
            ></v-text-field>

            <v-text-field
              v-model="passwordNueva"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="passwordRules"
              :type="show ? 'text' : 'password'"
              label="Nueva Contraseña"
              hint="Minimo 8 caracteres"
              @click:append="show = !show"
              required
            ></v-text-field>

            <v-row justify="center">
              <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4 my-4"
                @click="cambiarPassword"
              >
                Guardar
              </v-btn>
              <v-btn color="warning" class="mr-4 my-4" @click="reset"
                >Vaciar</v-btn
              >
              <v-btn color="error" class="mr-4 my-4" @click="dialogPassword=false"
                >Cancelar</v-btn
              >
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>


    <!-- Dialog eliminar cuenta -->
    <v-dialog v-model="dialogEliminarCuenta" width="500px">
      <v-card>
        <v-card-title primary-title>
          Eliminar cuenta
        </v-card-title>
        <v-card-text>
          <h3>¿Estas seguro que quieres eliminar tu cuenta? <br>
          Esta acción no se puede deshacer. </h3>
        </v-card-text>
        <v-card-actions>
          <v-btn tile color="error" @click="eliminarCuenta">Eliminar</v-btn>
          <v-spacer></v-spacer>
          <v-btn tile color="success" @click="dialogEliminarCuenta = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-alert
      class="my-4 text-center warning"
      v-model="alerta"
      close-text="Cerrar"
      dark
      dismissible
    >
      {{msgalerta}}
    </v-alert>

  </div>
</template>

<script>
import axios from "axios";
let url = "https://api-tanti-auguri.herokuapp.com/api/usuarios";
export default {
  name: "MenuOpciones",

  components: {},

  data: () => ({
    dialogEditar: false,
    dialogPassword: false,
    dialogEliminarCuenta: false,
    alerta: false,
    msgalerta: '',

    valid: true,
    nombre_completo: "",
    nombre_completoRules: [
      (v) => !!v || "Nombre es obligatorio",
      (v) =>
        (v && v.length <= 50) ||
        "El nombre debe tener un máximo de 50 caracteres",
    ],

    email: "",
    emailRules: [
      (v) => !!v || "Dirección de e-mail obligatoria",
      (v) => /.+@.+\..+/.test(v) || "La dirección de e-mail debe ser valida",
    ],

    show: true,
    password: "",
    passwordNueva: "",
    passwordRules: [
      (v) => !!v || "Contraseña obligatoria",
      (v) => v.length >= 8 || "Minimo 8 caracteres",
    ],

    selectPais: null,
    items: [
      "Alemania",
      "Argentina",
      "Austria",
      "Bolivia",
      "Brasil",
      "Canada",
      "Chile",
      "China",
      "Colombia",
      "Croacia",
      "Ecuador",
      "España",
      "Estados Unidos",
      "Francia",
      "Grecia",
      "Hong Kong",
      "Hungría",
      "India",
      "Italia",
      "Japon",
      "Malasia",
      "Mexico",
      "Paraguay",
      "Países Bajos",
      "Peru",
      "Polonia",
      "Portugal",
      "Reino Unido",
      "Rusia",
      "Tailandia",
      "Turquía",
      "Uruguay",
      "Venezuela",
    ],
  }),

  methods: {
    validate() {
      this.$refs.form.validate();
    },

    reset() {
      this.$refs.form.reset();
    },

    getDatosUsuario() {
      this.dialogEditar = true;
      axios.get(url + "/" + this.$store.state.userName).then((res) => {
        this.nombre_completo = res.data[0].nombre_completo;
        this.email = res.data[0].email;
        this.selectPais = res.data[0].pais;
      });
    },

    guardarCambioInfoUsuario() {
      let params = {
        nombre_completo: this.nombre_completo,
        email: this.email,
        pais: this.selectPais,
      };
      axios
        .put(url + "/" + this.$store.state.userName, params)
        .then((res) => {
          console.log("Actualizado correctamente", res);
          this.alerta = true;
          this.msgalerta = res.data;
        })
        .catch((err) => {
          console.log("Malió sal", err);
          this.alerta = true;
          this.msgalerta = err.res.data;
        });
      this.dialogEditar = false;
    },

    cambiarPassword() {
      let params = {
        username: this.$store.state.userName,
        password: this.password
      }
      let newUrl = url + "/" + this.$store.state.userName + "/comparar-password";
      let newUrl2 = url + "/" + this.$store.state.userName + "/cambiar-password";
      axios.post(newUrl,params).then((res) => {
        console.log("Contraseña correcta", res.data);
        axios.put(newUrl2, {password: this.passwordNueva}).then((resp) => {
            console.log('Contraseña acutalizada', resp.data)
            this.alerta = true;
            this.msgalerta = resp.data;
        }).catch((err) => {
          console.log('malio sal',err);
          this.alerta = true;
          this.msgalerta = err.resp.data;
        });
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
          this.alerta = true;
          this.msgalerta = error.response.data
        }
      });
      this.dialogPassword = false;
    },

    eliminarCuenta(){
      axios.delete(url+'/'+this.$store.state.userName).then(response => {
        console.log(response);
        this.$store.commit('setdataUser', {nombre_completo:'', username:''} )
        this.$store.commit('salir')
        this.$router.push('Principal')
       }).catch((error)=>{
        if (error.response) {
          console.log(error.response.data);
          this.alerta = true;
          this.msgalerta = error.response.data
        }
       });
      
    },
  },
};
</script>
