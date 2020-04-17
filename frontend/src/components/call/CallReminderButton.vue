<template>
  <div v-if="numberOfPersons">
    <calling-popup
      id="callreminderbutton-callingPopup"
      :type="nextToCallType"
      @save="savePerson"
      @saveAndEdit="savePersonAndEdit"
      ref="reminderPopup"
      v-model="selectedPersonToCall"
    ></calling-popup>

    <v-badge :content="numberOfPersons" color="warning" overlap>
      <v-btn id="callreminderbutton-btn-oeffnen" :loading="loading" light @click="call" raised>
        <v-icon left>mdi-phone-return</v-icon>Offene Anrufe
      </v-btn>
    </v-badge>
  </div>
</template>

<script lang="ts">
// libs
import { Component, Vue, Prop } from "vue-property-decorator";
import moment from "moment";
// components
import CallingPopup from "@/components/call/CallingPopup.vue";
import PersonService from "@/api/PersonService";
// types
import Person, { Quarantäne } from '@/types/Person';
import Kategorie from "@/types/Kategorie";

import { TYPE_DAILYGESPRAECH } from "@/views/TaeglicheAnrufeView.vue";
import { TYPE_ENDGESPRAECH } from "@/views/EndgespraecheView.vue";

@Component({
    name: "callreminder-button",
    components: {CallingPopup}
})
export default class CallReminderButton extends Vue {
  personsToCall: Person[] = [];
  nextToCallType: string = "";
  selectedPersonToCall: Person = {} as Person;
  loading: Boolean = false;

  mounted() {
    this.reloadData();
  }

  reloadData() {
    this.loading = true;
    PersonService.getMeineZuBearbeitendenPersonen()
      .then(resp => {
        this.personsToCall = resp;
      })
      .finally(() => this.loading = false);
  }

  get numberOfPersons() {
    return this.personsToCall.length;
  }

  call() {
    if (this.numberOfPersons > 0) {
      this.selectedPersonToCall = this.personsToCall[0];

      // Anrufart feststellen
      if (this.selectedPersonToCall.kategorie === Kategorie.Kontaktperson) {
        this.nextToCallType = TYPE_ENDGESPRAECH;
      } else if (this.selectedPersonToCall.kategorie === Kategorie.Index) {
        const quarantaene: Quarantäne = this.selectedPersonToCall.quarantaene;
        if (
          quarantaene &&
          quarantaene.ende &&
          moment().isAfter(quarantaene.ende)
        ) {
          this.nextToCallType = TYPE_ENDGESPRAECH;
        } else {
          this.nextToCallType = TYPE_DAILYGESPRAECH;
        }
      }

      (this.$refs.reminderPopup as any).open();
    }
  }
  savePerson(person: Person, navigate : Boolean = false) {
    this.loading = true;
    PersonService.updateCalledPerson(person)
      .then(resp => {
        this.$store.dispatch("snackbar/showMessage", {
          message: "Person wurde erfolgreich gespeichert."
        });
      })
      .catch(error => this.$store.dispatch("snackbar/showMessage", error))
      .finally(() => {
        this.loading = false;
        this.reloadData();
        if(navigate) {
          this.$router.push(`/edit/${person.id}`);
        }
      });
  }

  savePersonAndEdit(person: Person) {
    this.savePerson(person, true);
  }
}
</script>

