<template>
  <div>
    <v-row>
      <v-col cols="12" md="6">
        <!-- Kategorie -->
        <v-select
          id="personfields-select-kategorie"
          :readonly="readonly"
          :hide-details="readonly"
          :outlined="readonly"
          :filled="!readonly"
          dense
          :items="kategorien"
          label="Kategorie"
          v-model="person.kategorie"
          :rules="[rules.required]"
        ></v-select>
      </v-col>
      <v-col cols="12" md="6">
        <!-- Medizinische Einrichtung -->
        <v-select
          id="personfields-select-einrichtung"
          :readonly="readonly"
          :hide-details="readonly"
          :outlined="readonly"
          :filled="!readonly"
          dense
          clearable
          :items="medEinrichtungen"
          label="Medizinische Einrichtung"
          v-model="person.medEinrichtung"
        ></v-select>
      </v-col>
    </v-row>
    <v-subheader class="headline">Grunddaten</v-subheader>
    <v-divider></v-divider>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          id="personfields-textfield-vorname"
          :readonly="readonly"
          :hide-details="readonly"
          :outlined="readonly"
          :filled="!readonly"
          dense
          v-model="person.vorname"
          label="Vorname"
          counter="255"
          :rules="[rules.required, rules.max255]"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          id="personfields-textfield-nachname"
          :readonly="readonly"
          :hide-details="readonly"
          :outlined="readonly"
          :filled="!readonly"
          dense
          v-model="person.name"
          label="Nachname"
          counter="255"
          :rules="[rules.required, rules.max255]"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          id="personfields-textfield-geburtsdatum"
          :readonly="readonly"
          :hide-details="readonly"
          v-model="person.geburtsdatum"
          label="Geburtsdatum"
          type="date"
          :outlined="readonly"
          :filled="!readonly"
          dense
          :rules="[rules.inPast]"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          id="personfields-textfield-strasse"
          :readonly="readonly"
          :hide-details="readonly"
          :outlined="readonly"
          :filled="!readonly"
          dense
          v-model="person.strasse"
          label="Straße"
          counter="255"
          :rules="[rules.max255]"
          ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          id="personfields-textfield-plz"
          :readonly="readonly"
          :hide-details="readonly"
          :outlined="readonly"
          :filled="!readonly"
          dense
          v-model="person.plz"
          counter="5"
          :rules="[rules.plz]"
          label="PLZ"
          ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          id="personfields-textfield-ort"
          :readonly="readonly"
          :hide-details="readonly"
          :outlined="readonly"
          :filled="!readonly"
          dense
          v-model="person.ort"
          label="Ort"
          counter="255"
          :rules="[rules.max255]"
          ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          id="personfields-textfield-landkreis"
          :readonly="readonly"
          :hide-details="readonly"
          :outlined="readonly"
          :filled="!readonly"
          dense
          v-model="person.landkreis"
          label="Landkreis"
          counter="255"
          :rules="[rules.max255]"
          ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          id="personfields-textfield-land"
          :readonly="readonly"
          :hide-details="readonly"
          :outlined="readonly"
          :filled="!readonly"
          dense
          v-model="person.land"
          label="Land"
          counter="255"
          :rules="[rules.max255]"
          ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          id="personfields-textfield-standort"
          :readonly="readonly"
          :hide-details="readonly"
          :outlined="readonly"
          :filled="!readonly"
          dense v-model="person.standort"
          label="Standort"
          counter="1024"
          :rules="[rules.max1024]"
          ></v-text-field>
      </v-col>
    </v-row>

