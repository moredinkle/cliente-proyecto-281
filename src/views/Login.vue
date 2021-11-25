<template>
  <div class="Login my-3">
    <h1>Ingresa a tu cuenta o registrate</h1>
    <v-container class="">
        <v-layout row wrap justify-space-around pa-2>
            <v-flex xs12 md5 my-4>
                <v-card  elevation="3" class="grey lighten-4" pa-3>
                    <v-card-title> Registro </v-card-title>
                    <v-card-text>
                        <FormRegistro/>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs12 md5 my-4>
                <v-card class="grey lighten-4" pa-3>
                    <v-card-title> Login </v-card-title>
                    <v-card-text>
                        <FormLogin/>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
    
  </div>
</template>

<script>
import FormLogin from '../components/Login/FormLogin';
import FormRegistro from '../components/Login/FormRegistro';

  export default {
    name: 'Login',

    components: {
        FormRegistro,
        FormLogin,
    },
  }
</script>