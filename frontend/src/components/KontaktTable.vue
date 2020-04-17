<template>
  <div>
    <v-data-table id="kontakttable-table" :headers="headers" :items="infos">
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-subheader class="headline">In Kontakt mit:</v-subheader>
          <v-spacer></v-spacer>
          <v-dialog id="kontakttable-dialog-anlegen" persistent v-if="!readonly" :key="dialog" v-model="dialog" max-width="70%">
            <template v-slot:activator="{ on }">
              <v-btn id="kontakttable-btn-anlegen" color="primary" dark class="mb-2" v-on="on">
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
                  <v-form ref="form" v-model="valid">
                    <kontakt-fields id="kontakttable-kontakfields" v-model="editedInfo"></kontakt-fields>
                    <div v-if="showAddPerson">
                      <!-- Radio-Button ob neu erstellen oder existierenden hinzufügen -->
                      <v-radio-group id="kontakttable-radiogroup-erstellenOderHinzufuegen" v-model="selection" row>
                        <v-radio label="Bestehende Person hinzufügen" value="addExisting"></v-radio>
                        <v-radio label="Neue Person erstellen" value="createNew"></v-radio>
                      </v-radio-group>
                      <person-fields id="kontakttable-personfields" v-if="selection==='createNew'" v-model="person"></person-fields>
                      <personen-auswaehler id="kontakttable-personenauswaehler" :parent-person-id="parentPersonId" @input="personRelationSelected" v-else ></personen-auswaehler>
                    </div>
                    <div v-else>
                      <v-row>
                        <v-col cols="12" md="6">
                          <!-- Kategorie -->
                          <v-select
                            id="kontakttable-select-kategorie"
                            :readonly="true"
                            :outlined="readonly" 
                            :filled="!readonly"
                            dense
                            :items="kategorien"
                            label="Kategorie"
                            v-model="selectedPerson.kategorie"
                            class="d-inline-flex"
                          ></v-select>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field
                            id="kontakttable-textfield-vorname"
                            :readonly="true"
                            :outlined="readonly" 
                            :filled="!readonly"
                            dense
                            v-model="selectedPerson.vorname"
                            label="Vorname"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            id="kontakttable-textfield-nachname"
                            :readonly="true"
                            :outlined="readonly" 
                            :filled="!readonly"
                            dense
                            v-model="selectedPerson.name"
                            label="Nachname"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </div>
                  </v-form>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn id="kontakttable-btn-abbrechen" color="primary" text @click="close">Abbrechen</v-btn>
                <v-btn id="kontakttable-btn-hinzufuegen" color="primary" @click="save">Hinzufügen</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{item}">
        <v-tooltip v-if="readonly" top>
          <template v-slot:activator="{ on }">
            <v-btn :id="'kontakttable-btn-kplesen' + person.id" small text class="mr-2" @click="navigateRead(item._links.kontakt.href)" v-on="on">
              <v-icon>mdi-account</v-icon>
            </v-btn>
          </template>
          <span>Kontaktperson lesen</span>
        </v-tooltip>

        <v-tooltip v-if="readonly" top>
          <template v-slot:activator="{ on }">
            <v-btn :id="'kontakttable-btn-kpbearbeiten' + person.id" small text class="mr-2" @click="navigateEdit(item._links.kontakt.href)" v-on="on">
              <v-icon>mdi-account-edit</v-icon>
            </v-btn>
          </template>
          <span>Kontaktperson bearbeiten</span>
        </v-tooltip>

        <v-tooltip v-if="!readonly" top>
          <template v-slot:activator="{ on }">
            <v-btn :id="'kontakttable-btn-kontaktBearbeiten' + person.id" :disabled="readonly" small text class="mr-2" @click="editItem(item)" v-on="on">
              <v-icon>mdi-playlist-edit</v-icon>
            </v-btn>
          </template>
          <span>Kontakt bearbeiten</span>
        </v-tooltip>

        <v-tooltip v-if="!readonly" top>
          <template v-slot:activator="{ on }">
            <v-btn :id="'kontakttable-btn-kontaktLoeschen' + person.id" :disabled="readonly" small text @click="deleteItem(item)" v-on="on">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
          <span>Kontakt löschen</span>
        </v-tooltip>
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
import KontaktFields from "./KontaktFields.vue";
import PersonFields from "./PersonFields.vue";
import PersonenAuswaehler from "./PersonenAuswaehler.vue";
import PersonService from "./../api/PersonService"
// model
import { Kontakt } from "../types/Kontakt";
import Kategorie from "../types/Kategorie";
import { KategorieToText } from "../types/Kategorie";
import KeyVal from "../types/KeyVal";
import Person from "../types/Person";
import {Levels} from "@/api/error";

