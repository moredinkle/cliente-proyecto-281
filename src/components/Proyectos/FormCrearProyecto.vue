<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">Crear nuevo proyecto</span>
    </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6">
              <v-select
                v-model="selectCategoria"
                :items="itemsCategoria"
                :rules="[(v) => !!v || 'Debes escoger una categoria']"
                label="Categoria"
                required
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="nombre_proyecto"
                label="Nombre proyecto"
                required
                :rules="nombre_proyectoRules"
                :counter="50"
                clearable
                clear-icon="mdi-close-circle"
              ></v-text-field>
            </v-col>
            <!-- actualizar en BD ya no hay multimedia, solo logo de proyecto -->
            <v-col cols="12" sm="6">
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
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-textarea
                v-model="mision"
                label="Misión"
                :rules="misionRules"
                :counter="1000"
                auto-grow
                outlined
                clearable
                clear-icon="mdi-close-circle"
              ></v-textarea>
              <v-textarea
                v-model="vision"
                label="Visión"
                :rules="visionRules"
                :counter="1000"
                auto-grow
                outlined
                clearable
                clear-icon="mdi-close-circle"
              ></v-textarea>
              <v-textarea
                v-model="objetivo"
                label="Objetivo"
                :rules="objetivoRules"
                :counter="1000"
                auto-grow
                outlined
                clearable
                clear-icon="mdi-close-circle"
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
                v-model="monto_objetivo"
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
        <p class="text-left">
          Estos campos son necesarios para crear un proyecto<br />
          Primero guarde el proyecto y luego cree las recompensas y catálogo o cronograma
        </p>
      </div>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="warning" text to='/mis-proyectos'>
        Cancelar
      </v-btn>
      <v-btn :disabled="!valid" color="green darken-4" text @click="guardar">
        Guardar
      </v-btn>
    </v-card-actions>
    <v-alert
      class="my-4 text-center error"
      v-model="alerta"
      close-text="Cerrar"
      dark
      dismissible
    >
      {{ msgalerta }}
    </v-alert>
    <v-alert
      class="my-4 text-center success"
      v-model="alertaExito"
      close-text="Cerrar"
      dark
      dismissible
    >
      {{ msgalertaExito }}
    </v-alert>
    <div class="my-10">
      <FormRecompensas :nombreProyecto="this.nombre_proyecto" :proyectoCreado="this.proyecto_creado" :idProyectoCreado="this.id_proyecto_creado"></FormRecompensas>
      <div v-if="this.selectCategoria === 'Servicios/Productos'">
        <FormCatalogo :nombreProyecto="this.nombre_proyecto" :proyectoCreado="this.proyecto_creado" :idProyectoCreado="this.id_proyecto_creado"></FormCatalogo>
      </div>
      <div v-else-if="this.selectCategoria === 'Artistico/Cultural'">
        <FormCronograma :nombreProyecto="this.nombre_proyecto" :proyectoCreado="this.proyecto_creado" :idProyectoCreado="this.id_proyecto_creado"></FormCronograma>
      </div>
      <div v-else-if="this.selectCategoria === 'Beneficencia'">
        <FormCronogramaBenefico :nombreProyecto="this.nombre_proyecto" :proyectoCreado="this.proyecto_creado" :idProyectoCreado="this.id_proyecto_creado"></FormCronogramaBenefico>
      </div>
      <div class="black--text py-5">
        <p>Las recompensas y catálogos o cronogramas son opcionales</p>
      </div>
    </div>
    <v-row class="pa-6" align="center" justify="end">
      <v-btn text color="success" to="/mis-proyectos">Continuar</v-btn>
    </v-row>
  </v-card>
</template>

<script>
import FormRecompensas from "../ExtrasProyectos/FormRecompensas.vue";
import FormCatalogo from "../ExtrasProyectos/FormCatalogo.vue";
import FormCronograma from "../ExtrasProyectos/FormCronograma.vue";
import FormCronogramaBenefico from "../ExtrasProyectos/FormCronogramaBenefico.vue";
import moment from "moment";
import axios from "axios";

let url = "https://api-tanti-auguri.herokuapp.com/api/";

