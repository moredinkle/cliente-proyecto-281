<template>
  <div class="MenuTarjetas">
    <v-container class="my-5">
      <v-card outlined tile class="pa-2">
        <v-card-title primary-title>
          Tarjetas de credito
          <v-spacer></v-spacer>
          <v-btn class="ma-auto" tile color="info" @click="dialogCrearTarjeta = true"
            >Añadir tarjeta</v-btn
          >
        </v-card-title>
        <v-layout
          row
          wrap
          justify-center
          v-for="tarjeta in tarjetas"
          :key="tarjeta.numero_tarjeta"
          tile
          pa-3
        >
          <v-flex xs2 md3>
            <div class="class caption black--text">#</div>
            {{ tarjeta.num }}
          </v-flex>
          <v-flex xs7 md6>
            <div class="class caption black--text">Número de tarjeta</div>
            {{ tarjeta.numero_tarjeta }}
          </v-flex>
          <v-flex xs3 md3>
            <div class="class caption black--text">Eliminar</div>
            <v-icon @click="abrirDialogoBorrar(tarjeta.num)">mdi-delete</v-icon>
          </v-flex>
        </v-layout>
      </v-card>
    </v-container>

    <!-- Dialog añadir tarjeta -->
    <v-dialog v-model="dialogCrearTarjeta" width="500px">
      <v-card>
        <v-card-title primary-title>
          Añadir tarjeta
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="numero_tarjeta"
              :rules="numero_tarjetaRules"
              label="Numero de tarjeta"
              type="number"
              hint="Debe tener 16 digitos"
              required
            ></v-text-field>

            <v-text-field
              v-model="cod_seguridad"
              :rules="cod_seguridadRules"
              label="Codigo de seguridad"
              type="number"
              hint="Debe tener 3 digitos"
              required
            ></v-text-field>

            <v-text-field
              v-model="clave"
              :rules="claveRules"
              label="PIN"
              type="number"
              hint="Debe tener 4 digitos"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn tile color="success" @click="validate">Guardar</v-btn>
          <v-spacer></v-spacer>
          <v-btn tile color="info" @click="reset">Vaciar</v-btn>
          <v-spacer></v-spacer>
          <v-btn tile color="warning" @click="dialogCrearTarjeta = false"
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog eliminar tarjeta -->
    <v-dialog v-model="dialogEliminarTarjeta" width="500px">
      <v-card>
        <v-card-title primary-title>
          Eliminar tarjeta
        </v-card-title>
        <v-card-text>
          <h3>
            ¿Estas seguro que quieres eliminar esta tarjeta? <br />
            Esta acción no se puede deshacer.
          </h3>
        </v-card-text>
        <v-card-actions>
          <v-btn tile color="error" @click="eliminarTarjeta()">Eliminar</v-btn>
          <v-spacer></v-spacer>
          <v-btn tile color="success" @click="dialogEliminarTarjeta = false"
            >Cancelar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
let url = "https://api-tanti-auguri.herokuapp.com/api/tarjetas/";
export default {
  name: "MenuTarjetas",

  data: () => ({
    tarjetas: [],
    recibirTarjetas: [],
    tarjeta: { numero_tarjeta: "" },
    dialogEliminarTarjeta: false,
    dialogCrearTarjeta: false,
    valid: true,
    tarjetaAEliminar: 0,
    numero_tarjeta: "",
    numero_tarjetaRules: [
      (v) => !!v || "Numero de tarjeta es obligatorio",
      (v) => (v && v.length == 16) || "Numero de tarjeta debe tener 16 digitos",
    ],
    cod_seguridad: "",
    cod_seguridadRules: [
      (v) => !!v || "Codigo de seguridad obligatorio",
      (v) => (v && v.length == 3) || "Código de seguridad debe tener 3 digitos",
    ],
    clave: "",
    claveRules: [
      (v) => !!v || "PIN de tarjeta es obligatorio",
      (v) => (v && v.length == 4) || "PIN debe tener 4 digitos",
    ],
  }),

  created() {
    this.mostrarTarjetas();
  },

  methods: {
    validate() {
      this.$refs.form.validate();
      this.crearTarjeta();
    },

    reset() {
      this.$refs.form.reset();
    },

    abrirDialogoBorrar(num) {
      this.dialogEliminarTarjeta = true;
      this.tarjetaAEliminar = num;
    },

    mostrarTarjetas() {
      axios
        .get(url + this.$store.state.userName)
        .then((response) => {
          if (response.status == 200) {
            this.recibirTarjetas = JSON.parse(JSON.stringify(response.data));
            for (let i = 0; i < response.data.length; i++) {
              let cadena = response.data[i].numero_tarjeta;
              let mostrarTarjeta =
                cadena.substring(0, 4) +
                " **** **** " +
                cadena.substring(12, 16);
              response.data[i].numero_tarjeta = mostrarTarjeta;
              response.data[i].num = i + 1;
            }
            this.tarjetas = response.data;
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
    },

    crearTarjeta() {
      let parametros = {
        numero_tarjeta: this.numero_tarjeta,
        cod_seguridad: this.cod_seguridad,
        clave: this.clave,
      };
      axios
        .post(url + this.$store.state.userName, parametros)
        .then((response) => {
          if (response.status == 200) {
            console.log("Tarjeta guardada con exito");
            this.mostrarTarjetas();
            this.dialogCrearTarjeta = false;
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
    },

    eliminarTarjeta() {
      let ind = this.tarjetaAEliminar - 1;
      axios
        .delete(url + this.recibirTarjetas[ind].numero_tarjeta)
        .then((response) => {
          if (response.status == 200) {
            console.log("Tarjeta eliminada con exito");
            this.mostrarTarjetas();
            this.dialogEliminarTarjeta = false;
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
  },
};
</script>
