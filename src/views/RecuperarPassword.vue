<template>
  <div class="RecuperarPassword my-3">
    <h1>Ingresa los datos correctamente para recuperar tu contraseña</h1>
    <v-container class="">
        <v-layout row wrap justify-space-around pa-2>
            <v-flex xs8 md8 my-4>
                <v-card  elevation="3" class="grey lighten-4" pa-3>
                    <v-card-title> Recuperar contraseña </v-card-title>
                    <v-card-text>
                        <FormRecuperarPassword/>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
  </div>
</template>

<script>
import FormRecuperarPassword from '../components/Login/FormRecuperarPassword.vue';

  export default {
    name: 'RecuperarPassword',

    components: {
        FormRecuperarPassword,
    },
  }
</script>