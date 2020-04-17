<template>
    <div class="d-flex flex-column">
        <personen-suche id="personenauswaehler-personenSuche" @search="search" v-model="loading"></personen-suche>
        <v-radio-group id="personenauswaehler-radioGroup" @change="selectionChanged" :rules="[requiredRule]">
            <v-radio :id="'personenauswaehler-radiobtn-' + person.id" v-for="person in availableSelections" :key="person.id" :label="person.vorname + ' ' + person.name + ' - Geb. am ' + person.geburtsdatum" :value="person"></v-radio>
        </v-radio-group>
        <div id="personenauswaehler-div-weitereErgebnisse" v-if="options.itemsPerPage < length">⚠ Es gibt weitere Ergebnisse. Bitte Suche einschränken.</div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop} from "vue-property-decorator";
import PersonenSuche from '@/components/PersonenSuche.vue';
import Person from '../types/Person';
import PersonSearchParams from "@/api/types/PersonSearchparams";
import PersonService from "@/api/PersonService";

@Component({
    components: {
        PersonenSuche
    }
})
export default class PersonenAuswaehler extends Vue {
    @Prop()
    parentPersonId!: string;

    availableSelections : Person[] = [];
    options:any = {
        page: 1,
        itemsPerPage: 20,
        sortBy: [""]
    };
    length:number = 20;
    loading:boolean = false;

    requiredRule(v: any) {
    return !!v || "Bitte eine Person auswählen";
    }

    search(searchParams:PersonSearchParams | undefined) {
        if(searchParams === undefined){
            return;
        }

        this.loading = true;
        let sort = this.options.sortBy && this.options.sortBy[0] ? this.options.sortBy[0] : "";
        let reverse = this.options.sortDesc && this.options.sortDesc[0] ? this.options.sortDesc[0] : false;
        PersonService.searchPerson(searchParams, this.options.page, this.options.itemsPerPage, sort, reverse)
            .then(response => {
                this.length = response.totalElements;
                this.resultReceived(response.persons);
            })
            .catch(error => {
                this.$store.dispatch('snackbar/showMessage', error)
            })
            .finally(() => this.loading=false);
    }

    resultReceived(searchResults:Person[]) {
        // Entferne eigene Person aus den Suchergebnissen, um Selbstrelation zu verhindern.
        if(this.parentPersonId) {
            searchResults = searchResults.filter((result:Person) => this.parentPersonId !== result.id);
        }
        this.availableSelections = searchResults;
    }

    selectionChanged(selection:Person) {
        (this as Vue).$emit("input", selection);
    }
}
</script>

