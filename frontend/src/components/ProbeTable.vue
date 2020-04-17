<template>
  <div>
    <v-data-table id="probetable-table" :headers="headers" :items="proben" hide-default-footer>
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-subheader class="headline">Proben</v-subheader>
          <v-spacer></v-spacer>
          <v-dialog id="probetable-dialog-anlegen" persistent v-if="!readonly" :key="dialog" v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn id="probetable-btn-anlegen" color="primary" dark class="mb-2" v-on="on">
                <v-icon>mdi-plus</v-icon>
                <span>Anlegen</span>
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                {{formTitle}}
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-form ref="form">
                    <probe-fields id="probetable-probeFields" v-model="editedProbe"></probe-fields>
                  </v-form>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn id="probetable-btn-abbrechen" color="primary" text @click="close">Abbrechen</v-btn>
                <v-btn id="probetable-btn-hinzufuegen" color="primary" @click="save">Hinzufügen</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.ergebnis="{item}">
       {{ergebnisZuBeschreibung(item.ergebnis)}}
      </template>
      <template v-slot:item.actions="{item}">
        <v-btn :id="'probetable-btn-bearbeiten-' + proben.indexOf(item)" :disabled="readonly" small text class="mr-2" @click="editItem(item)">
          <v-icon>mdi-playlist-edit</v-icon>
        </v-btn>
        <v-btn :id="'probetable-btn-loeschen-' + proben.indexOf(item)" :disabled="readonly" small text @click="deleteItem(item)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
      <template v-slot:no-data>
        Keine Daten vorhanden
      </template>
    </v-data-table>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
// components
import ProbeFields from "./ProbeFields.vue";
// model
import { Probe } from "../types/Person";
import KeyVal from "../types/KeyVal";
import {Levels} from "@/api/error";
import {VForm} from "vuetify/lib";
import Ergebnis from "@/types/Ergebnis";
import {ErgebnisToBeschreibung} from "@/types/Ergebnis";


@Component({ components: { ProbeFields } })
export default class ProbeTable extends Vue {
  $store!: Vue["$store"];
  $refs!: Vue["$refs"];

  @Prop()
  value!: Probe[];
  
  @Prop({default: false, type: Boolean})
  readonly!: boolean;

  typen: KeyVal[] = [];
  headers = [
    { text: "Ergebnis", value: "ergebnis" },
    { text: "Datum", value: "datum" },
    { text: "Kommentar", value: "kommentar" },
    { text: "Aktionen", value: "actions", align: "right" }
  ];
  dialog = false;
  editedProbe: Probe = {} as Probe;
  editedIndex: number = -1;

  get proben(): Probe[] {
    if (this.value == undefined) {
      return [];
    }
    return this.value;
  }

  set proben(proben: Probe[]) {
    (this as Vue).$emit("input", proben);
  }

  get formTitle() {
    return this.editedIndex === -1
      ? "Probe hinzufügen"
      : "Probe bearbeiten";
  }

  mounted() {}

  ergebnisZuBeschreibung(ergebnis:Ergebnis) {
    return ErgebnisToBeschreibung.get(ergebnis);
  }

  editItem(item: Probe) {
    this.editedIndex = this.proben.indexOf(item);
    this.editedProbe = Object.assign({}, item);
    this.dialog = true;
  }

  deleteItem(item: Probe) {
    const index = this.proben.indexOf(item);
    this.proben.splice(index, 1);
  }

  close() {
    this.dialog = false;
    this.resetDialog();
    setTimeout(() => {
      this.editedProbe = Object.assign({}, this.editedProbe);
      this.editedIndex = -1;
    }, 300);
  }

  save() {
    let form = this.$refs.form as any;

    if(form.validate()) {
      if (this.editedIndex > -1) {
        Object.assign(this.proben[this.editedIndex], this.editedProbe);
      } else {
        this.proben.push(this.editedProbe);
      }
      this.close();
    } else {
      this.$store.dispatch('snackbar/showMessage', {level: Levels.WARNING, message: "Bitte Fehleingaben korrigieren."});
    }
  }

  
  resetDialog () {
    this.editedProbe = {} as Probe;
  }
}
</script>