<v-subheader class="headline">Kontaktdaten</v-subheader>
    <v-divider></v-divider>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          id="personfields-textfield-telefon"
          :readonly="readonly"
          :hide-details="readonly"
          :outlined="readonly"
          :filled="!readonly"
          type="tel"
          dense
          v-model="person.telefon"
          label="Telefon"
          counter="255"
          :rules="[rules.max255]"
          ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          id="personfields-textfield-mobiltelefon"
          :readonly="readonly"
          :hide-details="readonly"
          :outlined="readonly"
          :filled="!readonly"
          type="tel"
          dense
          v-model="person.mobile"
          label="Mobiltelefon"
          counter="255"
          :rules="[rules.max255]"
          ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          id="personfields-textfield-mail"
          :readonly="readonly"
          :hide-details="readonly"
          :outlined="readonly"
          :filled="!readonly"
          dense
          v-model="person.mail"
          label="Mail"
          counter="1024"
          :rules="[rules.max1024]"
          ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <datetime-input
                id="personfields-textfield-erstkontaktAm"
                v-model="person.erstKontaktErfolgtAm"
                :readonly="readonly"
                :hide-details="readonly"
                :outlined="readonly"
                :filled="!readonly"
                dense
                clearable
                label="Erstkontakt am"
                :rules="[rules.inPast]"
        ></datetime-input>
      </v-col>
      <v-col cols="12" md="6">
        <datetime-input
                id="personfields-textfield-abschlussgespraechAm"
                v-model="person.endTelefonatErfolgtAm"
                :readonly="readonly"
                :hide-details="readonly"
                :outlined="readonly"
                :filled="!readonly"
                dense
                clearable
                label="Abschlussgespräch am"
                :rules="[rules.inPast]"
        ></datetime-input>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <datetime-input
                id="personfields-textfield-letzterKontakt"
                v-model="person.letzterKontakt"
                :readonly="readonly"
                :hide-details="readonly"
                :outlined="readonly"
                :filled="!readonly"
                dense
                clearable
                label="Letzter Kontakt"
                :rules="[rules.inPast]"
        ></datetime-input>
      </v-col>
    </v-row>

    <v-subheader class="headline">Quarantäne</v-subheader>
    <v-divider></v-divider>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          id="personfields-textfield-quarantaeneStart"
          :readonly="readonly"
          :hide-details="readonly"
          v-model="person.quarantaene.start"
          label="Quarantäne Start "
          type="date"
          :outlined="readonly"
          :filled="!readonly"
          dense
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          id="personfields-textfield-quarantaeneEnde"
          :readonly="readonly"
          :hide-details="readonly"
          v-model="person.quarantaene.ende"
          label="Quarantäne Ende"
          type="date"
          :outlined="readonly"
          :filled="!readonly"
          dense
        ></v-text-field>
      </v-col>
    </v-row>

    <v-subheader  class="headline">Dokumentation</v-subheader>
    <v-divider></v-divider>
    <v-row justify="center">
      <v-col cols="12" md="12">
        <v-textarea id="personfields-textarea-kommentar" :readonly="readonly" :outlined="readonly" :filled="!readonly" dense v-model="person.kommentare" label="Kommentare"></v-textarea>
        <v-textarea id="personfields-textarea-telefonnotizen" :readonly="readonly" :outlined="readonly" :filled="!readonly" dense v-model="person.telefonnotizen" label="Telefonnotizen"></v-textarea>
        <v-textarea id="personfields-textarea-dokTaeglicheAnrufe" :readonly="readonly" :outlined="readonly" :filled="!readonly" dense v-model="person.doku" label="Dokumentation für tägliche Anrufe"></v-textarea>
        <v-textarea id="personfields-textarea-personenAusHaushalt" :readonly="readonly" :outlined="readonly" :filled="!readonly" dense v-model="person.haushalt" label="Personen aus Haushalt"></v-textarea>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
// libs
import { Component, Vue, Prop } from "vue-property-decorator";
import moment from 'moment';
// model
import Person from "../types/Person";
import Kategorie from "../types/Kategorie";
import { KategorieToText } from "../types/Kategorie";
import MedEinrichtung from "../types/MedEinrichtung";
import { MedEinrichtungToText } from "../types/MedEinrichtung";
import KontaktTyp, { KontakttypToBeschreibung } from "../types/KontaktTyp";
import KeyVal from "../types/KeyVal";
import DatetimeInput from "@/components/Common/DatetimeInput.vue";

@Component({
  components: {DatetimeInput }
})
export default class PersonFields extends Vue {

  @Prop()
  value!: Person;

  @Prop({default: false, type: Boolean})
  readonly!: boolean;

  kategorien: KeyVal[] = [];
  medEinrichtungen: KeyVal[] = [];
  typen: KeyVal[] = [];

  rules:any = {
    required: (v:string) => !!v || 'Eingabe ist erforderlich',
    max255: (v:string) => !v || v.length <= 255 || 'Maximal 255 Zeichen erlaubt',
    max1024: (v:string) => !v || v.length <= 1024 || 'Maximal 1024 Zeichen erlaubt',
    plz: (v:string) => !v || /^$|^([0-9]{5})$/.test(v) || "PLZ muss 5 stellige Zahl sein.",
    inPast: (v:string) => !v || moment(v).isBefore(moment.now()) || "Datum muss in der Vergangenheit liegen."
  }

  get person(): Person {
    return this.value;
  }

  set person(person: Person) {
    (this as Vue).$emit("input", person);
  }

  mounted() {
    this.kategorien = Object.values(Kategorie).map(key => {
      return {
        text: KategorieToText.get(key) as string,
        value: key
      };
    });
    this.typen = Object.values(KontaktTyp).map(key => {
      return {
        text: KontakttypToBeschreibung.get(key) as string,
        value: key
      };
    });
    this.medEinrichtungen = Object.values(MedEinrichtung).map(key => {
      return {
        text: MedEinrichtungToText.get(key) as string,
        value: key
      };
    });
  }
  isDirty() {
    return this.value.kategorie ||
      this.value.medEinrichtung ||
      this.value.vorname ||
      this.value.name ||
      this.value.geburtsdatum ||
      this.value.strasse ||
      this.value.plz ||
      this.value.ort ||
      this.value.landkreis ||
      this.value.land ||
      this.value.standort ||
      this.value.telefon ||
      this.value.mobile ||
      this.value.mail ||
      this.value.quarantaene.start ||
      this.value.quarantaene.ende ||
      this.value.kommentare ||
      this.value.telefonnotizen ||
      this.value.doku ||
      this.value.haushalt;

  }
}
</script>