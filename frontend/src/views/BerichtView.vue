<style scoped>
  table {
    border-collapse:collapse;
  }

  td {
    padding: 0px 8px;
  }
</style>
<template>
  <v-container>
    <v-card cols="8" flat>
      <div class="headline">Berichte
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="primary"
          ></v-progress-circular>
      </div>

      <v-subheader class="headline mt-5">Anzahl Personen mit Kategorie</v-subheader>
      <v-divider class="mb-5"></v-divider>

      <table>
        <tr>
          <td>Index (I)</td>
          <td align="right"><b id="berichtview-text-anzahlIndex">{{bericht.anzahl.kategorie.I}}</b></td>
          <td>davon in Quarantäne</td>
          <td align="right"><b id="berichtview-text-anzahlIndexInQuarantaene">{{bericht.anzahl.inQuarantaene.I}}</b></td>
        </tr>
        <tr>
          <td>Kontaktperson (KP)</td>
          <td align="right"><b id="berichtview-text-anzahlKP">{{bericht.anzahl.kategorie.KP}}</b></td>
          <td>davon in Quarantäne</td>
          <td align="right"><b id="berichtview-text-anzahlKPinQuarantaene">{{bericht.anzahl.inQuarantaene.KP}}</b></td>
        </tr>
        <tr>
          <td>Negativ getestete Kontaktperson (KPN)</td>
          <td align="right"><b id="berichtview-text-anzahlKPN">{{bericht.anzahl.kategorie.KPN}}</b></td>
        </tr>
        <tr>
          <td>Nicht gesetzt</td>
          <td align="right"><b id="berichtview-text-anzahlNichtGesetzt">{{bericht.anzahl.kategorie.nicht_gesetzt}}</b></td>
        </tr>
        <tr style="border-top: 1px solid lightgrey;">
          <td>Gesamtzahl</td>
          <td align="right"><b id="berichtview-text-anzahlGesamt">{{bericht.anzahl.kategorie.gesamt}}</b></td>
          <td>davon in Quarantäne</td>
          <td align="right"><b id="berichtview-text-anzahlGesamtInQuarantaene">{{bericht.anzahl.inQuarantaene.I  + bericht.anzahl.inQuarantaene.KP}}</b></td>
        </tr>
      </table>

      <v-subheader class="headline mt-5">Anzahl Personen mit Probenergebnis</v-subheader>
      <v-divider class="mb-5"></v-divider>

      <table>
        <tr>
          <td> Positiv (P)</td>
          <td align="right"><b id="berichtview-text-anzahlProbeP">{{bericht.anzahl.probenergebnis.P}}</b></td>
        </tr>
        <tr>
          <td>Ausstehend (A)</td>
          <td align="right"><b id="berichtview-text-anzahlProbeA">{{bericht.anzahl.probenergebnis.A}}</b></td>
        </tr>
        <tr>
          <td>Negativ (N)</td>
          <td align="right"><b id="berichtview-text-anzahlProbeN">{{bericht.anzahl.probenergebnis.N}}</b></td>
        </tr>
        <tr style="border-top: 1px solid lightgrey;">
          <td>Gesamtzahl</td>
          <td align="right"><b id="berichtview-text-anzahlProbeGesamt">{{bericht.anzahl.probenergebnis.gesamt}}</b></td>
        </tr>
      </table>

      <v-subheader class="headline mt-5">Anzahl Personen in medizinischen Einrichtungen/GE</v-subheader>
      <v-divider class="mb-5"></v-divider>
      <table>
        <tr>
          <td> Krankenhaus (KH)</td>
          <td align="right"><b id="berichtview-text-anzahlEinrichtungKH">{{bericht.anzahl.einrichtungen.KH}}</b></td>
        </tr>
        <tr v-if="bericht.anzahl.einrichtungen.AH != null">
          <td>Altenheim (AH)</td>
          <td align="right"><b id="berichtview-text-anzahlEinrichtungAH">{{bericht.anzahl.einrichtungen.AH}}</b></td>
        </tr>
        <tr>
          <td>Praxis (PR)</td>
          <td align="right"><b id="berichtview-text-anzahlEinrichtungPR">{{bericht.anzahl.einrichtungen.PR}}</b></td>
        </tr>
        <tr>
          <td>Schule (SCHU)</td>
          <td align="right"><b id="berichtview-text-anzahlEinrichtungSCHU">{{bericht.anzahl.einrichtungen.SCHU}}</b></td>
        </tr>
        <tr>
          <td>Kindertagesstätte (KITA)</td>
          <td align="right"><b id="berichtview-text-anzahlEinrichtungKITA">{{bericht.anzahl.einrichtungen.KITA}}</b></td>
        </tr>
        <tr>
          <td>Nicht gesetzt</td>
          <td align="right"><b id="berichtview-text-anzahlEinrichtungNichtGesetzt">{{bericht.anzahl.einrichtungen.nicht_gesetzt}}</b></td>
        </tr>
        <tr style="border-top: 1px solid lightgrey;">
          <td>Gesamtzahl</td>
          <td align="right"><b id="berichtview-text-anzahlEinrichtungGesamt">{{bericht.anzahl.einrichtungen.gesamt}}</b></td>
        </tr>
      </table>

      <v-subheader class="headline mt-5">Anzahl Konversionen</v-subheader>
      <v-divider class="mb-5"></v-divider>

      <table>
        <tr>
          <td>von Kontaktperson (KP) zu Index (I):</td>
          <td align="right"><b id="berichtview-text-anzahlKonversionen">{{bericht.anzahl.konversionen.I}}</b></td>
        </tr>
        <tr>
          <td><small>(Ab Erfassung 01.04.2020)</small></td>
        </tr>
      </table>

         
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
//api
import BerichtService from "@/api/BerichtService";
import Kategorie from "../types/Kategorie";
import Ergebnis from "../types/Ergebnis";
import { ApiError, Levels } from '../api/error';
// model
import Bericht, { InQuarantaene, Kategorien, Probenergebnis, Konversionen, Einrichtungen } from "../types/Bericht";

@Component
export default class BerichtView extends Vue {
  loading: boolean = false;
  stats: any = {};
  bericht: Bericht = { anzahl: {kategorie: {}, inQuarantaene: {}, probenergebnis: {}, konversionen: {}, einrichtungen: {}}} as unknown  as Bericht;
  mounted() {
    this.loading = true;
    let promises = [] as Promise<any>[];
    let tempStats:any = {};

    this.loading = true;
    BerichtService.getBericht()
      .then(response => {
        if(!response.anzahl.kategorie) {
          response.anzahl.kategorie = {} as Kategorien;
        }
        if(!response.anzahl.inQuarantaene) {
          response.anzahl.inQuarantaene = {} as InQuarantaene;
        }
        if(!response.anzahl.probenergebnis) {
          response.anzahl.probenergebnis = {} as Probenergebnis;
        }
        if(!response.anzahl.konversionen) {
          response.anzahl.konversionen = {} as Konversionen;
        }
        if(!response.anzahl.einrichtungen) {
          response.anzahl.einrichtungen = {} as Einrichtungen;
        }
        this.bericht = response;
      })
      .finally(() => {
        this.loading = false
      })

  }

}
</script>
