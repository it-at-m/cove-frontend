<template>
  <div>
    <v-subheader class="title">Beziehung</v-subheader>
    <v-divider></v-divider>
    <v-row>
      <v-col cols="12" md="6">
        <v-select
          id="kontakfields-select-kontakttyp"
          :outlined="readonly" 
          :filled="!readonly"
          dense
          :items="typen"
          label="Kontakttyp"
          v-model="info.kontakttyp"
          :rules="[rules.required]"
        ></v-select>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          id="kontakfields-textfield-kontaktdatum"
          :outlined="readonly" 
          :filled="!readonly" 
          dense 
          v-model="info.kontaktdatum" 
          type="date" 
          label="Kontaktdatum"
          :rules="[rules.inPast]"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-textarea 
      id="kontakfields-textarea-kommentare"
      :outlined="readonly" 
      :filled="!readonly" 
      dense 
      v-model="info.kommentar" 
      label="Kommentare"
      counter="1024"
      :rules="[rules.max1024]"
    ></v-textarea>

    <v-subheader class="title">Person</v-subheader>
    <v-divider></v-divider>
  </div>
</template>
<script lang="ts">
// libs
import { Component, Vue, Prop } from "vue-property-decorator";
import moment from 'moment';
// model
import KontaktTyp, { KontakttypToBeschreibung } from "../types/KontaktTyp";
import { Kontakt } from "../types/Kontakt";
import KeyVal from "../types/KeyVal";

@Component
export default class KontaktFields extends Vue {

  @Prop()
  value!: Kontakt;
  @Prop()
  readonly!: boolean;

  typen: KeyVal[] = [];

  rules:any = {
    required: (v:string) => !!v || 'Eingabe ist erforderlich',
    max1024: (v:string) => !v || v.length <= 1024 || 'Maximal 1024 Zeichen erlaubt',
    inPast: (v:string) => !v || moment(v).isBefore(moment.now()) || "Datum muss in der Vergangenheit liegen.",
  }

  get info(): Kontakt {
    return this.value;
  }

  set info(infos: Kontakt) {
    (this as Vue).$emit("input", infos);
  }

  mounted() {
    this.typen = Object.values(KontaktTyp).map(key => {
      return {
        text: KontakttypToBeschreibung.get(key) as string,
        value: key
      };
    });
  }
}
</script>