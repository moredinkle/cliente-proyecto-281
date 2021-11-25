<template>
  <div class="Observaciones">
    <h1 class="my-5 green-darken-3--text">Observaciones</h1>

    <v-data-table
      :headers="headers"
      :items="observaciones"
      sort-by="id_proyecto"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Observaciones</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <!--<template v-slot:activator="{ on, attrs }">
              <v-btn
                :disabled="!proyectoCreado"
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                Nueva recompensa
              </v-btn>
            </template> -->
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                      <v-col cols="12" sm="6" class="mx-4">
                        <v-select
                          v-model="editedItem.urgencia"
                          :items="itemsUrgencia"
                          :rules="[(v) => !!v || 'Debes escoger una categoria']"
                          label="Urgencia"
                          required
                          filled
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-col cols="12">
                      <v-textarea
                        v-model="editedItem.descripcion_observacion"
                        label="Descripcion observacion"
                        required
                        outlined
                        filled
                        :counter="500"
                        :rules="descripcion_observacionRules"
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
import axios from "axios";
let url = "https://api-tanti-auguri.herokuapp.com/api/observaciones";

export default {
  name: "Observaciones",

  data: () => ({
    observaciones: [],
    valid: false,
    urgencia: "",
    itemsUrgencia: ["Leve", "Moderado", "Importante", "Urgente"],
    descripcion_observacion: "",
    descripcion_observacionRules: [
      (v) => !!v || "Campo obligatorio",
      (v) => (v && v.length <= 500) || "Máximo 500 caracteres",
    ],
    headers: [
      {
        text: "Observación",
        align: "start",
        sortable: false,
        value: "descripcion_observacion",
      },
      { text: "Urgencia", value: "urgencia" },
      { text: "ID Proyecto", value: "id_proyecto" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {
      id_observacion: 0,
      descripcion_observacion: "",
      urgencia: "",
    },
    defaultItem: {
      descripcion_observacion: "",
      urgencia: "",
    },
  }),

  created() {
    this.mostrar();
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
    mostrar() {
      axios
        .get(url)
        .then((response) => {
          if (response.status == 200) {
            this.observaciones = JSON.parse(JSON.stringify(response.data));
          }
        })
        .catch((error) => {
          console.log(error.response);
          alert("Error. Intenta recargar la página.");
        });
    },

    editItem(item) {
      this.editedIndex = this.observaciones.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.observaciones.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      //version final
      axios
        .delete(url + '/' + this.editedItem.id_observacion)
        .then((response) => {
          if (response.status == 200) {
            this.mostrar();
          }
        })
        .catch((error) => {
          console.log(error.response);
          if (error.response.status == 400)
            alert("Error al eliminar observacion");
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
      let data = {
        descripcion_observacion: this.editedItem.descripcion_observacion,
        urgencia: this.editedItem.urgencia
      };
      if (this.editedIndex > -1) {
        //editar
        axios
          .put(url + "/" + this.editedItem.id_observacion, data)
          .then((response) => {
            if (response.status == 200) {
              this.mostrar();
            }
          })
          .catch((error) => {
            console.log(error.response);
            if (error.response.status == 400)
              alert("Error al editar observacion");
            else alert("Error de servidor");
          });
      } else {
        console.log('no')
      }
      this.close();
    },
  },
};
</script>
