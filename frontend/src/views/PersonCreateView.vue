<template>
  <v-container>
    <v-card cols="8" flat>
        <div class="headline">Person anlegen</div>
        <v-form ref="form" v-model="valid">
          <person-fields id="personcreateview-personFields" ref="personForm" v-model="person"></person-fields>
          <v-row justify="center">
            <v-col cols="12" md="12">
              <kontakt-table id="personcreateview-kontaktTable" v-model="person.kontakte"></kontakt-table>
              <v-divider class="mt-5 mb-12"></v-divider>
              <probe-table id="personcreateview-probeTable" v-model="person.proben"></probe-table>
              <v-divider class="mt-5 mb-12"></v-divider>
            </v-col>
          </v-row>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn id="personcreateview-btn-reset" color="primary" text @click="reset">Felder löschen</v-btn>
          <v-btn id="personcreateview-btn-speichern" :loading="loading" color="primary" @click="save">Speichern</v-btn>
        </v-card-actions>
    </v-card>
    <yes-no-dialog
            id="personcreateview-yesNoDialog"
            ref="saveLeaveDialog"
            :dialogtitle="saveLeaveDialogTitle"
            :dialogtext="saveLeaveDialogText"
            v-model="saveLeaveDialog"
            @yes="leave"
            @no="cancel"
    >
    </yes-no-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

// components
import PersonFields from "@/components/PersonFields.vue";
import KontaktTable from "@/components/KontaktTable.vue";
import ProbeTable from "@/components/ProbeTable.vue";
import PersonService from "@/api/PersonService.ts"
import YesNoDialog from "@/components/Common/YesNoDialog.vue"
import SaveLeaveMixin from "@/mixins/saveLeaveMixin";
// modell
import Person from "../types/Person";
import {Levels} from "@/api/error";
import any = jasmine.any;

@Component({
  components: { PersonFields, KontaktTable, ProbeTable, YesNoDialog }
})
export default class PersonCreateView extends SaveLeaveMixin {

  $store!: Vue["$store"];
  $refs!: Vue["$refs"];

  person: Person = {quarantaene: {}, kontakte: [], proben: []} as unknown  as Person;
  valid = false;
  loading : boolean = false;

  reset() {
      this.person = {quarantaene: {}, kontakte: [], proben: []} as unknown as Person;
      (this.$refs.form as any).resetValidation();
  }

  save() {
      let form = this.$refs.form as any;
      if(form.validate()) {
          this.loading = true;
          PersonService.savePerson(this.person)
              .then((resp) => {
                  this.$store.dispatch('snackbar/showMessage', {message: "Person wurde erfolgreich erstellt."});
                  this.reset()
              })
              .catch((error) => this.$store.dispatch('snackbar/showMessage', error))
              .finally(() => this.loading = false);
      } else {
          this.$store.dispatch('snackbar/showMessage', {level: Levels.WARNING, message: "Bitte Fehleingaben korrigieren."});
      }
  }

  isDirty(): boolean {
    return ((this.$refs.personForm as any).isDirty() || this.person.kontakte.length > 0 || this.person.proben.length > 0);
  }
}
</script>
