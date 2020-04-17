<template>
  <div>
    <!-- Name -->
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          id="callpersonfields-textfield-vorname"
          :readonly="readonly"
          :hide-details="readonly"
          :outlined="readonly"
          :filled="!readonly"
          dense
          v-model="person.vorname"
          label="Vorname"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          id="callpersonfields-textfield-nachname"
          :readonly="readonly"
          :hide-details="readonly"
          :outlined="readonly"
          :filled="!readonly"
          dense
          v-model="person.name"
          label="Nachname"
        ></v-text-field>
      </v-col>
    </v-row>
    <!-- Adresse -->
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          id="callpersonfields-textfield-strasse"
          :readonly="readonly"
          :hide-details="readonly"
          :outlined="readonly"
          :filled="!readonly"
          dense
          v-model="person.strasse"
          label="Straße"
          ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          id="callpersonfields-textfield-postleitzahl"
          :readonly="readonly"
          :hide-details="readonly"
          :outlined="readonly"
          :filled="!readonly"
          dense
          v-model="person.plz"
          label="Postleitzahl"
          ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          id="callpersonfields-textfield-ort"
          :readonly="readonly"
          :hide-details="readonly"
          :outlined="readonly"
          :filled="!readonly"
          dense
          v-model="person.ort"
          label="Ort"
          ></v-text-field>
      </v-col>
    </v-row>
    <!-- Kontakt -->
    <v-row>
      <v-col cols="12" md="6">
        <div class="d-flex">
          <v-text-field
            id="callpersonfields-textfield-telefon"
            :readonly="readonly"
            :hide-details="readonly"
            :outlined="readonly"
            :filled="!readonly"
            type="tel"
            dense
            v-model="person.telefon"
            label="Telefon"
            ></v-text-field>
          <v-btn :href="'tel:' + person.telefon" target="_blank" icon color="primary">
            <v-icon>mdi-phone</v-icon>
          </v-btn>
        </div>
      </v-col>
      <v-col cols="12" md="6">
        <div class="d-flex">
          <v-text-field
            id="callpersonfields-textfield-mobiltelefon"
            :readonly="readonly"
            :hide-details="readonly"
            :outlined="readonly"
            :filled="!readonly"
            type="tel"
            dense
            v-model="person.mobile"
            label="Mobiltelefon"
            ></v-text-field>
          <v-btn :href="'tel:' + person.mobile" target="_blank" icon color="primary">
            <v-icon>mdi-phone</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <!-- Quarantäne-Infos -->
    <v-row v-if="person.quarantaene">
      <v-col cols="12" md="6">
        <v-text-field
          id="callpersonfields-textfield-quarantaeneStart"
          :readonly="readonly"
          :hide-details="readonly"
          v-model="person.quarantaene.start"
          label="Quarantäne Start "
          type="date"
          :outlined="readonly"
          :filled="!readonly"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          id="callpersonfields-textfield-quarantaeneEnde"
          v-model="person.quarantaene.ende"
          label="Quarantäne Ende"
          type="date"
          filled
          dense
        ></v-text-field>
      </v-col>
    </v-row>
    <!-- Kommentare -->
    <v-row justify="center">
      <v-col cols="12" md="12">
        <v-textarea id="callpersonfields-textarea-telefonnotizen" filled dense v-model="person.telefonnotizen" label="Telefonnotizen"></v-textarea>
        <v-textarea id="callpersonfields-textarea-dokTaeglicheAnrufe" filled dense v-model="person.doku" label="Dokumentation für tägliche Anrufe"></v-textarea>
      </v-col>
    </v-row>
  </div>
</template>


<script lang="ts">
// libs
import { Component, Vue, Prop } from "vue-property-decorator";
import moment from 'moment';
// model
import Person from "@/types/Person";
import Kategorie from "@/types/Kategorie";
import { KategorieToText } from "@/types/Kategorie";
import KontaktTyp, { KontakttypToBeschreibung } from "@/types/KontaktTyp";
import KeyVal from "@/types/KeyVal";

@Component({
  name:"CallPersonFields",
  components: { }
})
export default class CallPersonFields extends Vue {
  @Prop()
  value!: Person;

  readonly:boolean = true;

  get person(): Person {
    return this.value;
  }

  set person(person: Person) {
    (this as Vue).$emit("input", person);
  }
}
</script>