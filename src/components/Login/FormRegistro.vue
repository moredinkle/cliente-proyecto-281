<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >
    <v-text-field
      v-model="nombre_completo"
      :counter="50"
      :rules="nombre_completoRules"
      label="Nombre completo"
      required
    ></v-text-field>

    <v-select
      v-model="selectPais"
      :items="items"
      :rules="[v => !!v || 'Debes escoger un pais']"
      label="Pais"
      required
    ></v-select>

    <v-text-field
      v-model="email"
      :rules="emailRules"
      label="E-mail"
      required
    ></v-text-field>

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

    <v-row justify="center" my-2>
      <v-btn :disabled="!valid" color="success" class="mr-4 my-4" @click="validate"> Registrar </v-btn>
      <v-btn color="warning" class="mr-4 my-4" @click="reset">Vaciar</v-btn>
    </v-row>
    
    <v-alert
      class="my-4 text-center error"
      v-model="alerta"
      close-text="Cerrar"
      dark
      dismissible
    >
      {{msgalerta}}
    </v-alert>

  </v-form>
</template>


<script>
  import axios from "axios";
  import emailjs from 'emailjs-com';
  let url = 'https://api-tanti-auguri.herokuapp.com/api/usuarios'
  
  export default {
    name: 'FormRegistro',

    data: () => ({
      valid: true,
      nombre_completo: '',
      nombre_completoRules: [
        v => !!v || 'Nombre es obligatorio',
        v => (v && v.length <= 50) || 'El nombre debe tener un máximo de 50 caracteres',
      ],
      username: '',
      usernameRules: [
        v => !!v || 'Nombre de usuario es obligatorio',
        v => (v && v.length <= 50) || 'El nombre de usuario debe tener un máximo de 50 caracteres',
      ],
      email: '',
      emailRules: [
        v => !!v || 'Dirección de e-mail obligatoria',
        v => /.+@.+\..+/.test(v) || 'La dirección de e-mail debe ser valida',
      ],
      
      selectPais: null,
      items: ['Alemania', 'Argentina', 'Austria', 'Bolivia', 'Brasil', 'Canada', 'Chile', 'China', 'Colombia', 'Croacia', 'Ecuador', 'España', 'Estados Unidos', 'Francia', 'Grecia', 'Hong Kong', 'Hungría', 'India', 'Italia', 'Japon', 'Malasia', 'Mexico', 'Paraguay', 'Países Bajos', 'Peru', 'Polonia', 'Portugal', 'Reino Unido', 'Rusia', 'Tailandia', 'Turquía', 'Uruguay', 'Venezuela'],

      show: false,
      password: '',
      passwordRules: [
        v => !!v || 'Contraseña obligatoria',
        v => v.length >= 8 || 'Minimo 8 caracteres',
      ],

      msgalerta: '',
      alerta: false
    }),

    methods: {
      validate () {
        this.$refs.form.validate()
        this.registrar()
      },
      reset () {
        this.$refs.form.reset()
      },
      registrar() {
        let parametros = {nombre_completo: this.nombre_completo, username: this.username, email: this.email, password: this.password, pais:this.selectPais}
        axios.post(url+'/registro', parametros).then(response => {
          if(response.status == 200) {
            console.log(response.data)
            let datauser = {nombre_completo: this.nombre_completo, username: this.username, userId: response.data.insertId}
            this.$store.commit('setdataUser', datauser)
            this.$store.commit('entrar')
            //enviar correo a cuenta creada
            let dataMail = {to_name: this.nombre_completo, to_email: this.email}
            emailjs.send("service_6vhsc3d","template_rv90eac",dataMail,"user_ywiwSUxFjbJ5WTFp5iZ31").then((result) => {
                console.log('Correo enviado con exito', result.text);
            }, (error) => {
                console.log('Algo malió sal', error);
            });

            this.$router.push('/')
          }
        }).catch(error => {
          this.alerta = true;
          this.msgalerta = error.response.data;
        });
      }
    },
  }
</script>