export default {
  name: "FormCrearProyecto",

  components: {
    FormRecompensas,
    FormCatalogo,
    FormCronograma,
    FormCronogramaBenefico,
  },

  data: () => ({
    valid: true,
    proyecto_creado: false,
    id_proyecto_creado: 0,
    nombre_proyecto: "",
    nombre_proyectoRules: [
      (v) => !!v || "Campo obligatorio",
      (v) =>
        (v && v.length <= 50) ||
        "El nombre debe tener un máximo de 50 caracteres",
    ],
    logo_proyecto: [],
    logo_proyectoRules: [
      (v) => !!v || "Campo obligatorio!",
      (v) => v.size < 3000000 || "Tamaño de imagen menor a 3MB!",
    ],
    mision: "",
    misionRules: [
      (v) => !!v || "Campo obligatorio",
      (v) =>
        (v && v.length <= 1000) ||
        "El nombre debe tener un máximo de 50 caracteres",
    ],
    vision: "",
    visionRules: [
      (v) => !!v || "Campo obligatorio",
      (v) =>
        (v && v.length <= 1000) ||
        "El nombre debe tener un máximo de 50 caracteres",
    ],
    objetivo: "",
    objetivoRules: [
      (v) => !!v || "Campo obligatorio",
      (v) =>
        (v && v.length <= 1000) ||
        "El nombre debe tener un máximo de 50 caracteres",
    ],
    fecha_inicio: "",
    fecha_inicioRules: [(v) => !!v || "Campo obligatorio"],
    fecha_fin: "",
    fecha_finRules: [(v) => !!v || "Campo obligatorio"],
    menuInicio: false,
    menuFin: false,
    monto_objetivo: 0,
    monto_objetivoRules: [
      (v) => !!v || "Campo obligatorio",
      (v) =>
        (v && parseInt(v) > 0) || "No puedes tener un objetivo negativo :/",
    ],
    selectCategoria: "",
    selectIdCategoria: "",
    itemsCategoria: [
      "Artistico/Cultural",
      "Beneficencia",
      "Servicios/Productos",
    ],
    iditemsCategoria: [1, 3, 2],
    msgalerta: "",
    alerta: false,
    msgalertaExito: "",
    alertaExito: false,
  }),

  created() {},

  methods: {
    selectFile(){
      this.logo_proyecto = this.$refs.file.files[0];
    },

    guardar() {
      // * controlar fechas
      let fini = this.fecha_inicio;
      let hoy = new Date().toISOString().slice(0, 10);
      let ffin = this.fecha_fin;
      if (moment(fini).isBefore(hoy)) {
        console.log("Fecha inicio invalida");
        this.alerta = true;
        this.msgalerta = "Fecha inicio invalida";
      } else if (moment(ffin).isBefore(fini)) {
        console.log("Fecha fin invalida");
        this.alerta = true;
        this.msgalerta = "Fecha fin invalida";
      } else {
        let estadoActual = "";
        if (moment(hoy).isBefore(fini)) {
          estadoActual = "no activo";
        } else {
          estadoActual = "activo";
        }

        for (let i = 0; i < this.itemsCategoria.length; i++) {
          if (this.selectCategoria === this.itemsCategoria[i])
            this.selectIdCategoria = this.iditemsCategoria[i];
        }
        let fd = new FormData();
        fd.append('nombre_proyecto', this.nombre_proyecto)
        fd.append('mision',  this.mision)
        fd.append('vision',  this.vision)
        fd.append('objetivo',  this.objetivo)
        fd.append('fecha_inicio',  this.fecha_inicio)
        fd.append('fecha_fin',  this.fecha_fin)
        fd.append('monto_objetivo',  parseInt(this.monto_objetivo))
        fd.append('monto_actual',  0)
        fd.append('logo_proyecto',  this.logo_proyecto)
        fd.append('estado',  estadoActual)
        fd.append('id_categoria', this.selectIdCategoria)
        fd.append('id_usuario',  this.$store.state.userId)

        axios
          .post(url + "proyectos", fd, {
            headers: {
              "content-type": "multipart/formdata",
            },
          })
          .then((response) => {
            if (response.status == 200) {
              console.log(response.data);
              this.msgalertaExito = "Proyecto creado con exito! Continua con las recompensas y cronograma o catálogo";
              this.alertaExito = true;
              this.proyecto_creado = true;
              this.id_proyecto_creado = response.data;
              console.log(this.id_proyecto_creado)
            }
          })
          .catch((error) => {
            this.alerta = true;
            this.msgalerta = error.response.data;
          });
      }
    },

    /*mostrarCategorias() {
      axios
        .get(url + "categorias")
        .then((response) => {
          if (response.status == 200) {
            console.log(response.data);
            for (let i = 0; i < response.data.length; i++) {
              this.itemsCategoria[i] = response.data[i].descripcion_categoria;
              this.iditemsCategoria[i] = response.data[i].id_categoria;
            }
            console.log(this.itemsCategoria, this.iditemsCategoria);
          }
        })
        .catch((error) => {
          console.log(error.response);
        });
    },*/
  },
};
</script>
