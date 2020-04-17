<template>
    <div>
        <v-data-table
                id="personenliste-table"
                :headers="headers"
                :items="personen"
                :footer-props="{
                    'items-per-page-options': [10, 20, 50, 100]
                }"
                :options.sync="options"
                :server-items-length="length"
                :loading="loading"
                loading-text="Lade Daten....."
        >
            <template v-slot:item.actions="{ item }">
                    <v-btn :id="'personenliste-btn-bearbeiten-' + item.id" @click=navigateEdit(item.id) small text class="mx-2"><v-icon left dark>mdi-pencil</v-icon>Bearbeiten</v-btn>
                    <v-btn :id="'personenliste-btn-lesen-' + item.id" @click=navigateRead(item.id) small text><v-icon left dark>mdi-eye</v-icon>Lesen</v-btn>
                    <v-btn :id="'personenliste-btn-loeschen-' + item.id" @click=deletePersonDialog(item) small text class="mx-2"><v-icon left dark>mdi-delete</v-icon>Löschen</v-btn>
            </template>
            <template v-slot:no-data>
                ⚠ Keine Ergebnisse gefunden.
            </template>
        </v-data-table>
        <loeschen-dialog
                ref="loeschendialog"
                dialogtitle="Löschen einer Person"
                :dialogtext="'Wollen Sie die Person ' + personToDelete.vornameNachname + ' endgültig löschen?'"
                v-model="dialogLoeschen"
                @deleted="deletePerson()"
                @canceled="cancel"
        >
        </loeschen-dialog>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop, Watch} from "vue-property-decorator";
import Kategorie from "@/types/Kategorie";
import Person from "@/types/Person";
import PersonService from '@/api/PersonService';
import LoeschenDialog from './Common/LoeschenDialog.vue'

@Component({
    components: {
        LoeschenDialog
    }
})
export default class PersonenSuche extends Vue {
    $router!: Vue["$router"];

    @Prop()
    personen!: Person[];
    @Prop()
    value!:any;
    options:any = {};
    @Prop()
    length!:number;
    @Prop()
    loading!:boolean;
    dialogLoeschen = false;
    personToDelete = {} as Person;
    
    headers = [
      { text: "Vorname", value: "vorname" },
      { text: "Nachname", value: "name" },
      { text: "Geburtstdatum", value: "geburtsdatum", sortable: false },
      { text: "Ort", value: "ort", sortable: false },
      { text: "Telefonnummer", value: "telefon", sortable: false },
      { text: "Kategorie", value: "kategorie", divider: true },
      { text: "Aktionen", value: "actions", align: "end", sortable: false }
    ];

    mounted() {
        this.options = this.value;
    }

    @Watch("value")
    valueChanged() {
        this.options = this.value;
    }

    @Watch("options", {deep: true})
    optionsChanged() {
        (this as Vue).$emit("input", this.options);
    }

    navigateEdit(id:string) {
        this.navigate(`/edit/${id}`);
    }

    navigateRead(id:string) {
        this.navigate(`/read/${id}`);
    }

    navigate(path:string) {
        this.$router.push(path);
    }
    deletePersonDialog(person: Person) {
      this.personToDelete = person;
      this.dialogLoeschen = true;
    }
    cancel() {
      this.personToDelete = {} as Person;
      this.dialogLoeschen = false;
    }
    deletePerson() {
      PersonService.deletePerson(this.personToDelete.id)
        .then(() => {
          this.$store.dispatch('snackbar/showMessage', {message: `Person "${this.personToDelete.vornameNachname}" erfolgreich gelöscht.`})
          this.$emit("delete", this.personToDelete);
        })
        .catch((err) => this.$store.dispatch('snackbar/showMessage', err))
        .finally(() => {
          this.personToDelete = {} as Person;
        })
      this.dialogLoeschen = false;
    }
}
</script>

