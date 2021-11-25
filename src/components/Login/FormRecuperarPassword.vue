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

    <v-row justify="center" my-6>
      <v-btn :disabled="!valid" color="success" class="mr-4 my-4" @click="verificarInfoUsuario" > Continuar </v-btn>
      <v-btn color="warning" class="mr-4 my-4" @click="reset" >Vaciar</v-btn>
    </v-row>

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>
            Guardar nueva contraseña
        </v-card-title>

        <v-card-text px-3>
            <v-text-field
            v-model="password"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="passwordRules"
            :type="show ? 'text' : 'password'"
            label="Nueva contraseña"
            hint="Minimo 8 caracteres"
            @click:append="show = !show"
            required
            ></v-text-field>

            <v-text-field
            v-model="passwordConfirm"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="passwordConfirmRules"
            :type="show ? 'text' : 'password'"
            label="Confirmar contraseña"
            hint="Minimo 8 caracteres"
            @click:append="show = !show"
            required
            ></v-text-field>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="cambiarPassword">
            Guardar
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
  let url = 'https://api-tanti-auguri.herokuapp.com/api/usuarios'

  export default {
    name: 'FormRecuperarPassword',

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

      show: true,
      password: '',
      passwordRules: [
        v => !!v || 'Contraseña obligatoria',
        v => v.length >= 8 || 'Minimo 8 caracteres',
      ],

      passwordConfirm: '',
      passwordConfirmRules: [
        v => !!v || 'Contraseña obligatoria',
        v => v.length >= 8 || 'Minimo 8 caracteres',
        v => v === this.password || 'Las contraseñas deben ser iguales'
      ],

      msgalerta: '',
      alerta: false,
      dialog: false,
    }),

    methods: {
      validate () {
        this.$refs.form.validate()
        this.verificarInfoUsuario()
      },

      reset () {
        this.$refs.form.reset()
      },

      registrar() {
        let parametros = {nombre_completo: this.nombre_completo, username: this.username, email: this.email, password: this.password, pais:this.selectPais}
        axios.post(url+'/registro', parametros).then(response => {
          if(response.status == 200) {
            let datauser = {nombre_completo: this.nombre_completo, username: this.username}
            this.$store.commit('setdataUser', datauser)
            this.$store.commit('entrar')
            this.$router.push('Principal')
          }
        }).catch(error => {
          this.alerta = true;
          this.msgalerta = error.response.data;
        });
      },

      verificarInfoUsuario(){
        let newUrl = url+'/'+this.username+'/recuperar-password'
        let parametros = {nombre_completo: this.nombre_completo, username: this.username, email: this.email}
        axios.post(newUrl, parametros).then(response => {
          if(response.status == 200) {
            this.dialog = true;
          }
        }).catch(error => {
          this.alerta = true;
          this.msgalerta = error.response.data;
        });
      },

      cambiarPassword(){
        let newUrl = url+'/'+this.username+'/cambiar-password'
        if(this.password === this.passwordConfirm){
          axios.put(newUrl, {password: this.password}).then(response => {
            if(response.status == 200) {
              this.dialog = false;
              this.login()
              this.$router.push('Principal')
            }
          }).catch(error => {
            this.dialog = false;
            this.alerta = true;
            this.msgalerta = error.response.data;
          });
        }
        else {
          this.alerta = true;
          this.msgalerta = 'Las contraseñas no coinciden';
        }
      },

      login() {
        let parametros = {username: this.username, password: this.password}
        axios.post(url+'/login', parametros).then(response => {
          if(response.status == 200) {
            let datauser = {nombre_completo: this.nombre_completo, username: this.username}
            this.$store.commit('setdataUser', datauser)
            this.$store.commit('entrar')
            this.$router.push('Principal')
          }
        }).catch(error => {
          this.alerta = true;
          this.msgalerta = error.response.data;
        });
      },
    },
  }
</script>