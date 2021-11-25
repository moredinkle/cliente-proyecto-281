<template>
  <div
    class="Editar Proyecto"
    v-if="this.proyecto.id_usuario == this.$store.state.userId"
  >
    <h1 class="my-5">Editar proyecto</h1>
    <v-card>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="selectCategoria"
                  :items="itemsCategoria"
                  label="Categoria"
                  readonly
                  required
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="proyecto.nombre_proyecto"
                  label="Nombre proyecto"
                  required
                  filled
                  :rules="nombre_proyectoRules"
                  :counter="50"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="proyecto.mision"
                  label="Misión"
                  :rules="misionRules"
                  :counter="1000"
                  auto-grow
                  outlined
                  filled
                ></v-textarea>
                <v-textarea
                  v-model="proyecto.vision"
                  label="Visión"
                  :rules="visionRules"
                  :counter="1000"
                  auto-grow
                  outlined
                  filled
                ></v-textarea>
                <v-textarea
                  v-model="proyecto.objetivo"
                  label="Objetivo"
                  :rules="objetivoRules"
                  :counter="1000"
                  auto-grow
                  outlined
                  filled
                ></v-textarea>
              </v-col>

              <!-- datepicker inicio proyecto -->
              <v-col cols="12" sm="6">
                <v-menu
                  v-model="menuInicio"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="fecha_inicio"
                      prepend-icon="mdi-calendar"
                      label="Fecha inicio proyecto"
                      :rules="fecha_inicioRules"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_inicio"
                    @input="menuInicio = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <!-- datepicker fin proyecto -->
              <v-col cols="12" sm="6">
                <v-menu
                  v-model="menuFin"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="fecha_fin"
                      prepend-icon="mdi-calendar-clock"
                      label="Fecha fin proyecto"
                      :rules="fecha_finRules"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fecha_fin"
                    @input="menuFin = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="proyecto.monto_objetivo"
                  prepend-icon="mdi-currency-usd"
                  label="Monto objetivo"
                  hint="¿Cuanto necesitas para realizar tu proyecto?"
                  type="number"
                  :rules="monto_objetivoRules"
                  clearable
                  clear-icon="mdi-close-circle"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
        <div class="black--text">
          <p class="text-left font-weight-black">
            La categoria no se puede cambiar
          </p>
        </div>
      </v-card-text>

      <div class="my-10">
        <FormRecompensas
          :nombreProyecto="this.proyecto.nombre_proyecto"
          :proyectoCreado="this.proyecto_creado"
          :idProyectoCreado="this.id_proyecto_creado"
        ></FormRecompensas>
        <div v-if="this.selectCategoria === 'Servicios/Productos'">
          <FormCatalogo
            :nombreProyecto="this.proyecto.nombre_proyecto"
            :proyectoCreado="this.proyecto_creado"
            :idProyectoCreado="this.id_proyecto_creado"
          ></FormCatalogo>
        </div>
        <div v-else-if="this.selectCategoria === 'Artistico/Cultural'">
          <FormCronograma
            :nombreProyecto="this.proyecto.nombre_proyecto"
            :proyectoCreado="this.proyecto_creado"
            :idProyectoCreado="this.id_proyecto_creado"
          ></FormCronograma>
        </div>
        <div v-else-if="this.selectCategoria === 'Beneficencia'">
          <FormCronogramaBenefico
            :nombreProyecto="this.proyecto.nombre_proyecto"
            :proyectoCreado="this.proyecto_creado"
            :idProyectoCreado="this.id_proyecto_creado"
          ></FormCronogramaBenefico>
        </div>
      </div>
      <v-alert
        class="my-4 text-center error"
        v-model="alerta"
        close-text="Cerrar"
        dark
        dismissible
      >
        {{ msgalerta }}
      </v-alert>
      <v-row class="pa-6" align="center" justify="end">
        <v-btn color="error" text @click="dialogDelete = true">
          Eliminar
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="warning" text to="/mis-proyectos">
          Cancelar
        </v-btn>
        <v-btn color="info" text @click="dialogLogo = true">
          Editar logo
        </v-btn>
        <v-btn
          :disabled="!valid"
          color="green darken-4"
          text
          @click="editarProyecto"
        >
          Guardar
        </v-btn>
      </v-row>
    </v-card>
    <v-dialog
      v-model="dialogLogo"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card cols="12">
        <v-card-title>Editar logo</v-card-title>
        <v-card-text>
          <p class="my-3 black--text">
            ¿Deseas cambiar el logo de tu proyecto?
          </p>
          <v-form>
            <v-file-input
              v-model="logo_proyecto"
              :rules="logo_proyectoRules"
              accept="image/png, image/jpeg, image/bmp"
              prepend-icon="mdi-camera"
              label="Logo de tu proyecto"
              required
              small-chips
              show-size
              ref="file"
              @change="selectFile"
            ></v-file-input>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text tile color="info" @click="dialogLogo=false">Cancelar</v-btn>
          <v-btn text tile color="success" @click="editarLogo">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialogDelete"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card cols="12">
        <v-card-title>Eliminar proyecto</v-card-title>
        <v-card-text>
          <p class="my-3 black--text">
            Estas seguro que quieres eliminar este proyecto? <br />
            Esta acción no se puede deshacer
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text tile color="success" @click="dialogDelete = false"
            >Cancelar</v-btn
          >
          <v-btn text tile color="error" @click="eliminarProyecto"
            >Eliminar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <div v-else>
    <h1 class="my-5">No puedes editar este proyecto</h1>
    <v-btn color="info" tile to="/mis-proyectos">Volver</v-btn>
  </div>
