<template>
  <div class="Ver Proyecto py-5">
    <v-container class="my-5">
      <v-row>
        <v-col cols="12" sm="8">
          <v-card class="full-height">
            <v-img
              :aspect-ratio="16 / 9"
              width="900"
              :src="proyecto.logo_proyecto"
            ></v-img>
            <v-card-title
              class="full-height pa-3 d-flex flex-column font-weight-black"
            >
              <h2>{{ proyecto.nombre_proyecto }}</h2>
            </v-card-title>
            <v-card-text
              class="full-height pa-3 d-flex flex-column text-left black--text"
            >
              <div class="black--text">
                {{ creadorProyecto }} <br />
                {{ paisCreadorProyecto }}
              </div>
              <div class="indigo--text mt-3">
                {{ selectCategoria }}
              </div>
              <div class="py-2">
                <h3 class="font-weight-bold">Misión</h3>
                {{ proyecto.mision }}
              </div>
              <div class="py-2">
                <h3 class="font-weight-bold">Visión</h3>
                {{ proyecto.vision }}
              </div>
              <div class="py-2">
                <h3 class="font-weight-bold">Objetivo</h3>
                {{ proyecto.objetivo }}
              </div>
            </v-card-text>
            <v-card-actions>
              <div v-if="megusta">
                <v-btn large icon color="indigo" @click="BotonMeGusta">
                  <v-icon>mdi-thumb-up</v-icon>
                </v-btn>
              </div>
              <div v-else>
                <v-btn large icon color="indigo" @click="BotonMeGusta">
                  <v-icon>mdi-thumb-up-outline</v-icon>
                </v-btn>
              </div>
              <div class=" numero_likes indigo--text">
                {{ numero_me_gusta }}
              </div>
            </v-card-actions>
            <div class="my-10">
              <VerRecompensas
                :nombreProyecto="this.proyecto.nombre_proyecto"
                :idProyecto="this.proyecto.id_proyecto"
              ></VerRecompensas>
              <div v-if="this.selectCategoria === 'Servicios/Productos'">
                <VerCatalogo
                  :nombreProyecto="this.proyecto.nombre_proyecto"
                  :idProyecto="this.proyecto.id_proyecto"
                ></VerCatalogo>
              </div>
              <div v-else-if="this.selectCategoria === 'Artistico/Cultural'">
                <VerCronograma
                  :nombreProyecto="this.proyecto.nombre_proyecto"
                  :idProyecto="this.proyecto.id_proyecto"
                ></VerCronograma>
              </div>
              <div v-else-if="this.selectCategoria === 'Beneficencia'">
                <VerCronogramaBenefico
                  :nombreProyecto="this.proyecto.nombre_proyecto"
                  :idProyecto="this.proyecto.id_proyecto"
                ></VerCronogramaBenefico>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card height="100%">
            <v-card-title>Financiación</v-card-title>
            <v-card-text class="pa-3">
              Fecha Inicio:
              <h3 class="font-weight-black black--text">
                {{ proyecto.fecha_inicio }}
              </h3>
              <v-divider class="ma-2"></v-divider>
              Fecha Fin:
              <h3 class="font-weight-black black--text">
                {{ proyecto.fecha_fin }}
              </h3>
              <v-divider class="ma-2"> </v-divider>
              <h2 class="black--text my-2">{{ proyecto.monto_actual }} Bs.</h2>
              recaudados
              <h2 class="black--text my-2">
                {{ proyecto.monto_objetivo }} Bs.
              </h2>
              necesarios
              <v-divider class="ma-2"></v-divider>
              <v-btn
                class="my-2"
                tile
                large
                color="success"
                :disabled="!cumpleRequisitos"
                @click="dialogFinanciar = true"
                >Financiar</v-btn
              >
              <div v-if="!cumpleRequisitos">
                <h3>Objetivo cumplido!</h3>
                <h4>Ya no se puede aportar a este proyecto</h4>
              </div>
              <div v-if="this.$store.state.userName === 'superusuario'">
                <v-divider class="ma-2"></v-divider>
                <v-btn color="warning" @click="dialogObservacion = true"
                  >Observación</v-btn
                >
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <Comentarios />

      <!--Formulario financiamiento -->
      <v-dialog v-model="dialogFinanciar" max-width="600px" height="500px">
        <v-card>
          <v-card-title class="green--text text-darken-4 font-weight-bold"
            >Financia este proyecto</v-card-title
          >
          <v-card-text class="py-4">
            <div
              v-if="financiamiento_actual > 0"
              class="grey--text text--darken-3 text-left mb-3"
            >
              Financiamiento actual: {{ financiamiento_actual }}
            </div>
            <v-text-field
              v-model="monto_financiamiento"
              label="Monto a financiar"
              hint="¿Cuanto quieres aportar a este proyecto?"
              persistent-hint
              required
              filled
              type="number"
              :rules="financiamientoRules"
              clearable
              clear-icon="mdi-close-circle"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-row class="pa-2" align="center" justify="end">
              <v-btn color="info" text @click="dialogFinanciar = false"
                >Cancelar</v-btn
              >
              <v-btn color="success" text @click="financiar">Financiar</v-btn>
            </v-row>
          </v-card-actions>
          <div class="pa-3">
            <v-alert
              class="text-center error"
              v-model="alertaFinanciar"
              close-text="Cerrar"
              dark
              dismissible
            >
              {{ msgalerta }}
            </v-alert>
          </div>
        </v-card>
      </v-dialog>

      <!--Formulario observación -->
      <v-dialog v-model="dialogObservacion" max-width="600px" height="500px">
        <v-card>
          <v-card-title class="green--text text-darken-4 font-weight-bold"
            >Observación</v-card-title
          >
          <v-col cols="12" sm="6" class="mx-4">
            <v-select
              v-model="selectUrgencia"
              :items="itemsUrgencia"
              :rules="[(v) => !!v || 'Debes escoger una categoria']"
              label="Urgencia"
              required
            ></v-select>
          </v-col>
          <v-card-text class="py-4">
            <v-textarea
                v-model="descripcion_observacion"
                label="Observación"
                :rules="observacionRules"
                :counter="500"
                required
                auto-grow
                clearable
                outlined
                clear-icon="mdi-close-circle"
              ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-row class="pa-2" align="center" justify="end">
              <v-btn color="info" text @click="dialogObservacion = false"
                >Cancelar</v-btn
              >
              <v-btn color="success" text @click="observar"
                >Guardar observación</v-btn
              >
            </v-row>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import VerRecompensas from "../components/ExtrasProyectos/VerRecompensas.vue";
