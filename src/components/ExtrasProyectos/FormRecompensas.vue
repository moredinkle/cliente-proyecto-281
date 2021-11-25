<template>
  <div class="FormRecompensas my-3">
    <div class="black--text">
      <h2>Recompensas {{ nombreProyecto }}</h2>
      <h4 class="my-2">
        Ofrece recompensas a las personas que apoyan tu proyecto!
      </h4>
    </div>

    <v-data-table
      :headers="headers"
      :items="recompensas"
      sort-by="monto_minimo"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Recompensas</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn :disabled="!proyectoCreado" color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Nueva recompensa
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
                          v-model="editedItem.monto_minimo"
                          label="Minimo"
                          hint="¿Cual es el monto minimo para acceder a esta recompensa?"
                          required
                          filled
                          type="number"
                          :rules="monto_minimoRules"
                          clearable
                          clear-icon="mdi-close-circle"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="editedItem.monto_maximo"
                          label="Maximo"
                          hint="¿Cual es el monto maximo para acceder a esta recompensa?"
                          required
                          filled
                          type="number"
                          :rules="monto_maximoRules"
                          clearable
                          clear-icon="mdi-close-circle"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-col cols="12">
                      <v-textarea
                        v-model="editedItem.descripcion_recompensa"
                        label="Descripcion recompensa"
                        hint="¿En que consiste esta recompensa?"
                        required
                        outlined
                        filled
                        :counter="500"
                        :rules="descripcion_recompensaRules"
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
                >¿Estas seguro que quieres eliminar esta
                recompensa?</v-card-title
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
import axios from 'axios'
let url = "https://api-tanti-auguri.herokuapp.com/api/proyectos/"
export default {
  name: "FormRecompensas",
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
    id_proyecto: 0,
    monto_minimo: null,
    monto_minimoRules: [
      (v) => !!v || "Campo obligatorio",
      (v) =>
        (v && parseInt(v) > 0) || "No puedes tener un monto minimo negativo :/",
    ],
    monto_maximo: null,
    monto_maximoRules: [
      (v) => !!v || "Campo obligatorio",
      // TODO: Controlar que sea mayor al momento de guardar
    ],
    descripcion_recompensa: "",
    descripcion_recompensaRules: [
      (v) => !!v || "Campo obligatorio",
      (v) => (v && v.length <= 500) || "Máximo 500 caracteres",
    ],
    headers: [
      {
        text: "Recompensa",
        align: "start",
        sortable: false,
        value: "descripcion_recompensa",
      },
      { text: "Monto minimo", value: "monto_minimo" },
      { text: "Monto maximo", value: "monto_maximo" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    recompensas: [],
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {
      descripcion_recompensa: "",
      monto_minimo: 0,
      monto_maximo: 0,
      id_recompensa: 0,
    },
    defaultItem: {
      descripcion_recompensa: "",
      monto_minimo: 0,
      monto_maximo: 0,
      id_recompensa: 0,
    },
  }),
  
  created(){
    this.mostrar()
  },
 

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nueva recompensa" : "Editar recompensa";
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
    mostrar(){
      axios
        .get(url + this.idProyectoCreado +'/recompensas')
        .then((response) => {
          if (response.status == 200) {
            this.recompensas = JSON.parse(JSON.stringify(response.data));
          }
        })
        .catch((error) => {
          console.log(error.response);
          if(error.response.status == 400) alert("Error al guardar recompensa")
          else alert("Error de servidor")
        });
    },

    editItem(item) {
      this.editedIndex = this.recompensas.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.recompensas.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      //version final
      axios
        .delete(url + 'recompensas/' + this.editedItem.id_recompensa)
        .then((response) => {
          if (response.status == 200) {
            this.mostrar();
          }
        })
        .catch((error) => {
          console.log(error.response);
          if(error.response.status == 400) alert("Error al eliminar recompensa")
          else alert("Error de servidor")
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
        monto_minimo: this.editedItem.monto_minimo,
        monto_maximo: this.editedItem.monto_maximo,
        descripcion_recompensa: this.editedItem.descripcion_recompensa,
      }
      if (this.editedIndex > -1) {
        //editar
        axios
        .put(url + 'recompensas/' + this.editedItem.id_recompensa, data)
        .then((response) => {
          if (response.status == 200) {
            this.mostrar();
          }
        })
        .catch((error) => {
          console.log(error.response);
          if(error.response.status == 400) alert("Error al editar recompensa")
          else alert("Error de servidor")
        });
      } else {
        //crear nuevo
        axios
        .post(url + this.idProyectoCreado+'/recompensas', data)
        .then((response) => {
          if (response.status == 200) {
            this.mostrar();
          }
        })
        .catch((error) => {
          console.log(error.response);
          if(error.response.status == 400) alert("Error al crear recompensa")
          else alert("Error de servidor")
        });
      }
      this.close();
    },
  },
};
</script>
