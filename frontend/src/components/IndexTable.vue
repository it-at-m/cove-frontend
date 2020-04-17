<template>
  <div>
    <v-data-table
        id="indextable-table"
        :headers="headers"
        :items="persons"
        :loading="loading">
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-subheader class="headline">Zugehörige Index-Personen:</v-subheader>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{item}">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn :id="'indextable-btn-lesen-' + item.id" small text class="mr-2" @click="navigateRead(item._links.self.href)" v-on="on">
              <v-icon>mdi-account-edit</v-icon>
            </v-btn>
          </template>
          <span>Person lesen</span>
        </v-tooltip>
      </template>
      <template v-slot:no-data>
        Keine Index-Person vorhanden.
      </template>
    </v-data-table>
  </div>
</template>
<script lang="ts">
  import {Component, Vue, Prop, Watch} from "vue-property-decorator";
// components
import PersonService from "./../api/PersonService"
// model
import Person from "../types/Person";


@Component
export default class IndexTable extends Vue {
  $store!: Vue["$store"];
  $refs!: Vue["$refs"];

  persons: Person[] = [];
  loading: boolean = false;

  @Prop()
  value!: string;

  headers = [
    { text: "Kontaktname", value: "vornameNachname" },
    { text: "Aktionen", value: "actions", align: "right" }
  ];

  mounted() {
   if(this.value) {
     this.loadPersons()
   }
  }

  @Watch("value")
  loadPersons() {
    this.loading = true;
    PersonService.findIndexPersonToKontakt(this.value)
            .then(persons => {
              this.persons = persons;
            })
    .finally(() => this.loading = false)
  }

  navigateRead(id:string) {
    let parts = id.split("/");
    id = parts[parts.length - 1];
    this.navigate(`/read/${id}`);
  }

  navigate(path:string) {
      this.$router.push(path);
  }
}
</script>