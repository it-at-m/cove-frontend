<template>
    <v-container>
        <v-card cols="8" flat>
            <div class="headline">Person suchen</div>
            <personen-suche id="personsearchview-personenSuche" @search="newSearch" v-model="loading" class="py-4"></personen-suche>

            <personen-liste 
                id="personsearchview-personenListe"
                @delete="onDelete"
                :personen="ergebnisse"
                :loading="loading"
                :length="length"
                :value="options"
                @input="pageChanged"
            ></personen-liste>
        </v-card>
    </v-container>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import PersonenSuche from '@/components/PersonenSuche.vue';
    import PersonenListe from '@/components/PersonenListe.vue';
    import Person from "@/types/Person";
    import PersonSearchParams from "@/api/types/PersonSearchparams";
    import PersonService from "@/api/PersonService";

    @Component({
        components: {PersonenSuche, PersonenListe}
    })
    export default class PersonSearchView extends Vue {
        ergebnisse: Person[] = [];
        searchParams: PersonSearchParams | undefined = undefined;
        options:any = {
            page: 1,
            itemsPerPage: 20,
            sortBy: [""]
        };
        length:number = 0;
        loading:boolean = false;

        newSearch(searchParams:PersonSearchParams) {
            this.options.page = 1;
            this.searchParams = searchParams;
            this.search(searchParams)
        }

        pageChanged(e:any) {
            if(this.options !== e) {
                this.options = e;
                this.search(this.searchParams)
            }
        }

        search(searchParams:PersonSearchParams | undefined) {
            if(searchParams === undefined){
                return;
            }

            if(this.options.page === 0) {
                this.ergebnisse = []
            }
            this.loading = true;
            this.$vuetify.goTo(0).then(() => {
                let sort = this.options.sortBy && this.options.sortBy[0] ? this.options.sortBy[0] : "";
                let reverse = this.options.sortDesc && this.options.sortDesc[0] ? this.options.sortDesc[0] : false;
                PersonService.searchPerson(searchParams, this.options.page, this.options.itemsPerPage, sort, reverse)
                    .then(response => {
                        this.ergebnisse = response.persons;
                        this.length = response.totalElements;
                    })
                    .catch(error => {
                        this.$store.dispatch('snackbar/showMessage', error)
                    })
                    .finally(() => this.loading=false);
                });
        }

        onDelete(deletedPerson:Person) {
            const index = this.ergebnisse.findIndex((ergebnis : Person) => ergebnis.id === deletedPerson.id);
            this.ergebnisse.splice(index, 1);
        }
    }
</script>
