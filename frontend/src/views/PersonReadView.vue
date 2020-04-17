<template>
  <v-container>
    <v-card cols="8" flat>
      <v-layout>
      <div class="headline">Personendaten lesen</div>
        <v-spacer></v-spacer>
        <v-btn id="personreadview-btn-bearbeiten" color="primary" @click="navigateEdit"><v-icon>mdi-pencil</v-icon>Bearbeiten</v-btn>
      </v-layout>
      <v-row
              v-if="loading"
              class="fill-height"
              align-content="center"
              justify="center"
      >
        <v-col
                class="subtitle-1 text-center"
                cols="12"
        >
          Lade Daten....
        </v-col>
        <v-col cols="6">
          <v-progress-linear
                  indeterminate
                  rounded
                  height="6"
          ></v-progress-linear>
        </v-col>
      </v-row>
      <v-form v-if="!loading" ref="form">
        <person-fields id="personreadview-personFields" readonly v-model="person"></person-fields>
        <v-row justify="center">
          <v-col cols="12" md="12">
            <index-table id="personreadview-indexTable" v-if="person.kategorie !== 'I'" readonly v-model="person.id"></index-table>
            <v-divider v-if="person.kategorie !== 'I'" class="mt-5 mb-12"></v-divider>
            <kontakt-table id="personreadview-kontaktTable" readonly v-model="person.kontakte"></kontakt-table>
            <v-divider class="mt-5 mb-12"></v-divider>
            <probe-table id="personreadview-probeTable" readonly v-model="person.proben"></probe-table>
            <v-divider class="mt-5 mb-12"></v-divider>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator';

//api
import PersonService from "@/api/PersonService.ts"
// components
import PersonFields from "@/components/PersonFields.vue";
import KontaktTable from "@/components/KontaktTable.vue";
import ProbeTable from "@/components/ProbeTable.vue";
// model
import Person, { Quarantäne } from "../types/Person";
import Kategorie from "@/types/Kategorie";
import IndexTable from "@/components/IndexTable.vue";

@Component({
  components: { PersonFields, KontaktTable, ProbeTable, IndexTable }
})
export default class PersonReadView extends Vue {
  $route!: Vue["$route"];

  person: Person = {quarantaene: {}, kontakte: [], proben: []} as unknown  as Person;
  loading : boolean = false;

  mounted() {
      this.loadPerson();
  }

  navigateEdit() {
    this.$router.push(`/edit/${this.person.id}`);
  }

  @Watch("$route.params.id")
  loadPerson() {
    this.loading = true;
    PersonService.readPerson(this.$route.params.id, true)
            .then(response => {
              if(!response.quarantaene) {
                response.quarantaene = {} as Quarantäne;
              }
              this.person = response;
            })
            .finally(() => this.loading = false)
  }

}
</script>
