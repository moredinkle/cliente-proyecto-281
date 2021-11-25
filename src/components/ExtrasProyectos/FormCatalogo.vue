<template>
  <div class="FormCatalogo my-10">
    <div class="black--text">
      <h2>Catalogo {{ nombreProyecto }}</h2>
      <h4 class="my-2">
        Crea un catalogo de productos para tu proyecto!
      </h4>
    </div>

    <v-data-table
      :headers="headers"
      :items="productos"
      sort-by="monto_minimo"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Catalogo</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Nuevo producto
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="editedItem.nombre_producto"
                          label="Nombre producto"
                          required
                          filled
                          :counter="50"
                          :rules="nombre_productoRules"
                          clearable
                          clear-icon="mdi-close-circle"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="editedItem.precio_producto"
                          label="Precio producto"
                          required
                          filled
                          type="number"
                          :rules="precio_productoRules"
                          clearable
                          clear-icon="mdi-close-circle"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-col cols="12">
                      <v-textarea
                        v-model="editedItem.descripcion_producto"
                        label="Descripcion producto"
                        hint="¿En que consiste este producto?"
                        required
                        outlined
                        filled
                        :counter="500"
                        :rules="descripcion_productoRules"
                        clearable
                        auto-grow
                        clear-icon="mdi-close-circle"
                      ></v-textarea>
                    </v-col>
                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn tile color="blue darken-1" text @click="close">
                  Cancelar
                </v-btn>
                <v-btn
                  tile
                  :disabled="!valid"
                  color="blue darken-1"
                  text
                  @click="save"
                >
                  Guardar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete">
            <v-card>
              <v-card-title class="text-h5 align-center justify-center"
                >¿Estas seguro que quieres eliminar este producto?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancelar</v-btn
                >
                <v-btn color="warning" text @click="deleteItemConfirm"
                  >Continuar</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="mostrar">
          Cargar
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import axios from "axios";
let url = "https://api-tanti-auguri.herokuapp.com/api/proyectos/";

export default {
  name: "FormCatalogo",
  props: {
    nombreProyecto: {
      type: String,
      default: "",
    },
    proyectoCreado: {
      type: Boolean,
    },
    idProyectoCreado: {
      type: Number,
      default: 0,
    },
  },

  data: () => ({
    valid: true,
    nombre_producto: "",
    nombre_productoRules: [
      (v) => !!v || "Campo obligatorio",
      (v) => (v && v.length <= 50) || "Máximo 500 caracteres",
    ],
    precio_producto: null,
    precio_productoRules: [
      (v) => !!v || "Campo obligatorio",
      (v) => (v && parseInt(v) > 0) || "Precio no puede ser negativo",
    ],
    descripcion_producto: "",
    descripcion_productoRules: [
      (v) => !!v || "Campo obligatorio",
      (v) => (v && v.length <= 500) || "Máximo 500 caracteres",
    ],
    headers: [
      {
        text: "Producto",
        align: "start",
        sortable: false,
        value: "nombre_producto",
      },
      { text: "Descripción", value: "descripcion_producto" },
      { text: "Precio", value: "precio_producto" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    productos: [],
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {
      nombre_producto: "",
      descripcion_producto: "",
      precio_producto: null,
      id_producto: 0,
    },
    defaultItem: {
      nombre_producto: "",
      descripcion_producto: "",
      precio_producto: null,
      id_producto: 0,
    },
  }),

  
  created(){
    this.mostrar()
  },
 

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo producto" : "Editar producto";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  methods: {
    mostrar() {
      axios
        .get(url + this.idProyectoCreado + "/productos")
        .then((response) => {
          if (response.status == 200) {
            this.productos = JSON.parse(JSON.stringify(response.data));
          }
        })
        .catch((error) => {
          console.log(error.response);
          if (error.response.status == 400) alert("Error al mostrar productos");
          else alert("Error de servidor");
        });
    },

    editItem(item) {
      this.editedIndex = this.productos.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.productos.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      //version final
      axios
        .delete(url + "productos/" + this.editedItem.id_producto)
        .then((response) => {
          if (response.status == 200) {
            this.mostrar();
          }
        })
        .catch((error) => {
          console.log(error.response);
          if (error.response.status == 400)
            alert("Error al eliminar producto");
          else alert("Error de servidor");
        });
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      let data={
        nombre_producto: this.editedItem.nombre_producto,
        descripcion_producto: this.editedItem.descripcion_producto,
        precio_producto: this.editedItem.precio_producto,
      }
      if (this.editedIndex > -1) {
        //editar
        axios
        .put(url + 'productos/' + this.editedItem.id_producto, data)
        .then((response) => {
          if (response.status == 200) {
            this.mostrar();
          }
        })
        .catch((error) => {
          console.log(error.response);
          if(error.response.status == 400) alert("Error al editar producto")
          else alert("Error de servidor")
        });
      } else {
        //crear nuevo
        axios
        .post(url + this.idProyectoCreado+'/productos', data)
        .then((response) => {
          if (response.status == 200) {
            this.mostrar();
          }
        })
        .catch((error) => {
          console.log(error.response);
          if(error.response.status == 400) alert("Error al crear producto")
          else alert("Error de servidor")
        });
      }
      this.close();
    },
  },
};
</script>