import VerCatalogo from "../components/ExtrasProyectos/VerCatalogo.vue";
import VerCronograma from "../components/ExtrasProyectos/VerCronograma.vue";
import VerCronogramaBenefico from "../components/ExtrasProyectos/VerCronogramaBenefico.vue";
import Comentarios from "../components/ExtrasProyectos/Comentarios.vue";
import axios from "axios";

let url = "https://api-tanti-auguri.herokuapp.com/api/proyectos/";

export default {
  name: "VerProyecto",
  components: {
    VerRecompensas,
    VerCatalogo,
    VerCronograma,
    VerCronogramaBenefico,
    Comentarios,
  },
  data: () => ({
    proyecto: {},
    selectCategoria: "",
    itemsCategoria: [
      "Artistico/Cultural",
      "Servicios/Productos",
      "Beneficencia",
    ],
    megusta: false,
    numero_me_gusta: 0,
    alertaFinanciar: false,
    msgalerta: "",
    dialogFinanciar: false,
    monto_financiamiento: null,
    financiamiento_actual: 0, //todo esto
    financiamientoRules: [
      (v) => !!v || "Campo obligatorio",
      (v) => (v && parseInt(v) > 0) || "Aporte > 0",
    ],
    paisCreadorProyecto: "",
    creadorProyecto: "",
    idCreador: 0,
    selectUrgencia: "",
    itemsUrgencia: ["Leve", "Moderado", "Importante", "Urgente"],
    descripcion_observacion: "",
    observacionRules: [
      (v) => !!v || "Campo obligatorio",
      (v) =>
        (v && v.length <= 500) ||
        "El nombre debe tener un máximo de 50 caracteres",
    ],
    dialogObservacion: false,
    cumpleRequisitos: true,
  }),
  created() {
    this.mostrar();
    this.getNumeroMeGusta();
    this.verificarMeGusta();
    this.getmontoActual();
    this.getFinanciamientoActual();
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
            let icat = parseInt(this.proyecto.id_categoria) - 1;
            this.selectCategoria = this.itemsCategoria[icat];
            this.proyecto.logo_proyecto = "https://api-tanti-auguri.herokuapp.com/" + this.proyecto.logo_proyecto;
            this.idCreador = this.proyecto.id_usuario;
            this.infoCreador();
            if(this.proyecto.monto_actual >= this.proyecto.monto_objetivo || this.proyecto.estado != 'activo'){
              this.cumpleRequisitos = false;
            }
          }
        })
        .catch((error) => {
          console.log(error.response);
          alert("Error. Intenta recargar la página.");
        });
    },

    financiar() {
      if (this.$store.state.userId === this.proyecto.id_usuario) {
        this.alertaFinanciar = true;
        this.msgalerta = "No puedes financiar tu proyecto";
      } else {
        let ahora = new Date().toISOString().slice(0, 10);
        let data = {
          monto: parseInt(this.monto_financiamiento),
          fecha_financiamiento: ahora,
          id_proyecto: this.$route.params.id_proyecto,
          id_usuario: this.$store.state.userId,
        };
        axios
          .post(url + "financiamiento", data)
          .then((response) => {
            if (response.status == 200) {
              this.getmontoActual();
            }
          })
          .catch((error) => {
            console.log(error.response);
            alert("Error. Intenta recargar la página.");
          });
      }
    },

    getmontoActual() {
      axios
        .get(url + "financiamiento/" + this.$route.params.id_proyecto)
        .then((response) => {
          if (response.status == 200) {
            this.mostrar();
            this.getFinanciamientoActual();
            this.dialogFinanciar = false;
          }
        })
        .catch((error) => {
          console.log(error.response);
          alert("Error. Intenta recargar la página.");
        });
    },

    getFinanciamientoActual() {
      axios
        .get(
          url +
            "financiamiento/monto/" +
            this.$route.params.id_proyecto +
            "/" +
            this.$store.state.userId
        )
        .then((response) => {
          if (response.status == 200) {
            this.financiamiento_actual = response.data[0].monto;
          }
        })
        .catch((error) => {
          console.log(error.response);
          alert("Error. Intenta recargar la página.");
        });
    },

    getNumeroMeGusta() {
      axios
        .get(url + "me-gusta/" + this.$route.params.id_proyecto)
        .then((response) => {
          if (response.status == 200) {
            this.numero_me_gusta = response.data[0].numero_me_gusta;
          }
        })
        .catch((error) => {
          console.log(error.response);
          alert("Error. Intenta recargar la página.");
        });
    },

    verificarMeGusta() {
      axios
        .get(
          url +
            "me-gusta/" +
            this.$route.params.id_proyecto +
            "/" +
            this.$store.state.userId
        )
        .then((response) => {
          if (response.status == 200) {
            if (response.data === "existe") this.megusta = true;
            else this.megusta = false;
          }
        })
        .catch((error) => {
          console.log(error.response);
          alert("Error. Intenta recargar la página.");
        });
    },

    BotonMeGusta() {
      if (this.megusta === false) {
        //crear me gusta
        let data = {
          id_usuario: this.$store.state.userId,
          id_proyecto: this.$route.params.id_proyecto,
        };
        axios
          .post(url + "me-gusta", data)
          .then((response) => {
            if (response.status == 200) {
              this.getNumeroMeGusta();
              this.verificarMeGusta();
            }
          })
          .catch((error) => {
            console.log(error.response);
            if (error.response.status == 400) alert("Error.");
            else alert("Error. ");
          });
      } else {
        axios
          .delete(
            url +
              "me-gusta/" +
              this.$route.params.id_proyecto +
              "/" +
              this.$store.state.userId
          )
          .then((response) => {
            if (response.status == 200) {
              this.getNumeroMeGusta();
              this.verificarMeGusta();
            }
          })
          .catch((error) => {
            console.log(error.response);
            if (error.response.status == 400) alert("Error.");
            else alert("Error. ");
          });
      }
    },

    infoCreador() {
      axios
        .get("https://api-tanti-auguri.herokuapp.com/api/usuarios/porid/" + this.idCreador)
        .then((response) => {
          if (response.status == 200) {
            this.paisCreadorProyecto = response.data[0].pais;
            this.creadorProyecto = response.data[0].nombre_completo;
          }
        })
        .catch((error) => {
          console.log(error.response);
          alert("Error. Intenta recargar la página.");
        });
    },

    observar(){
      let data = {
        descripcion_observacion: this.descripcion_observacion,
        urgencia: this.selectUrgencia,
        id_proyecto: this.$route.params.id_proyecto
      }
      axios
        .post('https://api-tanti-auguri.herokuapp.com/api/observaciones',data)
        .then((response) => {
          if (response.status == 200) {
            alert("Guardado con exito")
            this.dialogObservacion = false
          }
        })
        .catch((error) => {
          console.log(error.response);
          alert("Error. Intenta recargar la página.");
        });
    }
  },
};
</script>
