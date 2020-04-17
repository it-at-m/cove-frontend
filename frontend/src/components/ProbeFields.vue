<template>
  <div>
    <v-select
      id="probefields-select-ergebnis"
      filled
      dense
      :items="ergebnissarten"
      label="Ergebnis"
      v-model="probe.ergebnis"
      :rules="[rules.required]"
      class="d-inline-flex"
    ></v-select>
    <v-text-field 
      id="probefields-textfield-date"
      filled 
      dense 
      v-model="probe.datum" 
      type="date" 
      label="Datum"
      :rules="[rules.inPast]"
    ></v-text-field>
    <v-textarea 
      id="probefields-textarea-kommentar"
      filled 
      dense 
      v-model="probe.kommentar" 
      label="Kommentar"
      counter="1024"
      :rules="[rules.max1024]"
    ></v-textarea>
  </div>
</template>
<script lang="ts">
// libs
import { Component, Vue, Prop } from "vue-property-decorator";
import moment from 'moment';
// model
import { Probe } from "../types/Person";
import Ergebnis, { ErgebnisToBeschreibung } from "../types/Ergebnis";
import KeyVal from "../types/KeyVal";

@Component
export default class ProbeFields extends Vue {

  @Prop()
  value!: Probe;

  ergebnissarten: KeyVal[] = [];

  rules:any = {
    required: (v:string) => !!v || 'Eingabe ist erforderlich',
    max1024: (v:string) => !v || v.length <= 1024 || 'Maximal 1024 Zeichen erlaubt',
    inPast: (v:string) => !v || moment(v).isBefore(moment.now()) || "Datum muss in der Vergangenheit liegen.",
  }

  get probe(): Probe {
    return this.value;
  }

  set probe(probe: Probe) {
    (this as Vue).$emit("input", probe);
  }

  mounted() {
    this.ergebnissarten = Object.values(Ergebnis).map(key => {
      return {
        text: ErgebnisToBeschreibung.get(key) as string,
        value: key
      };
    });
  }
}
</script>