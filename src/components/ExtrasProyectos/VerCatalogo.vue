<template>
  <div class="VerCatalogo my-5">
    <div v-if="numProductos > 0">
      <h3 class="black--text">Catalogo</h3>
      <v-data-table
        :headers="headers"
        :items="productos"
        sort-by="monto_minimo"
        class="elevation-1"
      >
      </v-data-table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
let url = "https://api-tanti-auguri.herokuapp.com/api/proyectos/";

export default {
  name: "VerCatalogo",
  props: {
    nombreProyecto: {
      type: String,
      default: "",
    },
    idProyecto: {
      type: Number,
      default: 0,
    },
  },

  data: () => ({
    headers: [
      {
        text: "Producto",
        align: "start",
        sortable: false,
        value: "nombre_producto",
      },
      { text: "Descripción", value: "descripcion_producto" },
      { text: "Precio", value: "precio_producto" },
    ],
    productos: [],
    numProductos: 0,
  }),

  created() {
    this.mostrar();
  },

  methods: {
    mostrar() {
      axios
        .get(url + this.idProyecto + "/productos")
        .then((response) => {
          if (response.status == 200) {
            this.productos = JSON.parse(JSON.stringify(response.data));
            this.numProductos = response.data.length;
          }
        })
        .catch((error) => {
          console.log(error.response);
          if (error.response.status == 400) alert("Error al mostrar productos");
          else alert("Error de servidor");
        });
    },
  },
};
</script>