@Component({ components: { PersonFields, KontaktFields, PersonenAuswaehler } })
export default class KontaktTable extends Vue {
  $store!: Vue["$store"];
  $refs!: Vue["$refs"];

  person: Person = {quarantaene: {}, kontakte: [], proben: []} as unknown  as Person;
  @Prop()
  value!: Kontakt[];
  
  @Prop({default: false, type: Boolean})
  readonly!: boolean;

  @Prop()
  parentPersonId!: string;

  typen: KeyVal[] = [];
  kategorien: KeyVal[] = [];
  headers = [
    { text: "Kontaktname", value: "_person.vornameNachname" },
    { text: "Kontaktkategorie", value: "_person.kategorie" },
    { text: "Kontakttyp", value: "kontakttyp" },
    { text: "Kontaktdatum", value: "kontaktdatum" },
    { text: "Kommentar", value: "kommentar" },
    { text: "Aktionen", value: "actions", align: "right" }
  ];
  valid = false;
  dialog = false;
  showAddPerson = true;
  editedInfo: Kontakt = {} as Kontakt;
  editedIndex: number = -1;
  selection: string = "addExisting";
  selectedPerson: Person = {} as Person;

  get infos(): Kontakt[] {
    if (this.value == undefined) {
      return [];
    }
    return this.value;
  }

  set infos(infos: Kontakt[]) {
    (this as Vue).$emit("input", infos);
  }

  get formTitle() {
    return this.editedIndex === -1
      ? "Kontaktbeziehung hinzufügen"
      : "Kontaktbeziehung bearbeiten";
  }

  mounted() {
    this.kategorien = Object.values(Kategorie).map(key => {
      return {
        text: KategorieToText.get(key) as string,
        value: key
      };
    });
  }

  personRelationSelected(personSelection : Person) {
    this.selectedPerson = personSelection;
  }

  navigateRead(id:string) {
    let parts = id.split("/");
    id = parts[parts.length - 1];
    this.navigate(`/read/${id}`);
  }
    navigateEdit(id:string) {
    let parts = id.split("/");
    id = parts[parts.length - 1];
    this.navigate(`/edit/${id}`);
  }

  navigate(path:string) {
      this.$router.push(path);
  }

  editItem(item: Kontakt) {
    this.showAddPerson = false;
    this.editedIndex = this.infos.indexOf(item);
    this.editedInfo = Object.assign({}, item);
    this.selectedPerson = item._person;
    this.dialog = true;
  }

  deleteItem(item: Kontakt) {
    const index = this.infos.indexOf(item);
    this.infos.splice(index, 1);
  }

  close() {
    this.showAddPerson = true;
    this.resetDialog();
    this.dialog = false;
    setTimeout(() => {
      this.editedInfo = Object.assign({}, this.editedInfo);
      this.editedIndex = -1;
    }, 300);
  }

  async save() {
    let form = this.$refs.form as any;

    if(!form.validate()) {
      this.$store.dispatch('snackbar/showMessage', {level: Levels.WARNING, message: "Bitte Fehleingaben korrigieren."});
      return;
    }

    if(this.selection === "createNew") {
        const response = await PersonService.savePerson(this.person) as any;
        this.person = {quarantaene: {}, kontakte: [], proben: []} as unknown as Person;
        this.editedInfo.kontakt = response._links.self.href;
        this.editedInfo._person = response;
        form.resetValidation()


    } else if(this.selection === "addExisting") {
      this.editedInfo.kontakt = "/" + this.selectedPerson.id;
      this.editedInfo._person = this.selectedPerson;
    }

    if (this.editedIndex > -1) {
      Object.assign(this.infos[this.editedIndex], this.editedInfo);
    } else {
      this.infos.push(this.editedInfo);
    }
    this.close();
  }

  resetDialog () {
    this.editedInfo = {} as Kontakt;
    this.selection = "addExisting";
  }
}
</script>