</template>

<script>
import FormRecompensas from "../ExtrasProyectos/FormRecompensas.vue";
import FormCatalogo from "../ExtrasProyectos/FormCatalogo.vue";
import FormCronograma from "../ExtrasProyectos/FormCronograma.vue";
import FormCronogramaBenefico from "../ExtrasProyectos/FormCronogramaBenefico.vue";
import axios from "axios";
import moment from "moment";

let url = "https://api-tanti-auguri.herokuapp.com/api/proyectos/";

export default {
  name: "FormEditarProyecto",

  components: {
    FormRecompensas,
    FormCatalogo,
    FormCronograma,
    FormCronogramaBenefico,
  },

  data: () => ({
    proyecto: {
      id_proyecto: 0,
      nombre_proyecto: "",
      mision: "",
      vision: "",
      objetivo: "",
      fecha_inicio: "",
      fecha_fin: "",
      monto_objetivo: 0,
      monto_actual: 0,
      logo_proyecto: "",
      estado: "",
      id_categoria: 0,
      id_usuario: 0,
    },
    dialogLogo: false,
    valid: false,
    proyecto_creado: true,
    id_proyecto_creado: 0,
    nombre_proyectoRules: [
      (v) => !!v || "Campo obligatorio",
      (v) =>
        (v && v.length <= 50) ||
        "El nombre debe tener un máximo de 50 caracteres",
    ],
    misionRules: [
      (v) => !!v || "Campo obligatorio",
      (v) => (v && v.length <= 1000) || "Máximo 1000 caracteres",
    ],
    visionRules: [
      (v) => !!v || "Campo obligatorio",
      (v) => (v && v.length <= 1000) || "Máximo 1000 caracteres",
    ],
    objetivoRules: [
      (v) => !!v || "Campo obligatorio",
      (v) => (v && v.length <= 1000) || "Máximo 1000 caracteres",
    ],
    fecha_inicioRules: [(v) => !!v || "Campo obligatorio"],
    fecha_finRules: [(v) => !!v || "Campo obligatorio"],
    menuInicio: false,
    menuFin: false,
    monto_objetivoRules: [
      (v) => !!v || "Campo obligatorio",
      (v) =>
        (v && parseInt(v) > 0) || "No puedes tener un objetivo negativo :/",
    ],
    selectCategoria: "",
    itemsCategoria: [
      "Artistico/Cultural",
      "Servicios/Productos",
      "Beneficencia",
    ],
    msgalerta: "",
    alerta: false,
    fecha_inicio: "",
    fecha_fin: "",
    logo_proyecto: [],
    logo_proyectoRules: [
      (v) => !!v || "Campo obligatorio!",
      (v) => v.size < 3000000 || "Tamaño de imagen menor a 3MB!",
    ],
    dialogDelete: false,
  }),

  created() {
    this.mostrar();
  },

  methods: {
    mostrar() {
      axios
        .get(url + this.$route.params.id_proyecto)
        .then((response) => {
          if (response.status == 200) {
            this.proyecto = JSON.parse(JSON.stringify(response.data[0]));
            this.proyecto.fecha_inicio = this.proyecto.fecha_inicio.slice(0,10);
            this.proyecto.fecha_fin = this.proyecto.fecha_fin.slice(0, 10);
            //this.hintini = 'Fecha inicio actual: '+this.proyecto.fecha_inicio
            //this.hintfin = 'Fecha fin actual: '+this.proyecto.fecha_fin
            this.id_proyecto_creado = this.proyecto.id_proyecto;
            let icat = parseInt(this.proyecto.id_categoria) - 1;
            this.selectCategoria = this.itemsCategoria[icat];
            this.fecha_inicio = this.proyecto.fecha_inicio;
            this.fecha_fin = this.proyecto.fecha_fin;
          }
        })
        .catch((error) => {
          console.log(error.response);
          alert("Error. Intenta recargar la página.");
        });
    },

    editarProyecto() {
      // * controlar fechas
      let fini = this.fecha_inicio;
      let ffin = this.fecha_fin;
      if (moment(fini).isBefore(this.proyecto.fecha_inicio)) {
        console.log("Fecha inicio invalida");
        this.alerta = true;
        this.msgalerta = "Fecha inicio invalida";
      } else if (moment(ffin).isBefore(fini)) {
        console.log("Fecha fin invalida");
        this.alerta = true;
        this.msgalerta = "Fecha fin invalida";
      } else {
        let data = {
          nombre_proyecto: this.proyecto.nombre_proyecto,
          mision: this.proyecto.mision,
          vision: this.proyecto.vision,
          objetivo: this.proyecto.objetivo,
          fecha_inicio: this.proyecto.fecha_inicio,
          fecha_fin: this.proyecto.fecha_fin,
          monto_objetivo: this.proyecto.monto_objetivo,
        };
        axios
          .put(url + this.id_proyecto_creado, data)
          .then((response) => {
            if (response.status == 200) {
              console.log("Exito al editar");
              this.$router.push("/mis-proyectos");
            }
          })
          .catch((error) => {
            this.alerta = true;
            this.msgalerta = error.response.data;
          });
      }
    },

    selectFile() {
      this.logo_proyecto = this.$refs.file.files[0];
    },

    editarLogo() {
      this.dialogLogo = true;
      let fd = new FormData();
      fd.append("logo_proyecto", this.logo_proyecto);
      axios
        .put(url + "logos/" + this.id_proyecto_creado, fd, {
          headers: {
            "content-type": "multipart/formdata",
          },
        })
        .then((response) => {
          if (response.status == 200) {
            this.$router.push("/mis-proyectos");
          }
        })
        .catch((error) => {
          console.log(error.response.data);
          alert("Error. Intenta otra vez.");
        });
    },

    eliminarProyecto() {
      if (this.proyecto.estado === "no activo") {
        axios
          .delete(url + this.id_proyecto_creado)
          .then((response) => {
            if (response.status == 200) {
              this.$router.push("/proyectos");
            }
          })
          .catch((error) => {
            console.log(error.response.data);
            alert("Error. Intenta otra vez.");
          });
      } else {
        alert("No se puede eliminar un proyecto activo o terminado");
      }
    },
  },
};
</script>