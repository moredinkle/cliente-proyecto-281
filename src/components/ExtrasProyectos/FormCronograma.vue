<template>
  <div class="FormCronograma my-10">
    <div class="black--text">
      <h2>Cronograma {{nombreProyecto}}</h2>
      <h4 class="my-2">
        Crea un cronograma de actividades para tu proyecto!
      </h4>
    </div>

    <v-data-table
      :headers="headers"
      :items="actividades"
      sort-by="nombre_actividad"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Cronograma</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Nueva actividad
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field
                      v-model="editedItem.nombre_actividad"
                      label="Nombre actividad"
                      required
                      filled
                      :counter="100"
                      :rules="nombre_actividadRules"
                      clearable
                      auto-grow
                      clear-icon="mdi-close-circle"
                    ></v-text-field>
                    <v-text-field
                      v-model="editedItem.lugar_actividad"
                      label="Lugar actividad"
                      required
                      filled
                      :counter="100"
                      :rules="lugar_actividadRules"
                      clearable
                      clear-icon="mdi-close-circle"
                    ></v-text-field>

                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-menu
                          v-model="menuFechaActividad"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              prepend-icon="mdi-calendar"
                              readonly
                              required
                              filled
                              :rules="fecha_actividadRules"
                              v-model="editedItem.fecha_actividad"
                              label="Fecha actividad"
                              hint="YYYY/MM/DD"
                              persistent-hint
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="editedItem.fecha_actividad"
                            no-title
                            @input="menuFechaActividad = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-menu
                          ref="menu"
                          v-model="menuHoraActividad"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          :return-value.sync="hora_actividad"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="editedItem.hora_actividad"
                              label="Hora actividad"
                              prepend-icon="mdi-clock-time-four-outline"
                              readonly
                              required
                              filled
                              :rules="hora_actividadRules"
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-time-picker
                            v-if="menuHoraActividad"
                            v-model="editedItem.hora_actividad"
                            full-width
                            ampm-in-title
                            @click:minute="$refs.menu.save(hora_actividad)"
                          ></v-time-picker>
                        </v-menu>
                      </v-col>
                    </v-row>
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
                actividad?</v-card-title
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
  name: "FormCronograma",
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
    menuFechaActividad: false,
    menuHoraActividad: false,
    nombre_catalogo: "",
    nombre_catalogoRules: [
      (v) => !!v || "Campo obligatorio",
      (v) => (v && v.length <= 100) || "Máximo 100 caracteres",
    ],
    nombre_actividad: "",
    nombre_actividadRules: [
      (v) => !!v || "Campo obligatorio",
      (v) => (v && v.length <= 100) || "Máximo 100 caracteres",
    ],
    lugar_actividad: "",
    lugar_actividadRules: [
      (v) => !!v || "Campo obligatorio",
      (v) => (v && v.length <= 100) || "Máximo 100 caracteres",
    ],
    fecha_actividad: null,
    fecha_actividadRules: [(v) => !!v || "Campo obligatorio"],
    hora_actividad: null,
    hora_actividadRules: [(v) => !!v || "Campo obligatorio"],
    headers: [
      {
        text: "Actividad",
        align: "start",
        sortable: false,
        value: "nombre_actividad",
      },
      { text: "Lugar", value: "lugar_actividad" },
      { text: "Fecha", value: "fecha_actividad" },
      { text: "Hora", value: "hora_actividad" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    actividades: [],
    dialog: false,
    dialogDelete: false,
    editedIndex: -1,
    editedItem: {
      nombre_actividad: "",
      lugar_actividad: "",
      fecha_actividad: "",
      hora_actividad: "",
      id_actividad: 0,
    },
    defaultItem: {
      nombre_actividad: "",
      fecha_actividad: "",
      lugar_actividad: "",
      hora_actividad: "",
      id_actividad: 0,
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
        .get(url + this.idProyectoCreado + "/actividades")
        .then((response) => {
          if (response.status == 200) {
            this.actividades = JSON.parse(JSON.stringify(response.data));
            for (let i = 0; i < this.actividades.length; i++) {
              let aux = this.actividades[i].fecha_actividad;
              this.actividades[i].fecha_actividad = aux.slice(0,10)
            }
          }
        })
        .catch((error) => {
          console.log(error.response);
          if (error.response.status == 400) alert("Error al mostrar actividades");
          else alert("Error de servidor");
        });
    },

    editItem(item) {
      this.editedIndex = this.actividades.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.actividades.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      //version final
      axios
        .delete(url + "actividades/" + this.editedItem.id_actividad)
        .then((response) => {
          if (response.status == 200) {
            this.mostrar();
          }
        })
        .catch((error) => {
          console.log(error.response);
          if (error.response.status == 400)
            alert("Error al eliminar actividad");
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
        nombre_actividad: this.editedItem.nombre_actividad,
        lugar_actividad: this.editedItem.lugar_actividad,
        fecha_actividad: this.editedItem.fecha_actividad,
        hora_actividad: this.editedItem.hora_actividad,
      }
      if (this.editedIndex > -1) {
        //editar
        axios
        .put(url + 'actividades/' + this.editedItem.id_actividad, data)
        .then((response) => {
          if (response.status == 200) {
            this.mostrar();
          }
        })
        .catch((error) => {
          console.log(error.response);
          if(error.response.status == 400) alert("Error al editar actividad")
          else alert("Error de servidor")
        });
      } else {
        //crear nuevo
        axios
        .post(url + this.idProyectoCreado+'/actividades', data)
        .then((response) => {
          if (response.status == 200) {
            this.mostrar();
          }
        })
        .catch((error) => {
          console.log(error.response);
          if(error.response.status == 400) alert("Error al crear actividad")
          else alert("Error de servidor")
        });
      }
      this.close();
    },
  },
};
</script>
